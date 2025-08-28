# 🚀 Guide de Démarrage Rapide - GreenCart

## Prérequis
- Node.js 18+
- PostgreSQL 12+
- npm ou yarn

## 1. Configuration de la Base de Données

### Option A : PostgreSQL Local
```bash
# Créer la base de données
createdb greencart
```

### Option B : PostgreSQL en Ligne (Recommandé)
Utilisez [Neon](https://neon.tech) ou [Supabase](https://supabase.com) pour une base de données gratuite.

## 2. Configuration du Backend

```bash
cd backend

# Installer les dépendances
npm install

# Créer le fichier .env
cat > .env << EOF
DATABASE_URL="postgresql://username:password@localhost:5432/greencart"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV=development
EOF

# Générer le client Prisma
npm run db:generate

# Appliquer les migrations
npm run db:migrate

# (Optionnel) Ajouter des données de test
npm run db:seed

# Démarrer le serveur de développement
npm run start:dev
```

## 3. Configuration du Frontend

```bash
# Retourner à la racine
cd ..

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

## 4. Accès à l'Application

- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:3000
- **Prisma Studio** : http://localhost:5555 (après `npm run db:studio`)

## 5. Comptes de Test

### Administrateur
- Email: admin@greencart.com
- Mot de passe: admin123
- Rôle: ADMIN

### Utilisateur Test
- Email: user@greencart.com
- Mot de passe: user123
- Rôle: CONSUMER

## 6. Fonctionnalités Testées

✅ **Authentification**
- Inscription avec différents rôles
- Connexion
- Mot de passe oublié
- Réinitialisation du mot de passe

✅ **Boutique**
- Affichage des produits
- Filtres et recherche
- Ajout au panier
- Détails des produits

✅ **Administration**
- Tableau de bord avec statistiques
- Gestion des utilisateurs
- Gestion des produits
- Gestion des commandes
- Gestion des catégories

✅ **API Backend**
- Endpoints d'authentification
- CRUD complet pour toutes les entités
- Gestion des rôles et permissions
- Validation des données

## 7. Structure des Données

### Utilisateurs
- **CONSUMER** : Consommateurs finaux
- **PRODUCER** : Producteurs locaux
- **RESTAURANT** : Restaurants et commerces
- **ADMIN** : Administrateurs

### Produits
- Contenu garanti avec liste détaillée
- Prix original et prix réduit
- Stock et disponibilité
- Catégorisation et filtres

### Commandes
- Statuts : PENDING, PAID, FAILED, CANCELLED
- Suivi des paiements
- Historique des commandes

## 8. Scripts Utiles

```bash
# Backend
cd backend
npm run start:dev          # Développement
npm run start:prod         # Production
npm run db:generate        # Générer Prisma client
npm run db:migrate         # Migrations
npm run db:seed           # Données de test
npm run db:studio         # Interface Prisma

# Frontend
npm run dev               # Développement
npm run build            # Build production
npm run preview          # Preview production
```

## 9. Dépannage

### Erreur de connexion à la base de données
```bash
# Vérifier que PostgreSQL est démarré
sudo service postgresql start  # Linux
brew services start postgresql # macOS
```

### Erreur de port déjà utilisé
```bash
# Changer le port dans .env
PORT=3001
```

### Erreur de dépendances
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
```

## 10. Variables d'Environnement

### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/greencart"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api
```

---

🎉 **Votre application GreenCart est maintenant prête !**

Accédez à http://localhost:5173 pour commencer à utiliser l'application.
