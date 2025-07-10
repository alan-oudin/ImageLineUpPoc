<?php
// Charger les variables d'environnement
if (file_exists(__DIR__ . '/.env')) {
    $lines = file(__DIR__ . '/.env');
    foreach ($lines as $line) {
        if (trim($line) && strpos($line, '=') !== false) {
            putenv(trim($line));
        }
    }
}

$cloud_name = getenv('CLOUDINARY_CLOUD_NAME');
$api_key = getenv('CLOUDINARY_API_KEY');
$api_secret = getenv('CLOUDINARY_API_SECRET');
$folder = getenv('CLOUDINARY_FOLDER') ?: '';

header('Content-Type: application/json');

// Vérification de la configuration
if (!$cloud_name || !$api_key || !$api_secret) {
    echo json_encode(['success' => false, 'error' => "Configuration manquante dans .env. Veuillez vérifier CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY et CLOUDINARY_API_SECRET."]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !isset($_FILES['image'])) {
    echo json_encode(['success' => false, 'error' => 'Aucun fichier reçu.']);
    exit;
}

// Vérification de l'upload local
if ($_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    $phpFileUploadErrors = array(
        UPLOAD_ERR_INI_SIZE   => 'Le fichier dépasse la taille autorisée par php.ini.',
        UPLOAD_ERR_FORM_SIZE  => 'Le fichier dépasse la taille autorisée par le formulaire.',
        UPLOAD_ERR_PARTIAL    => 'L\'envoi du fichier a été interrompu.',
        UPLOAD_ERR_NO_FILE    => 'Aucun fichier n\'a été envoyé.',
        UPLOAD_ERR_NO_TMP_DIR => 'Dossier temporaire manquant.',
        UPLOAD_ERR_CANT_WRITE => 'Erreur d\'écriture sur le disque.',
        UPLOAD_ERR_EXTENSION  => 'Envoi stoppé par une extension PHP.'
    );
    $err = $_FILES['image']['error'];
    $msg = isset($phpFileUploadErrors[$err]) ? $phpFileUploadErrors[$err] : 'Erreur inconnue.';
    echo json_encode(['success' => false, 'error' => "Erreur upload local : $msg"]);
    exit;
}

$tmpFile = $_FILES['image']['tmp_name'];
$filename = $_FILES['image']['name'];

if (!is_uploaded_file($tmpFile)) {
    echo json_encode(['success' => false, 'error' => "Le fichier uploadé n'est pas valide."]);
    exit;
}

// Préparer la requête vers Cloudinary
$upload_url = "https://api.cloudinary.com/v1_1/$cloud_name/image/upload";
$timestamp = time();
$params_to_sign = [
    'timestamp' => $timestamp,
    'folder' => $folder,
];
// Générer la signature
ksort($params_to_sign);
$signature_str = http_build_query($params_to_sign, '', '&');
$signature_str = urldecode($signature_str) . $api_secret;
$signature = sha1($signature_str);

$postFields = [
    'file' => new CURLFile($tmpFile, mime_content_type($tmpFile), $filename),
    'api_key' => $api_key,
    'timestamp' => $timestamp,
    'signature' => $signature,
    'folder' => $folder,
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $upload_url);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postFields);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curl_error = curl_error($ch);
curl_close($ch);

if ($curl_error) {
    echo json_encode(['success' => false, 'error' => 'Erreur réseau cURL : ' . $curl_error]);
    exit;
}

$data = json_decode($response, true);
if ($http_code !== 200 || empty($data['secure_url'])) {
    $cloudinaryError = isset($data['error']['message']) ? $data['error']['message'] : $response;
    echo json_encode(['success' => false, 'error' => 'Erreur Cloudinary : ' . $cloudinaryError]);
    exit;
}

// Générer l'URL du thumbnail (320px de large)
$public_id = $data['public_id'];
$thumbnail_url = "https://res.cloudinary.com/$cloud_name/image/upload/w_320,c_limit/$public_id.jpg";

echo json_encode(['success' => true, 'thumbnail_url' => $thumbnail_url]); 