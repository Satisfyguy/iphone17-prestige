import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/products";
import { Check, Truck, Shield, RefreshCw, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import iphone17Blue from "@/assets/iphone-17-blue.jpg";
import iphone17Colors from "@/assets/iphone-17-colors copy.webp"; // Updated to use the new colors image

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="gradient-hero py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in-up">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                Découvrez la nouvelle génération
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground">
                iPhone 17. Plus puissant. Plus intelligent. Plus beau.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link to="/comparateur">
                  <Button variant="hero" size="lg">
                    Explorer la gamme
                  </Button>
                </Link>
                <Link to="/comparateur">
                  <Button variant="outline" size="lg">
                    Comparer les modèles
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="mt-16 animate-fade-in">
              <img 
                src={iphone17Colors} 
                alt="iPhone 17" 
                className="w-full max-w-4xl mx-auto rounded-2xl shadow-apple-lg"
              />
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-20 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="mb-4">Choisissez votre iPhone 17</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Quatre modèles exceptionnels conçus pour répondre à tous vos besoins
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <div key={product.id} className="animate-fade-in-up">
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    image={product.image}
                    price={`${product.price}€`}
                    features={product.features}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Preview */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="mb-4">Comparaison rapide</h2>
              <p className="text-lg text-muted-foreground">
                Trouvez le modèle qui vous correspond
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                <div className="grid grid-cols-5 gap-4 bg-card rounded-xl p-6 shadow-apple-md">
                  <div className="font-semibold">
                    <div className="h-12 flex items-center">Caractéristiques</div>
                  </div>
                  {products.map((product) => (
                    <div key={product.id} className="text-center">
                      <div className="h-12 flex items-center justify-center font-semibold text-sm">
                        {product.name}
                      </div>
                    </div>
                  ))}
                  
                  <div className="col-span-5 border-t border-border my-4"></div>
                  
                  <div className="text-muted-foreground">Écran</div>
                  {products.map((product) => (
                    <div key={product.id} className="text-center text-sm">
                      {product.specs.screen}
                    </div>
                  ))}
                  
                  <div className="text-muted-foreground">Puce</div>
                  {products.map((product) => (
                    <div key={product.id} className="text-center text-sm">
                      {product.specs.chip}
                    </div>
                  ))}
                  
                  <div className="text-muted-foreground">Appareil photo</div>
                  {products.map((product) => (
                    <div key={product.id} className="text-center text-sm">
                      {product.specs.camera}
                    </div>
                  ))}
                  
                  <div className="text-muted-foreground">Prix</div>
                  {products.map((product) => (
                    <div key={product.id} className="text-center font-semibold">
                      À partir de {product.price}€
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <Link to="/comparateur">
                <Button variant="outline" size="lg">
                  Voir la comparaison complète
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="mb-4">Pourquoi nous choisir</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="p-6 text-center gradient-card shadow-apple-md">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Livraison gratuite</h3>
                <p className="text-sm text-muted-foreground">
                  Dès 50€ d'achat partout en France
                </p>
              </Card>
              
              <Card className="p-6 text-center gradient-card shadow-apple-md">
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-success" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Garantie Apple</h3>
                <p className="text-sm text-muted-foreground">
                  Produits 100% authentiques garantis
                </p>
              </Card>
              
              <Card className="p-6 text-center gradient-card shadow-apple-md">
                <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RefreshCw className="h-6 w-6 text-warning" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Retours 30 jours</h3>
                <p className="text-sm text-muted-foreground">
                  Changez d'avis sans frais
                </p>
              </Card>
              
              <Card className="p-6 text-center gradient-card shadow-apple-md">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Support expert</h3>
                <p className="text-sm text-muted-foreground">
                  Assistance 7j/7 par des experts
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="mb-4">Ce que disent nos clients</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Card className="p-6 gradient-card shadow-apple-md">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-sm mb-4">
                  "L'iPhone 17 Pro Max est incroyable ! La qualité photo est exceptionnelle et la batterie tient toute la journée."
                </p>
                <p className="text-sm font-semibold">Sophie M.</p>
                <p className="text-xs text-muted-foreground">Cliente vérifiée</p>
              </Card>
              
              <Card className="p-6 gradient-card shadow-apple-md">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-sm mb-4">
                  "Livraison rapide et produit impeccable. Le service client est très réactif. Je recommande !"
                </p>
                <p className="text-sm font-semibold">Thomas L.</p>
                <p className="text-xs text-muted-foreground">Client vérifié</p>
              </Card>
              
              <Card className="p-6 gradient-card shadow-apple-md">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-sm mb-4">
                  "L'iPhone 17 Air est parfait pour moi. Ultra léger et suffisamment puissant pour tous mes besoins."
                </p>
                <p className="text-sm font-semibold">Marie D.</p>
                <p className="text-xs text-muted-foreground">Cliente vérifiée</p>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
