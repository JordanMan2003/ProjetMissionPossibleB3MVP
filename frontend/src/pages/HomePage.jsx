import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Leaf, ShoppingCart, Users, Heart, Star, Truck, Shield, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>GreenCart - Circuit Court & Anti-Gaspillage</title>
        <meta name="description" content="Favoriser le circuit court et lutter contre le gaspillage alimentaire. Découvrez nos paniers locaux et solidaires." />
      </Helmet>

      <div className="min-h-screen">
        <Header />
        
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 pt-20">
          <div className={`absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%2322c55e" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30`}></div>
          
          <div className="container mx-auto px-4 py-20 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium"
                  >
                    <Leaf className="w-4 h-4" />
                    Circuit Court & Solidaire
                  </motion.div>
                  
                  <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                    <span className="gradient-text">Favoriser le circuit court</span>
                    <br />
                    <span className="text-gray-800">et lutter contre le</span>
                    <br />
                    <span className="gradient-text">gaspillage alimentaire</span>
                  </h1>
                  
                  <p className="text-xl text-gray-600 leading-relaxed">
                    Découvrez des produits frais locaux et des invendus à prix réduits. 
                    Ensemble, construisons un avenir plus durable et solidaire.
                  </p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <Link to="/shop">
                    <Button size="lg" className="green-gradient green-gradient-hover text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Découvrir les paniers
                    </Button>
                  </Link>
                  
                  <Link to="/register">
                    <Button variant="outline" size="lg" className="border-2 border-green-500 text-green-600 hover:bg-green-50 px-8 py-4 text-lg font-semibold rounded-xl">
                      Rejoindre la communauté
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="floating-animation">
                  <img  alt="Panier de légumes frais locaux" className="w-full h-auto rounded-2xl shadow-2xl" src="https://images.unsplash.com/photo-1418669112725-fb499fb61127" />
                </div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="absolute -bottom-6 -left-6 glass-effect rounded-2xl p-6 max-w-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 green-gradient rounded-full flex items-center justify-center">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">+1,250 paniers</p>
                      <p className="text-sm text-gray-600">sauvés du gaspillage</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Registration Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold gradient-text mb-4">
                Rejoignez notre communauté
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Que vous soyez producteur, restaurateur ou consommateur, 
                ensemble nous pouvons faire la différence
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Je suis un producteur local",
                  description: "Vendez vos produits frais directement aux consommateurs",
                  icon: Leaf,
                  color: "from-green-500 to-emerald-500",
                  userType: "producer"
                },
                {
                  title: "Je suis un restaurant",
                  description: "Valorisez vos invendus et participez au programme solidaire",
                  icon: Users,
                  color: "from-blue-500 to-cyan-500",
                  userType: "restaurant"
                },
                {
                  title: "Je suis un consommateur",
                  description: "Achetez local et participez à la lutte contre le gaspillage",
                  icon: ShoppingCart,
                  color: "from-purple-500 to-pink-500",
                  userType: "consumer"
                }
              ].map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-effect rounded-2xl p-8 text-center hover:shadow-2xl transition-all duration-300 group"
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${card.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <card.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {card.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6">
                    {card.description}
                  </p>
                  
                  <Link to={`/register?type=${card.userType}`}>
                    <Button className={`bg-gradient-to-r ${card.color} hover:opacity-90 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300`}>
                      S'inscrire
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Local Section */}
        <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold gradient-text mb-4">
                Pourquoi consommer local ?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Découvrez tous les avantages du circuit court pour vous, 
                votre santé et notre planète
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Leaf,
                  title: "Écologique",
                  description: "Réduction de l'empreinte carbone et préservation de l'environnement"
                },
                {
                  icon: Truck,
                  title: "Fraîcheur",
                  description: "Produits récoltés à maturité et livrés rapidement"
                },
                {
                  icon: Shield,
                  title: "Qualité",
                  description: "Traçabilité complète et respect des saisons"
                },
                {
                  icon: Heart,
                  title: "Solidaire",
                  description: "Soutien aux producteurs locaux et économie de proximité"
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center group"
                >
                  <div className="w-16 h-16 green-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {benefit.title}
                  </h3>
                  
                  <p className="text-gray-600">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Loyalty Program Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <img  alt="Programme de fidélité GreenCart" className="w-full h-auto rounded-2xl shadow-xl" src="https://images.unsplash.com/photo-1693971810143-3834c76d702f" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium">
                  <Award className="w-4 h-4" />
                  Programme de fidélité
                </div>

                <h2 className="text-4xl font-bold gradient-text">
                  Gagnez des points à chaque achat
                </h2>

                <p className="text-xl text-gray-600">
                  1€ dépensé = 1 point gagné. Échangez vos points contre des paniers gratuits 
                  et des réductions exclusives.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">70 points</p>
                      <p className="text-sm text-gray-600">= 1 panier gratuit</p>
                    </div>
                  </div>

                  <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "60%" }}
                      transition={{ duration: 1, delay: 0.5 }}
                      viewport={{ once: true }}
                      className="h-full green-gradient"
                    />
                  </div>
                  
                  <p className="text-sm text-gray-600">
                    42/70 points - Plus que 28 points pour votre prochain panier gratuit !
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default HomePage;