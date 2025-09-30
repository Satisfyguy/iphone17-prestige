import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

const Success = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const orderId = params.get("orderId");
  const txHash = params.get("txHash");
  const network = params.get("network");

  const explorerByNet: Record<string, (hash: string) => string> = {
    "TRC-20": (h) => `https://tronscan.org/#/transaction/${h}`,
    "ERC-20": (h) => `https://etherscan.io/tx/${h}`,
    "BEP-20": (h) => `https://bscscan.com/tx/${h}`,
  };

  const explorerUrl = txHash && network && explorerByNet[network]
    ? explorerByNet[network](txHash)
    : undefined;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card className="p-8 gradient-card text-center">
            <h1 className="text-2xl font-bold mb-2">Commande confirmée</h1>
            <p className="text-muted-foreground mb-6">Merci pour votre achat !</p>
            <div className="space-y-2 text-sm">
              {orderId && <div>Numéro de commande: <span className="font-mono">{orderId}</span></div>}
              {txHash && <div>Transaction: <span className="font-mono break-all">{txHash}</span></div>}
              {explorerUrl && (
                <div>
                  <a className="underline" href={explorerUrl} target="_blank" rel="noreferrer">Voir sur l'explorateur</a>
                </div>
              )}
            </div>
            <div className="mt-8 flex gap-3 justify-center">
              <Link to="/"><Button variant="hero">Retour à l'accueil</Button></Link>
              <Link to="/support"><Button variant="outline">Support</Button></Link>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Success;


