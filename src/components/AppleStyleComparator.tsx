import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { products } from "@/data/products";
import { Link } from "react-router-dom";
import { Package, Clock, ArrowLeft } from "lucide-react";
import { LaunchOfferUtils } from "@/lib/launch-offer";

interface AppleStyleComparatorProps {
  products: typeof products;
}

export const AppleStyleComparator = ({ products: allProducts }: AppleStyleComparatorProps) => {
  const [selectedProducts, setSelectedProducts] = useState(allProducts.map(p => p.id));
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>({});
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
    { name: "Space Black", value: "black", class: "bg-gray-900" },
    { name: "Natural Titanium", value: "titanium", class: "bg-gray-300" },
    { name: "White Titanium", value: "white", class: "bg-gray-100" },
    { name: "Deep Blue", value: "blue", class: "bg-blue-900" },
    { name: "Cosmic Orange", value: "orange", class: "bg-orange-600" },
    { name: "Lavender", value: "lavender", class: "bg-purple-300" },
    { name: "Sage", value: "sage", class: "bg-green-400" }
  ];

  const features = [
    { category: "Display", label: "Screen Size", values: ["6.3″", "6.9″", "6.5″", "6.3″"]  },
    { category: "Display", label: "Camera System", values: ["Pro System", "Pro Max System", "Advanced System", "Standard System"] },
    { category: "Performance", label: "Chip", values: ["A18 Pro", "A18 Pro", "A18", "A18"] },
    { category: "Performance", label: "Storage", values: ["256GB, 512GB, 1TB", "256GB, 512GB, 1TB", "128GB, 256GB, 512GB", "128GB, 256GB"] },
    { category: "Camera", label: "Telephoto", values: ["Yes", "Yes", "Yes", "No"] },
    { category: "Camera", label: "LiDAR Scanner", values: ["Yes", "Yes", "No", "No"] },
    { category: "Design", label: "Material", values: ["Titanium", "Titanium", "Aluminum", "Aluminum"] },
    { category: "Battery", label: "Video Playback", values: ["25 hours", "29 hours", "22 hours", "20 hours"] }
  ];

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Compare iPhone models</h1>
              <div className="flex items-center gap-2 mt-1">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Shop
                </Button>
                <span className="text-gray-500">|</span>
                <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                  Get help choosing. Chat with a Specialist →
                </Button>
              </div>
            </div>
            
            {/* Product Selector */}
            <div className="flex gap-2">
              {allProducts.map(product => (
                <Button
                  key={product.id}
                  variant={selectedProducts.includes(product.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleProduct(product.id)}
                  className={`${
                    selectedProducts.includes(product.id) 
                      ? "bg-white text-black hover:bg-gray-100" 
                      : "border-gray-600 text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  {product.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Price Section */}
      <div className="bg-gray-950 py-8">
        <div className="container mx-auto px-4">
          <div className="grid gap-8" style={{ gridTemplateColumns: `120px repeat(${displayedProducts.length}, 1fr)` }}>
            <div></div>
            {displayedProducts.map((product, index) => (
              <div key={product.id} className="text-center">
                {isOfferActive ? (
                  <div>
                    <div className="text-3xl font-bold">€{product.launchPrice}</div>
                    <div className="text-sm text-gray-400 line-through">€{product.price}</div>
                    <Badge className="mt-2 bg-red-600">Save €{product.savings}</Badge>
                  </div>
                ) : (
                  <div className="text-3xl font-bold">€{product.price}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Color Selection */}
      <div className="py-6">
        <div className="container mx-auto px-4">
          <div className="grid gap-8" style={{ gridTemplateColumns: `120px repeat(${displayedProducts.length}, 1fr)` }}>
            <div className="flex items-center">
              <span className="text-sm text-gray-400">Finish</span>
            </div>
            {displayedProducts.map((product) => (
              <div key={product.id} className="flex flex-wrap gap-2">
                {colorOptions.slice(0, 4).map(color => (
                  <button
                    key={color.value}
                    onClick={() => setProductColor(product.id, color.value)}
                    className={`w-6 h-6 rounded-full border-2 ${
                      selectedColors[product.id] === color.value
                        ? "border-white"
                        : "border-gray-600"
                    } ${color.class}`}
                    title={color.name}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Comparison */}
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid gap-8" style={{ gridTemplateColumns: `200px repeat(${displayedProducts.length}, 1fr)` }}>
            
            {/* Product Headers */}
            <div></div>
            {displayedProducts.map((product) => (
              <div key={product.id} className="relative">
                <div className="text-center mb-8">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-40 mx-auto mb-4"
                  />
                  <h3 className="text-xl font-semibold">{product.name}</h3>
                  <Badge variant="secondary" className="mt-2 bg-green-600">
                    Available
                  </Badge>
                </div>
              </div>
            ))}

            {/* Features Rows */}
            {features.map((feature, featureIndex) => (
              <div key={featureIndex}>
                <div className={`flex items-center font-medium ${
                  feature.category === "Display" ? "text-blue-400" :
                  feature.category === "Performance" ? "text-purple-400" :
                  feature.category === "Camera" ? "text-green-400" :
                  feature.category === "Design" ? "text-pink-400" :
                  feature.category === "Battery" ? "text-yellow-400" : "text-white"
                }`}>
                  {feature.label}
                </div>
                {feature.values.map((value, valueIndex) => (
                  <div key={valueIndex} className="text-center py-3 border-b border-gray-800">
                    {displayedProducts[valueIndex] ? (
                      <Badge variant="outline" className="border-gray-600 text-gray-300">
                        {value}
                      </Badge>
                    ) : (
                      <span className="text-gray-600">—</span>
                    )}
                  </div>
                ))}
              </div>
            ))}

            {/* Buy Buttons */}
            <div></div>
            {displayedProducts.map((product) => (
              <div key={product.id} className="mt-8">
                <Link to={`/produit/${product.id}`}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 font-semibold">
                    Buy
                  </Button>
                </Link>
                <Button variant="ghost" className="w-full mt-2 text-blue-400 hover:text-blue-300">
                  Learn more →
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="py-12 bg-gray-950">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-semibold mb-4">Which iPhone 17 is right for you?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            All iPhone 17 models feature advanced performance, stunning displays, and exceptional camera systems. 
            Choose based on screen size, advanced features, and your budget.
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <Link to="/">
              <Button variant="outline" className="border-gray-600 text-gray-300">
                Shop iPhone
              </Button>
            </Link>
            <Button variant="outline" className="border-gray-600 text-gray-300">
              Chat with Specialist
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
