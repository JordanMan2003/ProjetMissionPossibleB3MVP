# 🧪 Guide de Test - Administration GreenCart

## 🚀 **Démarrage Rapide**

### 1. **Démarrer le Backend**
```bash
cd backend

# Créer le fichier .env
echo 'DATABASE_URL="postgresql://postgres:password@localhost:5432/greencart"' > .env
echo 'JWT_SECRET="your-super-secret-jwt-key"' >> .env
echo 'JWT_EXPIRES_IN="7d"' >> .env
echo 'PORT=3001' >> .env
echo 'NODE_ENV=development' >> .env

# Générer Prisma et migrer
npm run db:generate
npm run db:migrate

# Ajouter les données de test
npm run db:seed

# Démarrer le serveur
npm run start:dev
```

### 2. **Démarrer le Frontend**
```bash
# Dans un nouveau terminal
cd ..
npm run dev
```

## 🔐 **Comptes de Test**

### **Administrateur**
- **Email** : `admin@greencart.com`
- **Mot de passe** : `admin123`
- **Rôle** : ADMIN

### **Utilisateur Consommateur**
- **Email** : `user@greencart.com`
- **Mot de passe** : `user123`
- **Rôle** : CONSUMER

### **Producteur**
- **Email** : `producer@greencart.com`
- **Mot de passe** : `producer123`
- **Rôle** : PRODUCER

### **Restaurant**
- **Email** : `restaurant@greencart.com`
- **Mot de passe** : `restaurant123`
- **Rôle** : RESTAURANT

## 📋 **Test de l'Administration**

### **1. Connexion Admin**
1. Allez sur `http://localhost:5173/login`
2. Connectez-vous avec `admin@greencart.com` / `admin123`
3. Accédez à `http://localhost:5173/admin`

### **2. Test du Tableau de Bord**
✅ **Vérifiez que les statistiques s'affichent** :
- Utilisateurs totaux : 4
- Produits actifs : 3
- Commandes : 2
- Chiffre d'affaires : ~40€

### **3. Test de la Gestion des Utilisateurs**
✅ **Onglet "Utilisateurs"** :
- Voir la liste des 4 utilisateurs
- Vérifier les rôles et statuts
- Tester la recherche
- Tester les actions (voir, modifier, supprimer)

### **4. Test de la Gestion des Produits**
✅ **Onglet "Produits"** :
- Voir la liste des 3 produits
- Vérifier les prix et stocks
- Vérifier les propriétaires
- Vérifier les catégories

### **5. Test de la Gestion des Commandes**
✅ **Onglet "Commandes"** :
- Voir la liste des 2 commandes
- Vérifier les statuts (PAID, PENDING)
- Vérifier les totaux
- Vérifier les clients

### **6. Test de la Gestion des Catégories**
✅ **Onglet "Catégories"** :
- Voir les 4 catégories (Légumes, Fruits, Boulangerie, Fromages)
- Vérifier le nombre de produits par catégorie

## 🔧 **Endpoints API Testés**

### **Authentification**
```bash
# Test d'inscription admin
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName": "Test Admin", "email": "test@admin.com", "password": "test123", "role": "ADMIN"}'

# Test de connexion
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@greencart.com", "password": "admin123"}'
```

### **Administration**
```bash
# Test des statistiques
curl -X GET http://localhost:3001/api/admin/stats \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test des utilisateurs
curl -X GET http://localhost:3001/api/admin/users \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test des produits
curl -X GET http://localhost:3001/api/admin/products \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test des commandes
curl -X GET http://localhost:3001/api/admin/orders \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test des catégories
curl -X GET http://localhost:3001/api/admin/categories \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🐛 **Problèmes Courants et Solutions**

### **Erreur 401 - Non autorisé**
- Vérifiez que vous êtes connecté avec un compte ADMIN
- Vérifiez que le token JWT est valide
- Vérifiez que le backend est démarré sur le port 3001

### **Erreur 404 - Endpoint non trouvé**
- Vérifiez que le backend est démarré
- Vérifiez l'URL de l'API dans `src/services/api.js`
- Vérifiez que les routes sont bien configurées

### **Erreur de base de données**
```bash
# Vérifier PostgreSQL
brew services start postgresql  # macOS
sudo service postgresql start   # Linux

# Recréer la base
dropdb greencart
createdb greencart
npm run db:migrate
npm run db:seed
```

### **Erreur de dépendances**
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
```

## 📊 **Données de Test Créées**

### **Utilisateurs**
- 1 Admin
- 1 Consommateur
- 1 Producteur
- 1 Restaurant

### **Produits**
- Panier de légumes (15.99€)
- Invendus boulangerie (8.50€)
- Fruits de saison (12.99€)

### **Commandes**
- Commande 1 : 24.49€ (PAID)
- Commande 2 : 15.99€ (PENDING)

### **Catégories**
- Légumes
- Fruits
- Boulangerie
- Fromages

## ✅ **Checklist de Validation**

- [ ] Backend démarre sur le port 3001
- [ ] Frontend démarre sur le port 5173
- [ ] Base de données connectée
- [ ] Données de test créées
- [ ] Connexion admin fonctionne
- [ ] Interface d'administration accessible
- [ ] Tableau de bord affiche les stats
- [ ] Gestion des utilisateurs fonctionne
- [ ] Gestion des produits fonctionne
- [ ] Gestion des commandes fonctionne
- [ ] Gestion des catégories fonctionne
- [ ] Recherche et filtres fonctionnent
- [ ] Actions CRUD fonctionnent

## 🎯 **URLs d'Accès**

- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:3001
- **Admin** : http://localhost:5173/admin
- **Swagger API** : http://localhost:3001/api

---

🎉 **L'administration est maintenant entièrement fonctionnelle !**

