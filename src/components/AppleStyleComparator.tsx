import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { products } from "@/data/products";
import { Link } from "react-router-dom";
import { LaunchOfferUtils } from "@/lib/launch-offer";

interface AppleStyleComparatorProps {
  products: typeof products;
}

export const AppleStyleComparator = ({ products: allProducts }: AppleStyleComparatorProps) => {
  const [selectedProducts, setSelectedProducts] = useState(allProducts.slice(0, 3).map(p => p.id));
  const isOfferActive = LaunchOfferUtils.isOfferActive();

  // Mapping des images réelles
  const productImages: Record<string, string> = {
    'iphone-17-pro': '/1.png',
    'iphone-17-pro-max': '/1.png',
    'iphone-air': '/2.png',
    'iphone-17': '/3.png'
  };

  const toggleProduct = (id: string) => {
    if (selectedProducts.includes(id)) {
      if (selectedProducts.length > 1) {
        setSelectedProducts(selectedProducts.filter(p => p !== id));
      }
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  const displayedProducts = allProducts.filter(p => selectedProducts.includes(p.id));

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header Apple-style */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-semibold mb-4">Comparez les modèles iPhone</h1>
            <div className="flex flex-col items-center gap-2">
              <Link to="/">
                <Button variant="ghost" className="text-blue-600 hover:text-blue-700 text-base">
                  Magasiner iPhone →
                </Button>
              </Link>
              <p className="text-gray-600">
                Obtenir de l'aide pour choisir.{" "}
                <Link to="/support" className="text-blue-600 hover:text-blue-700">
                  Discuter avec un Spécialiste →
                </Link>
              </p>
            </div>
          </div>

          {/* Product Dropdowns */}
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${displayedProducts.length}, 1fr)` }}>
            {displayedProducts.map(product => (
              <div key={product.id} className="relative">
                <select 
                  className="w-full px-4 py-3 text-lg font-medium border border-gray-300 rounded-xl bg-white appearance-none cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={product.id}
                  onChange={(e) => {
                    const newProducts = [...selectedProducts];
                    const index = newProducts.indexOf(product.id);
                    if (index > -1) {
                      newProducts[index] = e.target.value;
                      setSelectedProducts(newProducts);
                    }
                  }}
                >
                  {allProducts.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-blue-600">
                  <svg width="12" height="7" viewBox="0 0 12 7" fill="currentColor">
                    <path d="M6 7L0 0h12L6 7z"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* Product Images */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid gap-12" style={{ gridTemplateColumns: `repeat(${displayedProducts.length}, 1fr)` }}>
            {displayedProducts.map((product) => (
              <div key={product.id} className="text-center">
                {/* Image principale */}
                <div className="mb-8 flex items-center justify-center h-[500px] bg-white">
                  <img 
                    src={productImages[product.id] || product.image}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Boutons */}
                <Link to={`/produit/${product.id}`}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full mb-3 py-3 text-base font-medium">
                    Acheter
                  </Button>
                </Link>
                <Link to={`/produit/${product.id}`}>
                  <Button variant="ghost" className="text-blue-600 hover:text-blue-700 text-base">
                    En savoir plus →
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Price Section */}
      <div className="py-8 border-t border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid gap-12" style={{ gridTemplateColumns: `repeat(${displayedProducts.length}, 1fr)` }}>
            {displayedProducts.map((product) => (
              <div key={product.id} className="text-center">
                {isOfferActive && product.launchPrice ? (
                  <div>
                    <div className="text-3xl font-semibold mb-1">À partir de {product.launchPrice}€</div>
                    <div className="text-base text-gray-500 line-through mb-2">ou {product.price}€</div>
                    <Badge className="bg-orange-600 text-white rounded-full px-3 py-1 text-xs font-medium">Nouveau</Badge>
                  </div>
                ) : (
                  <div className="text-3xl font-semibold">À partir de {product.price}€</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 border-t border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-2xl font-semibold">Résumé</h2>
          </div>
          
          <div className="space-y-12">
            {/* Display Section */}
            <div className="border-t border-gray-200 pt-8">
              <div className="grid gap-12" style={{ gridTemplateColumns: `repeat(${displayedProducts.length}, 1fr)` }}>
                {displayedProducts.map((product) => (
                  <div key={product.id}>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Écran</div>
                    <div className="text-2xl font-semibold mb-2">
                      {product.name.includes('Pro Max') ? '6.9"' : 
                       product.name.includes('Pro') ? '6.3"' : 
                       product.name.includes('Air') ? '6.5"' : '6.3"'}
                    </div>
                    <div className="text-sm text-gray-600">Super Retina XDR</div>
                    <div className="text-sm text-gray-600">ProMotion 120Hz</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Camera Section */}
            <div className="border-t border-gray-200 pt-8">
              <div className="grid gap-12" style={{ gridTemplateColumns: `repeat(${displayedProducts.length}, 1fr)` }}>
                {displayedProducts.map((product) => (
                  <div key={product.id}>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Appareil photo</div>
                    <div className="text-base font-semibold mb-2">
                      {product.name.includes('Pro') ? 'Système Pro' : 'Triple caméra avancée'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {product.name.includes('Pro') ? '48MP Principal + Ultra grand-angle + Téléobjectif' : '48MP Principal + Ultra grand-angle'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Section */}
            <div className="border-t border-gray-200 pt-8">
              <div className="grid gap-12" style={{ gridTemplateColumns: `repeat(${displayedProducts.length}, 1fr)` }}>
                {displayedProducts.map((product) => (
                  <div key={product.id}>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Puce</div>
                    <div className="text-base font-semibold mb-2">
                      {product.name.includes('Pro') ? 'A18 Pro' : 'A18'}
                    </div>
                    <div className="text-sm text-gray-600">Apple Intelligence</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Battery Section */}
            <div className="border-t border-gray-200 pt-8">
              <div className="grid gap-12" style={{ gridTemplateColumns: `repeat(${displayedProducts.length}, 1fr)` }}>
                {displayedProducts.map((product) => (
                  <div key={product.id}>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Autonomie</div>
                    <div className="text-base font-semibold mb-2">
                      {product.name.includes('Pro Max') ? 'Jusqu\'à 33h' : 
                       product.name.includes('Pro') ? 'Jusqu\'à 27h' : 
                       product.name.includes('Air') ? 'Jusqu\'à 25h' : 'Jusqu\'à 22h'}
                    </div>
                    <div className="text-sm text-gray-600">Lecture vidéo</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Apple-style */}
      <div className="bg-gray-50 py-16 border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold mb-4">Quel iPhone vous convient le mieux ?</h2>
          <p className="text-base text-gray-600 mb-8 leading-relaxed">
            Tous les modèles iPhone 17 offrent des performances avancées, des écrans époustouflants et des systèmes photo exceptionnels. 
            Choisissez selon la taille d'écran, les fonctionnalités avancées et votre budget.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-3 text-base font-medium">
                Magasiner iPhone
              </Button>
            </Link>
            <Link to="/support">
              <Button variant="outline" className="border-gray-300 hover:bg-gray-100 rounded-full px-8 py-3 text-base font-medium">
                Discuter avec un Spécialiste
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};