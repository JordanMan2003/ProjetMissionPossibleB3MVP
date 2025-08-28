import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Menu, X, ShoppingCart, User, LogOut, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/UserContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  React.useEffect(() => {
    const load = async () => {
      if (!user) { setNotifications([]); return; }
      try {
        const data = await (await import('@/services/api')).default.getNotifications();
        setNotifications(data || []);
      } catch {}
    };
    load();
  }, [user]);

  const openNotifications = async () => {
    setIsNotifOpen(v => !v);
    try {
      // Marquer tous comme lus côté API
      const api = (await import('@/services/api')).default;
      const notRead = notifications.filter(n => !n.read);
      await Promise.all(notRead.map(n => api.markNotificationAsRead(n.id).catch(() => null)));
      // Mettre à jour localement
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch {}
  };
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img 
              src="https://storage.googleapis.com/hostinger-horizons-assets-prod/ec0ab4bd-14e9-481f-8956-c54da0a58c6c/d9d4a8ceeaa16401b82e359734e11920.png" 
              alt="Logo GreenCart" 
              className="w-10 h-10 group-hover:scale-110 transition-transform duration-300"
            />
            <span className="text-2xl font-bold gradient-text">GreenCart</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
              Accueil
            </Link>
            <Link to="/shop" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
              Boutique
            </Link>
            {user && (
              <Link to="/dashboard" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
                Tableau de bord
              </Link>
            )}
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4 relative">
                {/* Notifications */}
                <button
                  className="relative p-2 rounded-lg hover:bg-gray-100"
                  onClick={openNotifications}
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5 text-gray-700" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </button>
                {isNotifOpen && (
                  <div className="absolute right-24 top-12 w-80 bg-white border rounded-xl shadow-xl p-3 z-[60]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-800">Notifications</span>
                      <button className="text-sm text-gray-500" onClick={() => setIsNotifOpen(false)}>Fermer</button>
                    </div>
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {notifications.length === 0 && (
                        <div className="text-sm text-gray-500">Aucune notification</div>
                      )}
                      {notifications.map((n) => (
                        <div key={n.id} className={`p-2 rounded-lg ${n.read ? 'bg-gray-50' : 'bg-green-50'}`}>
                          <div className="text-xs text-gray-500">{new Date(n.createdAt).toLocaleString('fr-FR')}</div>
                          <div className="text-sm text-gray-800">{n.message}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg">
                  <User className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    {user.name}
                  </span>
                  <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
                    {user.loyaltyPoints || 0} pts
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="outline" size="sm" className="border-green-200 text-green-600 hover:bg-green-50">
                    Connexion
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="green-gradient text-white hover:opacity-90">
                    Inscription
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-green-600 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden py-4 border-t border-gray-200"
          >
            <nav className="flex flex-col gap-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-green-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link
                to="/shop"
                className="text-gray-700 hover:text-green-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Boutique
              </Link>
              {user && (
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-green-600 font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Tableau de bord
                </Link>
              )}
              
              <div className="pt-4 border-t border-gray-200">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg">
                      <User className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        {user.name}
                      </span>
                      <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
                        {user.loyaltyPoints || 0} pts
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLogout}
                      className="w-full border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Déconnexion
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full border-green-200 text-green-600 hover:bg-green-50">
                        Connexion
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                      <Button size="sm" className="w-full green-gradient text-white hover:opacity-90">
                        Inscription
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;