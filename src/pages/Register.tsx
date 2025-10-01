import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const navigate = useNavigate();
  const { signUp, user } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await signUp(email, password, firstName, lastName);
      if (error) throw error;
      toast({
        title: "Inscription réussie",
        description: "Vérifiez votre email pour confirmer votre compte"
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Erreur d'inscription",
        description: error.message || "Veuillez réessayer",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-md">
          <Card className="p-6">
            <h1 className="text-xl font-semibold mb-4">Créer un compte</h1>
            <form onSubmit={onSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm">Prénom</label>
                  <input className="mt-1 w-full rounded-md border px-3 py-2 bg-background" value={firstName} onChange={e=>setFirstName(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm">Nom</label>
                  <input className="mt-1 w-full rounded-md border px-3 py-2 bg-background" value={lastName} onChange={e=>setLastName(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="text-sm">Email</label>
                <input className="mt-1 w-full rounded-md border px-3 py-2 bg-background" value={email} onChange={e=>setEmail(e.target.value)} />
              </div>
              <div>
                <label className="text-sm">Mot de passe</label>
                <input type="password" className="mt-1 w-full rounded-md border px-3 py-2 bg-background" value={password} onChange={e=>setPassword(e.target.value)} />
              </div>
              <Button type="submit" disabled={loading}>{loading? "...": "Créer le compte"}</Button>
              <div className="text-sm">Déjà un compte ? <Link to="/login" className="underline">Se connecter</Link></div>
            </form>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;


