# 🚗 Garage Connect - Suivi des réparations en ligne

Bienvenue sur **Garage Connect**, une plateforme permettant aux garagistes et à leurs clients de suivre l'état des réparations, d'accéder à l'historique des véhicules, et de communiquer facilement à tout moment. Voici un récapitulatif des technologies utilisées et des fonctionnalités offertes par l'application.

## 🔧 Technologies Utilisées

- **Backend :** Node.js (Firebase Functions)
- **Base de Données :** Firebase Firestore
- **Stockage :** Firebase Storage
- **Authentification :** Firebase Authentication
- **Frontend :** React.js (Next.js, Tailwind CSS)
- **Déploiement :** Vercel

## ✨ Fonctionnalités

### 🛠️ Partie Garagiste

1. **Suivi des réparations :**
   - Interface permettant de suivre les étapes des réparations en cours.
   - Mise à jour de l'état de la réparation (en attente, en cours, terminé), visible par le client.
   - Envoi de photos des réparations pour plus de transparence via Firebase Storage.

2. **Gestion des clients et des véhicules :**
   - Création de fiches clients et gestion des informations sur chaque client.
   - Historique des interventions pour chaque véhicule.

3. **Support client :**
   - Chat en ligne avec les clients pour répondre aux questions et fournir des conseils.

### 👤 Partie Client

1. **Suivi des réparations :**
   - Accès à l'état de la réparation de leur véhicule.
   - Possibilité de voir des photos des réparations en cours.

2. **Historique des véhicules :**
   - Accès à l'historique complet des réparations pour chaque véhicule associé au compte.

3. **Support client :**
   - Chat en ligne avec le garage pour poser des questions ou obtenir des conseils.

## 🚀 Comment démarrer ?
Pour exécuter l'application en local, vous aurez besoin de Node.js.

### installation

1. **Installez les dépendances :**

   ```bash
   npm install
   ```

2. **Configurer les variables d'environnement :**
   - Créez un fichier `.env.local` à la racine du projet.
   - Ajoutez vos clés de configuration Firebase et autres paramètres requis dans ce fichier.

### Lancer l'application

1. **Démarrer l'application en mode développement :**

   ```bash
   npm run dev
   ```

2. **Accéder à l'application :**
   - Ouvrez votre navigateur et accédez à `http://localhost:3001`.

## Structure du projet

Voici la structure de base du projet :

- `app/` : Contient les pages de votre application. `app/page.tsx` est la page d'accueil.
- `components/` : Répertoire pour vos composants.
- `public/` : Pour les fichiers statiques comme les images.


## More libraries 🎨

  - Cool components:
  <a href="https://ui.shadcn.com/" target="_blank">https://ui.shadcn.com/</a> or <a href="https://ui.aceternity.com/" target="_blank">https://ui.aceternity.com/</a>
  - Charts:
  <a href="https://recharts.org/en-US/" target="_blank">https://recharts.org/en-US/</a>
  - Animated or fixed illustrations:
  <a href="https://storyset.com/" target="_blank">https://storyset.com/</a>
  - Animated icons:
  <a href="https://lottiefiles.com/" target="_blank">https://lottiefiles.com/</a> or <a href="https://lordicon.com/icons" target="_blank">https://lordicon.com/icons</a>
  - More icons: For more icons
  <a href="https://iconduck.com/" target="_blank">https://iconduck.com/</a>

## Licence

Ce projet est sous licence MIT. Pour plus d'informations, consultez le fichier `LICENSE`.
