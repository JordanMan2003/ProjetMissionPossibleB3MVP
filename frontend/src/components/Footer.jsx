import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img 
                src="https://storage.googleapis.com/hostinger-horizons-assets-prod/ec0ab4bd-14e9-481f-8956-c54da0a58c6c/d9d4a8ceeaa16401b82e359734e11920.png" 
                alt="Logo GreenCart" 
                className="w-10 h-10"
              />
              <span className="text-2xl font-bold text-white">GreenCart</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Favoriser le circuit court et lutter contre le gaspillage alimentaire 
              pour un avenir plus durable et solidaire.
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer">
                <Facebook className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer">
                <Twitter className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer">
                <Instagram className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <span className="text-lg font-semibold text-white">Navigation</span>
            <div className="space-y-2">
              <Link to="/" className="block text-gray-400 hover:text-green-400 transition-colors">
                Accueil
              </Link>
              <Link to="/shop" className="block text-gray-400 hover:text-green-400 transition-colors">
                Boutique
              </Link>
              <Link to="/register" className="block text-gray-400 hover:text-green-400 transition-colors">
                Inscription
              </Link>
              <Link to="/login" className="block text-gray-400 hover:text-green-400 transition-colors">
                Connexion
              </Link>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <span className="text-lg font-semibold text-white">Services</span>
            <div className="space-y-2">
              <p className="text-gray-400">Producteurs locaux</p>
              <p className="text-gray-400">Paniers solidaires</p>
              <p className="text-gray-400">Programme fidélité</p>
              <p className="text-gray-400">Anti-gaspillage</p>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <span className="text-lg font-semibold text-white">Contact</span>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400">
                <Mail className="w-5 h-5 text-green-400" />
                <span>contact@greencart.fr</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Phone className="w-5 h-5 text-green-400" />
                <span>01 23 45 67 89</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin className="w-5 h-5 text-green-400" />
                <span>Paris, France</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 GreenCart. Tous droits réservés. Fait avec ❤️ pour la planète.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;