import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";

const Accessoires = () => {
  const accessories = [
    {
      name: "Coque MagSafe",
      price: "59€",
      description: "Protection élégante avec MagSafe intégré"
    },
    {
      name: "Chargeur MagSafe",
      price: "39€",
      description: "Charge sans fil jusqu'à 15W"
    },
    {
      name: "AirPods Pro",
      price: "279€",
      description: "Son immersif avec réduction de bruit active"
    },
    {
      name: "Apple Watch Series 9",
      price: "449€",
      description: "Le parfait complément de votre iPhone"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="Accessoires iPhone 17 - Coques, AirPods, Chargeurs MagSafe | TekL∞p"
        description="Découvrez nos accessoires iPhone 17 : coques MagSafe, chargeurs sans fil, AirPods Pro, Apple Watch. Livraison gratuite, garantie Apple officielle."
        keywords="accessoires iPhone 17, coque iPhone 17, MagSafe, AirPods Pro, Apple Watch, chargeur iPhone"
      />
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="mb-4">Accessoires</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Complétez votre expérience iPhone avec nos accessoires premium
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {accessories.map((accessory, index) => (
              <Card key={index} className="p-6 gradient-card shadow-apple-md hover:shadow-apple-lg transition-smooth">
                <div className="aspect-square bg-secondary rounded-lg mb-4"></div>
                <h3 className="font-semibold mb-2">{accessory.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{accessory.description}</p>
                <p className="text-2xl font-bold mb-4">{accessory.price}</p>
                <Button variant="hero" className="w-full">
                  Ajouter au panier
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Accessoires;
