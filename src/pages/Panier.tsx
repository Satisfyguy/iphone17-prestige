import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/hooks/useCart";

const Panier = () => {
  const { items, total, originalTotal, totalSavings, changeQty, removeItem, clear } = useCart();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="mb-8">Panier</h1>

          {items.length === 0 ? (
            <Card className="p-12 text-center gradient-card">
              <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-semibold mb-2">Votre panier est vide</h2>
              <p className="text-muted-foreground mb-6">
                Découvrez notre gamme iPhone 17 et trouvez le modèle parfait pour vous
              </p>
              <Link to="/">
                <Button variant="hero" size="lg">
                  Découvrir les produits
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item, index) => (
                  <Card key={`${item.id}-${item.color}-${item.storage}-${index}`} className="p-6 gradient-card">
                    <div className="flex gap-4">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{item.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {item.color} - {item.storage}
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="inline-flex items-center border rounded-md overflow-hidden">
                            <button className="px-3 py-1" onClick={() => changeQty(item.id, item.color, item.storage, Math.max(1, item.qty - 1))}>-</button>
                            <span className="px-3 py-1">{item.qty}</span>
                            <button className="px-3 py-1" onClick={() => changeQty(item.id, item.color, item.storage, item.qty + 1)}>+</button>
                          </div>
                          <span className="font-semibold">{item.price * item.qty}€</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeItem(item.id, item.color, item.storage)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Summary */}
              <div>
                <Card className="p-6 gradient-card sticky top-24">
                  <h3 className="font-semibold mb-4">Récapitulatif</h3>
                  <div className="space-y-3 mb-6">
                    {totalSavings > 0 && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Sous-total</span>
                          <span className="font-semibold line-through text-muted-foreground">{originalTotal}€</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Prix de lancement (-20%)</span>
                          <span className="font-semibold text-green-600">{total}€</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Économies</span>
                          <span className="font-semibold text-green-600">-{totalSavings}€</span>
                        </div>
                      </>
                    )}
                    {totalSavings === 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sous-total</span>
                        <span className="font-semibold">{total}€</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Livraison</span>
                      <span className="font-semibold text-success">Gratuite</span>
                    </div>
                    <div className="border-t border-border pt-3">
                      <div className="flex justify-between">
                        <span className="font-semibold">Total</span>
                        <span className="text-2xl font-bold">{total}€</span>
                      </div>
                      {totalSavings > 0 && (
                        <div className="text-sm text-green-600 mt-1">
                          Vous économisez {totalSavings}€ !
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" className="w-1/3" onClick={clear}>Vider</Button>
                    <Link to="/checkout" className="flex-1">
                      <Button variant="hero" className="w-full" size="lg">
                        Commander
                      </Button>
                    </Link>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Panier;
