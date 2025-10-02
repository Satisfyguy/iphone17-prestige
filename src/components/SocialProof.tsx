import { useState, useEffect } from "react";
import { Users, ShoppingBag, CheckCircle, Star } from "lucide-react";

interface PurchaseNotification {
  id: string;
  name: string;
  city: string;
  product: string;
  timeAgo: string;
}

export const SocialProofNotifications = () => {
  const [currentNotification, setCurrentNotification] = useState<PurchaseNotification | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const notifications: PurchaseNotification[] = [
    { id: "1", name: "Sophie M.", city: "Paris", product: "iPhone 17 Pro", timeAgo: "à l'instant" },
    { id: "2", name: "Thomas L.", city: "Lyon", product: "iPhone 17 Pro Max", timeAgo: "il y a 2 min" },
    { id: "3", name: "Marie D.", city: "Marseille", product: "iPhone Air", timeAgo: "il y a 5 min" },
    { id: "4", name: "Alex B.", city: "Toulouse", product: "iPhone 17", timeAgo: "il y a 8 min" },
    { id: "5", name: "Claire R.", city: "Nice", product: "iPhone 17 Pro", timeAgo: "il y a 12 min" },
    { id: "6", name: "Lucas M.", city: "Nantes", product: "iPhone 17 Pro Max", timeAgo: "il y a 15 min" },
  ];

  useEffect(() => {
    const showNotification = () => {
      const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
      setCurrentNotification(randomNotification);
      setIsVisible(true);

      // Cacher après 4 secondes
      setTimeout(() => {
        setIsVisible(false);
      }, 4000);
    };

    // Première notification après 3 secondes
    const initialTimer = setTimeout(showNotification, 3000);

    // Ensuite toutes les 15-25 secondes
    const interval = setInterval(() => {
      const randomDelay = Math.random() * 10000 + 15000; // 15-25 secondes
      setTimeout(showNotification, randomDelay);
    }, 20000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  if (!currentNotification || !isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-slide-up">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm">
        <div className="flex items-start space-x-3">
          <div className="bg-green-100 rounded-full p-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-900">{currentNotification.name}</span>
              <span className="text-sm text-gray-500">de {currentNotification.city}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              vient d'acheter un <span className="font-medium">{currentNotification.product}</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">{currentNotification.timeAgo}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const VisitorCounter = ({ productName }: { productName?: string }) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
      <div className="flex items-center space-x-2 text-blue-700">
        <Users className="h-4 w-4" />
        <span className="text-sm font-medium">
          {productName === "iPhone Air" ? "iPhone Air disponible" : "iPhone 17 disponible"} - Stock limité Apple neuf
        </span>
      </div>
      
      <div className="flex items-center space-x-2 text-green-700">
        <ShoppingBag className="h-4 w-4" />
        <span className="text-sm font-medium">
          {productName === "iPhone Air" ? "iPhone Air disponible" : "iPhone 17 disponible"} - Stock limité 10 unités par modèle
        </span>
      </div>

      <div className="flex items-center space-x-2 text-yellow-700">
        <Star className="h-4 w-4 fill-current" />
        <span className="text-sm font-medium">
          Garantie Apple officielle incluse
        </span>
      </div>
    </div>
  );
};

// Composant principal qui combine les deux
export const SocialProof = ({ productName }: { productName?: string }) => {
  return (
    <>
      <SocialProofNotifications />
      <VisitorCounter productName={productName} />
    </>
  );
};
