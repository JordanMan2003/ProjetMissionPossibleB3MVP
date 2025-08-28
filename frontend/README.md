# GreenCart - Plateforme de Circuit Court et Anti-Gaspillage

GreenCart est une plateforme innovante qui connecte les producteurs locaux, restaurants et consommateurs pour promouvoir le circuit court et lutter contre le gaspillage alimentaire.

## 🚀 Fonctionnalités

### Frontend (React + Vite)
- **Interface utilisateur moderne** avec Tailwind CSS et Framer Motion
- **Authentification complète** : inscription, connexion, mot de passe oublié
- **Boutique interactive** avec filtres et recherche
- **Panier d'achat** en temps réel
- **Tableau de bord utilisateur** avec points de fidélité
- **Interface d'administration** CRUD complète
- **Design responsive** et accessible

### Backend (NestJS + Prisma)
- **API RESTful** complète avec authentification JWT
- **Gestion des utilisateurs** avec rôles (CONSUMER, PRODUCER, RESTAURANT, ADMIN)
- **Gestion des produits** avec catégories et contenu garanti
- **Système de panier** et commandes
- **Administration** avec statistiques et rapports
- **Base de données PostgreSQL** avec Prisma ORM

## 📋 Prérequis

- **Node.js** (version 18 ou supérieure)
- **PostgreSQL** (version 12 ou supérieure)
- **npm** ou **yarn**

## 🛠️ Installation

### 1. Cloner le projet
```bash
git clone <votre-repo>
cd ProjetMissionPossibleB3Frontend
```

### 2. Configuration de la base de données

#### Option A : PostgreSQL local
1. Installez PostgreSQL sur votre machine
2. Créez une base de données :
```sql
CREATE DATABASE greencart;
```

#### Option B : PostgreSQL en ligne (recommandé pour le développement)
Utilisez un service comme [Neon](https://neon.tech) ou [Supabase](https://supabase.com)

### 3. Configuration du Backend

```bash
cd backend

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env
```

Modifiez le fichier `.env` :
```env
DATABASE_URL="postgresql://username:password@localhost:5432/greencart"
JWT_SECRET="votre-secret-jwt-super-securise"
JWT_EXPIRES_IN="7d"
PORT=3000
```

### 4. Configuration du Frontend

```bash
# Retourner à la racine du projet
cd ..

# Installer les dépendances
npm install
```

## 🚀 Démarrage

### 1. Base de données
```bash
cd backend

# Générer le client Prisma
npm run db:generate

# Appliquer les migrations
npm run db:migrate

# (Optionnel) Ajouter des données de test
npm run db:seed
```

### 2. Backend
```bash
cd backend

# Mode développement
npm run start:dev

# Le serveur sera accessible sur http://localhost:3000
```

### 3. Frontend
```bash
# Dans un nouveau terminal, depuis la racine du projet

# Mode développement
npm run dev

# L'application sera accessible sur http://localhost:5173
```

## 📁 Structure du Projet

```
ProjetMissionPossibleB3Frontend/
├── backend/                 # API NestJS
│   ├── src/
│   │   ├── admin/          # Module d'administration
│   │   ├── auth/           # Authentification
│   │   ├── cart/           # Gestion du panier
│   │   ├── orders/         # Gestion des commandes
│   │   ├── products/       # Gestion des produits
│   │   ├── users/          # Gestion des utilisateurs
│   │   └── prisma/         # Configuration Prisma
│   ├── prisma/
│   │   ├── schema.prisma   # Schéma de base de données
│   │   └── seed.ts         # Données de test
│   └── package.json
├── src/                    # Frontend React
│   ├── components/         # Composants réutilisables
│   ├── contexts/           # Contextes React
│   ├── pages/              # Pages de l'application
│   ├── services/           # Services API
│   └── lib/                # Utilitaires
├── package.json
└── README.md
```

## 🔐 Authentification

### Rôles utilisateurs
- **CONSUMER** : Consommateurs finaux
- **PRODUCER** : Producteurs locaux
- **RESTAURANT** : Restaurants et commerces
- **ADMIN** : Administrateurs de la plateforme

### Endpoints d'authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/forgot-password` - Mot de passe oublié
- `POST /api/auth/reset-password` - Réinitialisation du mot de passe

## 🛒 Fonctionnalités de la Boutique

### Filtres disponibles
- **Type** : Producteurs / Restaurants
- **Région** : Localisation géographique
- **Solidaire** : Produits anti-gaspillage
- **Recherche** : Par nom, description, producteur

### Contenu garanti
Chaque produit affiche son contenu exact pour éviter les mauvaises surprises.

## 👨‍💼 Administration

Accédez à l'interface d'administration sur `/admin` (réservé aux utilisateurs ADMIN).

### Fonctionnalités admin
- **Tableau de bord** avec statistiques
- **Gestion des utilisateurs** (approuver/rejeter)
- **Gestion des produits** (activer/désactiver)
- **Gestion des commandes** (suivi des statuts)
- **Gestion des catégories**
- **Rapports de vente**

## 🔧 Scripts Utiles

### Backend
```bash
cd backend

# Développement
npm run start:dev

# Production
npm run start:prod

# Base de données
npm run db:generate    # Générer le client Prisma
npm run db:migrate     # Appliquer les migrations
npm run db:seed        # Ajouter des données de test
npm run db:studio      # Interface Prisma Studio
```

### Frontend
```bash
# Développement
npm run dev

# Build de production
npm run build

# Preview de production
npm run preview
```

## 🐛 Dépannage

### Problèmes courants

1. **Erreur de connexion à la base de données**
   - Vérifiez que PostgreSQL est démarré
   - Vérifiez les paramètres de connexion dans `.env`
   - Assurez-vous que la base de données existe

2. **Erreur de migration Prisma**
   ```bash
   cd backend
   npm run db:generate
   npm run db:migrate
   ```

3. **Erreur de port déjà utilisé**
   - Changez le port dans le fichier `.env` du backend
   - Ou arrêtez le processus qui utilise le port

4. **Erreur de dépendances**
   ```bash
   # Backend
   cd backend && npm install
   
   # Frontend
   cd .. && npm install
   ```

## 📝 Variables d'environnement

### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/greencart"
JWT_SECRET="votre-secret-jwt-super-securise"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api
```

## 🤝 Contribution

1. Fork le projet
2. Créez une branche pour votre fonctionnalité
3. Committez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.

## 🆘 Support

Pour toute question ou problème :
1. Consultez la documentation
2. Vérifiez les issues existantes
3. Créez une nouvelle issue avec les détails du problème

---

**GreenCart** - Ensemble pour un avenir plus durable ! 🌱
