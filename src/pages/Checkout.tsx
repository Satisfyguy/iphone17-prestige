import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import * as QRCode from "qrcode";

const Checkout = () => {
  const { items, total } = useCart();
  const [network, setNetwork] = useState<string>("TRC-20");
  const [isRequesting, setIsRequesting] = useState<boolean>(false);
  const [quote, setQuote] = useState<null | {
    quoteId: string;
    amountUSDT: string;
    network: string;
    address: string;
    memo?: string;
    expiresAt: string;
  }>(null);
  const [status, setStatus] = useState<null | { state: string; confirmations?: number; txHash?: string }>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [remainingMs, setRemainingMs] = useState<number>(0);
  const [txHashInput, setTxHashInput] = useState<string>("");
  const [copied, setCopied] = useState<{ field: "address" | "amount" | null }>({ field: null });

  const isEmpty = items.length === 0;
  const eurTotal = useMemo(() => total, [total]);

  const requestQuote = async () => {
    setIsRequesting(true);
    try {
      const res = await fetch("/api/payment/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currency: "EUR",
          amount: eurTotal,
          network,
          cart: items.map(i => ({ id: i.id, color: i.color, storage: i.storage, qty: i.qty, price: i.price })),
        }),
      });
      if (!res.ok) throw new Error("Quote failed");
      const data = await res.json();
      setQuote(data);
      setStatus(null);
      try {
        const payload = `${data.network}:${data.address}?amount=${data.amountUSDT}`;
        const url = await QRCode.toDataURL(payload, { width: 256 });
        setQrDataUrl(url);
      } catch (e) {
        console.error("QR gen failed", e);
        setQrDataUrl("");
      }
    } catch (e) {
      console.error(e);
      alert("Impossible de générer le devis USDT. Réessayez.");
    } finally {
      setIsRequesting(false);
    }
  };

  const pollStatus = async () => {
    if (!quote) return;
    try {
      const res = await fetch(`/api/payment/status/${quote.quoteId}`);
      if (!res.ok) throw new Error("status failed");
      const data = await res.json();
      const mapped = { state: data.status as string, confirmations: data.confirmations as number | undefined, txHash: data.txHash as string | undefined };
      setStatus(mapped);
    } catch (e) {
      console.error(e);
      alert("Impossible de vérifier le statut. Réessayez.");
    }
  };

  const submitTx = async () => {
    if (!quote) return;
    if (!txHashInput.trim()) return alert("Entrez le hash de la transaction.");
    try {
      const res = await fetch('/api/payment/submit-tx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quoteId: quote.quoteId, txHash: txHashInput.trim() })
      });
      if (!res.ok) throw new Error('submit failed');
      const data = await res.json();
      setStatus({ state: data.status as string, txHash: data.txHash as string | undefined });
      alert('Transaction soumise. Vérification en cours.');
    } catch (e) {
      console.error(e);
      alert("Soumission du hash échouée. Vérifiez et réessayez.");
    }
  };

  // countdown timer for quote expiry
  useEffect(() => {
    if (!quote) return;
    const expiry = new Date(quote.expiresAt).getTime();
    const id = setInterval(() => {
      const remain = expiry - Date.now();
      setRemainingMs(remain);
      if (remain <= 0) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [quote]);

  // auto polling while quote active and not confirmed/expired
  useEffect(() => {
    if (!quote) return;
    if (status?.state === 'confirmed' || status?.state === 'expired') return;
    const id = setInterval(() => {
      pollStatus();
    }, 5000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quote, status?.state]);

  const copyToClipboard = async (text: string, field: "address" | "amount") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied({ field });
      setTimeout(() => setCopied({ field: null }), 1500);
    } catch (e) {
      console.error('copy failed', e);
      alert('Copie impossible, copiez manuellement.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="mb-8">Checkout</h1>

          {isEmpty ? (
            <Card className="p-12 text-center gradient-card">
              <h2 className="text-2xl font-semibold mb-2">Votre panier est vide</h2>
              <Link to="/">
                <Button variant="hero" size="lg">Retour à l'accueil</Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Card className="p-6 gradient-card">
                  <h3 className="font-semibold mb-4">Adresse & Contact</h3>
                  <p className="text-sm text-muted-foreground">(À implémenter) — formulaire adresse facturation/livraison</p>
                </Card>
                <Card className="p-6 gradient-card">
                  <h3 className="font-semibold mb-4">Paiement en USDT</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      {["TRC-20", "ERC-20", "BEP-20"].map(n => (
                        <button
                          key={n}
                          onClick={() => setNetwork(n)}
                          className={`p-3 rounded-lg border-2 transition-smooth ${network === n ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                    <Button onClick={requestQuote} disabled={isRequesting} variant="hero">
                      Générer le devis USDT
                    </Button>
                    {quote && (
                      <div className="mt-4 p-4 rounded-lg border">
                        <div className="font-semibold">Devis #{quote.quoteId}</div>
                        <div className="text-sm text-muted-foreground">Réseau: {quote.network}</div>
                        <div className="text-sm flex items-center gap-2">
                          <span>Montant: {quote.amountUSDT} USDT</span>
                          <Button variant="outline" size="sm" onClick={() => copyToClipboard(quote.amountUSDT, 'amount')}>
                            {copied.field === 'amount' ? 'Copié' : 'Copier'}
                          </Button>
                        </div>
                        <div className="text-sm break-all flex items-center gap-2">
                          <span>Adresse: {quote.address}</span>
                          <Button variant="outline" size="sm" onClick={() => copyToClipboard(quote.address, 'address')}>
                            {copied.field === 'address' ? 'Copié' : 'Copier'}
                          </Button>
                        </div>
                        {quote.memo && <div className="text-sm break-all">Mémo: {quote.memo}</div>}
                        <div className="flex gap-4 mt-3 items-start">
                          {qrDataUrl && <img src={qrDataUrl} alt="QR USDT" className="w-40 h-40" />}
                          <div className="text-xs text-muted-foreground">
                            <div>Expire: {new Date(quote.expiresAt).toLocaleString()}</div>
                            <div>Temps restant: {Math.max(0, Math.floor(remainingMs / 1000))}s</div>
                          </div>
                        </div>
                        <div className="mt-3 space-y-3">
                          <div className="flex items-center gap-3">
                            <Button variant="outline" onClick={pollStatus}>Rafraîchir statut</Button>
                            {status && (
                              <span className="text-sm">
                                Statut: {status.state}{status.confirmations !== undefined ? ` (${status.confirmations} conf)` : ""}
                                {status.txHash ? ` — ${status.txHash}` : ""}
                              </span>
                            )}
                          </div>
                          {status?.state !== 'confirmed' && (
                            <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
                              <div className="flex-1">
                                <label htmlFor="txhash" className="text-sm">Hash de transaction</label>
                                <input id="txhash" value={txHashInput} onChange={e => setTxHashInput(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2 bg-background" placeholder="Collez le tx hash ici" />
                              </div>
                              <Button onClick={submitTx}>Soumettre la transaction</Button>
                            </div>
                          )}
                        </div>
                        {status?.state === "confirmed" && (
                          <div className="mt-3">
                            <Button onClick={async () => {
                              const res = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ quoteId: quote.quoteId }) });
                              if (!res.ok) return alert('Création de commande échouée');
                              const order = await res.json();
                              alert(`Commande créée: ${order.orderId}`);
                            }}>
                              Finaliser la commande
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              <div>
                <Card className="p-6 gradient-card sticky top-24">
                  <h3 className="font-semibold mb-4">Récapitulatif</h3>
                  <div className="space-y-3 mb-6">
                    {items.map((item) => (
                      <div key={`${item.id}-${item.color}-${item.storage}`} className="flex justify-between text-sm">
                        <span>{item.name} × {item.qty}</span>
                        <span>{item.price * item.qty}€</span>
                      </div>
                    ))}
                    <div className="border-t border-border pt-3">
                      <div className="flex justify-between">
                        <span className="font-semibold">Total</span>
                        <span className="text-2xl font-bold">{eurTotal}€</span>
                      </div>
                    </div>
                  </div>
                  <Link to="/panier"><Button variant="outline" className="w-full">Retour au panier</Button></Link>
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

export default Checkout;


