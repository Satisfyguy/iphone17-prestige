// Remove all direct image imports as they are now in the public directory
// import iphone17AirWhite from "/src/assets/iphone-17-air-white.jpg";
// import iphone17Blue from "/src/assets/iphone-17-blue.jpg";
// import iphone17ProBlue from "/src/assets/iphone-17-pro-blue.png";
// import iphone17ProBlueWebp from "/src/assets/iphone-17-pro-blue.webp";
// import iphone17ProMaxTitanium from "/src/assets/iphone-17-pro-max-titanium.jpg";
// import iphone17ProOrange from "/src/assets/iphone-17-pro-orange.png";
// import iphone17ProOrangeWebp from "/src/assets/iphone-17-pro-orange.webp";
// import iphone17ProSilver from "/src/assets/iphone-17-pro-silver.png";
// import iphone17ProSilverWebp from "/src/assets/iphone-17-pro-silver.webp";
// import iphone17ProTitanium from "/src/assets/iphone-17-pro-titanium.jpg";

// // iPhone 17 specific color images
// import iphone17Brume from "/src/assets/iphone-17-brume.webp";
// import iphone17Lavander from "/src/assets/iphone-17-lavender.webp";
// import iphone17Black from "/src/assets/iphone-17-black.webp";
// import iphone17White from "/src/assets/iphone-17-white.webp";
// import iphone17Sauge from "/src/assets/iphone-17-sauge.webp";
// import iphone17Colors from "/src/assets/iphone-17-colors.webp";

// // iPhone Air specific color images
// import iphoneAirBlancNuage from "/src/assets/iphone-air-Blanc-nuage.webp";
// import iphoneAirBleuCiel from "/src/assets/iphone-air-bleu-ciel.webp";
// import iphoneAirColors from "/src/assets/iphone-air-colors.webp";
// import iphoneAirNoirSideral from "/src/assets/iphone-air-Noir-sidéral.webp";
// import iphoneAirOrClair from "/src/assets/iphone-air-Or-Clair.webp";

export interface Product {
  id: string;
  name: string;
  fullName: string;
  price: number; // Prix après lancement (prix de référence)
  launchPrice: number; // Prix de lancement (-20%)
  savings: number; // Économies réalisées
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
    price: 969, // Prix après lancement
    launchPrice: 775, // Prix de lancement (-20%)
    savings: 194, // Économies
    image: "/iphone-17-colors.webp", // Updated to use the public directory path
    features: [
      "Puce A18 nouvelle génération",
      "Double appareil photo 48MP",
      "Écran Super Retina XDR 6.27\""
    ],
    description: "L'iPhone 17 repousse les limites de la performance avec la nouvelle puce A18, un système photo avancé et un design élégant disponible en cinq magnifiques coloris.",
    specs: {
      screen: "6.27\" Super Retina XDR",
      chip: "Puce A18",
      camera: "Double 48MP",
      battery: "Jusqu'à 22h de lecture vidéo"
    },
    colors: [
      { name: "Brume", hex: "#A7B1BF", image: "/iphone-17-brume.webp" },
      { name: "Lavande", hex: "#D0B8E9", image: "/iphone-17-lavender.webp" },
      { name: "Noir", hex: "#2B2B2B", image: "/iphone-17-black.webp" },
      { name: "Blanc", hex: "#F0F0F0", image: "/iphone-17-white.webp" },
      { name: "Sauge", hex: "#A0D468", image: "/iphone-17-sauge.webp" }
    ],
    storage: [
      { size: "256 Go", price: 0 },
      { size: "512 Go", price: 250 }
    ]
  },
  {
    id: "iphone-17-air",
    name: "iPhone Air",
    fullName: "iPhone Air",
    price: 1229, // Prix après lancement
    launchPrice: 983, // Prix de lancement (-20%)
    savings: 246, // Économies
    image: "/iphone-air-colors.webp", // Updated image for iPhone Air from public directory
    features: [
      "Design ultra-fin 5.5mm",
      "Léger et élégant",
      "Puce A18 efficace"
    ],
    description: "Le plus fin des iPhone jamais conçu. L'iPhone Air combine légèreté exceptionnelle et performances puissantes dans un design révolutionnaire de seulement 5.5mm d'épaisseur.",
    specs: {
      screen: "6.1\" Super Retina XDR",
      chip: "Puce A18",
      camera: "Double 48MP",
      battery: "Jusqu'à 20h de lecture vidéo"
    },
    colors: [
      { name: "Bleu ciel", hex: "#B0D9E7", image: "/iphone-air-bleu-ciel.webp" },
      { name: "Blanc nuage", hex: "#E0E0E0", image: "/iphone-air-Blanc-nuage.webp" },
      { name: "Or clair", hex: "#F0E6D2", image: "/iphone-air-Or-Clair.webp" },
      { name: "Noir sidéral", hex: "#303030", image: "/iphone-air-Noir-sidéral.webp" }
    ],
    storage: [
      { size: "256 Go", price: 0 },
      { size: "512 Go", price: 250 },
      { size: "1 To", price: 500 }
    ]
  },
  {
    id: "iphone-17-pro",
    name: "iPhone 17 Pro",
    fullName: "iPhone 17 Pro",
    price: 1329, // Prix après lancement
    launchPrice: 1063, // Prix de lancement (-20%)
    savings: 266, // Économies
    image: "/iphone-17-pro-orange.webp", // Updated image path
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
      { name: "Argent", hex: "#E5E5EA", image: "/iphone-17-pro-silver.webp" },
      { name: "Orange cosmique", hex: "#E67E50", image: "/iphone-17-pro-orange.webp" },
      { name: "Bleu intense", hex: "#3B4B6B", image: "/iphone-17-pro-blue.webp" }
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
    price: 1479, // Prix après lancement
    launchPrice: 1183, // Prix de lancement (-20%)
    savings: 296, // Économies
    image: "/iphone-17-pro-orange.webp", // Updated image path
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
      { name: "Argent", hex: "#E5E5EA", image: "/iphone-17-pro-silver.webp" },
      { name: "Orange cosmique", hex: "#E67E50", image: "/iphone-17-pro-orange.webp" },
      { name: "Bleu intense", hex: "#3B4B6B", image: "/iphone-17-pro-blue.webp" }
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
