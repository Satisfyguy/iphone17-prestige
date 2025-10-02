import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  HelpCircle, 
  MessageCircle, 
  BookOpen, 
  X, 
  ArrowRight,
  Shield,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CryptoHelpWidgetProps {
  className?: string;
}

export const CryptoHelpWidget = ({ className = '' }: CryptoHelpWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const quickActions = [
    {
      title: "Guide complet",
      description: "Comment payer en crypto",
      icon: BookOpen,
      action: () => navigate('/guide-crypto'),
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "Chat en direct",
      description: "Conseiller disponible",
      icon: MessageCircle,
      action: () => {
        // Ici vous pouvez intégrer votre système de chat
        console.log('Ouvrir le chat');
      },
      color: "bg-green-500 hover:bg-green-600"
    }
  ];

  const trustIndicators = [
    { icon: Shield, text: "100% sécurisé", color: "text-green-600" },
    { icon: Clock, text: "5 min max", color: "text-blue-600" },
    { icon: CheckCircle, text: "Support 24/7", color: "text-purple-600" }
  ];

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      {/* Widget Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300"
          size="lg"
        >
          <HelpCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Widget Panel */}
      {isOpen && (
        <Card className="w-80 shadow-2xl border-0 bg-white">
          <CardContent className="p-0">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Besoin d'aide ?</h3>
                  <p className="text-blue-100 text-sm">Paiement en crypto</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-center gap-4 text-xs">
                {trustIndicators.map((indicator, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <indicator.icon className={`h-3 w-3 ${indicator.color}`} />
                    <span className="text-gray-600">{indicator.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-4 space-y-3">
              <h4 className="font-medium text-gray-900 mb-3">Actions rapides</h4>
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  onClick={action.action}
                  className={`w-full justify-start ${action.color} text-white`}
                  variant="default"
                >
                  <action.icon className="h-4 w-4 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-xs opacity-90">{action.description}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </Button>
              ))}
            </div>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="p-4 border-t bg-gray-50">
                <div className="space-y-3">
                  <div className="text-sm">
                    <p className="font-medium text-gray-900 mb-2">💡 Conseils rapides :</p>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Utilisez le réseau TRC20 pour des frais bas</li>
                      <li>• Vérifiez l'adresse avant d'envoyer</li>
                      <li>• Envoyez le montant exact</li>
                    </ul>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-xs text-yellow-800">
                      <strong>⚠️ Important :</strong> Envoyez uniquement des USDT sur le réseau TRC20
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="p-4 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full text-blue-600 hover:text-blue-700"
              >
                {isExpanded ? 'Moins d\'infos' : 'Plus d\'infos'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
