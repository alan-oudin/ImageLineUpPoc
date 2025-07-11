# PocImage : Upload et Thumbnail avec Next.js & Spring Boot

## Architecture

- **frontend/** : Application Next.js (TypeScript) pour l’upload et l’affichage du thumbnail.
- **backend/** : API Spring Boot pour recevoir l’upload, envoyer l’image à Cloudinary, et retourner l’URL du thumbnail.

## Workflow

1. L’utilisateur charge une image via l’interface Next.js.
2. L’image est envoyée à l’API Spring Boot (`/api/upload`).
3. Le backend envoie l’image à Cloudinary, génère un thumbnail (320px de large), et retourne l’URL au frontend.
4. Le frontend affiche le thumbnail adapté au mobile.

## Configuration

### Cloudinary
Crée un compte sur [cloudinary.com](https://cloudinary.com/) et récupère :
- `cloud_name`
- `api_key`
- `api_secret`

Configure ces valeurs dans le backend (voir `application.properties`).

### Démarrage

#### Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```

#### Backend (Spring Boot)
```bash
cd backend
$env:JAVA_HOME="C:\Program Files\Eclipse Adoptium\jdk-17.0.15.6-hotspot"
$env:Path="$env:JAVA_HOME\bin;$env:Path"
.\gradlew clean
.\gradlew bootRun --args='--spring.profiles.active=local'
```

## Points à personnaliser
- Gestion d’erreur côté frontend et backend
- Sécurité (authentification, validation de fichier, etc.)
- Personnalisation du thumbnail (taille, crop, format)

## Structure des dossiers

```
PocImage/
│
├── frontend/   # Next.js (upload, affichage)
│
├── backend/    # Spring Boot (API, Cloudinary)
│
└── README.md
``` 

