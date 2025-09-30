import { Link } from "react-router-dom";
import { ShoppingCart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold tracking-tight">TechLoop</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium transition-smooth hover:text-primary">
              Accueil
            </Link>
            <Link to="/comparateur" className="text-sm font-medium transition-smooth hover:text-primary">
              Comparateur
            </Link>
            <Link to="/accessoires" className="text-sm font-medium transition-smooth hover:text-primary">
              Accessoires
            </Link>
            <Link to="/support" className="text-sm font-medium transition-smooth hover:text-primary">
              Support
            </Link>
          </nav>

          <div className="flex items-center space-x-4 relative">
            <Link to="/panier" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
              {count > 0 && (
                <span className="absolute -top-1 -right-1 text-[10px] leading-none px-1.5 py-1 rounded-full bg-primary text-primary-foreground">
                  {count}
                </span>
              )}
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden py-4 space-y-4 animate-fade-in">
            <Link 
              to="/" 
              className="block text-sm font-medium transition-smooth hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link 
              to="/comparateur" 
              className="block text-sm font-medium transition-smooth hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Comparateur
            </Link>
            <Link 
              to="/accessoires" 
              className="block text-sm font-medium transition-smooth hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Accessoires
            </Link>
            <Link 
              to="/support" 
              className="block text-sm font-medium transition-smooth hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Support
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};
