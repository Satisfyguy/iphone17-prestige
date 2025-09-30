import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  price: string;
  features: string[];
}

export const ProductCard = ({ id, name, image, price, features }: ProductCardProps) => {
  return (
    <Card className="overflow-hidden gradient-card border-border shadow-apple-md hover:shadow-apple-lg transition-smooth group">
      <Link to={`/produit/${id}`}>
        <div className="aspect-[4/3] overflow-hidden bg-secondary">
          <img 
            src={image} 
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
          <p className="text-sm text-muted-foreground mb-1">À partir de</p>
          <p className="text-3xl font-bold mb-4">{price}</p>
          
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
