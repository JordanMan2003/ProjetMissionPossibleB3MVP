import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Filter, Search, ShoppingCart, Heart, Star, MapPin, Clock, CheckCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/UserContext';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import apiService from '@/services/api';

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({
    type: 'all',
    region: 'all',
    solidaire: false
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [favorites, setFavorites] = useState([]);
  
  const { user } = useAuth();
  const { toast } = useToast();

  const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1635865165118-917ed9e20936';
  const resolveImageUrl = (url) => {
    if (!url || typeof url !== 'string') return PLACEHOLDER_IMG;
    if (url.startsWith('http')) return url;
    const backendOrigin = apiService.baseURL.replace(/\/?api$/, '');
    // Chemin déjà sous /api -> préfixer par l'origine backend sans /api
    if (url.startsWith('/api/')) {
      return `${backendOrigin}${url}`;
    }
    // Chemins de type uploads/... ou /uploads/...
    if (url.startsWith('uploads') || url.startsWith('/uploads')) {
      const needsSlash = url.startsWith('/') ? '' : '/';
      return `${backendOrigin}${needsSlash}${url}`;
    }
    // Autres chemins relatifs
    const needsSlash = url.startsWith('/') ? '' : '/';
    return `${backendOrigin}${needsSlash}${url}`;
  };

  const [regionOptions, setRegionOptions] = useState([]);

  // Load products from API
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productsData = await apiService.getShopProducts();
        setProducts(productsData);
        setFilteredProducts(productsData);

        // Construire la liste des régions disponibles (dynamiques + prédéfinies)
        const predefined = (apiService.getRegions?.() || []).map(r => r.name);
        const fromProducts = Array.from(new Set((productsData || []).map(p => p.region).filter(Boolean)));
        const merged = Array.from(new Set([...fromProducts, ...predefined]));
        setRegionOptions(merged);
      } catch (error) {
        console.error('Failed to load products:', error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les produits",
          variant: "destructive"
        });
      }
    };

    loadProducts();
  }, [toast]);

  // Load user favorites if logged in
  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) return;
      try {
        const favoritesData = await apiService.getUserFavorites();
        const favoriteProductIds = favoritesData.map(fav => fav.productId);
        setFavorites(favoriteProductIds);
      } catch (error) {
        console.error('Failed to load favorites:', error);
      }
    };

    loadFavorites();
  }, [user]);

  // Filter products
  useEffect(() => {
    const filterProducts = async () => {
      try {
        const filteredData = await apiService.getShopProducts(searchTerm, filters);
        setFilteredProducts(filteredData);
      } catch (error) {
        console.error('Failed to filter products:', error);
      }
    };

    filterProducts();
  }, [searchTerm, filters]);

  const addToCart = async (product) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour ajouter des produits au panier",
        variant: "destructive"
      });
      return;
    }

    try {
      await apiService.addToCart(product.id, 1);
      // Recharger le panier depuis l'API pour assurer la synchro
      const srvCart = await apiService.getCart().catch(() => null);
      if (srvCart && Array.isArray(srvCart.items)) {
        const uiCart = srvCart.items.map(it => ({
          id: it.productId,
          name: it.product?.name,
          price: Number(it.product?.price || 0),
          quantity: it.quantity,
        }));
        setCart(uiCart);
      } else {
        // Fallback local si indispo
        setCart(prev => {
          const existing = prev.find(item => item.id === product.id);
          if (existing) {
            return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
          }
          return [...prev, { ...product, quantity: 1 }];
        });
      }

      toast({
        title: "Ajouté au panier !",
        description: `${product.name} a été ajouté à votre panier`,
      });
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le produit au panier",
        variant: "destructive"
      });
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const openProductDetails = (product) => {
    setSelectedProduct(product);
  };

  const closeProductDetails = () => {
    setSelectedProduct(null);
  };

  const toggleFavorite = async (productId) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour ajouter des favoris",
        variant: "destructive"
      });
      return;
    }

    try {
      if (favorites.includes(productId)) {
        await apiService.removeFromFavorites(productId);
        setFavorites(prev => prev.filter(id => id !== productId));
        toast({
          title: "Favori retiré !",
          description: "Produit retiré des favoris",
        });
      } else {
        await apiService.addToFavorites(productId);
        setFavorites(prev => [...prev, productId]);
        toast({
          title: "Favori ajouté !",
          description: "Produit ajouté aux favoris",
        });
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les favoris",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Boutique - GreenCart</title>
        <meta name="description" content="Découvrez nos paniers de produits frais locaux et nos invendus à prix réduits. Circuit court et anti-gaspillage avec contenu garanti." />
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
              className="text-center mb-12"
            >
              <h1 className="text-4xl font-bold gradient-text mb-4">
                Boutique GreenCart
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
                Découvrez nos paniers de produits frais locaux et nos invendus à prix réduits
              </p>
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full font-medium">
                <CheckCircle className="w-5 h-5" />
                <span>Contenu garanti - Pas de surprise !</span>
              </div>
            </motion.div>

            {/* Search and Filters */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="glass-effect rounded-2xl p-6 mb-8"
            >
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Search */}
                <div className="lg:col-span-2 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher des produits..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Type Filter */}
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({...filters, type: e.target.value})}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">Tous les types</option>
                  <option value="producer">Producteurs</option>
                  <option value="restaurant">Restaurants</option>
                </select>

                {/* Region Filter */}
                <select
                  value={filters.region}
                  onChange={(e) => setFilters({ ...filters, region: e.target.value })}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">Toutes les régions</option>
                  {regionOptions.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>

                {/* Solidaire Filter */}
                <label className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-xl cursor-pointer hover:border-green-300 transition-colors">
                  <input
                    type="checkbox"
                    checked={filters.solidaire}
                    onChange={(e) => setFilters({...filters, solidaire: e.target.checked})}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium">Solidaire</span>
                </label>
              </div>
            </motion.div>

            {/* Products Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="glass-effect rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 group"
                >
                  <div className="relative">
                    <img  alt={product.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" src={resolveImageUrl(product.imageUrl)} onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMG; }} />
                    
                    {product.solidaire && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        Solidaire
                      </div>
                    )}
                    
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      -{Math.round(((Number(product.originalPrice || 0) - Number(product.price || 0)) / Math.max(Number(product.originalPrice || 0), 1)) * 100)}%
                    </div>

                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-green-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Contenu garanti
                    </div>

                    {/* Bouton favori */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(product.id);
                      }}
                      className={`absolute top-3 right-12 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                        favorites.includes(product.id)
                          ? 'bg-red-500 text-white shadow-lg'
                          : 'bg-white/90 text-gray-600 hover:bg-red-50 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${favorites.includes(product.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-2 h-2 rounded-full ${product.type === 'producer' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                      <span className="text-xs text-gray-600 font-medium">
                        {product.type === 'producer' ? 'Producteur' : 'Restaurant'}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors">
                      {product.name}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-3">
                      {product.description}
                    </p>

                    {/* Product Contents Preview */}
                    <div className="mb-4 p-3 bg-green-50 rounded-lg">
                      <p className="text-sm font-medium text-green-800 mb-2">
                        {product.isRestaurant && product.expiryNote ? (
                          <span className="text-orange-700">{product.expiryNote}</span>
                        ) : (
                          "Ce panier contient :"
                        )}
                      </p>
                      <div className="text-sm text-gray-700">
                        {(product.contents || []).slice(0, 3).map((content, idx) => (
                          <span key={idx} className="inline-block mr-2 mb-1">
                            {content.emoji} {content.item}
                            {idx < Math.min(2, (product.contents || []).length - 1) && " • "}
                          </span>
                        ))}
                        {(product.contents || []).length > 3 && (
                          <button
                            onClick={() => openProductDetails(product)}
                            className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-1 mt-1"
                          >
                            <Eye className="w-3 h-3" />
                            Voir tout le contenu
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{product.producer}</span>
                      <span className="text-xs text-green-600 font-medium">• {product.distance}</span>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{product.rating}</span>
                      </div>
                      <span className="text-xs text-gray-500">({product.reviews} avis)</span>
                      <div className="flex items-center gap-1 ml-auto">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-600">{product.stock} restants</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-green-600">
                          {Number(product.price || 0).toFixed(2)}€
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          {Number(product.originalPrice || 0).toFixed(2)}€
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button
                        onClick={() => addToCart(product)}
                        className="w-full green-gradient green-gradient-hover text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all duration-300"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Ajouter au panier
                      </Button>
                      
                      <Button
                        onClick={() => openProductDetails(product)}
                        variant="outline"
                        className="w-full border-green-200 text-green-600 hover:bg-green-50"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Voir le détail
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Aucun produit trouvé
                </h3>
                <p className="text-gray-600">
                  Essayez de modifier vos filtres ou votre recherche
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Product Details Modal */}
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeProductDetails}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-effect rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold gradient-text">{selectedProduct.name}</h2>
                  <button
                    onClick={closeProductDetails}
                    className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <img  alt={selectedProduct.name} className="w-full h-64 object-cover rounded-xl mb-4" src={resolveImageUrl(selectedProduct.imageUrl)} onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMG; }} />
                    
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-3xl font-bold text-green-600">
                          {Number(selectedProduct.price || 0).toFixed(2)}€
                        </span>
                        <span className="text-lg text-gray-500 line-through">
                          {Number(selectedProduct.originalPrice || 0).toFixed(2)}€
                        </span>
                      </div>
                      <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                        -{Math.round(((Number(selectedProduct.originalPrice || 0) - Number(selectedProduct.price || 0)) / Math.max(Number(selectedProduct.originalPrice || 0), 1)) * 100)}% de réduction
                      </div>
                    </div>

                    <Button
                      onClick={() => {
                        addToCart(selectedProduct);
                        closeProductDetails();
                      }}
                      className="w-full green-gradient text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all duration-300"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Ajouter au panier
                    </Button>
                  </div>

                  <div>
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                      <p className="text-gray-600">{selectedProduct.description}</p>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <h3 className="text-lg font-semibold text-gray-800">Contenu garanti</h3>
                      </div>
                      
                      {selectedProduct.isRestaurant && selectedProduct.expiryNote && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                          <p className="text-sm text-orange-700">{selectedProduct.expiryNote}</p>
                        </div>
                      )}

                      <div className="bg-green-50 rounded-lg p-4">
                        <p className="font-medium text-green-800 mb-3">Ce panier contient :</p>
                        <div className="space-y-2">
                          {(selectedProduct.contents || []).map((content, idx) => (
                            <div key={idx} className="flex items-center gap-3 text-gray-700">
                              <span className="text-xl">{content.emoji}</span>
                              <span>{content.item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedProduct.producer} • {selectedProduct.distance}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{selectedProduct.rating}/5 ({selectedProduct.reviews} avis)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{selectedProduct.stock} paniers restants</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Floating Cart */}
        {cart.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 glass-effect rounded-2xl p-4 shadow-2xl z-40"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-gray-800">
                  Panier ({getCartItemsCount()} articles)
                </span>
              </div>
              <span className="text-lg font-bold text-green-600">
                {getCartTotal().toFixed(2)}€
              </span>
            </div>
            
            <div className="space-y-2 mb-4 max-h-32 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm gap-2">
                  <span className="text-gray-700 truncate">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <button
                      className="px-2 py-1 rounded border hover:bg-gray-50"
                      onClick={async () => {
                        const newQty = Math.max(0, (item.quantity || 1) - 1);
                        if (newQty === 0) {
                          await apiService.removeFromCart(item.id);
                          const srvCart = await apiService.getCart().catch(() => null);
                          if (srvCart && Array.isArray(srvCart.items)) {
                            setCart(srvCart.items.map(it => ({ id: it.productId, name: it.product?.name, price: Number(it.product?.price || 0), quantity: it.quantity })));
                          } else {
                            setCart(prev => prev.filter(i => i.id !== item.id));
                          }
                        } else {
                          await apiService.updateCartItem(item.id, newQty);
                          const srvCart = await apiService.getCart().catch(() => null);
                          if (srvCart && Array.isArray(srvCart.items)) {
                            setCart(srvCart.items.map(it => ({ id: it.productId, name: it.product?.name, price: Number(it.product?.price || 0), quantity: it.quantity })));
                          } else {
                            setCart(prev => prev.map(i => i.id === item.id ? { ...i, quantity: newQty } : i));
                          }
                        }
                      }}
                    >
                      -
                    </button>
                    <span className="w-6 text-center">{item.quantity}</span>
                    <button
                      className="px-2 py-1 rounded border hover:bg-gray-50"
                      onClick={async () => {
                        const newQty = (item.quantity || 1) + 1;
                        await apiService.updateCartItem(item.id, newQty);
                        const srvCart = await apiService.getCart().catch(() => null);
                        if (srvCart && Array.isArray(srvCart.items)) {
                          setCart(srvCart.items.map(it => ({ id: it.productId, name: it.product?.name, price: Number(it.product?.price || 0), quantity: it.quantity })));
                        } else {
                          setCart(prev => prev.map(i => i.id === item.id ? { ...i, quantity: newQty } : i));
                        }
                      }}
                    >
                      +
                    </button>
                    <span className="font-medium w-16 text-right">{(item.price * item.quantity).toFixed(2)}€</span>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={async () => {
                        await apiService.removeFromCart(item.id);
                        const srvCart = await apiService.getCart().catch(() => null);
                        if (srvCart && Array.isArray(srvCart.items)) {
                          setCart(srvCart.items.map(it => ({ id: it.productId, name: it.product?.name, price: Number(it.product?.price || 0), quantity: it.quantity })));
                        } else {
                          setCart(prev => prev.filter(i => i.id !== item.id));
                        }
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <Button className="w-full green-gradient text-white font-semibold py-3 rounded-xl"
              onClick={async () => {
                try {
                  const res = await apiService.createOrder();
                  const low = (res && res.lowStockWarnings) || [];
                  if (low.length > 0) {
                    toast({ title: 'Stock faible', description: low.map(l => `${l.name}: ${l.stock} restants`).join(' | ') });
                  }
                  setCart([]);
                  toast({ title: 'Commande créée', description: 'Redirection vers vos commandes...' });
                  setTimeout(() => {
                    window.location.href = '/dashboard';
                  }, 600);
                } catch (error) {
                  toast({ title: 'Paiement/commande', description: error.message || 'Impossible de valider le panier', variant: 'destructive' });
                }
              }}
            >
              Valider le panier
            </Button>
          </motion.div>
        )}

        <Footer />
      </div>
    </>
  );
};

export default ShopPage;