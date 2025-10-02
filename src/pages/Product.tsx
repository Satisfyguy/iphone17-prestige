import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getProductById } from "@/data/products";
import { ShoppingCart, Check, Clock, Package, Truck, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/hooks/useCart";
import { useStock, useSessionId } from "@/hooks/useStock";
import { LaunchOfferUtils } from "@/lib/launch-offer";
import { SEO } from "@/components/SEO";
import { ProductSchema } from "@/components/ProductSchema";

const Product = () => {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id || "");
  const sessionId = useSessionId();
  const { stock, loading: stockLoading, refreshStock } = useStock(id || "");
  
  const [selectedColor, setSelectedColor] = useState(product?.colors[0]?.name || "");
  const [selectedStorage, setSelectedStorage] = useState(product?.storage[0]?.size || "");
  const [timeRemaining, setTimeRemaining] = useState("");
  const [isOfferActive, setIsOfferActive] = useState(true);
  
  const currentColor = product?.colors.find(c => c.name === selectedColor);
  const currentColorImage = currentColor?.image || product?.image;

  const { addItem } = useCart();

  // Timer pour l'offre de lancement
  useEffect(() => {
    const updateTimer = () => {
      const active = LaunchOfferUtils.isOfferActive();
      setIsOfferActive(active);
      
      if (active) {
        setTimeRemaining(LaunchOfferUtils.formatTimeRemaining());
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

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
  const totalOriginalPrice = product.price + selectedStoragePrice;
  const totalLaunchPrice = product.launchPrice + selectedStoragePrice;
  const totalSavings = totalOriginalPrice - totalLaunchPrice;
  
  // Informations de stock
  const stockRemaining = stock?.available || 0;
  const stockBadge = LaunchOfferUtils.getStockBadge(stockRemaining);
  const urgencyMessage = LaunchOfferUtils.getUrgencyMessage(stockRemaining);

  const handleAddToCart = () => {
    if (stockRemaining <= 0) {
      toast.error("Stock épuisé", {
        description: "Ce produit n'est plus disponible",
      });
      return;
    }

    addItem(
      {
        id: product.id,
        name: product.fullName,
        image: currentColorImage || "",
        color: selectedColor,
        storage: selectedStorage,
        price: isOfferActive ? totalLaunchPrice : totalOriginalPrice,
      },
      1
    );
    toast.success("Produit ajouté au panier", {
      description: `${product.name} - ${selectedColor} - ${selectedStorage}`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title={`${product.fullName} - ${selectedColor} ${selectedStorage} | TechLoop`}
        description={`Achetez ${product.fullName} en ${selectedColor} avec ${selectedStorage} de stockage. ${product.description} Livraison gratuite, garantie Apple.`}
        keywords={`${product.name}, ${product.fullName}, iPhone ${selectedStorage}, iPhone ${selectedColor}, acheter ${product.name}`}
        ogImage={currentColorImage}
        type="product"
      />
      <ProductSchema 
        name={`${product.fullName} ${selectedColor} ${selectedStorage}`}
        description={product.description}
        image={currentColorImage || ""}
        price={isOfferActive ? totalLaunchPrice : totalOriginalPrice}
        sku={`${product.id}-${selectedColor}-${selectedStorage}`}
        url={`${window.location.origin}/product/${product.id}`}
      />
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
                  alt={`${product.fullName} couleur ${selectedColor} avec ${selectedStorage} de stockage - photo officielle Apple haute résolution`}
                  width="800"
                  height="800"
                  loading="eager"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-8 animate-fade-in-up">
              {/* Badges de lancement */}
              <div className="flex flex-wrap gap-3">
                <Badge variant="destructive" className="text-sm font-semibold">
                  <Package className="h-3 w-3 mr-1" />
                  Édition de lancement — 10 pièces
                </Badge>
                {isOfferActive && (
                  <Badge variant="secondary" className="text-sm font-semibold bg-green-500/90 text-white">
                    <Clock className="h-3 w-3 mr-1" />
                    –20% jusqu'au 15 octobre, 23:59
                  </Badge>
                )}
                <Badge variant="outline" className="text-sm">
                  <Truck className="h-3 w-3 mr-1" />
                  Livraison 48h offerte
                </Badge>
              </div>

              <div>
                <h1 className="mb-4">{product.fullName}</h1>
                <p className="text-lg text-muted-foreground mb-6">
                  {product.description.replace("iPhone 17 Air", "iPhone Air")}
                </p>
                
                {/* Stock et urgence */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={stockBadge.variant} className="text-sm">
                      {stockBadge.text}
                    </Badge>
                    {stockRemaining > 0 && (
                      <span className="text-sm text-orange-600 font-medium">
                        {urgencyMessage}
                      </span>
                    )}
                  </div>
                  {isOfferActive && timeRemaining && (
                    <div className="text-sm text-red-600 font-medium">
                      Fin de l'offre dans {timeRemaining}
                    </div>
                  )}
                </div>

                {/* Prix */}
                <div className="space-y-2">
                  {isOfferActive ? (
                    <>
                      <div className="flex items-center gap-3">
                        <span className="text-4xl font-bold text-green-600">
                          {totalLaunchPrice}€
                        </span>
                        <span className="text-2xl text-muted-foreground line-through">
                          {totalOriginalPrice}€
                        </span>
                        <Badge variant="secondary" className="bg-green-500/10 text-green-700">
                          –{totalSavings}€
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Prix après lancement: {totalOriginalPrice}€
                      </p>
                    </>
                  ) : (
                    <div className="text-4xl font-bold">
                      {totalOriginalPrice}€
                    </div>
                  )}
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
              {stockRemaining > 0 ? (
                <div className="space-y-3">
                  <Button 
                    variant="hero" 
                    size="lg" 
                    className="w-full"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {isOfferActive 
                      ? `Ajouter — ${totalLaunchPrice}€ (–20%)` 
                      : `Ajouter — ${totalOriginalPrice}€`
                    }
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Limité à 1 par client
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full"
                    disabled
                  >
                    <AlertTriangle className="mr-2 h-5 w-5" />
                    Épuisé (10/10 vendus)
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="w-full"
                  >
                    Rejoindre la liste d'attente
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Prochain prix: {totalOriginalPrice}€
                  </p>
                </div>
              )}

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
