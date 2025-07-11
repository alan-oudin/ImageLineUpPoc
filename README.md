# PocImage : Upload, Thumbnail & Modération avec Next.js, Spring Boot & Cloudinary

---

## Guide de reprise du projet

Bienvenue ! Ce guide est destiné à toute personne amenée à reprendre, maintenir ou faire évoluer ce projet.

### 1. Stack technique
- **Frontend** : Next.js (TypeScript) + next-cloudinary
- **Backend** : Spring Boot (Java)
- **Cloud** : Cloudinary (stockage, transformation, modération d’images)

### 2. Structure du projet
- `frontend/` : Application Next.js (upload, affichage, modération)
- `backend/` : API Spring Boot (upload, Cloudinary, endpoints de modération)
- `.gitignore` dans chaque dossier pour ignorer les fichiers sensibles ou inutiles
- `README.md` (ce fichier)

### 3. Configuration à prévoir
- **Cloudinary** : Créer un compte, renseigner les clés dans le backend et le frontend (voir section Configuration plus bas)
- **Variables d’environnement** :
  - Backend : `application.properties` (ne pas versionner les secrets)
  - Frontend : `.env.local` (ne pas versionner)
- **CORS** : Le backend autorise le frontend (localhost ou IP locale). Adapter si besoin.

### 4. Démarrage rapide
- Installer les dépendances dans chaque dossier (`npm install` côté frontend, rien à installer côté backend si Java/Gradle déjà présents)
- Lancer le backend puis le frontend (voir section Démarrage)
- Tester l’upload, l’affichage et la modération

### 5. Bonnes pratiques
- Ne jamais versionner les secrets ou fichiers de config sensibles
- Utiliser les endpoints REST existants pour l’upload, la liste et la suppression d’images
- Pour toute évolution, respecter la séparation frontend/backend
- Documenter toute nouvelle fonctionnalité dans ce README

### 6. Maintenance & évolution
- Les dépendances sont standards et maintenues (Next.js, Spring Boot, Cloudinary)
- Pour ajouter des fonctionnalités (authentification, pagination, etc.), suivre la logique existante
- Pour toute question, se référer à la documentation officielle des frameworks utilisés

### 7. Contact & passation
- Ajouter ici le contact du référent technique ou du responsable projet si besoin

---

# PocImage : Upload, Thumbnail & Modération avec Next.js, Spring Boot & Cloudinary

## Stack technique

- **Frontend** : Next.js (TypeScript) + [next-cloudinary](https://www.npmjs.com/package/next-cloudinary)
- **Backend** : Spring Boot (Java)
- **Cloud** : Cloudinary (stockage, transformation, modération d’images)

## Architecture

```
PocImage/
│
├── frontend/   # Next.js (upload, affichage, modération)
│   ├── .gitignore
│   ├── .env.local (voir ci-dessous)
│   └── app/page.tsx
│   ...
│
├── backend/    # Spring Boot (API, Cloudinary)
│   ├── .gitignore
│   ├── src/main/java/com/pocimage/...
│   └── src/main/resources/application.properties
│   ...
│
└── README.md
```

## Fonctionnalités principales

- Upload d’image depuis le frontend
- Génération et affichage d’un thumbnail optimisé (Cloudinary)
- Affichage des infos : nom, taille, URL d’origine, URL et taille du thumbnail
- **Modération** :
  - Liste des images stockées sur Cloudinary (nom/public_id)
  - Sélection par checkbox
  - Suppression par lot via un bouton

## Workflow

1. L’utilisateur charge une image via l’interface Next.js.
2. L’image est envoyée à l’API Spring Boot (`/api/upload`).
3. Le backend envoie l’image à Cloudinary, génère un thumbnail (300px de large), et retourne l’URL, le public_id, la taille, etc.
4. Le frontend affiche le thumbnail optimisé avec `next-cloudinary` et toutes les infos utiles.
5. Un panneau de modération permet de lister et supprimer les images Cloudinary.

## Configuration

### Cloudinary
Crée un compte sur [cloudinary.com](https://cloudinary.com/) et récupère :
- `cloud_name`
- `api_key`
- `api_secret`

**Backend** :
Ajoute ces valeurs dans `backend/src/main/resources/application.properties` :
```
cloudinary.cloud-name=TON_CLOUD_NAME
cloudinary.api-key=TON_API_KEY
cloudinary.api-secret=TON_API_SECRET
cloudinary.folder=thumbnails_poc
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

**Frontend** :
Ajoute dans `frontend/.env.local` :
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=TON_CLOUD_NAME
```

### CORS (Cross-Origin)
Le backend autorise les requêtes du frontend (localhost:3000 ou IP locale). Si besoin, adapte la config CORS dans `WebConfig.java`.

## Démarrage

### Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```

### Backend (Spring Boot)
```bash
cd backend
# Configure JAVA_HOME si besoin
./gradlew clean
./gradlew bootRun --args='--spring.profiles.active=local'
```

## Modération (admin)
- Accède au panneau de modération en bas de la page d’accueil
- Coche les images à supprimer puis clique sur “Supprimer la sélection”

## Bonnes pratiques & sécurité
- Les fichiers sensibles (`.env`, `application.properties`, `.gradle/`, etc.) sont ignorés par git (voir `.gitignore` dans chaque dossier)
- Ne jamais versionner les clés Cloudinary ou autres secrets
- Adapter la gestion des erreurs et la sécurité selon vos besoins (authentification, validation, etc.)

## Dépendances principales
- `next-cloudinary` (frontend)
- `cloudinary` (backend Java)
- Spring Boot, Gradle

## Pour aller plus loin
- Ajouter l’authentification pour la modération
- Pagination ou recherche dans la liste d’images
- Personnalisation avancée des transformations Cloudinary

### Modération automatique d’images (Rekognition AI Moderation)

Pour activer la modération automatique des images uploadées (détection de contenu inapproprié, nudité, violence, etc.) :

1. Active l’add-on "Rekognition AI Moderation" dans ton compte Cloudinary (section Add-ons du dashboard).
2. Lors de l’upload, ajoute le paramètre `moderation: 'aws_rek'` dans l’appel à l’API Cloudinary (voir documentation Cloudinary et SDK Java).
3. Les images seront automatiquement marquées comme "approved" ou "rejected" selon le score de confiance et les catégories détectées.
4. Tu peux lister, filtrer ou overrider manuellement le statut de modération via l’API Admin ou l’interface Cloudinary.

👉 Documentation officielle : [Cloudinary Rekognition AI Moderation](https://cloudinary.com/documentation/aws_rekognition_ai_moderation_addon)

---

## Fichiers de configuration à ne pas oublier

### Frontend : .env.local
- **Emplacement** : `frontend/.env.local`
- **Exemple de contenu** :
  ```env
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=ton_cloud_name
  ```
- Ce fichier ne doit pas être versionné (il est ignoré par `.gitignore`).

### Backend : application.properties
- **Emplacement** : `backend/src/main/resources/application.properties`
- **Exemple de contenu** :
  ```properties
  cloudinary.cloud-name=ton_cloud_name
  cloudinary.api-key=ta_api_key
  cloudinary.api-secret=ton_api_secret
  cloudinary.folder=thumbnails_poc
  spring.servlet.multipart.max-file-size=10MB
  spring.servlet.multipart.max-request-size=10MB
  ```
- Ce fichier ne doit pas être versionné (il est ignoré par `.gitignore`).

---

**Projet prêt à l’emploi pour upload, affichage optimisé et modération d’images avec Next.js, Spring Boot et Cloudinary !** 

