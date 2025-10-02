import { Link } from "react-router-dom";
import { ShoppingCart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { count } = useCart();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 border-b border-border/50 shadow-apple-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-32 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <img 
              src="/tekloop-logo.svg" 
              alt="TekL∞p" 
              className="h-28 w-auto transition-all duration-300 group-hover:scale-105 group-hover:opacity-90"
            />
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium transition-all duration-300 hover:text-primary hover:scale-105 relative group">
              Accueil
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/comparateur" className="text-sm font-medium transition-all duration-300 hover:text-primary hover:scale-105 relative group">
              Comparateur
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/accessoires" className="text-sm font-medium transition-all duration-300 hover:text-primary hover:scale-105 relative group">
              Accessoires
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/support" className="text-sm font-medium transition-all duration-300 hover:text-primary hover:scale-105 relative group">
              Support
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>

          <div className="flex items-center space-x-4 relative">
            {user ? (
              <>
                <Link to="/checkout" className="text-sm font-medium transition-smooth hover:text-primary">Payer</Link>
                <button className="text-sm text-muted-foreground hover:text-destructive" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium transition-smooth hover:text-primary">Login</Link>
                <Link to="/register" className="text-sm font-medium transition-smooth hover:text-primary">Register</Link>
              </>
            )}
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
