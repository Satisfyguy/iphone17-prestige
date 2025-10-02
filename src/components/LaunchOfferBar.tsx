import { useState, useEffect } from 'react';
import { X, Clock, Package, Truck } from 'lucide-react';
import { LaunchOfferUtils } from '@/lib/launch-offer';

export const LaunchOfferBar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [isOfferActive, setIsOfferActive] = useState(true);

  useEffect(() => {
    const updateTimer = () => {
      const active = LaunchOfferUtils.isOfferActive();
      setIsOfferActive(active);
      
      if (active) {
        setTimeRemaining(LaunchOfferUtils.formatTimeRemaining());
      }
    };

    // Mise à jour initiale
    updateTimer();

    // Mise à jour toutes les secondes
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible || !isOfferActive) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white py-3 px-4 relative z-50 shadow-lg">
      <div className="container mx-auto flex items-center justify-between text-sm font-medium">
        <div className="flex items-center space-x-6 flex-1">
          {/* Message principal */}
          <div className="flex items-center space-x-2">
            <Package className="h-4 w-4 flex-shrink-0" />
            <span className="font-semibold">–20% LANCEMENT</span>
          </div>
          
          {/* Stock limité */}
          <div className="hidden sm:flex items-center space-x-1">
            <span>•</span>
            <span>10 pièces par modèle</span>
          </div>
          
          {/* Timer */}
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 flex-shrink-0" />
            <span className="font-mono font-bold">{timeRemaining}</span>
          </div>
          
          {/* Livraison */}
          <div className="hidden md:flex items-center space-x-2">
            <Truck className="h-4 w-4 flex-shrink-0" />
            <span>Livraison 48h offerte</span>
          </div>
        </div>
        
        {/* Bouton fermer */}
        <button
          onClick={() => setIsVisible(false)}
          className="ml-4 p-1 hover:bg-white/20 rounded-full transition-colors flex-shrink-0"
          aria-label="Fermer l'annonce"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      {/* Version mobile compacte */}
      <div className="sm:hidden mt-2 text-center text-xs opacity-90">
        10 pièces/modèle • Livraison 48h offerte
      </div>
    </div>
  );
};
