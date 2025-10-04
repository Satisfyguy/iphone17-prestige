import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Package } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  price: string;
  launchPrice?: string;
  savings?: string;
  features: string[];
}

export const ProductCard = ({ id, name, image, price, launchPrice, savings, features }: ProductCardProps) => {
  const resolvedImage = image.startsWith('/') ? image : `/${image}`;
  return (
    <Card className="overflow-hidden gradient-card border-border shadow-apple-md hover:shadow-apple-lg transition-all duration-300 group hover:-translate-y-1 hover:scale-[1.02] backdrop-blur-sm flex flex-col h-full">
      <Link to={`/produit/${id}`}>
        <div className="aspect-[4/3] overflow-hidden bg-secondary relative">
          {/* Badge disponible discret en haut à droite */}
          <div className="absolute top-3 right-3 z-10">
            <Badge variant="secondary" className="text-xs font-semibold bg-green-500/80 text-white backdrop-blur-sm">
              ✓ DISPONIBLE
            </Badge>
          </div>
          
          <img 
            src={resolvedImage} 
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500 ease-out"
          />
        </div>
      </Link>
      
      <div className="p-6 space-y-4 flex flex-col h-full">
        <Link to={`/produit/${id}`}>
          <h3 className="text-2xl font-semibold group-hover:text-primary transition-smooth">
            {name}
          </h3>
        </Link>
        
        {/* Badges informatifs élégants */}
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="outline" className="text-xs font-medium bg-blue-50 text-blue-700 border-blue-200">
            📦 Neuf sous emballage
          </Badge>
          {launchPrice && (
            <Badge variant="destructive" className="text-xs font-medium">
              🎉 -20% Lancement
            </Badge>
          )}
        </div>
        
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="text-sm text-muted-foreground flex items-start">
              <span className="mr-2">•</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        
        <div className="pt-4 border-t border-border mt-auto">
          {/* Prix */}
          <div className="space-y-2 mb-4">
            {/* Microcopie d'urgence pour produits en offre */}
            {launchPrice && (
              <div className="flex items-center text-xs text-orange-500 font-medium mb-2">
                <Clock className="h-3 w-3 mr-1" />
                Achat immédiat - Stock limité
              </div>
            )}
            {launchPrice ? (
              <>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-green-600">{launchPrice}</span>
                  <span className="text-xl text-muted-foreground line-through">{price}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive" className="text-xs font-bold">
                    ÉCONOMISEZ {savings}
                  </Badge>
                </div>
                <p className="text-xs text-orange-600 font-medium">
                  ⏱️ Offre limitée - Prix normal après: {price}
                </p>
                {/* Espaceur invisible pour maintenir l'alignement */}
                <div className="h-4"></div>
              </>
            ) : (
              <>
                {/* Espaceur invisible pour aligner avec les produits en offre */}
                <div className="h-4"></div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold">{price}</span>
                </div>
                <p className="text-sm text-muted-foreground">Prix standard</p>
                {/* Espaceur invisible pour maintenir l'alignement */}
                <div className="h-4"></div>
              </>
            )}
          </div>
          
          <Link to={`/produit/${id}`}>
            <Button className="w-full" variant="hero">
              {launchPrice ? `Acheter maintenant • ${launchPrice}` : `Acheter • ${price}`}
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};
