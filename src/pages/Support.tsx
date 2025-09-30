import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Support = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="mb-4">Support & Assistance</h1>
            <p className="text-lg text-muted-foreground">
              Nous sommes là pour vous aider
            </p>
          </div>

          {/* FAQ */}
          <Card className="p-8 mb-8 gradient-card animate-fade-in">
            <h2 className="text-2xl font-semibold mb-6">Questions fréquentes</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Quelle est la durée de livraison ?</AccordionTrigger>
                <AccordionContent>
                  La livraison standard est gratuite et prend 2-3 jours ouvrés. Nous proposons également une livraison express en 24h.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Puis-je retourner mon iPhone ?</AccordionTrigger>
                <AccordionContent>
                  Oui, vous disposez de 30 jours pour retourner votre produit sans frais. Il doit être dans son état d'origine avec tous les accessoires.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>La garantie Apple est-elle incluse ?</AccordionTrigger>
                <AccordionContent>
                  Tous nos produits sont 100% authentiques et incluent la garantie Apple standard d'un an. Vous pouvez également souscrire à AppleCare+.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>Quels modes de paiement acceptez-vous ?</AccordionTrigger>
                <AccordionContent>
                  Nous acceptons les cartes bancaires (Visa, Mastercard, Amex), PayPal, Apple Pay, et proposons le paiement en 3x ou 4x sans frais.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>

          {/* Contact Form */}
          <Card className="p-8 gradient-card animate-fade-in-up">
            <h2 className="text-2xl font-semibold mb-6">Contactez-nous</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Nom</label>
                  <Input placeholder="Votre nom" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <Input type="email" placeholder="votre@email.com" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Sujet</label>
                <Input placeholder="Sujet de votre message" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Message</label>
                <Textarea 
                  placeholder="Décrivez votre demande..." 
                  rows={6}
                />
              </div>
              <Button variant="hero" size="lg" className="w-full md:w-auto">
                Envoyer le message
              </Button>
            </form>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Support;
