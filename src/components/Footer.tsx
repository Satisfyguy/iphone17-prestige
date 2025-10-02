import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { LaunchOfferUtils } from "@/lib/launch-offer";

export const Footer = () => {
  return (
    <footer className="bg-secondary border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">Produits</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/produit/iphone-17" className="text-sm text-muted-foreground hover:text-foreground transition-smooth">
                  iPhone 17
                </Link>
              </li>
              <li>
                <Link to="/produit/iphone-17-air" className="text-sm text-muted-foreground hover:text-foreground transition-smooth">
                  iPhone 17 Air
                </Link>
              </li>
              <li>
                <Link to="/produit/iphone-17-pro" className="text-sm text-muted-foreground hover:text-foreground transition-smooth">
                  iPhone 17 Pro
                </Link>
              </li>
              <li>
                <Link to="/produit/iphone-17-pro-max" className="text-sm text-muted-foreground hover:text-foreground transition-smooth">
                  iPhone 17 Pro Max
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Assistance</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/support" className="text-sm text-muted-foreground hover:text-foreground transition-smooth">
                  Support
                </Link>
              </li>
              <li>
                <Link to="/support#garantie" className="text-sm text-muted-foreground hover:text-foreground transition-smooth">
                  Garantie
                </Link>
              </li>
              <li>
                <Link to="/support#retours" className="text-sm text-muted-foreground hover:text-foreground transition-smooth">
                  Retours
                </Link>
              </li>
              <li>
                <Link to="/support#livraison" className="text-sm text-muted-foreground hover:text-foreground transition-smooth">
                  Livraison
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">À propos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/a-propos" className="text-sm text-muted-foreground hover:text-foreground transition-smooth">
                  Notre histoire
                </Link>
              </li>
              <li>
                <Link to="/a-propos#equipe" className="text-sm text-muted-foreground hover:text-foreground transition-smooth">
                  Notre équipe
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-smooth">
                  Mentions légales
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-smooth">
                  CGV
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Suivez-nous</h3>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-smooth">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-smooth">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-smooth">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-smooth">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              Restez informé des dernières nouveautés
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border space-y-4">
          {/* Disclaimer de l'offre de lancement */}
          <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
            <p className="text-xs text-orange-800 dark:text-orange-200 text-center leading-relaxed">
              {LaunchOfferUtils.getLegalDisclaimer()}
            </p>
          </div>
          
          <p className="text-center text-sm text-muted-foreground">
            © 2025 iPhone 17 Store. Tous droits réservés. Revendeur indépendant non affilié à Apple Inc.
          </p>
        </div>
      </div>
    </footer>
  );
};
