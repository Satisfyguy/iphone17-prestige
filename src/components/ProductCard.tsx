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
    <Card className="overflow-hidden gradient-card border-border shadow-apple-md hover:shadow-apple-lg transition-smooth group">
      <Link to={`/produit/${id}`}>
        <div className="aspect-[4/3] overflow-hidden bg-secondary relative">
          {/* Badges de lancement */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
            <Badge variant="destructive" className="text-xs font-semibold">
              Série limitée • 10 ex.
            </Badge>
            <Badge variant="secondary" className="text-xs font-semibold bg-green-500/90 text-white">
              –20% lancement
            </Badge>
          </div>
          
          <img 
            src={resolvedImage} 
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
          />
        </div>
      </Link>
      
      <div className="p-6 space-y-4">
        <Link to={`/produit/${id}`}>
          <h3 className="text-2xl font-semibold group-hover:text-primary transition-smooth">
            {name}
          </h3>
        </Link>
        
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="text-sm text-muted-foreground flex items-start">
              <span className="mr-2">•</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        
        <div className="pt-4 border-t border-border">
          {/* Microcopie d'urgence */}
          <div className="flex items-center text-xs text-orange-500 font-medium mb-2">
            <Clock className="h-3 w-3 mr-1" />
            Premiers arrivés, premiers servis
          </div>
          
          {/* Prix */}
          <div className="space-y-1 mb-4">
            {launchPrice ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-green-600">{launchPrice}</span>
                  <span className="text-lg text-muted-foreground line-through">{price}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Prix après lancement: {price}
                </p>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-1">À partir de</p>
                <p className="text-3xl font-bold">{price}</p>
              </>
            )}
          </div>
          
          <Link to={`/produit/${id}`}>
            <Button className="w-full" variant="hero">
              Découvrir
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};
