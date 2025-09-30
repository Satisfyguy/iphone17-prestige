import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getProductById } from "@/data/products";
import { ShoppingCart, Check } from "lucide-react";
import { toast } from "sonner";

const Product = () => {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id || "");
  
  const [selectedColor, setSelectedColor] = useState(product?.colors[0]?.name || "");
  const [selectedStorage, setSelectedStorage] = useState(product?.storage[0]?.size || "");
  
  const currentColorImage = product?.colors.find(c => c.name === selectedColor)?.image || product?.image;

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Produit non trouvé</h1>
            <Link to="/">
              <Button>Retour à l'accueil</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const selectedStoragePrice = product.storage.find(s => s.size === selectedStorage)?.price || 0;
  const totalPrice = product.price + selectedStoragePrice;

  const handleAddToCart = () => {
    toast.success("Produit ajouté au panier", {
      description: `${product.name} - ${selectedColor} - ${selectedStorage}`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-8 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-smooth">
              Accueil
            </Link>
            <span className="mx-2 text-muted-foreground">/</span>
            <span className="text-foreground font-medium">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image */}
            <div className="animate-fade-in">
              <div className="aspect-square rounded-2xl overflow-hidden bg-secondary shadow-apple-lg">
                <img 
                  src={currentColorImage} 
                  alt={`${product.name} - ${selectedColor}`}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-8 animate-fade-in-up">
              <div>
                <h1 className="mb-4">{product.fullName}</h1>
                <p className="text-lg text-muted-foreground mb-6">
                  {product.description}
                </p>
                <div className="text-4xl font-bold">
                  {totalPrice}€
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Couleur : {selectedColor}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-12 h-12 rounded-full border-2 transition-smooth ${
                        selectedColor === color.name 
                          ? "border-primary scale-110 shadow-apple-md" 
                          : "border-border hover:border-primary/50"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      aria-label={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Storage Selection */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Stockage</h3>
                <div className="grid grid-cols-3 gap-3">
                  {product.storage.map((storage) => (
                    <button
                      key={storage.size}
                      onClick={() => setSelectedStorage(storage.size)}
                      className={`p-4 rounded-lg border-2 transition-smooth ${
                        selectedStorage === storage.size
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="font-semibold">{storage.size}</div>
                      {storage.price > 0 && (
                        <div className="text-xs text-muted-foreground">
                          +{storage.price}€
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add to Cart */}
              <Button 
                variant="hero" 
                size="lg" 
                className="w-full"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Ajouter au panier
              </Button>

              {/* Features */}
              <Card className="p-6 gradient-card">
                <h3 className="text-lg font-semibold mb-4">Points forts</h3>
                <ul className="space-y-3">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-success mr-3 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>

          {/* Specifications */}
          <div className="mt-20">
            <h2 className="text-center mb-12">Caractéristiques techniques</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 gradient-card text-center">
                <h3 className="font-semibold mb-2">Écran</h3>
                <p className="text-sm text-muted-foreground">{product.specs.screen}</p>
              </Card>
              <Card className="p-6 gradient-card text-center">
                <h3 className="font-semibold mb-2">Puce</h3>
                <p className="text-sm text-muted-foreground">{product.specs.chip}</p>
              </Card>
              <Card className="p-6 gradient-card text-center">
                <h3 className="font-semibold mb-2">Appareil photo</h3>
                <p className="text-sm text-muted-foreground">{product.specs.camera}</p>
              </Card>
              <Card className="p-6 gradient-card text-center">
                <h3 className="font-semibold mb-2">Autonomie</h3>
                <p className="text-sm text-muted-foreground">{product.specs.battery}</p>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Product;
