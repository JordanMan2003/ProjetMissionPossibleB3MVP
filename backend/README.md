# GreenCart Backend API

Backend NestJS pour la marketplace GreenCart avec authentification, gestion des produits, panier et paiements Stripe.

## 🚀 Technologies

- **NestJS** - Framework backend
- **PostgreSQL** - Base de données
- **Prisma** - ORM
- **Passport.js** - Authentification (JWT + Local)
- **Stripe** - Paiements
- **Swagger** - Documentation API
- **class-validator** - Validation des données

## 📋 Prérequis

- Node.js 18+
- PostgreSQL
- Docker (optionnel)

## 🛠️ Installation

### 1. Variables d'environnement

Créez un fichier `.env` dans le dossier `backend/` :

```env
# Backend environment
NODE_ENV=development
PORT=3001

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/app_db?schema=public

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Stripe (test keys)
STRIPE_SECRET_key=sk_test_your_stripe_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# CORS
FRONTEND_URL=http://localhost:5173
```

### 2. Installation des dépendances

```bash
npm install
```

### 3. Base de données

```bash
# Générer le client Prisma
npm run prisma:generate

# Créer et appliquer les migrations
npm run prisma:migrate

# Peupler la base avec des données de test
npm run prisma:seed
```

### 4. Démarrage

```bash
# Mode développement
npm run start:dev

# Mode production
npm run build
npm run start:prod
```

## 🐳 Docker

### Avec Docker Compose (recommandé)

```bash
# Depuis la racine du projet
docker compose up --build
```

### Manuellement

```bash
# Build de l'image
docker build -t greencart-backend .

# Lancement
docker run -p 3001:3001 greencart-backend
```

## 📚 Documentation API

Une fois le serveur démarré, accédez à la documentation Swagger :

```
http://localhost:3001/api
```

## 🔐 Authentification

### Rôles utilisateurs

- **CONSUMER** - Consommateurs (accès immédiat après inscription)
- **PRODUCER** - Producteurs locaux (nécessite validation admin)
- **RESTAURANT** - Restaurants (nécessite validation admin)
- **ADMIN** - Administrateurs (peuvent valider les comptes)

### Endpoints d'authentification

```bash
# Inscription
POST /auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "Nom Complet",
  "role": "CONSUMER" | "PRODUCER" | "RESTAURANT"
}

# Connexion
POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

## 🛍️ Endpoints principaux

### Produits

```bash
# Lister tous les produits (avec filtres)
GET /products?type=producer&region=Île-de-France&solidaire=true&search=légumes

# Créer un produit (PRODUCER/RESTAURANT approuvés uniquement)
POST /products
Authorization: Bearer <jwt_token>
{
  "name": "Panier de légumes",
  "description": "Légumes frais locaux",
  "price": 15.99,
  "originalPrice": 22.00,
  "stock": 10,
  "type": "producer",
  "region": "Île-de-France",
  "producer": "Ferme Bio",
  "distance": "5 km",
  "contents": [
    { "item": "4 carottes", "emoji": "🥕", "order": 1 },
    { "item": "3 tomates", "emoji": "🍅", "order": 2 }
  ]
}
```

### Panier

```bash
# Voir son panier
GET /cart
Authorization: Bearer <jwt_token>

# Ajouter au panier
POST /cart/items
Authorization: Bearer <jwt_token>
{
  "productId": "product-uuid",
  "quantity": 2
}

# Retirer du panier
DELETE /cart/items
Authorization: Bearer <jwt_token>
{
  "productId": "product-uuid"
}
```

### Commandes

```bash
# Créer une commande depuis le panier
POST /orders/checkout
Authorization: Bearer <jwt_token>

# Webhook Stripe (pour les paiements)
POST /orders/webhook
```

### Administration

```bash
# Valider un compte producteur/restaurant
PATCH /users/:id/approve
Authorization: Bearer <jwt_token> (ADMIN uniquement)
```

## 🧪 Données de test

Le seed crée automatiquement :

- **1 admin** : `admin@greencart.com` / `admin123`
- **3 producteurs** approuvés
- **3 restaurants** approuvés  
- **1 consommateur** : `consumer@example.com` / `consumer123`
- **6 produits** avec contenus détaillés

## 🔧 Structure des données

### Produit

```typescript
{
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  stock: number;
  type: "producer" | "restaurant";
  region: string;
  producer: string;
  rating: number;
  reviews: number;
  solidaire: boolean;
  distance: string;
  isRestaurant: boolean;
  expiryNote?: string;
  contents: Array<{
    item: string;
    emoji: string;
    order: number;
  }>;
}
```

## 🚨 Sécurité

- Validation des données avec `class-validator`
- Authentification JWT
- Rôles et permissions
- CORS configuré pour le frontend
- Variables d'environnement pour les secrets

## 🔄 Intégration Frontend

Le backend est configuré pour fonctionner avec le frontend React existant :

- CORS ouvert vers `http://localhost:5173`
- Endpoints compatibles avec la structure de données du frontend
- Authentification JWT pour les requêtes protégées

## 📝 Logs

Les logs sont disponibles dans la console en mode développement et peuvent être configurés pour la production avec Winston ou Pino.
