import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useMemo, useState } from "react";
import * as QRCode from "qrcode";
import { supabase } from "@/integrations/supabase/client";

const Checkout = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
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
  const [totalMs, setTotalMs] = useState<number>(0);
  const [txHashInput, setTxHashInput] = useState<string>("");
  const [copied, setCopied] = useState<{ field: "address" | "amount" | null }>({ field: null });
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    postalCode: "",
    country: "France",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const isEmpty = items.length === 0;
  const eurTotal = useMemo(() => total, [total]);

  const requestQuote = async () => {
    if (!session) {
      return navigate('/login');
    }
    setIsRequesting(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-payment-quote', {
        body: {
          currency: "EUR",
          amount: eurTotal,
          network,
          cart: items.map(i => ({ id: i.id, color: i.color, storage: i.storage, qty: i.qty, price: i.price })),
        },
      });
      if (error) throw error;
      if (!data) throw new Error("Quote failed");
      setQuote(data);
      // compute total duration for progress
      const ttl = new Date(data.expiresAt).getTime() - Date.now();
      setTotalMs(ttl > 0 ? ttl : 0);
      setStatus(null);
      try {
        const payload = (() => {
          if (data.network === 'TRC-20') return `tron:${data.address}?amount=${data.amountUSDT}`;
          if (data.network === 'ERC-20') return `${data.address}`; // EIP-681 token transfer is complex; keep simple
          if (data.network === 'BEP-20') return `${data.address}`;
          return `${data.address}`;
        })();
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
      const { data, error } = await supabase.functions.invoke(`check-payment-status/${quote.quoteId}`);
      if (error) throw error;
      if (!data) throw new Error("status failed");
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
      const { data, error } = await supabase.functions.invoke('submit-transaction', {
        body: { quoteId: quote.quoteId, txHash: txHashInput.trim() }
      });
      if (error) throw error;
      if (!data) throw new Error('submit failed');
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

  const downloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `usdt-${quote?.network?.toLowerCase() || 'qr'}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // simple validation
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!form.firstName.trim()) errors.firstName = 'Prénom requis';
    if (!form.lastName.trim()) errors.lastName = 'Nom requis';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Email invalide';
    if (!form.phone.trim()) errors.phone = 'Téléphone requis';
    if (!form.address1.trim()) errors.address1 = 'Adresse requise';
    if (!form.city.trim()) errors.city = 'Ville requise';
    if (!form.postalCode.trim()) errors.postalCode = 'Code postal requis';
    if (!form.country.trim()) errors.country = 'Pays requis';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // persist to localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('checkout_form');
      if (saved) setForm(JSON.parse(saved));
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    try { localStorage.setItem('checkout_form', JSON.stringify(form)); } catch {}
  }, [form]);

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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm" htmlFor="firstName">Prénom</label>
                      <input id="firstName" value={form.firstName} onChange={e=>setForm({...form, firstName: e.target.value})} className={`mt-1 w-full rounded-md border px-3 py-2 bg-background ${formErrors.firstName? 'border-destructive': ''}`} />
                      {formErrors.firstName && <div className="text-xs text-destructive mt-1">{formErrors.firstName}</div>}
                    </div>
                    <div>
                      <label className="text-sm" htmlFor="lastName">Nom</label>
                      <input id="lastName" value={form.lastName} onChange={e=>setForm({...form, lastName: e.target.value})} className={`mt-1 w-full rounded-md border px-3 py-2 bg-background ${formErrors.lastName? 'border-destructive': ''}`} />
                      {formErrors.lastName && <div className="text-xs text-destructive mt-1">{formErrors.lastName}</div>}
                    </div>
                    <div>
                      <label className="text-sm" htmlFor="email">Email</label>
                      <input id="email" type="email" value={form.email} onChange={e=>setForm({...form, email: e.target.value})} className={`mt-1 w-full rounded-md border px-3 py-2 bg-background ${formErrors.email? 'border-destructive': ''}`} />
                      {formErrors.email && <div className="text-xs text-destructive mt-1">{formErrors.email}</div>}
                    </div>
                    <div>
                      <label className="text-sm" htmlFor="phone">Téléphone</label>
                      <input id="phone" value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})} className={`mt-1 w-full rounded-md border px-3 py-2 bg-background ${formErrors.phone? 'border-destructive': ''}`} />
                      {formErrors.phone && <div className="text-xs text-destructive mt-1">{formErrors.phone}</div>}
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm" htmlFor="address1">Adresse</label>
                      <input id="address1" value={form.address1} onChange={e=>setForm({...form, address1: e.target.value})} className={`mt-1 w-full rounded-md border px-3 py-2 bg-background ${formErrors.address1? 'border-destructive': ''}`} />
                      {formErrors.address1 && <div className="text-xs text-destructive mt-1">{formErrors.address1}</div>}
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm" htmlFor="address2">Complément (optionnel)</label>
                      <input id="address2" value={form.address2} onChange={e=>setForm({...form, address2: e.target.value})} className="mt-1 w-full rounded-md border px-3 py-2 bg-background" />
                    </div>
                    <div>
                      <label className="text-sm" htmlFor="city">Ville</label>
                      <input id="city" value={form.city} onChange={e=>setForm({...form, city: e.target.value})} className={`mt-1 w-full rounded-md border px-3 py-2 bg-background ${formErrors.city? 'border-destructive': ''}`} />
                      {formErrors.city && <div className="text-xs text-destructive mt-1">{formErrors.city}</div>}
                    </div>
                    <div>
                      <label className="text-sm" htmlFor="postalCode">Code postal</label>
                      <input id="postalCode" value={form.postalCode} onChange={e=>setForm({...form, postalCode: e.target.value})} className={`mt-1 w-full rounded-md border px-3 py-2 bg-background ${formErrors.postalCode? 'border-destructive': ''}`} />
                      {formErrors.postalCode && <div className="text-xs text-destructive mt-1">{formErrors.postalCode}</div>}
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm" htmlFor="country">Pays</label>
                      <input id="country" value={form.country} onChange={e=>setForm({...form, country: e.target.value})} className={`mt-1 w-full rounded-md border px-3 py-2 bg-background ${formErrors.country? 'border-destructive': ''}`} />
                      {formErrors.country && <div className="text-xs text-destructive mt-1">{formErrors.country}</div>}
                    </div>
                  </div>
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
                          {qrDataUrl && (
                            <div className="flex flex-col items-center gap-2">
                              <img src={qrDataUrl} alt="QR USDT" className="w-40 h-40" />
                              <Button size="sm" variant="outline" onClick={downloadQr}>Télécharger le QR</Button>
                            </div>
                          )}
                          <div className="flex-1 text-xs text-muted-foreground">
                            <div>Expire: {new Date(quote.expiresAt).toLocaleString()}</div>
                            <div>Temps restant: {Math.max(0, Math.floor(remainingMs / 1000))}s</div>
                            <div className="mt-2 h-2 w-full rounded bg-muted overflow-hidden">
                              <div
                                className="h-2 bg-primary transition-all"
                                style={{ width: `${Math.max(0, Math.min(100, totalMs ? ((totalMs - Math.max(0, remainingMs)) / totalMs) * 100 : 0))}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        {remainingMs <= 0 && (
                          <div className="mt-3">
                            <Button variant="hero" onClick={requestQuote}>Régénérer le devis</Button>
                          </div>
                        )}
                        <div className="mt-3 space-y-3">
                          <div className="flex items-center gap-3">
                            <Button variant="outline" onClick={pollStatus}>Rafraîchir statut</Button>
                            {status && (
                              <span className="text-sm">
                                <span className={`px-2 py-0.5 rounded border ${status.state === 'confirmed' ? 'text-green-600 border-green-600' : status.state === 'submitted' ? 'text-amber-600 border-amber-600' : status.state === 'expired' ? 'text-red-600 border-red-600' : 'text-muted-foreground border-muted-foreground'}`}>
                                  {status.state}
                                </span>
                                {status.confirmations !== undefined ? ` (${status.confirmations} conf)` : ""}
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
                              if (!validateForm()) {
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                return;
                              }
                              const { data: order, error: orderError } = await supabase.functions.invoke('create-order', { 
                                body: { quoteId: quote.quoteId } 
                              });
                              if (orderError || !order) return alert('Création de commande échouée');
                              const params = new URLSearchParams({ orderId: order.orderId, txHash: status?.txHash || '', network: quote.network });
                              window.location.href = `/success?${params.toString()}`;
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


