import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { products } from "@/data/products";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";

const Comparateur = () => {
  const [selectedProducts, setSelectedProducts] = useState(products.map(p => p.id));

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
        title="Comparateur iPhone 17, Pro, Pro Max, Air - Trouvez le meilleur | TechLoop"
        description="Comparez les iPhone 17, iPhone 17 Air, iPhone 17 Pro et Pro Max. Découvrez les différences de prix, écran, appareil photo, autonomie. Guide d'achat complet."
        keywords="comparateur iPhone 17, iPhone 17 vs Pro, iPhone 17 Pro Max vs Pro, différence iPhone 17, quel iPhone choisir"
      />
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="mb-4">Comparez les modèles</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Trouvez l'iPhone 17 qui correspond parfaitement à vos besoins
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

          {/* Comparison Table */}
          <div className="overflow-x-auto animate-fade-in-up">
            <div className="min-w-[800px]">
              <div className="grid gap-6" style={{ gridTemplateColumns: `200px repeat(${displayedProducts.length}, 1fr)` }}>
                {/* Headers */}
                <div></div>
                {displayedProducts.map((product) => (
                  <Card key={product.id} className="p-6 gradient-card text-center">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full aspect-square object-cover rounded-lg mb-4"
                    />
                    <h3 className="font-semibold mb-2">{product.name}</h3>
                    <p className="text-2xl font-bold mb-4">À partir de {product.price}€</p>
                    <Link to={`/produit/${product.id}`}>
                      <Button variant="hero" className="w-full">
                        Choisir
                      </Button>
                    </Link>
                  </Card>
                ))}

                {/* Écran */}
                <div className="font-semibold flex items-center">Écran</div>
                {displayedProducts.map((product) => (
                  <Card key={product.id} className="p-4 flex items-center justify-center text-center">
                    <p className="text-sm">{product.specs.screen}</p>
                  </Card>
                ))}

                {/* Puce */}
                <div className="font-semibold flex items-center">Puce</div>
                {displayedProducts.map((product) => (
                  <Card key={product.id} className="p-4 flex items-center justify-center text-center">
                    <p className="text-sm">{product.specs.chip}</p>
                  </Card>
                ))}

                {/* Appareil photo */}
                <div className="font-semibold flex items-center">Appareil photo</div>
                {displayedProducts.map((product) => (
                  <Card key={product.id} className="p-4 flex items-center justify-center text-center">
                    <p className="text-sm">{product.specs.camera}</p>
                  </Card>
                ))}

                {/* Autonomie */}
                <div className="font-semibold flex items-center">Autonomie</div>
                {displayedProducts.map((product) => (
                  <Card key={product.id} className="p-4 flex items-center justify-center text-center">
                    <p className="text-sm">{product.specs.battery}</p>
                  </Card>
                ))}

                {/* Stockage */}
                <div className="font-semibold flex items-center">Options de stockage</div>
                {displayedProducts.map((product) => (
                  <Card key={product.id} className="p-4 flex items-center justify-center text-center">
                    <p className="text-sm">{product.storage.map(s => s.size).join(", ")}</p>
                  </Card>
                ))}

                {/* Couleurs */}
                <div className="font-semibold flex items-center">Couleurs disponibles</div>
                {displayedProducts.map((product) => (
                  <Card key={product.id} className="p-4">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {product.colors.map((color) => (
                        <div
                          key={color.name}
                          className="w-8 h-8 rounded-full border-2 border-border"
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </Card>
                ))}

                {/* Prix */}
                <div className="font-semibold flex items-center">Prix de départ</div>
                {displayedProducts.map((product) => (
                  <Card key={product.id} className="p-4 flex items-center justify-center text-center">
                    <p className="text-xl font-bold">{product.price}€</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12 animate-fade-in">
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

      <Footer />
    </div>
  );
};

export default Comparateur;
