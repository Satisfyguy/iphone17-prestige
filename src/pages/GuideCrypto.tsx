import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Shield, Clock, HelpCircle, ArrowRight, Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const GuideCrypto = () => {
  const [activeStep, setActiveStep] = useState(0);
  const { toast } = useToast();

  const steps = [
    {
      title: "Achetez des USDT",
      description: "Obtenez des USDT sur une plateforme fiable",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">Les USDT (Tether) sont la crypto-monnaie la plus stable pour les achats.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-green-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Binance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-600">Plateforme la plus populaire</p>
                <Button size="sm" className="w-full mt-2" variant="outline">
                  Acheter sur Binance
                </Button>
              </CardContent>
            </Card>
            <Card className="border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Coinbase
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-600">Interface simple</p>
                <Button size="sm" className="w-full mt-2" variant="outline">
                  Acheter sur Coinbase
                </Button>
              </CardContent>
            </Card>
            <Card className="border-purple-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Kraken
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-600">Très sécurisé</p>
                <Button size="sm" className="w-full mt-2" variant="outline">
                  Acheter sur Kraken
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      title: "Configurez votre portefeuille",
      description: "Installez un portefeuille crypto sécurisé",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">Vous avez besoin d'un portefeuille pour stocker et envoyer vos USDT.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">MetaMask (Recommandé)</CardTitle>
                <CardDescription>Extension navigateur, très facile à utiliser</CardDescription>
              </CardHeader>
              <CardContent>
                <Button size="sm" className="w-full" variant="outline">
                  Installer MetaMask
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Trust Wallet</CardTitle>
                <CardDescription>Application mobile, très sécurisée</CardDescription>
              </CardHeader>
              <CardContent>
                <Button size="sm" className="w-full" variant="outline">
                  Installer Trust Wallet
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      title: "Transférez vos USDT",
      description: "Envoyez vos USDT vers votre portefeuille",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">Depuis votre plateforme d'achat, envoyez vos USDT vers votre portefeuille.</p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <HelpCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Important</p>
                <p className="text-sm text-yellow-700">Utilisez le réseau TRC20 (Tron) pour des frais très bas (1 USDT)</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Effectuez le paiement",
      description: "Envoyez le montant exact à notre adresse",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">Copiez notre adresse USDT et envoyez le montant exact de votre commande.</p>
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle className="text-sm">Notre adresse USDT (TRC20)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-white p-2 rounded border text-xs font-mono">
                  TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE
                </code>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText('TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE');
                    toast({
                      title: "Adresse copiée",
                      description: "L'adresse USDT a été copiée dans votre presse-papiers",
                    });
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                ⚠️ Envoyez uniquement des USDT sur le réseau TRC20
              </p>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      title: "Confirmation automatique",
      description: "Votre commande sera confirmée automatiquement",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">Dès que nous recevons votre paiement, votre commande est automatiquement confirmée.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-medium">2-5 minutes</h4>
              <p className="text-sm text-gray-600">Temps de confirmation</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-medium">100% sécurisé</h4>
              <p className="text-sm text-gray-600">Transaction irréversible</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-medium">Confirmation auto</h4>
              <p className="text-sm text-gray-600">Pas d'attente</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Guide d'Achat en Crypto
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Payer en USDT, c'est simple et sécurisé ! Suivez ce guide étape par étape.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>5 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>100% sécurisé</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span>Support 24/7</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Étape {activeStep + 1} sur {steps.length}</span>
            <span className="text-sm text-gray-500">{Math.round(((activeStep + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Steps Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Étapes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {steps.map((step, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveStep(index)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      activeStep === index
                        ? 'bg-blue-50 border border-blue-200 text-blue-900'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        activeStep === index
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{step.title}</p>
                        <p className="text-xs text-gray-500">{step.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Step Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{steps[activeStep].title}</CardTitle>
                <CardDescription className="text-lg">{steps[activeStep].description}</CardDescription>
              </CardHeader>
              <CardContent>
                {steps[activeStep].content}
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                disabled={activeStep === 0}
              >
                Précédent
              </Button>
              <Button
                onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
                disabled={activeStep === steps.length - 1}
              >
                Suivant
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-center mb-8">Questions Fréquentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Combien coûtent les frais ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Les frais de transaction USDT sur le réseau TRC20 sont très bas : environ 1 USDT (1€) par transaction, quel que soit le montant.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Que faire si j'envoie le mauvais montant ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Contactez-nous immédiatement via le chat. Nous remboursons la différence ou ajustons votre commande selon le cas.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Puis-je payer en Bitcoin ou Ethereum ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Nous acceptons uniquement les USDT pour la stabilité des prix. Vous pouvez facilement convertir vos autres cryptos en USDT.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Combien de temps pour la confirmation ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Les transactions USDT sont confirmées en 2-5 minutes. Vous recevrez un email de confirmation automatique.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="py-8">
              <h3 className="text-2xl font-bold mb-4">Prêt à acheter votre iPhone ?</h3>
              <p className="text-gray-600 mb-6">Maintenant que vous savez comment payer en crypto, découvrez notre sélection d'iPhone 17.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Voir les iPhone 17
                </Button>
                <Button size="lg" variant="outline">
                  Chat avec un conseiller
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GuideCrypto;
