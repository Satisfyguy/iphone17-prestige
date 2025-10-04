import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/products";
import { Truck, Shield, RefreshCw, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SEO } from "@/components/SEO";
import { OrganizationSchema } from "@/components/OrganizationSchema";
import { SecurityBadges } from "@/components/TrustBadges";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="iPhone 17 disponible - Pro, Pro Max, Air en stock | TekL∞p"
        description="iPhone 17 disponible maintenant. iPhone 17 Pro, Pro Max et Air neufs sous emballage Apple en stock. Livraison gratuite 48h, garantie Apple officielle."
        keywords="iPhone 17 disponible, iPhone 17 Pro disponible, iPhone 17 Pro Max disponible, iPhone Air disponible, Apple neuf, stock iPhone 17, acheter iPhone 17"
        type="website"
      />
      <OrganizationSchema />
      <Header />
      
      <main className="flex-1">
        {/* Hero Products Section - Apple Style */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-semibold mb-4 text-black">iPhone 17</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Découvrez toute la gamme iPhone 17. Design élégant, performances exceptionnelles.
              </p>
            </div>
            
            {/* Three Products Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
              {/* iPhone 17 Pro */}
              <div className="text-center">
                <div className="mb-6">
                  <h3 className="text-2xl font-semibold mb-2 text-black">{products[2].name}</h3>
                  <p className="text-base text-gray-600 mb-4">Le Pro par excellence</p>
                </div>
                <div className="mb-8 flex items-center justify-center h-[500px] bg-white">
                  <img 
                    src="/1.png"
                    alt={products[2].name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="mb-4">
                  <div className="text-3xl font-semibold text-black mb-1">À partir de {products[2].launchPrice}€</div>
                  <div className="text-base text-gray-500 line-through mb-2">ou {products[2].price}€</div>
                </div>
                <div className="space-y-3">
                  <Link to={`/produit/${products[2].id}`}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full py-3 text-base font-medium">
                      Acheter
                    </Button>
                  </Link>
                  <Link to={`/produit/${products[2].id}`}>
                    <Button variant="ghost" className="text-blue-600 hover:text-blue-700 text-base">
                      En savoir plus →
                    </Button>
                  </Link>
                </div>
                <div className="mt-6 space-y-2 text-sm text-gray-600">
                  {products[2].features.map((feature, idx) => (
                    <p key={idx}>{feature}</p>
                  ))}
                </div>
              </div>

              {/* iPhone Air */}
              <div className="text-center">
                <div className="mb-6">
                  <h3 className="text-2xl font-semibold mb-2 text-black">{products[1].name}</h3>
                  <p className="text-base text-gray-600 mb-4">Ultra fin. Ultra léger.</p>
                </div>
                <div className="mb-8 flex items-center justify-center h-[500px] bg-white">
                  <img 
                    src="/2.png"
                    alt={products[1].name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="mb-4">
                  <div className="text-3xl font-semibold text-black mb-1">À partir de {products[1].launchPrice}€</div>
                  <div className="text-base text-gray-500 line-through mb-2">ou {products[1].price}€</div>
                </div>
                <div className="space-y-3">
                  <Link to={`/produit/${products[1].id}`}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full py-3 text-base font-medium">
                      Acheter
                    </Button>
                  </Link>
                  <Link to={`/produit/${products[1].id}`}>
                    <Button variant="ghost" className="text-blue-600 hover:text-blue-700 text-base">
                      En savoir plus →
                    </Button>
                  </Link>
                </div>
                <div className="mt-6 space-y-2 text-sm text-gray-600">
                  {products[1].features.map((feature, idx) => (
                    <p key={idx}>{feature}</p>
                  ))}
                </div>
              </div>

              {/* iPhone 17 */}
              <div className="text-center">
                <div className="mb-6">
                  <h3 className="text-2xl font-semibold mb-2 text-black">{products[0].name}</h3>
                  <p className="text-base text-gray-600 mb-4">Un grand pas en avant</p>
                </div>
                <div className="mb-8 flex items-center justify-center h-[500px] bg-white">
                  <img 
                    src="/3.png"
                    alt={products[0].name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="mb-4">
                  <div className="text-3xl font-semibold text-black mb-1">À partir de {products[0].launchPrice}€</div>
                  <div className="text-base text-gray-500 line-through mb-2">ou {products[0].price}€</div>
                </div>
                <div className="space-y-3">
                  <Link to={`/produit/${products[0].id}`}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full py-3 text-base font-medium">
                      Acheter
                    </Button>
                  </Link>
                  <Link to={`/produit/${products[0].id}`}>
                    <Button variant="ghost" className="text-blue-600 hover:text-blue-700 text-base">
                      En savoir plus →
                    </Button>
                  </Link>
                </div>
                <div className="mt-6 space-y-2 text-sm text-gray-600">
                  {products[0].features.map((feature, idx) => (
                    <p key={idx}>{feature}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center py-8 border-t border-gray-200">
              <Link to="/comparateur">
                <Button variant="outline" className="border-gray-300 hover:bg-gray-100 rounded-full px-8 py-3 text-base font-medium">
                  Comparer tous les modèles
                </Button>
              </Link>
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
                    <div key={product.id} className="text-center">
                      <div className="font-semibold text-green-600">{product.launchPrice}€</div>
                      <div className="text-xs text-muted-foreground line-through">{product.price}€</div>
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
              <Card className="p-6 text-center gradient-card shadow-apple-md hover:shadow-apple-lg transition-all duration-300 group hover:-translate-y-1">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                  <Truck className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-300">Livraison gratuite</h3>
                <p className="text-sm text-muted-foreground">
                  Dès 50€ d'achat partout en France
                </p>
              </Card>
              
              <Card className="p-6 text-center gradient-card shadow-apple-md hover:shadow-apple-lg transition-all duration-300 group hover:-translate-y-1">
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-success/20 transition-colors duration-300">
                  <Shield className="h-6 w-6 text-success group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-success transition-colors duration-300">Garantie Apple</h3>
                <p className="text-sm text-muted-foreground">
                  Produits 100% authentiques garantis
                </p>
              </Card>
              
              <Card className="p-6 text-center gradient-card shadow-apple-md hover:shadow-apple-lg transition-all duration-300 group hover:-translate-y-1">
                <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-warning/20 transition-colors duration-300">
                  <RefreshCw className="h-6 w-6 text-warning group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-warning transition-colors duration-300">Retours 30 jours</h3>
                <p className="text-sm text-muted-foreground">
                  Changez d'avis sans frais
                </p>
              </Card>
              
              <Card className="p-6 text-center gradient-card shadow-apple-md hover:shadow-apple-lg transition-all duration-300 group hover:-translate-y-1">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                  <Star className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-300">Support expert</h3>
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
              <Card className="p-6 gradient-card shadow-apple-md hover:shadow-apple-lg transition-all duration-300 group hover:-translate-y-1">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-warning text-warning group-hover:scale-110 transition-transform duration-300" style={{transitionDelay: `${i * 50}ms`}} />
                  ))}
                </div>
                <p className="text-sm mb-4 group-hover:text-foreground transition-colors duration-300">
                  "L'iPhone 17 Pro Max est incroyable ! La qualité photo est exceptionnelle et la batterie tient toute la journée."
                </p>
                <p className="text-sm font-semibold group-hover:text-primary transition-colors duration-300">Sophie M.</p>
                <p className="text-xs text-muted-foreground">Cliente vérifiée</p>
              </Card>
              
              <Card className="p-6 gradient-card shadow-apple-md hover:shadow-apple-lg transition-all duration-300 group hover:-translate-y-1">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-warning text-warning group-hover:scale-110 transition-transform duration-300" style={{transitionDelay: `${i * 50}ms`}} />
                  ))}
                </div>
                <p className="text-sm mb-4 group-hover:text-foreground transition-colors duration-300">
                  "Livraison rapide et produit impeccable. Le service client est très réactif. Je recommande !"
                </p>
                <p className="text-sm font-semibold group-hover:text-primary transition-colors duration-300">Thomas L.</p>
                <p className="text-xs text-muted-foreground">Client vérifié</p>
              </Card>
              
              <Card className="p-6 gradient-card shadow-apple-md hover:shadow-apple-lg transition-all duration-300 group hover:-translate-y-1">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-warning text-warning group-hover:scale-110 transition-transform duration-300" style={{transitionDelay: `${i * 50}ms`}} />
                  ))}
                </div>
                <p className="text-sm mb-4 group-hover:text-foreground transition-colors duration-300">
                  "L'iPhone 17 Air est parfait pour moi. Ultra léger et suffisamment puissant pour tous mes besoins."
                </p>
                <p className="text-sm font-semibold group-hover:text-primary transition-colors duration-300">Marie D.</p>
                <p className="text-xs text-muted-foreground">Cliente vérifiée</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Security & Trust */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Achat 100% sécurisé</h2>
              <p className="text-muted-foreground">Vos garanties pour un achat en toute confiance</p>
            </div>
            <SecurityBadges />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
