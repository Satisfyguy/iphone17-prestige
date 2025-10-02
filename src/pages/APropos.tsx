import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Shield, Award, Users, Heart } from "lucide-react";
import { SEO } from "@/components/SEO";

const APropos = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="À propos de TekL∞p - Revendeur Apple Agréé depuis 2014"
        description="TekL∞p est un revendeur Apple agréé spécialisé dans l'iPhone 17. Plus de 50 000 clients satisfaits, garantie officielle Apple, service client expert."
        keywords="revendeur Apple agréé, TekL∞p, vendeur iPhone officiel, garantie Apple, AppleCare"
      />
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in-up max-w-3xl mx-auto">
            <h1 className="mb-4">À propos de nous</h1>
            <p className="text-lg text-muted-foreground">
              Votre partenaire de confiance pour les produits Apple depuis plus de 10 ans
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-12">
            {/* Notre histoire */}
            <Card className="p-8 gradient-card animate-fade-in">
              <h2 className="text-2xl font-semibold mb-4">Notre histoire</h2>
              <p className="text-muted-foreground mb-4">
                Fondée en 2014, notre entreprise s'est donnée pour mission de rendre l'excellence Apple accessible à tous. Nous sommes passionnés par l'innovation technologique et nous nous engageons à offrir une expérience d'achat exceptionnelle à chaque client.
              </p>
              <p className="text-muted-foreground">
                Revendeur Apple agréé, nous garantissons l'authenticité de tous nos produits et offrons un service après-vente de premier ordre. Notre équipe d'experts est là pour vous accompagner dans le choix du produit qui correspond parfaitement à vos besoins.
              </p>
            </Card>

            {/* Nos valeurs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
              <Card className="p-6 gradient-card text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Confiance</h3>
                <p className="text-sm text-muted-foreground">
                  Produits 100% authentiques avec garantie officielle
                </p>
              </Card>

              <Card className="p-6 gradient-card text-center">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-success" />
                </div>
                <h3 className="font-semibold mb-2">Excellence</h3>
                <p className="text-sm text-muted-foreground">
                  Un service client irréprochable et des conseils d'experts
                </p>
              </Card>

              <Card className="p-6 gradient-card text-center">
                <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-warning" />
                </div>
                <h3 className="font-semibold mb-2">Communauté</h3>
                <p className="text-sm text-muted-foreground">
                  Plus de 50 000 clients satisfaits nous font confiance
                </p>
              </Card>

              <Card className="p-6 gradient-card text-center">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-destructive" />
                </div>
                <h3 className="font-semibold mb-2">Passion</h3>
                <p className="text-sm text-muted-foreground">
                  Une équipe passionnée par la technologie Apple
                </p>
              </Card>
            </div>

            {/* Certifications */}
            <Card className="p-8 gradient-card animate-fade-in">
              <h2 className="text-2xl font-semibold mb-4">Certifications & Partenariats</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>✓ Revendeur agréé Apple</li>
                <li>✓ Certifié ISO 9001 pour la qualité de service</li>
                <li>✓ Partenaire premium AppleCare</li>
                <li>✓ Membre de la Fédération du e-commerce (FEVAD)</li>
              </ul>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default APropos;
