import { Shield, Truck, RefreshCw, Headphones, Award, CreditCard } from "lucide-react";
import { Card } from "@/components/ui/card";

export const TrustBadges = () => {
  const guarantees = [
    {
      icon: Shield,
      title: "Garantie Apple officielle",
      description: "Produits 100% authentiques avec garantie constructeur"
    },
    {
      icon: Truck,
      title: "Livraison 48h garantie",
      description: "Ou livraison gratuite + 20€ de dédommagement"
    },
    {
      icon: RefreshCw,
      title: "30 jours satisfait ou remboursé",
      description: "Changez d'avis sans frais, retour gratuit"
    },
    {
      icon: Headphones,
      title: "Support technique à vie",
      description: "Assistance 7j/7 par des experts Apple certifiés"
    },
    {
      icon: Award,
      title: "Assurance casse incluse",
      description: "1ère année gratuite contre la casse accidentelle"
    },
    {
      icon: CreditCard,
      title: "Paiement 100% sécurisé",
      description: "Crypté SSL + protection acheteur garantie"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {guarantees.map((guarantee, index) => {
        const IconComponent = guarantee.icon;
        return (
          <Card key={index} className="p-4 gradient-card border-green-200 bg-green-50/50 hover:shadow-md transition-smooth">
            <div className="flex items-start space-x-3">
              <div className="bg-green-100 rounded-full p-2 flex-shrink-0">
                <IconComponent className="h-5 w-5 text-green-600" />
              </div>
              <div className="min-w-0">
                <h4 className="font-semibold text-green-800 text-sm">
                  {guarantee.title}
                </h4>
                <p className="text-xs text-green-700 mt-1">
                  {guarantee.description}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export const SecurityBadges = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-4 px-6 bg-gray-50 rounded-lg border">
      <div className="flex items-center space-x-2">
        <Shield className="h-5 w-5 text-green-600" />
        <span className="text-sm font-medium text-gray-700">SSL Sécurisé</span>
      </div>
      <div className="h-4 w-px bg-gray-300"></div>
      <div className="flex items-center space-x-2">
        <Award className="h-5 w-5 text-blue-600" />
        <span className="text-sm font-medium text-gray-700">Vendeur Certifié</span>
      </div>
      <div className="h-4 w-px bg-gray-300"></div>
      <div className="flex items-center space-x-2">
        <CreditCard className="h-5 w-5 text-purple-600" />
        <span className="text-sm font-medium text-gray-700">Paiement Protégé</span>
      </div>
    </div>
  );
};
