import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { products } from "@/data/products";
import { Link } from "react-router-dom";
import { Package, Clock, ArrowLeft } from "lucide-react";
import { LaunchOfferUtils } from "@/lib/launch-offer";
import { AppleiPhone } from "./AppleiPhone";

interface AppleStyleComparatorProps {
  products: typeof products;
}

export const AppleStyleComparator = ({ products: allProducts }: AppleStyleComparatorProps) => {
  const [selectedProducts, setSelectedProducts] = useState(allProducts.slice(0, 3).map(p => p.id));
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>({
    'iphone-17-pro': 'orange',
    'iphone-17-pro-max': 'blue', 
    'iphone-air': 'lavender'
  });
  const isOfferActive = LaunchOfferUtils.isOfferActive();

  const toggleProduct = (id: string) => {
    if (selectedProducts.includes(id)) {
      if (selectedProducts.length > 1) {
        setSelectedProducts(selectedProducts.filter(p => p !== id));
      }
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  const setProductColor = (productId: string, color: string) => {
    setSelectedColors(prev => ({
      ...prev,
      [productId]: color
    }));
  };

  const displayedProducts = allProducts.filter(p => selectedProducts.includes(p.id));

  const colorOptions = [
    { name: "Orange Cosmique", value: "orange", class: "bg-orange-600", french: "Orange Cosmique" },
    { name: "Bleu Profond", value: "blue", class: "bg-blue-900", french: "Bleu Profond" },
    { name: "Argent", value: "silver", class: "bg-gray-300", french: "Argent" },
    { name: "Blanc", value: "white", class: "bg-white border-gray-300", french: "Blanc" },
    { name: "Lavande", value: "lavender", class: "bg-purple-300", french: "Lavande" },
    { name: "Sauge", value: "sage", class: "bg-green-400", french: "Sauge" }
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header Apple-style */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold mb-2">Comparez les modèles iPhone</h1>
              <div className="flex items-center gap-4">
                <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
                  Magasiner iPhone →
                </Button>
                <span className="text-gray-400">|</span>
                <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
                  Obtenir de l'aide pour choisir. Discuter avec un Spécialiste →
                </Button>
              </div>
            </div>
            
            {/* Product Selector */}
            <div className="flex gap-2">
              {allProducts.slice(0, 4).map(product => (
                <Button
                  key={product.id}
                  variant={selectedProducts.includes(product.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleProduct(product.id)}
                  className={`rounded-full ${
                    selectedProducts.includes(product.id) 
                      ? "bg-black text-white hover:bg-gray-800" 
                      : "border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {product.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Colours Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid gap-8" style={{ gridTemplateColumns: `60px repeat(${displayedProducts.length}, 1fr) 60px` }}>
            {/* Space column */}
            <div></div>
            
            {/* Color headers */}
            {displayedProducts.map((product) => (
              <div key={product.id} className="text-center">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">Finition</div>
                <div className="flex justify-center gap-2">
                  {colorOptions.slice(0, 3).map(color => (
                    <button
                      key={color.value}
                      onClick={() => setProductColor(product.id, color.value)}
                      className={`w-6 h-6 rounded-full border-2 ${
                        selectedColors[product.id] === color.value
                          ? "border-blue-500"
                          : "border-gray-400"
                      } ${color.class}`}
                      title={color.french}
                    />
                  ))}
                </div>
              </div>
            ))}
            
            {/* Space column */}
            <div></div>
          </div>
        </div>
      </div>

      {/* Product Images */}
      <div className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid gap-8" style={{ gridTemplateColumns: `60px repeat(${displayedProducts.length}, 1fr) 60px` }}>
            <div></div>
            
            {displayedProducts.map((product, index) => (
              <div key={product.id} className="text-center">
                <div className="mb-8 h-48 flex items-center justify-center bg-gradient-to-b from-gray-50 to-white rounded-2xl">
                  {/* Apple-style iPhone images */}
                  <div className="flex items-center gap-4">
                    {/* Front view */}
                    <AppleiPhone 
                      model={product.name} 
                      color={selectedColors[product.id]} 
                      orientation="front"
                    />
                    {/* Back view */}
                    <AppleiPhone 
                      model={product.name} 
                      color={selectedColors[product.id]} 
                      orientation="back"
                    />
                  </div>
                </div>
                <Link to={`/produit/${product.id}`}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full mb-2">
                    Acheter
                  </Button>
                </Link>
                <Link to={`/produit/${product.id}`}>
                  <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
                    En savoir plus →
                  </Button>
                </Link>
              </div>
            ))}
            
            <div></div>
          </div>
        </div>
      </div>

      {/* Price Section */}
      <div className="py-8 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid gap-8" style={{ gridTemplateColumns: `60px repeat(${displayedProducts.length}, 1fr) 60px` }}>
            <div></div>
            
            {displayedProducts.map((product) => (
              <div key={product.id} className="text-center">
                {isOfferActive && product.launchPrice ? (
                  <div>
                    <div className="text-2xl font-semibold">À partir de {product.launchPrice}€</div>
                    <div className="text-lg text-gray-500 line-through">ou {product.price}€</div>
                    <Badge className="mt-2 bg-red-600 text-white">Nouveau</Badge>
                  </div>
                ) : (
                  <div className="text-2xl font-semibold">À partir de {product.price}€</div>
                )}
              </div>
            ))}
            
            <div></div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-left mb-8">
            <h2 className="text-2xl font-semibold">Résumé</h2>
          </div>
          
          <div className="space-y-8">
            {/* Display Section */}
            <div>
              <div className="text-lg font-medium mb-4 text-blue-600">Display: Taille d'écran</div>
              <div className="grid gap-8" style={{ gridTemplateColumns: `60px repeat(${displayedProducts.length}, 1fr) 60px` }}>
                <div></div>
                {displayedProducts.map((product) => (
                  <div key={product.id} className="text-center">
                    <div className="text-4xl font-bold mb-1">
                      {product.name.includes('Pro Max') ? '6.9"' : 
                       product.name.includes('Pro') ? '6.3"' : 
                       product.name.includes('Air') ? '6.5"' : '6.3"'}
                    </div>
                    <div className="text-sm text-gray-600">Display Super Retina XDR¹</div>
                    <div className="text-sm text-gray-600">Technologie ProMotion</div>
                  </div>
                ))}
                <div></div>
              </div>
            </div>

            {/* Camera Section */}
            <div>
              <div className="text-lg font-medium mb-4 text-green-600">Appareil photo</div>
              <div className="grid gap-8" style={{ gridTemplateColumns: `60px repeat(${displayedProducts.length}, 1fr) 60px` }}>
                <div></div>
                {displayedProducts.map((product) => (
                  <div key={product.id} className="text-center">
                    <div className="text-lg font-semibold">
                      {product.name.includes('Pro') ? 'Système Pro' : 'Triple caméra'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {product.name.includes('Pro') ? 'Photo et Vidéo Pro' : 'Photo et Vidéo avancées'}
                    </div>
                  </div>
                ))}
                <div></div>
              </div>
            </div>

            {/* Performance Section */}
            <div>
              <div className="text-lg font-medium mb-4 text-purple-600">Performance</div>
              <div className="grid gap-8" style={{ gridTemplateColumns: `60px repeat(${displayedProducts.length}, 1fr) 60px` }}>
                <div></div>
                {displayedProducts.map((product) => (
                  <div key={product.id} className="text-center">
                    <div className="text-lg font-semibold">
                      {product.name.includes('Pro') ? 'A18 Pro' : 'A18'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {product.name.includes('Pro') ? 'iPhone Intelligence' : 'iPhone Intelligence'}
                    </div>
                  </div>
                ))}
                <div></div>
              </div>
            </div>

            {/* Connectivity Section */}
            <div>
              <div className="text-lg font-medium mb-4 text-yellow-600">Connectivité</div>
              <div className="grid gap-8" style={{ gridTemplateColumns: `60px repeat(${displayedProducts.length}, 1fr) 60px` }}>
                <div></div>
                {displayedProducts.map((product) => (
                  <div key={product.id} className="text-center">
                    <div className="text-lg font-semibold">5G (sous-6 et mmWave)</div>
                    <div className="text-sm text-gray-600">Connectivité complète</div>
                  </div>
                ))}
                <div></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Apple-style */}
      <div className="bg-gray-50 py-12 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-semibold mb-4">Quel iPhone 17 vous convient ?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Tous les modèles iPhone 17 offrent des performances avancées, des écrans époustouflants et des systèmes photo exceptionnels. 
            Choisissez selon la taille d'écran, les fonctionnalités avancées et votre budget.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/">
              <Button className="bg-blue-600 text-white rounded-full px-6">
                Magasiner iPhone
              </Button>
            </Link>
            <Button variant="outline" className="border-gray-300 rounded-full px-6">
              Discuter avec un Spécialiste
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};