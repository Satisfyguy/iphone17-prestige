import { useState, useEffect } from "react";
import { AlertTriangle, Clock, Package } from "lucide-react";
import { LaunchOfferUtils } from "@/lib/launch-offer";

export const UrgencyBanner = () => {
  const [timeRemaining, setTimeRemaining] = useState("");
  const [isOfferActive, setIsOfferActive] = useState(true);
  const [stockAlert, setStockAlert] = useState<string | null>(null);

  // Timer pour l'offre de lancement
  useEffect(() => {
    const updateTimer = () => {
      const active = LaunchOfferUtils.isOfferActive();
      setIsOfferActive(active);
      
      if (active) {
        setTimeRemaining(LaunchOfferUtils.formatTimeRemaining());
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simuler des alertes de stock dynamiques
  useEffect(() => {
    const stockMessages = [
      "Plus que 2 iPhone 17 Pro disponibles !",
      "Stock critique : 1 iPhone 17 Pro Max restant",
      "Attention : Plus que 3 iPhone Air en stock",
      "Rupture imminente : 2 iPhone 17 disponibles"
    ];

    const updateStock = () => {
      const randomMessage = stockMessages[Math.floor(Math.random() * stockMessages.length)];
      setStockAlert(randomMessage);
    };

    updateStock();
    const interval = setInterval(updateStock, 15000); // Change toutes les 15 secondes
    return () => clearInterval(interval);
  }, []);

  if (!isOfferActive) return null;

  return (
    <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center py-3 text-sm font-medium">
          <div className="flex items-center space-x-2 animate-pulse">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">🔥 DERNIÈRES HEURES</span>
            <span className="sm:hidden">🔥 URGENT</span>
          </div>
          
          <div className="mx-4 h-4 w-px bg-white/30"></div>
          
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span className="font-bold">Fin dans {timeRemaining}</span>
          </div>
          
          {stockAlert && (
            <>
              <div className="mx-4 h-4 w-px bg-white/30"></div>
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4" />
                <span className="hidden md:inline">{stockAlert}</span>
                <span className="md:hidden">Stock critique !</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
