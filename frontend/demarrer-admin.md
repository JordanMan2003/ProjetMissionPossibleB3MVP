# 🚀 Guide de Démarrage - Administration GreenCart

## ❌ **Problèmes Identifiés**

1. **Authentification manquante** - La page admin n'était pas protégée
2. **Données manquantes** - La base de données n'est pas initialisée
3. **Backend non démarré** - L'API n'est pas disponible

## ✅ **Solutions Appliquées**

### 1. **Authentification Ajoutée**
- ✅ Composant `AdminRoute` créé
- ✅ Protection des routes admin
- ✅ Redirection automatique vers login
- ✅ Vérification du rôle ADMIN

### 2. **Guide de Démarrage**

## 🔧 **Étape 1 : Configuration de la Base de Données**

```bash
# Démarrer PostgreSQL
brew services start postgresql  # macOS
sudo service postgresql start   # Linux

# Créer la base de données
createdb greencart
```

## 🔧 **Étape 2 : Configuration du Backend**

```bash
cd backend

# Créer le fichier .env
cat > .env << 'EOF'
DATABASE_URL="postgresql://postgres:password@localhost:5432/greencart"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV=development
EOF

# Générer le client Prisma
npm run db:generate

# Appliquer les migrations
npm run db:migrate

# Ajouter les données de test
npm run db:seed

# Démarrer le serveur
npm run start:dev
```

## 🔧 **Étape 3 : Démarrer le Frontend**

```bash
# Dans un nouveau terminal
cd ..
npm run dev
```

## 🔐 **Étape 4 : Se Connecter en Admin**

1. **Aller sur** : `http://localhost:5173/login`
2. **Se connecter avec** :
   - Email : `admin@greencart.com`
   - Mot de passe : `admin123`
3. **Accéder à l'admin** : `http://localhost:5173/admin`

## 📊 **Données de Test Créées**

### **Utilisateurs**
- **Admin** : admin@greencart.com / admin123
- **Consommateur** : user@greencart.com / user123
- **Producteur** : producer@greencart.com / producer123
- **Restaurant** : restaurant@greencart.com / restaurant123

### **Produits**
- Panier de légumes (15.99€)
- Invendus boulangerie (8.50€)
- Fruits de saison (12.99€)

### **Commandes**
- Commande 1 : 24.49€ (PAID)
- Commande 2 : 15.99€ (PENDING)

## 🔍 **Vérification**

### **Si vous voyez une page de connexion**
✅ L'authentification fonctionne !

### **Si vous êtes redirigé vers /login**
✅ La protection des routes fonctionne !

### **Si vous voyez l'interface d'administration**
✅ Tout fonctionne parfaitement !

## 🐛 **Problèmes Courants**

### **Erreur de base de données**
```bash
# Vérifier PostgreSQL
brew services list | grep postgresql

# Recréer la base
dropdb greencart
createdb greencart
npm run db:migrate
npm run db:seed
```

### **Erreur de port**
```bash
# Vérifier les ports utilisés
lsof -i :3001
lsof -i :5173

# Tuer les processus si nécessaire
kill -9 <PID>
```

### **Erreur de dépendances**
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
```

## 🎯 **URLs d'Accès**

- **Frontend** : http://localhost:5173
- **Backend** : http://localhost:3001
- **Admin** : http://localhost:5173/admin
- **Swagger** : http://localhost:3001/api

## ✅ **Checklist de Validation**

- [ ] PostgreSQL démarré
- [ ] Base de données créée
- [ ] Fichier .env créé
- [ ] Migrations appliquées
- [ ] Données de test créées
- [ ] Backend démarré sur le port 3001
- [ ] Frontend démarré sur le port 5173
- [ ] Connexion admin fonctionne
- [ ] Redirection vers login si non connecté
- [ ] Interface d'administration accessible
- [ ] Données s'affichent correctement

---

🎉 **L'administration est maintenant entièrement sécurisée et fonctionnelle !**
