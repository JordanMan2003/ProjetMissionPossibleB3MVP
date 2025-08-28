import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, MapPin, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/UserContext';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import apiService from '@/services/api';

const CartPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setIsLoading(true);
      const cart = await apiService.getCart();
      setCartItems(cart.items || []);
    } catch (error) {
      console.error('Failed to load cart:', error);
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger votre panier",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      setIsUpdating(true);
      await apiService.updateCartItem(productId, newQuantity);
      setCartItems(prev => 
        prev.map(item => 
          item.productId === productId 
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
      toast({
        title: "Quantité mise à jour",
        description: "La quantité a été modifiée avec succès",
      });
    } catch (error) {
      console.error('Failed to update quantity:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la quantité",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const removeItem = async (productId) => {
    try {
      await apiService.removeFromCart(productId);
      setCartItems(prev => prev.filter(item => item.productId !== productId));
      toast({
        title: "Produit retiré",
        description: "Le produit a été retiré de votre panier",
      });
    } catch (error) {
      console.error('Failed to remove item:', error);
      toast({
        title: "Erreur",
        description: "Impossible de retirer le produit",
        variant: "destructive"
      });
    }
  };

  const clearCart = async () => {
    try {
      await apiService.clearCart();
      setCartItems([]);
      toast({
        title: "Panier vidé",
        description: "Votre panier a été vidé avec succès",
      });
    } catch (error) {
      console.error('Failed to clear cart:', error);
      toast({
        title: "Erreur",
        description: "Impossible de vider le panier",
        variant: "destructive"
      });
    }
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (Number(item.product?.price || 0) * item.quantity);
    }, 0);
  };

  const getTotal = () => {
    return getSubtotal(); // Pas de frais de livraison pour l'instant
  };

  const proceedToCheckout = () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour continuer",
        variant: "destructive"
      });
      return;
    }
    
    // Rediriger vers la page de paiement
    // window.location.href = '/checkout';
    toast({
      title: "Fonctionnalité en développement",
      description: "La page de paiement sera bientôt disponible",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50">
        <Header />
        <div className="pt-20 pb-12">
          <div className="container mx-auto px-4 text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement de votre panier...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50">
        <Header />
        <div className="pt-20 pb-12">
          <div className="container mx-auto px-4 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Votre panier est vide</h1>
            <p className="text-gray-600 mb-6">Ajoutez des produits pour commencer vos achats</p>
            <Button 
              onClick={() => window.location.href = '/shop'}
              className="green-gradient text-white px-6 py-3 rounded-xl"
            >
              Découvrir nos produits
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Mon Panier - GreenCart</title>
        <meta name="description" content="Gérez votre panier et préparez vos achats sur GreenCart." />
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
              <h1 className="text-4xl font-bold gradient-text mb-4">
                Mon Panier
              </h1>
              <p className="text-xl text-gray-600">
                Révisez vos produits et préparez votre commande
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="lg:col-span-2"
              >
                <div className="glass-effect rounded-2xl p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800">
                      Produits ({cartItems.length})
                    </h2>
                    <Button
                      onClick={clearCart}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Vider le panier
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 bg-white rounded-xl border">
                        <img
                          src={item.product?.imageUrl || "https://images.unsplash.com/photo-1635865165118-917ed9e20936"}
                          alt={item.product?.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 mb-1">
                            {item.product?.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {item.product?.description}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <MapPin className="w-4 h-4" />
                            <span>{item.product?.producer}</span>
                            <span>•</span>
                            <span>{item.product?.distance}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            variant="outline"
                            size="sm"
                            disabled={isUpdating || item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-12 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            variant="outline"
                            size="sm"
                            disabled={isUpdating}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <p className="font-semibold text-gray-800">
                            {(Number(item.product?.price || 0) * item.quantity).toFixed(2)}€
                          </p>
                          <p className="text-sm text-gray-500">
                            {Number(item.product?.price || 0).toFixed(2)}€ l'unité
                          </p>
                        </div>

                        <Button
                          onClick={() => removeItem(item.productId)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="lg:col-span-1"
              >
                <div className="glass-effect rounded-2xl p-6 sticky top-24">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Résumé de la commande
                  </h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Sous-total</span>
                      <span>{getSubtotal().toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Frais de livraison</span>
                      <span>Gratuit</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-lg font-bold text-gray-800">
                        <span>Total</span>
                        <span>{getTotal().toFixed(2)}€</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={proceedToCheckout}
                    className="w-full green-gradient text-white font-semibold py-3 rounded-xl mb-4"
                    size="lg"
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Procéder au paiement
                  </Button>

                  <div className="text-center text-sm text-gray-600">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Paiement sécurisé</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span>Livraison rapide</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default CartPage;
