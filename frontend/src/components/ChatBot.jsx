import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, HelpCircle, ShoppingCart, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Bonjour ! Je suis votre assistant GreenCart. Comment puis-je vous aider aujourd'hui ?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const { toast } = useToast();

  const quickReplies = [
    {
      icon: HelpCircle,
      text: "FAQ",
      response: "Voici les questions fréquentes :\n\n• Comment fonctionne le programme de fidélité ?\n• Comment faire un don solidaire ?\n• Quels sont les frais de livraison ?\n• Comment devenir producteur partenaire ?\n\nPour plus d'informations détaillées, contactez notre équipe !"
    },
    {
      icon: ShoppingCart,
      text: "Commande",
      response: "Pour passer une commande :\n\n1. Parcourez notre boutique\n2. Ajoutez des paniers à votre panier\n3. Choisissez d'ajouter un don solidaire (+3€)\n4. Utilisez vos points fidélité si vous le souhaitez\n5. Procédez au paiement\n\nBesoin d'aide pour une commande spécifique ?"
    },
    {
      icon: Phone,
      text: "Contact",
      response: "Vous pouvez nous contacter :\n\n📧 Email : contact@greencart.fr\n📞 Téléphone : 01 23 45 67 89\n📍 Adresse : Paris, France\n\nNotre équipe vous répondra dans les plus brefs délais !"
    }
  ];

  const handleQuickReply = (reply) => {
    const userMessage = {
      id: Date.now(),
      text: reply.text,
      isBot: false,
      timestamp: new Date()
    };

    const botResponse = {
      id: Date.now() + 1,
      text: reply.response,
      isBot: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, botResponse]);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    const botResponse = {
      id: Date.now() + 1,
      text: "🚧 Cette fonctionnalité n'est pas encore implémentée—mais ne vous inquiétez pas ! Vous pouvez la demander dans votre prochaine requête ! 🚀",
      isBot: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, botResponse]);
    setInputMessage('');

    toast({
      title: "Message envoyé",
      description: "Notre assistant vous a répondu !",
    });
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 green-gradient rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 z-50 pulse-green ${isOpen ? 'hidden' : 'block'}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="green-gradient p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold">Assistant GreenCart</p>
                    <p className="text-sm opacity-90">En ligne</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.isBot
                        ? 'bg-gray-100 text-gray-800'
                        : 'green-gradient text-white'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                    <p className={`text-xs mt-1 ${message.isBot ? 'text-gray-500' : 'text-white/70'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Replies */}
            <div className="p-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3">Réponses rapides :</p>
              <div className="flex gap-2 mb-4">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickReply(reply)}
                    className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg text-sm hover:bg-green-100 transition-colors"
                  >
                    <reply.icon className="w-4 h-4" />
                    {reply.text}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Tapez votre message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  className="green-gradient text-white px-3"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;