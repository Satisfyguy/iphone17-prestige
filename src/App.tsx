import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Comparateur from "./pages/Comparateur";
import Panier from "./pages/Panier";
import Accessoires from "./pages/Accessoires";
import Support from "./pages/Support";
import APropos from "./pages/APropos";
import NotFound from "./pages/NotFound";
import { CartProvider } from "@/hooks/useCart";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/produit/:id" element={<Product />} />
            <Route path="/comparateur" element={<Comparateur />} />
            <Route path="/panier" element={<Panier />} />
            <Route path="/accessoires" element={<Accessoires />} />
            <Route path="/support" element={<Support />} />
            <Route path="/a-propos" element={<APropos />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
