import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BreadcrumbsWithSchema } from "@/components/BreadcrumbsWithSchema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { products } from "@/data/products";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { LaunchOfferUtils } from "@/lib/launch-offer";
import { Package, Clock } from "lucide-react";
import { AppleStyleComparator } from "@/components/AppleStyleComparator";

const Comparateur = () => {
  const [comparisonMode, setComparisonMode] = useState<'apple' | 'classic'>('apple');
  const [selectedProducts, setSelectedProducts] = useState(products.map(p => p.id));
  const isOfferActive = LaunchOfferUtils.isOfferActive();

  const toggleProduct = (id: string) => {
    if (selectedProducts.includes(id)) {
      if (selectedProducts.length > 1) {
        setSelectedProducts(selectedProducts.filter(p => p !== id));
      }
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  const displayedProducts = products.filter(p => selectedProducts.includes(p.id));

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="Comparateur iPhone 17, Pro, Pro Max, Air - Trouvez le meilleur | TekL∞p"
        description="Comparez les iPhone 17, iPhone 17 Air, iPhone 17 Pro et Pro Max. Découvrez les différences de prix, écran, appareil photo, autonomie. Guide d'achat complet."
        keywords="comparateur iPhone 17, iPhone 17 vs Pro, iPhone 17 Pro Max vs Pro, différence iPhone 17, quel iPhone choisir"
      />
      
      {/* Apple Style Comparator */}
      <AppleStyleComparator products={products} />
      
      {/* Mode Toggle */}
      <div className="sticky top-[100px] z-40 bg-white/10 backdrop-blur-md mx-auto mb-8">
        <div className="flex gap-2">
          <Button 
            variant={comparisonMode === 'apple' ? "default" : "outline"}
            onClick={() => setComparisonMode('apple')}
            className={comparisonMode === 'apple' ? "bg-black text-white" : "text-gray-300"}
          >
            Apple Style
          </Button>
          <Button 
            variant={comparisonMode === 'classic' ? "default" : "outline"}
            onClick={() => setComparisonMode('classic')}
            className={comparisonMode === 'classic' ? "bg-black text-white" : "text-gray-300"}
          >
            Classic View
          </Button>
        </div>
      </div>

      {/* Classic Comparison Mode */}
      {comparisonMode === 'classic' && (
        <>
          <Header />
          <main className="flex-1 py-12 bg-white text-black">
            <div className="container mx-auto px-4">
              <BreadcrumbsWithSchema />
              <div className="text-center mb-12 animate-fade-in-up">
                {/* Badge de lancement */}
                {isOfferActive && (
                  <div className="inline-flex items-center px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-sm font-medium mb-6">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                    Série de lancement • –20% jusqu'au 15 octobre 23:59
                  </div>
                )}
                
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                  Comparateur iPhone 17
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Comparez facilement les iPhone 17, Pro, Pro Max et Air pour trouver le modèle qui correspond parfaitement à vos besoins et votre budget.
                </p>
              </div>

              {/* Product Selection */}
              <div className="flex flex-wrap justify-center gap-3 mb-12 animate-fade-in">
                {products.map((product) => (
                  <Button
                    key={product.id}
                    variant={selectedProducts.includes(product.id) ? "default" : "outline"}
                    onClick={() => toggleProduct(product.id)}
                  >
                    {product.name}
                  </Button>
                ))}
              </div>

              {/* Comparison Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in-up">
                {displayedProducts.map((product) => (
                  <Card key={product.id} className="p-6 gradient-card text-center relative">
                    {/* Badges de lancement */}
                    {isOfferActive && (
                      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                        <Badge variant="destructive" className="text-xs font-semibold">
                          <Package className="h-2 w-2 mr-1" />
                          Série limitée
                        </Badge>
                        <Badge variant="secondary" className="text-xs font-semibold bg-green-500/90 text-white">
                          <Clock className="h-2 w-2 mr-1" />
                          –20%
                        </Badge>
                      </div>
                    )}
                    
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full aspect-square object-cover rounded-lg mb-4"
                    />
                    <h3 className="font-semibold mb-3">{product.name}</h3>
                    
                    {/* Prix avec offre de lancement */}
                    <div className="mb-4">
                      {isOfferActive ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-2xl font-bold text-green-600">
                              {product.launchPrice}€
                            </span>
                            <span className="text-lg text-muted-foreground line-through">
                              {product.price}€
                            </span>
                          </div>
                          <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-700">
                            –{product.savings}€
                          </Badge>
                        </div>
                      ) : (
                        <p className="text-xl font-bold">{product.price}€</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      <Link to={`/produit/${product.id}`}>
                        <Button className="w-full" variant={isOfferActive ? "default" : "outline"}>
                          {isOfferActive ? 
                            `Acheter maintenant • ${product.launchPrice}€` : 
                            `Voir détails • ${product.price}€`
                          }
                        </Button>
                      </Link>
                      <Link to={`/produit/${product.id}`}>
                        <Button variant="ghost" size="sm" className="w-full">
                          Comparer
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>

              {/* CTA */}
              <div className="text-center mt-12 animate-fade-in">
                {isOfferActive && (
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border border-green-200 dark:border-green-800 rounded-xl p-6 mb-8">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <Clock className="h-5 w-5 text-green-600" />
                      <span className="font-semibold text-green-800 dark:text-green-200">
                        Offre de lancement limitée
                      </span>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-300 mb-4">
                      –20% sur tous les modèles • 10 pièces par produit • Fin le 15 octobre 23:59
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                      {displayedProducts.map((product) => (
                        <Link key={product.id} to={`/produit/${product.id}`}>
                          <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700">
                            {product.name} - {product.launchPrice}€
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                
                <p className="text-lg text-muted-foreground mb-6">
                  Besoin d'aide pour choisir ?
                </p>
                <Link to="/support">
                  <Button variant="outline" size="lg">
                    Contactez nos experts
                  </Button>
                </Link>
              </div>
            </div>
          </main>
        </>
      )}
      
      <Footer />
    </div>
  );
};

export default Comparateur;