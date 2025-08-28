import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { 
  User, 
  ShoppingCart, 
  Heart, 
  Star, 
  TrendingUp, 
  Package, 
  Users, 
  Award,
  Plus,
  Edit,
  Eye,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import apiService from '@/services/api';
import { useAuth } from '@/contexts/UserContext';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const DashboardPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [sellerOrders, setSellerOrders] = useState([]);
  const [myProducts, setMyProducts] = useState([]);
  const [isLoadingSeller, setIsLoadingSeller] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [favorites, setFavorites] = useState([]);

  const handleFeatureClick = (featureName) => {
    toast({
      title: "🚧 Cette fonctionnalité n'est pas encore implémentée—mais ne vous inquiétez pas ! Vous pouvez la demander dans votre prochaine requête ! 🚀",
      description: `Fonctionnalité : ${featureName}`,
    });
  };

  // Load restaurant data (orders as seller, products owned)
  useEffect(() => {
    const loadSellerData = async () => {
      if (user?.userType !== 'restaurant') return;
      try {
        setIsLoadingSeller(true);
        const [ordersData, allProducts] = await Promise.all([
          apiService.getSellerOrders().catch(() => []),
          apiService.getAllProducts().catch(() => []),
        ]);
        setSellerOrders(ordersData || []);
        const mine = (allProducts || []).filter(p => (p.owner?.id || p.ownerId) === user?.id);
        setMyProducts(mine);
      } finally {
        setIsLoadingSeller(false);
      }
    };
    loadSellerData();
  }, [user?.id, user?.userType]);

  // Load producer data (orders as seller, products owned)
  useEffect(() => {
    const loadProducerData = async () => {
      if (user?.userType !== 'producer') return;
      try {
        setIsLoadingSeller(true);
        const [ordersData, allProducts] = await Promise.all([
          apiService.getSellerOrders().catch(() => []),
          apiService.getAllProducts().catch(() => []),
        ]);
        setSellerOrders(ordersData || []);
        const mine = (allProducts || []).filter(p => (p.owner?.id || p.ownerId) === user?.id);
        setMyProducts(mine);
      } finally {
        setIsLoadingSeller(false);
      }
    };
    loadProducerData();
  }, [user?.id, user?.userType]);

  const restaurantMetrics = useMemo(() => {
    if (user?.userType !== 'restaurant') return null;
    const paidOrders = (sellerOrders || []).filter(o => o.status === 'PAID');
    const items = paidOrders.flatMap(o => o.items || []).filter(it => (it.product?.ownerId) === user?.id);
    const basketsSold = items.reduce((sum, it) => sum + (it.quantity || 0), 0);
    const impactRSE = items.filter(it => it.product?.solidaire).length;
    const pointsRSE = impactRSE * 10;
    const unsoldProposed = (myProducts || []).filter(p => p.isRestaurant).length;
    const recentActivity = (sellerOrders || [])
      .slice()
      .sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3)
      .map(o => ({
        id: o.id,
        customer: o.user?.fullName || 'Client',
        product: (o.items?.find(it => it.product?.ownerId === user?.id)?.product?.name) || `${o.items?.length || 0} articles`,
        amount: `${Number(o.total || 0).toFixed(2)}€`,
        status: o.status,
      }));
    return { basketsSold, impactRSE, pointsRSE, unsoldProposed, recentActivity };
  }, [sellerOrders, myProducts, user?.id, user?.userType]);

  // Producer metrics calculation
  const producerMetrics = useMemo(() => {
    if (user?.userType !== 'producer') return null;
    const paidOrders = (sellerOrders || []).filter(o => o.status === 'PAID');
    const items = paidOrders.flatMap(o => o.items || []).filter(it => (it.product?.ownerId) === user?.id);
    const productsForSale = (myProducts || []).filter(p => p.stock > 0).length;
    const ordersReceived = items.length;
    const revenue = items.reduce((sum, it) => sum + (Number(it.priceAtPurchase || 0) * Number(it.quantity || 0)), 0);
    const averageRating = (myProducts || []).reduce((sum, p) => sum + Number(p.rating || 0), 0) / Math.max(1, myProducts.length);
    const recentActivity = (sellerOrders || [])
      .slice()
      .sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3)
      .map(o => ({
        id: o.id,
        customer: o.user?.fullName || 'Client',
        product: (o.items?.find(it => it.product?.ownerId === user?.id)?.product?.name) || `${o.items?.length || 0} articles`,
        amount: `${Number(o.total || 0).toFixed(2)}€`,
        status: o.status,
      }));
    return { productsForSale, ordersReceived, revenue, averageRating, recentActivity };
  }, [sellerOrders, myProducts, user?.id, user?.userType]);

  // Load consumer data (orders, favorites) if applicable
  useEffect(() => {
    const load = async () => {
      try {
        if (user?.userType === 'consumer') {
          setIsLoadingData(true);
          const [ordersData] = await Promise.all([
            apiService.getOrders().catch(() => []),
          ]);
          setOrders(ordersData || []);
        }
      } finally {
        setIsLoadingData(false);
      }
    };
    load();
  }, [user?.userType]);

  // Load favorites from API when opening favorites tab
  useEffect(() => {
    const loadFavs = async () => {
      if (!user || activeTab !== 'favorites') return;
      try {
        const favs = await apiService.getUserFavorites().catch(() => []);
        const products = (favs || []).map(f => f.product || f);
        setFavorites(products);
      } catch {}
    };
    loadFavs();
  }, [activeTab, user?.id]);

  // Derive consumer metrics from orders
  const consumerMetrics = useMemo(() => {
    if (user?.userType !== 'consumer') return null;
    const allItems = orders.flatMap(o => o.items || []);
    const ordersCount = orders.length;
    const totalSpent = orders
      .filter(o => o.status === 'PAID')
      .reduce((sum, o) => sum + Number(o.total || 0), 0);
    const donationsCount = allItems.filter(it => it.product?.solidaire).length;
    const savings = allItems.reduce((sum, it) => {
      const original = Number(it.product?.originalPrice || 0);
      const paid = Number(it.priceAtPurchase || 0);
      const qty = Number(it.quantity || 0);
      const diff = Math.max(0, original - paid) * qty;
      return sum + diff;
    }, 0);
    const loyaltyPoints = Math.round(totalSpent);
    const recentOrders = orders
      .slice()
      .sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3)
      .map(o => ({
        id: o.id,
        product: o.items?.[0]?.product?.name || `${o.items?.length || 0} articles`,
        seller: o.items?.[0]?.product?.producer || 'Vendeur',
        amount: `${Number(o.total || 0).toFixed(2)}€`,
        status: o.status,
      }));
    return { ordersCount, totalSpent, donationsCount, savings, loyaltyPoints, recentOrders };
  }, [orders, user?.userType]);
  const getDashboardData = () => {
    // Admin dashboard content
    if ((user?.role === 'ADMIN') || (user?.userType === 'admin')) {
      return {
        title: 'Tableau de bord Administrateur',
        stats: [
          { label: 'Utilisateurs totaux', value: '-', icon: Users, color: 'text-blue-600' },
          { label: 'Produits actifs', value: '-', icon: Package, color: 'text-green-600' },
          { label: 'Commandes', value: '-', icon: ShoppingCart, color: 'text-purple-600' },
          { label: "Chiffre d'affaires", value: '-', icon: TrendingUp, color: 'text-yellow-600' }
        ],
        recentOrders: []
      };
    }
    switch (user?.userType) {
      case 'producer':
        return {
          title: 'Tableau de bord Producteur',
          stats: [
            { label: 'Produits en vente', value: String(producerMetrics?.productsForSale || 0), icon: Package, color: 'text-green-600' },
            { label: 'Commandes reçues', value: String(producerMetrics?.ordersReceived || 0), icon: ShoppingCart, color: 'text-blue-600' },
            { label: 'Chiffre d\'affaires', value: `${Number(producerMetrics?.revenue || 0).toFixed(2)}€`, icon: TrendingUp, color: 'text-purple-600' },
            { label: 'Note moyenne', value: Number(producerMetrics?.averageRating || 0).toFixed(1), icon: Star, color: 'text-yellow-600' }
          ],
          recentOrders: producerMetrics?.recentActivity || []
        };
      
      case 'restaurant':
        return {
          title: 'Tableau de bord Restaurant',
          stats: [
            { label: 'Invendus proposés', value: String(restaurantMetrics?.unsoldProposed || 0), icon: Package, color: 'text-green-600' },
            { label: 'Paniers vendus', value: String(restaurantMetrics?.basketsSold || 0), icon: ShoppingCart, color: 'text-blue-600' },
            { label: 'Impact RSE', value: String(restaurantMetrics?.impactRSE || 0), icon: Heart, color: 'text-red-600' },
            { label: 'Points RSE', value: String(restaurantMetrics?.pointsRSE || 0), icon: Award, color: 'text-purple-600' }
          ],
          recentOrders: restaurantMetrics?.recentActivity || []
        };
      
      default: // consumer
        return {
          title: 'Tableau de bord Consommateur',
          stats: [
            { label: 'Commandes passées', value: String(consumerMetrics?.ordersCount || 0), icon: ShoppingCart, color: 'text-green-600' },
            { label: 'Points fidélité', value: String(consumerMetrics?.loyaltyPoints || 0), icon: Star, color: 'text-yellow-600' },
            { label: 'Dons effectués', value: String(consumerMetrics?.donationsCount || 0), icon: Heart, color: 'text-red-600' },
            { label: 'Économies réalisées', value: `${Number(consumerMetrics?.savings || 0).toFixed(2)}€`, icon: TrendingUp, color: 'text-purple-600' }
          ],
          recentOrders: consumerMetrics?.recentOrders || []
        };
    }
  };

  const dashboardData = getDashboardData();

  const ProductModal = () => {
    if (!isProductModalOpen || (user?.userType !== 'restaurant' && user?.userType !== 'producer')) return null;
    const [form, setForm] = React.useState(editingProduct ? {
      name: editingProduct.name || '',
      price: String(editingProduct.price || ''),
      originalPrice: String(editingProduct.originalPrice || editingProduct.price || ''),
      stock: String(editingProduct.stock || ''),
      region: editingProduct.region || '',
      producer: editingProduct.producer || (user?.name || ''),
      type: editingProduct.type || (user?.userType === 'restaurant' ? 'restaurant' : 'producer'),
      distance: editingProduct.distance || '0 km',
      description: editingProduct.description || '',
      imageUrl: editingProduct.imageUrl || '',
      categoryId: editingProduct.categoryId || '',
      solidaire: Boolean(editingProduct.solidaire || (user?.userType === 'producer')), 
      expiryNote: editingProduct.expiryNote || '',
      contents: (editingProduct.contents || []).map((c, idx) => ({ item: c.item || '', emoji: c.emoji || '', order: idx })),
    } : {
      name: '',
      price: '',
      originalPrice: '',
      stock: '',
      region: '',
      producer: user?.name || '',
      type: user?.userType === 'restaurant' ? 'restaurant' : 'producer',
      distance: '0 km',
      description: '',
      imageUrl: '',
      categoryId: '',
      solidaire: user?.userType === 'producer',
      expiryNote: '',
      contents: [],
    });

    const [categories, setCategories] = React.useState([]);
    const [regions] = React.useState(apiService.getRegions());
    const [imageFile, setImageFile] = React.useState(null);
    const [imagePreview, setImagePreview] = React.useState(editingProduct?.imageUrl || '');
    const [isUploading, setIsUploading] = React.useState(false);

    React.useEffect(() => {
      const loadCategories = async () => {
        try {
          const data = await apiService.getCategories().catch(() => []);
          setCategories(data || []);
        } catch {}
      };
      loadCategories();
    }, []);

    // Mettre à jour le formulaire quand on passe en mode édition
    React.useEffect(() => {
      if (editingProduct) {
        setForm({
          name: editingProduct.name || '',
          price: String(editingProduct.price || ''),
          originalPrice: String(editingProduct.originalPrice || editingProduct.price || ''),
          stock: String(editingProduct.stock || ''),
          region: editingProduct.region || '',
          producer: editingProduct.producer || (user?.name || ''),
          type: editingProduct.type || (user?.userType === 'restaurant' ? 'restaurant' : 'producer'),
          distance: editingProduct.distance || '0 km',
          description: editingProduct.description || '',
          imageUrl: editingProduct.imageUrl || '',
          categoryId: editingProduct.categoryId || '',
          solidaire: Boolean(editingProduct.solidaire || (user?.userType === 'producer')),
          expiryNote: editingProduct.expiryNote || '',
          contents: (editingProduct.contents || []).map((c, idx) => ({ item: c.item || '', emoji: c.emoji || '', order: idx })),
        });
        setImagePreview(editingProduct.imageUrl || '');
      }
    }, [editingProduct, user?.userType, user?.name]);

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
    const onChangeContent = (idx, key, value) => {
      const next = [...form.contents];
      next[idx] = { ...next[idx], [key]: value };
      // recalculer order
      next.forEach((c, i) => c.order = i);
      setForm({ ...form, contents: next });
    };
    const addContentRow = () => setForm({ ...form, contents: [...form.contents, { item: '', emoji: '', order: form.contents.length }] });
    const removeContentRow = (idx) => {
      const next = form.contents.filter((_, i) => i !== idx).map((c, i) => ({ ...c, order: i }));
      setForm({ ...form, contents: next });
    };

    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(file);
      }
    };

    const uploadImage = async () => {
      if (!imageFile) return null;
      
      try {
        setIsUploading(true);
        const result = await apiService.uploadProductImage(imageFile);
        return result.url;
      } catch (error) {
        toast({ title: 'Erreur', description: error.message || 'Échec de l\'upload', variant: 'destructive' });
        return null;
      } finally {
        setIsUploading(false);
      }
    };

    const close = () => { 
      setIsProductModalOpen(false); 
      setEditingProduct(null); 
      setImageFile(null);
      setImagePreview('');
    };
    
    const save = async () => {
      try {
        // Debug: vérifier l'authentification
        const token = localStorage.getItem('greencart_token');
        console.log('Token présent:', !!token);
        console.log('User connecté:', user);
        console.log('User type:', user?.userType);
        
        // Upload image si nouvelle image sélectionnée
        let finalImageUrl = form.imageUrl;
        if (imageFile) {
          console.log('Tentative d\'upload d\'image...');
          const uploadedUrl = await uploadImage();
          if (uploadedUrl) {
            finalImageUrl = uploadedUrl;
            console.log('Image uploadée:', uploadedUrl);
          } else {
            return; // Erreur upload
          }
        }

        const payload = {
          name: form.name,
          description: form.description || `Produit ${user?.userType === 'restaurant' ? 'du restaurant' : 'local'}`,
          price: Number(form.price || 0),
          originalPrice: Number(form.originalPrice || form.price || 0),
          stock: Number(form.stock || 0),
          imageUrl: finalImageUrl || undefined,
          categoryId: form.categoryId || undefined,
          type: user?.userType === 'restaurant' ? 'restaurant' : 'producer',
          region: form.region || 'Île-de-France',
          producer: form.producer || user?.name || (user?.userType === 'restaurant' ? 'Restaurant' : 'Producteur'),
          distance: form.distance || '0 km',
          isRestaurant: user?.userType === 'restaurant',
          solidaire: Boolean(form.solidaire),
          expiryNote: (user?.userType === 'restaurant' ? (form.expiryNote || undefined) : undefined),
          contents: (form.contents || []).map((c, idx) => ({ item: c.item, emoji: c.emoji, order: idx })).filter(c => c.item && c.emoji),
        };
        
        console.log('Payload à envoyer:', payload);
        
        if (editingProduct) {
          await apiService.updateProduct(editingProduct.id, payload);
        } else {
          await apiService.createProduct(payload);
        }
        toast({ title: 'Succès', description: 'Produit enregistré' });
        // reload my products
        const all = await apiService.getAllProducts().catch(() => []);
        setMyProducts((all || []).filter(p => (p.owner?.id || p.ownerId) === user?.id));
        close();
      } catch (err) {
        console.error('Erreur lors de la sauvegarde:', err);
        toast({ title: 'Erreur', description: err.message || 'Échec enregistrement', variant: 'destructive' });
      }
    };
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={close}>
        <div className="bg-white rounded-xl w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">{editingProduct ? 'Modifier un produit' : 'Ajouter un produit'}</h3>
            <button onClick={close}>✕</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input name="name" placeholder="Nom" value={form.name} onChange={onChange} className="w-full border p-2 rounded" />
            <input name="price" placeholder="Prix (EUR)" value={form.price} onChange={onChange} className="w-full border p-2 rounded" />
            <input name="originalPrice" placeholder="Prix d'origine" value={form.originalPrice} onChange={onChange} className="w-full border p-2 rounded" />
            <input name="stock" placeholder="Stock" value={form.stock} onChange={onChange} className="w-full border p-2 rounded" />
            
            <select name="region" value={form.region} onChange={onChange} className="w-full border p-2 rounded">
              <option value="">Sélectionner une région...</option>
              {regions.map(region => (
                <option key={region.id} value={region.name}>{region.name}</option>
              ))}
            </select>
            
            <input name="producer" placeholder="Nom affiché" value={form.producer} onChange={onChange} className="w-full border p-2 rounded" />
            <input name="distance" placeholder="Distance (ex: 5 km)" value={form.distance} onChange={onChange} className="w-full border p-2 rounded" />
            
            <select name="categoryId" value={form.categoryId} onChange={onChange} className="w-full border p-2 rounded">
              <option value="">Catégorie...</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            
            {user?.userType === 'restaurant' && (
              <input name="expiryNote" placeholder="Note d'expiration (ex: À consommer dans 24h)" value={form.expiryNote} onChange={onChange} className="w-full border p-2 rounded md:col-span-2" />
            )}
            {(user?.userType === 'producer' || user?.userType === 'restaurant') && (
              <label className="flex items-center gap-2 md:col-span-2">
                <input type="checkbox" name="solidaire" checked={!!form.solidaire} onChange={onChange} />
                <span>Produit solidaire</span>
              </label>
            )}
            <textarea name="description" placeholder="Description" value={form.description} onChange={onChange} className="w-full border p-2 rounded md:col-span-2" />
          </div>

          {/* Image Upload Section */}
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Image du produit</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="w-full border p-2 rounded"
                  disabled={isUploading}
                />
                <p className="text-xs text-gray-500 mt-1">Formats: JPG, PNG, WEBP (max 10MB)</p>
              </div>
              <div className="flex items-center justify-center">
                {imagePreview ? (
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Aperçu" 
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                    {imageFile && (
                      <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                        ✓
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-32 h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                    Aucune image
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">Contenu garanti du panier</h4>
              <Button size="sm" variant="outline" onClick={addContentRow}>Ajouter un élément</Button>
            </div>
            {form.contents.length === 0 && (
              <div className="text-sm text-gray-500 mb-2">Ajoutez des éléments (ex: 🥕 Carottes bio)</div>
            )}
            <div className="space-y-2">
              {form.contents.map((c, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                  <input className="col-span-2 border p-2 rounded" placeholder="Emoji (ex: 🥕)" value={c.emoji} onChange={(e) => onChangeContent(idx, 'emoji', e.target.value)} />
                  <input className="col-span-9 border p-2 rounded" placeholder="Intitulé (ex: Carottes bio)" value={c.item} onChange={(e) => onChangeContent(idx, 'item', e.target.value)} />
                  <button onClick={() => removeContentRow(idx)} className="col-span-1 text-red-600">✕</button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={close}>Annuler</Button>
            <Button className="green-gradient text-white" onClick={save} disabled={isUploading}>
              {isUploading ? 'Upload en cours...' : 'Enregistrer'}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const isAdmin = (user?.role === 'ADMIN') || (user?.userType === 'admin');
  const tabs = isAdmin
    ? [
        { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
        { id: 'users', label: 'Utilisateurs', icon: Users },
        { id: 'products', label: 'Produits', icon: Package },
        { id: 'orders', label: 'Commandes', icon: ShoppingCart },
      ]
    : [
    { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
        ...(user?.userType === 'restaurant' ? [
          { id: 'orders', label: 'Commandes', icon: ShoppingCart },
          { id: 'ready', label: 'Commandes prêtes', icon: ShoppingCart },
          { id: 'products', label: 'Mes produits', icon: Package },
          { id: 'impact', label: 'Impact', icon: Award },
        ] : user?.userType === 'producer' ? [
          { id: 'orders', label: 'Mes commandes', icon: ShoppingCart },
          { id: 'ready', label: 'Commandes prêtes', icon: ShoppingCart },
          { id: 'products', label: 'Mes produits', icon: Package },
          { id: 'favorites', label: 'Favoris', icon: Heart },
          { id: 'loyalty', label: 'Fidélité', icon: Award },
        ] : [
          { id: 'orders', label: 'Mes commandes', icon: ShoppingCart },
          { id: 'ready', label: 'Commandes prêtes', icon: ShoppingCart },
          { id: 'favorites', label: 'Favoris', icon: Heart },
          { id: 'loyalty', label: 'Fidélité', icon: Award },
        ])
  ];

  return (
    <>
      <Helmet>
        <title>Tableau de bord - GreenCart</title>
        <meta name="description" content="Gérez votre compte GreenCart, suivez vos commandes et votre programme de fidélité." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50">
        <Header />
        
        <div className="pt-20 pb-12">
          <div className="container mx-auto px-4">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold gradient-text mb-2">
                    {dashboardData.title}
                  </h1>
                  <p className="text-xl text-gray-600">
                    Bienvenue, {user?.name} !
                  </p>
                </div>
                
                {user?.userType === 'restaurant' && (
                  <Button 
                    onClick={() => { setEditingProduct(null); setIsProductModalOpen(true); setActiveTab('products'); }}
                    className="green-gradient text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Ajouter un produit
                  </Button>
                )}
                
                {user?.userType === 'producer' && (
                  <Button 
                    onClick={() => { setEditingProduct(null); setIsProductModalOpen(true); setActiveTab('products'); }}
                    className="green-gradient text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Ajouter un produit
                  </Button>
                )}
              </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              {dashboardData.stats.map((stat, index) => (
                <div key={index} className="glass-effect rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <span className={`text-2xl font-bold ${stat.color}`}>
                      {stat.value}
                    </span>
                  </div>
                  <p className="text-gray-600 font-medium">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="glass-effect rounded-2xl p-6 mb-8"
            >
              <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="min-h-[400px]">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-gray-800">
                        {user?.userType === 'consumer' ? 'Commandes récentes' : 
                         user?.userType === 'producer' ? 'Activité récente' :
                         'Activité récente'}
                      </h3>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setActiveTab('orders')}
                      >
                        Voir tout
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {dashboardData.recentOrders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <ShoppingCart className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{order.product}</p>
                              <p className="text-sm text-gray-600">
                                {user?.userType === 'consumer' ? order.seller : order.customer}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-800">{order.amount}</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              order.status === 'Livré' || order.status === 'Récupéré' || order.status === 'PAID'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Restaurant: Orders list */}
                {(!isAdmin && activeTab === 'orders' && user?.userType === 'restaurant') && (
                  <div className="space-y-3">
                    {isLoadingSeller && (<div className="text-center text-gray-600">Chargement...</div>)}
                    {!isLoadingSeller && sellerOrders.length === 0 && (<div className="text-center text-gray-600">Aucune commande.</div>)}
                    {!isLoadingSeller && sellerOrders.map((o) => (
                      <div key={o.id} className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-between">
                          <div className="font-semibold text-gray-800">Commande #{o.id}</div>
                          <div className="text-sm">{new Date(o.createdAt).toLocaleDateString('fr-FR')}</div>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Client: {o.user?.fullName || 'Client'}</div>
                        <div className="mt-2 space-y-1 text-sm">
                          {(o.items || []).filter(it => it.product?.ownerId === user?.id).map((it) => (
                            <div key={it.id} className="flex items-center justify-between">
                              <span>{it.product?.name || 'Produit'} x{it.quantity}</span>
                              <span>{Number(it.priceAtPurchase || 0).toFixed(2)}€</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="font-semibold">Total: {Number(o.total || 0).toFixed(2)}€</div>
                          <Button size="sm" className="green-gradient text-white"
                            onClick={async () => {
                              try {
                                await apiService.markOrderReady(o.id);
                                toast({ title: 'Commande prête', description: 'Le client a été notifié.' });
                                // reload seller orders
                                const [ordersData] = await Promise.all([
                                  apiService.getSellerOrders().catch(() => []),
                                ]);
                                setSellerOrders(ordersData || []);
                              } catch (e) {
                                toast({ title: 'Erreur', description: e.message || 'Impossible de notifier', variant: 'destructive' });
                              }
                            }}
                          >
                            Marquer comme prête
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Producer: Orders list */}
                {(!isAdmin && activeTab === 'orders' && user?.userType === 'producer') && (
                  <div className="space-y-3">
                    {isLoadingSeller && (<div className="text-center text-gray-600">Chargement...</div>)}
                    {!isLoadingSeller && sellerOrders.length === 0 && (<div className="text-center text-gray-600">Aucune commande.</div>)}
                    {!isLoadingSeller && sellerOrders.map((o) => (
                      <div key={o.id} className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-between">
                          <div className="font-semibold text-gray-800">Commande #{o.id}</div>
                          <div className="text-sm">{new Date(o.createdAt).toLocaleDateString('fr-FR')}</div>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Client: {o.user?.fullName || 'Client'}</div>
                        <div className="mt-2 space-y-1 text-sm">
                          {(o.items || []).filter(it => it.product?.ownerId === user?.id).map((it) => (
                            <div key={it.id} className="flex items-center justify-between">
                              <span>{it.product?.name || 'Produit'} x{it.quantity}</span>
                              <span>{Number(it.priceAtPurchase || 0).toFixed(2)}€</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="font-semibold">Total: {Number(o.total || 0).toFixed(2)}€</div>
                          <Button size="sm" className="green-gradient text-white"
                            onClick={async () => {
                              try {
                                await apiService.markOrderReady(o.id);
                                toast({ title: 'Commande prête', description: 'Le client a été notifié.' });
                                const [ordersData] = await Promise.all([
                                  apiService.getSellerOrders().catch(() => []),
                                ]);
                                setSellerOrders(ordersData || []);
                              } catch (e) {
                                toast({ title: 'Erreur', description: e.message || 'Impossible de notifier', variant: 'destructive' });
                              }
                            }}
                          >
                            Marquer comme prête
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Ready orders for seller */}
                {(!isAdmin && activeTab === 'ready' && (user?.userType === 'restaurant' || user?.userType === 'producer')) && (
                  <div className="space-y-3">
                    {isLoadingSeller && (<div className="text-center text-gray-600">Chargement...</div>)}
                    {!isLoadingSeller && sellerOrders.length === 0 && (<div className="text-center text-gray-600">Aucune commande.</div>)}
                    {!isLoadingSeller && sellerOrders.map((o) => {
                      const readyItems = (o.items || []).filter(it => it.product?.ownerId === user?.id && it.sellerReady);
                      if (readyItems.length === 0) return null;
                      return (
                        <div key={o.id} className="p-4 bg-green-50 rounded-xl border border-green-200">
                          <div className="flex items-center justify-between">
                            <div className="font-semibold text-gray-800">Commande #{o.id}</div>
                            <div className="text-sm">{new Date(o.createdAt).toLocaleDateString('fr-FR')}</div>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">Client: {o.user?.fullName || 'Client'}</div>
                          <div className="mt-2 space-y-1 text-sm">
                            {readyItems.map((it) => (
                              <div key={it.id} className="flex items-center justify-between">
                                <span>{it.product?.name || 'Produit'} x{it.quantity}</span>
                                <span>{Number(it.priceAtPurchase || 0).toFixed(2)}€</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Consumer: Ready orders confirmation */}
                {activeTab === 'ready' && !isAdmin && user?.userType === 'consumer' && (
                  <div className="space-y-3">
                    {isLoadingData && (
                      <div className="text-center text-gray-600">Chargement des commandes...</div>
                    )}
                    {!isLoadingData && orders.length === 0 && (
                      <div className="text-center text-gray-600">Aucune commande prête.</div>
                    )}
                    {!isLoadingData && orders.map((o) => {
                      const anyReady = (o.items || []).some(it => it.sellerReady && !it.pickedUp);
                      if (!anyReady) return null;
                      return (
                        <div key={o.id} className="p-4 bg-green-50 rounded-xl border border-green-200">
                          <div className="flex items-center justify-between">
                            <div className="font-semibold text-gray-800">Commande #{o.id}</div>
                            <div className="text-sm">{new Date(o.createdAt).toLocaleDateString('fr-FR')}</div>
                          </div>
                          <div className="mt-2 space-y-1 text-sm">
                            {(o.items || []).filter(it => it.sellerReady && !it.pickedUp).map((it) => (
                              <div key={it.id} className="flex items-center justify-between">
                                <span>{it.product?.name || 'Produit'} x{it.quantity}</span>
                                <span>{Number(it.priceAtPurchase || 0).toFixed(2)}€</span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 text-right">
                            <Button size="sm" className="green-gradient text-white" onClick={async () => {
                              try {
                                await apiService.confirmOrderPickup(o.id);
                                toast({ title: 'Merci', description: 'Commande récupérée confirmée.' });
                                const refreshed = await apiService.getOrders().catch(() => []);
                                setOrders(refreshed || []);
                              } catch (e) {
                                toast({ title: 'Erreur', description: e.message || 'Impossible de confirmer', variant: 'destructive' });
                              }
                            }}>J\'ai récupéré</Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Restaurant: My products */}
                {(!isAdmin && activeTab === 'products' && user?.userType === 'restaurant') && (
                  <div className="space-y-4">
                    <div className="text-right">
                      <Button onClick={() => { setEditingProduct(null); setIsProductModalOpen(true); }} className="green-gradient text-white">
                        <Plus className="w-4 h-4 mr-2" /> Ajouter
                      </Button>
                    </div>
                    <div className="overflow-x-auto glass-effect rounded-2xl">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {myProducts.map(p => (
                            <tr key={p.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 text-sm text-gray-900">{p.name}</td>
                              <td className="px-6 py-4 text-sm text-gray-900">{Number(p.price).toFixed(2)}€</td>
                              <td className="px-6 py-4 text-sm text-gray-900">{p.stock}</td>
                              <td className="px-6 py-4 text-sm">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${p.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                  {p.stock > 0 ? 'Actif' : 'Inactif'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right text-sm font-medium">
                                <div className="flex items-center justify-end gap-2">
                                  <button onClick={() => { setEditingProduct(p); setIsProductModalOpen(true); }} className="text-green-600 hover:text-green-900">Modifier</button>
                                  <button onClick={async () => { if (!window.confirm(`Confirmer la suppression du produit "${p.name}" ?`)) return; await apiService.deleteProduct(p.id); setMyProducts(prev => prev.filter(x => x.id !== p.id)); }} className="text-red-600 hover:text-red-900">Supprimer</button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Producer: My products */}
                {(!isAdmin && activeTab === 'products' && user?.userType === 'producer') && (
                  <div className="space-y-4">
                    <div className="text-right">
                      <Button onClick={() => { setEditingProduct(null); setIsProductModalOpen(true); }} className="green-gradient text-white">
                        <Plus className="w-4 h-4 mr-2" /> Ajouter
                      </Button>
                    </div>
                    <div className="overflow-x-auto glass-effect rounded-2xl">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {myProducts.map(p => (
                            <tr key={p.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 text-sm text-gray-900">{p.name}</td>
                              <td className="px-6 py-4 text-sm text-gray-900">{Number(p.price).toFixed(2)}€</td>
                              <td className="px-6 py-4 text-sm text-gray-900">{p.stock}</td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                  {Number(p.rating || 0).toFixed(1)}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${p.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                  {p.stock > 0 ? 'Actif' : 'Inactif'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right text-sm font-medium">
                                <div className="flex items-center justify-end gap-2">
                                  <button onClick={() => { setEditingProduct(p); setIsProductModalOpen(true); }} className="text-green-600 hover:text-green-900">Modifier</button>
                                  <button onClick={async () => { if (!window.confirm(`Confirmer la suppression du produit "${p.name}" ?`)) return; await apiService.deleteProduct(p.id); setMyProducts(prev => prev.filter(x => x.id !== p.id)); }} className="text-red-600 hover:text-red-900">Supprimer</button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Restaurant: Impact */}
                {(!isAdmin && activeTab === 'impact' && user?.userType === 'restaurant') && (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="glass-effect rounded-2xl p-6">
                        <p className="text-sm text-gray-600">Impact RSE</p>
                        <p className="text-3xl font-bold text-gray-800">{restaurantMetrics?.impactRSE || 0}</p>
                      </div>
                      <div className="glass-effect rounded-2xl p-6">
                        <p className="text-sm text-gray-600">Points RSE</p>
                        <p className="text-3xl font-bold text-gray-800">{restaurantMetrics?.pointsRSE || 0}</p>
                      </div>
                    </div>
                    <p className="text-gray-600">Vos points RSE augmentent avec les paniers solidaires vendus.</p>
                  </div>
                )}

                {/* Producer: Favorites */}
                {(!isAdmin && activeTab === 'favorites' && user?.userType === 'producer') && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold gradient-text mb-2">
                        Mes favoris
                      </h3>
                      <p className="text-gray-600">
                        Gérez vos produits favoris et vos références
                      </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {favorites.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Heart className="w-12 h-12 text-gray-400" />
                          </div>
                          <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            Aucun favori pour le moment
                          </h3>
                          <p className="text-gray-600 mb-4">
                            Ajoutez des produits à vos favoris pour les retrouver facilement
                          </p>
                        </div>
                      ) : (
                        favorites.map((fav) => (
                          <div key={fav.id} className="glass-effect rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                <Heart className="w-6 h-6 text-green-600" />
                              </div>
                              <button 
                                onClick={async () => {
                                  if (!window.confirm('Retirer ce favori ?')) return;
                                  await apiService.removeFromFavorites(fav.id);
                                  setFavorites(prev => prev.filter(p => p.id !== fav.id));
                                }}
                                className="text-red-500 hover:text-red-700"
                              >
                                ✕
                              </button>
                            </div>
                            <h4 className="font-semibold text-gray-800 mb-2">{fav.name || 'Produit favori'}</h4>
                            <p className="text-sm text-gray-600">{fav.description || 'Description du produit'}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Favorites (Consumer) */}
                {(!isAdmin && activeTab === 'favorites' && user?.userType === 'consumer') && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold gradient-text mb-2">
                        Mes favoris
                      </h3>
                      <p className="text-gray-600">
                        Vos produits enregistrés en favoris
                      </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {favorites.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Heart className="w-12 h-12 text-gray-400" />
                          </div>
                          <h3 className="text-xl font-semibold text-gray-800 mb-2">Aucun favori</h3>
                          <p className="text-gray-600">Ajoutez des produits depuis la boutique</p>
                        </div>
                      ) : (
                        favorites.map((fav) => (
                          <div key={fav.id} className="glass-effect rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                <Heart className="w-6 h-6 text-green-600" />
                              </div>
                              <button
                                onClick={async () => {
                                  if (!window.confirm('Retirer ce favori ?')) return;
                                  await apiService.removeFromFavorites(fav.id);
                                  setFavorites(prev => prev.filter(p => p.id !== fav.id));
                                }}
                                className="text-red-500 hover:text-red-700"
                              >
                                ✕
                              </button>
                            </div>
                            <h4 className="font-semibold text-gray-800 mb-2">{fav.name}</h4>
                            <p className="text-sm text-gray-600">{fav.description}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Producer: Loyalty */}
                {(!isAdmin && activeTab === 'loyalty' && user?.userType === 'producer') && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold gradient-text mb-2">
                        Programme de fidélité Producteur
                      </h3>
                      <p className="text-gray-600">
                        Gagnez des points en vendant vos produits et accédez à des avantages exclusifs
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-lg font-semibold">Points actuels</p>
                          <p className="text-sm opacity-90">Basé sur vos ventes</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">{Math.round(producerMetrics?.revenue || 0)}</p>
                          <p className="text-sm opacity-90">points</p>
                        </div>
                      </div>
                      
                      <div className="bg-white/20 rounded-full h-3 overflow-hidden mb-4">
                        <div 
                          className="h-full bg-white rounded-full transition-all duration-1000"
                          style={{ width: `${Math.min(((producerMetrics?.revenue || 0) / 1000) * 100, 100)}%` }}
                        />
                      </div>
                      
                      <p className="text-sm opacity-90">
                        {Math.max(0, 1000 - (producerMetrics?.revenue || 0))}€ de plus pour le prochain niveau !
                      </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      {[
                        { level: 'Bronze', requirement: 0, reward: 'Accès aux marchés locaux', available: true },
                        { level: 'Argent', requirement: 500, reward: 'Promotion prioritaire', available: (producerMetrics?.revenue || 0) >= 500 },
                        { level: 'Or', requirement: 1000, reward: 'Support premium', available: (producerMetrics?.revenue || 0) >= 1000 }
                      ].map((reward, index) => (
                        <div key={index} className={`p-4 rounded-xl border-2 ${
                          reward.available 
                            ? 'border-green-200 bg-green-50' 
                            : 'border-gray-200 bg-gray-50'
                        }`}>
                          <div className="text-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                              reward.available ? 'bg-green-500' : 'bg-gray-400'
                            }`}>
                              <Award className="w-6 h-12 text-white" />
                            </div>
                            <p className="font-semibold text-gray-800 mb-1">{reward.level}</p>
                            <p className="text-sm text-gray-600">{reward.reward}</p>
                            {reward.requirement > 0 && (
                              <p className="text-xs text-gray-500 mt-2">
                                {reward.requirement}€ minimum
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Consumer: Loyalty */}
                {activeTab === 'loyalty' && !isAdmin && user?.userType === 'consumer' && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold gradient-text mb-2">
                        Programme de fidélité
                      </h3>
                      <p className="text-gray-600">
                        Vous avez {user?.loyaltyPoints || 42} points de fidélité
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-lg font-semibold">Prochain objectif</p>
                          <p className="text-sm opacity-90">Panier gratuit à 70 points</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">{user?.loyaltyPoints || 42}/70</p>
                          <p className="text-sm opacity-90">points</p>
                        </div>
                      </div>
                      
                      <div className="bg-white/20 rounded-full h-3 overflow-hidden mb-4">
                        <div 
                          className="h-full bg-white rounded-full transition-all duration-1000"
                          style={{ width: `${((user?.loyaltyPoints || 42) / 70) * 100}%` }}
                        />
                      </div>
                      
                      <p className="text-sm opacity-90">
                        Plus que {70 - (user?.loyaltyPoints || 42)} points pour votre prochain panier gratuit !
                      </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      {[
                        { points: 50, reward: '5€ de réduction', available: true },
                        { points: 70, reward: 'Panier gratuit', available: false },
                        { points: 100, reward: 'Livraison gratuite', available: false }
                      ].map((reward, index) => (
                        <div key={index} className={`p-4 rounded-xl border-2 ${
                          reward.available 
                            ? 'border-green-200 bg-green-50' 
                            : 'border-gray-200 bg-gray-50'
                        }`}>
                          <div className="text-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                              reward.available ? 'bg-green-500' : 'bg-gray-400'
                            }`}>
                              <Award className="w-6 h-6 text-white" />
                            </div>
                            <p className="font-semibold text-gray-800 mb-1">{reward.points} points</p>
                            <p className="text-sm text-gray-600">{reward.reward}</p>
                            {reward.available && (
                              <Button 
                                size="sm" 
                                className="mt-3 green-gradient text-white"
                                onClick={() => handleFeatureClick('Échanger des points')}
                              >
                                Échanger
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                  {(!isAdmin && activeTab === 'orders' && user?.userType !== 'restaurant') && (
                  <div className="space-y-3">
                    {isLoadingData && (
                      <div className="text-center text-gray-600">Chargement des commandes...</div>
                    )}
                    {!isLoadingData && orders.length === 0 && (
                      <div className="text-center text-gray-600">Aucune commande pour le moment.</div>
                    )}
                    {!isLoadingData && orders.map((o) => (
                      <div key={o.id} className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-between">
                          <div className="font-semibold text-gray-800">Commande #{o.id}</div>
                          <div className="text-sm">{new Date(o.createdAt).toLocaleDateString('fr-FR')}</div>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Statut: {o.status}</div>
                        <div className="mt-2 space-y-1 text-sm">
                          {(o.items || []).map((it) => (
                            <div key={it.id} className="flex items-center justify-between">
                              <span>{it.product?.name || 'Produit'} x{it.quantity}</span>
                              <span>{Number(it.priceAtPurchase || 0).toFixed(2)}€</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 text-right font-semibold">Total: {Number(o.total || 0).toFixed(2)}€</div>
                      </div>
                    ))}
                  </div>
                )}

                {(!isAdmin && activeTab === 'products' && user?.userType !== 'restaurant') && (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      Fonctionnalité en développement
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Cette section sera bientôt disponible !
                    </p>
                    <Button 
                      onClick={() => handleFeatureClick(tabs.find(t => t.id === activeTab)?.label)}
                      className="green-gradient text-white"
                    >
                      En savoir plus
                    </Button>
                  </div>
                )}

                 {isAdmin && (activeTab === 'users' || activeTab === 'products' || activeTab === 'orders') && (
                  <div className="text-center py-12">
                     <h3 className="text-xl font-semibold text-gray-800 mb-2">
                       Raccourci administration
                     </h3>
                     <p className="text-gray-600 mb-4">
                       Accédez à la gestion complète depuis l’interface d’administration.
                     </p>
                     <a href="/admin" className="inline-block px-4 py-2 rounded-xl green-gradient text-white">Ouvrir l’administration</a>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        <Footer />
      </div>
      <ProductModal />
    </>
  );
};

export default DashboardPage;