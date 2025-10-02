import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  CheckCircle, 
  Shield, 
  Clock, 
  Copy, 
  ExternalLink,
  ArrowRight,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CryptoPaymentModalProps {
  amount: number;
  currency?: string;
  onPaymentComplete?: () => void;
  children?: React.ReactNode;
}

export const CryptoPaymentModal = ({ 
  amount, 
  currency = 'EUR',
  onPaymentComplete,
  children 
}: CryptoPaymentModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();

  // Adresse USDT de démonstration (à remplacer par votre vraie adresse)
  const usdtAddress = 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE';
  
  const steps = [
    {
      title: "Achetez des USDT",
      description: "Obtenez des USDT sur une plateforme fiable",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">Vous avez besoin de {amount} USDT pour finaliser votre achat.</p>
          <div className="grid grid-cols-1 gap-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => window.open('https://www.binance.com', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Acheter sur Binance (Recommandé)
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => window.open('https://www.coinbase.com', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Acheter sur Coinbase
            </Button>
          </div>
        </div>
      )
    },
    {
      title: "Configurez votre portefeuille",
      description: "Installez MetaMask ou Trust Wallet",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">Vous avez besoin d'un portefeuille pour envoyer vos USDT.</p>
          <div className="grid grid-cols-1 gap-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => window.open('https://metamask.io', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Installer MetaMask (Extension)
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => window.open('https://trustwallet.com', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Installer Trust Wallet (Mobile)
            </Button>
          </div>
        </div>
      )
    },
    {
      title: "Effectuez le paiement",
      description: "Envoyez le montant exact à notre adresse",
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-800">Instructions importantes</span>
            </div>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Utilisez le réseau TRC20 (Tron)</li>
              <li>• Envoyez exactement {amount} USDT</li>
              <li>• Vérifiez l'adresse avant d'envoyer</li>
            </ul>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Montant à envoyer</label>
              <div className="bg-gray-50 border rounded-lg p-3 flex items-center justify-between">
                <span className="font-mono text-lg">{amount} USDT</span>
                <Badge variant="secondary">Exact</Badge>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Notre adresse USDT (TRC20)</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-gray-50 p-3 rounded border text-sm font-mono break-all">
                  {usdtAddress}
                </code>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(usdtAddress);
                    toast({
                      title: "Adresse copiée",
                      description: "L'adresse USDT a été copiée dans votre presse-papiers",
                    });
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Confirmation",
      description: "Votre paiement sera confirmé automatiquement",
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Paiement en cours de traitement</h3>
            <p className="text-gray-600">Nous vérifions votre transaction. Vous recevrez un email de confirmation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-medium text-sm">2-5 minutes</h4>
              <p className="text-xs text-gray-500">Temps de confirmation</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-medium text-sm">100% sécurisé</h4>
              <p className="text-xs text-gray-500">Transaction irréversible</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-medium text-sm">Confirmation auto</h4>
              <p className="text-xs text-gray-500">Pas d'attente</p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <HelpCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Besoin d'aide ?</p>
                <p className="text-sm text-yellow-700">Contactez notre support si vous rencontrez des difficultés.</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Dernière étape - simuler la confirmation
      onPaymentComplete?.();
      setIsOpen(false);
      setCurrentStep(0);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="w-full">
            Payer en USDT
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Paiement en USDT</DialogTitle>
          <DialogDescription>
            Guide étape par étape pour payer en crypto-monnaie
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                Étape {currentStep + 1} sur {steps.length}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(((currentStep + 1) / steps.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{steps[currentStep].title}</CardTitle>
              <CardDescription className="text-base">
                {steps[currentStep].description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {steps[currentStep].content}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              Précédent
            </Button>
            <Button onClick={handleNext}>
              {currentStep === steps.length - 1 ? 'Finaliser' : 'Suivant'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Help Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="h-4 w-4 text-gray-600" />
              <span className="font-medium text-gray-900">Besoin d'aide ?</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Notre équipe est disponible 24/7 pour vous accompagner.
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                Chat en direct
              </Button>
              <Button size="sm" variant="outline">
                Guide complet
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
