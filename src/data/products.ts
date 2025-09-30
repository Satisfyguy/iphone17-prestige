export interface Product {
  id: string;
  name: string;
  fullName: string;
  price: number;
  image: string;
  features: string[];
  description: string;
  specs: {
    screen: string;
    chip: string;
    camera: string;
    battery: string;
  };
  colors: Array<{
    name: string;
    hex: string;
    image: string;
  }>;
  storage: Array<{
    size: string;
    price: number;
  }>;
}

export const products: Product[] = [
  {
    id: "iphone-17",
    name: "iPhone 17",
    fullName: "iPhone 17",
    price: 899,
    image: "/src/assets/iphone-17-blue.jpg",
    features: [
      "Puce A18 nouvelle génération",
      "Double appareil photo 48MP",
      "Écran Super Retina XDR 6.1\""
    ],
    description: "L'iPhone 17 repousse les limites de la performance avec la nouvelle puce A18, un système photo avancé et un design élégant disponible en cinq magnifiques coloris.",
    specs: {
      screen: "6.1\" Super Retina XDR",
      chip: "Puce A18",
      camera: "Double 48MP",
      battery: "Jusqu'à 22h de lecture vidéo"
    },
    colors: [
      { name: "Bleu", hex: "#4A90E2", image: "/src/assets/iphone-17-blue.jpg" },
      { name: "Rose", hex: "#FFB6C1", image: "/src/assets/iphone-17-blue.jpg" },
      { name: "Jaune", hex: "#FFD700", image: "/src/assets/iphone-17-blue.jpg" },
      { name: "Noir", hex: "#1D1D1F", image: "/src/assets/iphone-17-blue.jpg" },
      { name: "Blanc", hex: "#F5F5F7", image: "/src/assets/iphone-17-blue.jpg" }
    ],
    storage: [
      { size: "128 GB", price: 0 },
      { size: "256 GB", price: 100 },
      { size: "512 GB", price: 300 }
    ]
  },
  {
    id: "iphone-17-air",
    name: "iPhone 17 Air",
    fullName: "iPhone 17 Air",
    price: 799,
    image: "/src/assets/iphone-17-air-white.jpg",
    features: [
      "Design ultra-fin 5.5mm",
      "Léger et élégant",
      "Puce A18 efficace"
    ],
    description: "Le plus fin des iPhone jamais conçu. L'iPhone 17 Air combine légèreté exceptionnelle et performances puissantes dans un design révolutionnaire de seulement 5.5mm d'épaisseur.",
    specs: {
      screen: "6.1\" Super Retina XDR",
      chip: "Puce A18",
      camera: "Double 48MP",
      battery: "Jusqu'à 20h de lecture vidéo"
    },
    colors: [
      { name: "Bleu", hex: "#4A90E2", image: "/src/assets/iphone-17-air-white.jpg" },
      { name: "Rose", hex: "#FFB6C1", image: "/src/assets/iphone-17-air-white.jpg" },
      { name: "Blanc", hex: "#F5F5F7", image: "/src/assets/iphone-17-air-white.jpg" },
      { name: "Noir", hex: "#1D1D1F", image: "/src/assets/iphone-17-air-white.jpg" }
    ],
    storage: [
      { size: "128 GB", price: 0 },
      { size: "256 GB", price: 100 },
      { size: "512 GB", price: 300 }
    ]
  },
  {
    id: "iphone-17-pro",
    name: "iPhone 17 Pro",
    fullName: "iPhone 17 Pro",
    price: 1329,
    image: "/src/assets/iphone-17-pro-orange.webp",
    features: [
      "Puce A18 Pro",
      "Système caméra Pro Fusion",
      "Écran ProMotion 120Hz de 6,3 pouces"
    ],
    description: "Conçu pour les professionnels et les créateurs. L'iPhone 17 Pro offre des performances inégalées avec la puce A18 Pro, un système photo révolutionnaire et un écran ProMotion fluide.",
    specs: {
      screen: "6,3\" Super Retina XDR ProMotion 120Hz",
      chip: "Puce A18 Pro",
      camera: "Système caméra Pro Fusion",
      battery: "Autonomie exceptionnelle"
    },
    colors: [
      { name: "Argent", hex: "#E5E5EA", image: "/src/assets/iphone-17-pro-silver.webp" },
      { name: "Orange cosmique", hex: "#E67E50", image: "/src/assets/iphone-17-pro-orange.webp" },
      { name: "Bleu intense", hex: "#3B4B6B", image: "/src/assets/iphone-17-pro-blue.webp" }
    ],
    storage: [
      { size: "256 GB", price: 0 },
      { size: "512 GB", price: 250 },
      { size: "1 TB", price: 500 }
    ]
  },
  {
    id: "iphone-17-pro-max",
    name: "iPhone 17 Pro Max",
    fullName: "iPhone 17 Pro Max",
    price: 1479,
    image: "/src/assets/iphone-17-pro-orange.webp",
    features: [
      "Écran 6,9\" ProMotion",
      "Autonomie exceptionnelle",
      "Système caméra Pro Fusion avancé"
    ],
    description: "Le summum de l'innovation iPhone. Avec son immense écran 6,9\", son autonomie record et son système photo professionnel, l'iPhone 17 Pro Max est le smartphone le plus avancé jamais créé.",
    specs: {
      screen: "6,9\" Super Retina XDR ProMotion 120Hz",
      chip: "Puce A18 Pro",
      camera: "Système caméra Pro Fusion avec téléobjectif 5x",
      battery: "Autonomie record"
    },
    colors: [
      { name: "Argent", hex: "#E5E5EA", image: "/src/assets/iphone-17-pro-silver.webp" },
      { name: "Orange cosmique", hex: "#E67E50", image: "/src/assets/iphone-17-pro-orange.webp" },
      { name: "Bleu intense", hex: "#3B4B6B", image: "/src/assets/iphone-17-pro-blue.webp" }
    ],
    storage: [
      { size: "256 GB", price: 0 },
      { size: "512 GB", price: 250 },
      { size: "1 TB", price: 500 },
      { size: "2 TB", price: 1000 }
    ]
  }
];

export const getProductById = (id: string) => {
  return products.find(product => product.id === id);
};
