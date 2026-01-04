export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  gender: "women" | "men" | "unisex";
  isNew?: boolean;
  isBestseller?: boolean;
  collection?: string;
  description?: string;
  notes?: {
    top: string[];
    heart: string[];
    base: string[];
  };
}

export const products: Product[] = [
  {
    id: "1",
    name: "Midnight Rose",
    brand: "Vernont",
    price: 245,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80",
    category: "Eau de Parfum",
    gender: "women",
    isNew: true,
    collection: "Signature",
    description: "A captivating floral fragrance with deep rose and mysterious oud undertones.",
    notes: {
      top: ["Bulgarian Rose", "Pink Pepper"],
      heart: ["Turkish Rose Absolute", "Saffron"],
      base: ["Oud", "Musk", "Amber"],
    },
  },
  {
    id: "2",
    name: "Golden Amber",
    brand: "Vernont",
    price: 320,
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80",
    category: "Parfum",
    gender: "unisex",
    isBestseller: true,
    collection: "Heritage",
    description: "A warm, enveloping scent that wraps you in luxury.",
    notes: {
      top: ["Bergamot", "Cardamom"],
      heart: ["Amber", "Labdanum"],
      base: ["Vanilla", "Sandalwood", "Benzoin"],
    },
  },
  {
    id: "3",
    name: "Velvet Oud",
    brand: "Vernont",
    price: 395,
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80",
    category: "Eau de Parfum",
    gender: "unisex",
    collection: "Signature",
    description: "An opulent oriental fragrance with the finest oud.",
    notes: {
      top: ["Saffron", "Rose"],
      heart: ["Oud", "Incense"],
      base: ["Sandalwood", "Musk"],
    },
  },
  {
    id: "4",
    name: "Jasmine Dreams",
    brand: "Vernont",
    price: 275,
    originalPrice: 340,
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&q=80",
    category: "Eau de Toilette",
    gender: "women",
    collection: "Floral",
    description: "A delicate floral journey through jasmine gardens at dusk.",
    notes: {
      top: ["Orange Blossom", "Neroli"],
      heart: ["Jasmine Sambac", "Tuberose"],
      base: ["White Musk", "Cedar"],
    },
  },
  {
    id: "5",
    name: "Crystal Iris",
    brand: "Vernont",
    price: 285,
    image: "https://images.unsplash.com/photo-1619994403073-2cec844b8e63?w=800&q=80",
    category: "Eau de Parfum",
    gender: "women",
    isNew: true,
    collection: "Floral",
    description: "A sophisticated powdery floral with iris at its heart.",
    notes: {
      top: ["Bergamot", "Pink Pepper"],
      heart: ["Iris", "Violet"],
      base: ["Orris Butter", "Cashmere Wood"],
    },
  },
  {
    id: "6",
    name: "Noir Essence",
    brand: "Vernont",
    price: 355,
    image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800&q=80",
    category: "Parfum",
    gender: "men",
    isNew: true,
    collection: "Signature",
    description: "A bold masculine scent with dark leather and spices.",
    notes: {
      top: ["Black Pepper", "Grapefruit"],
      heart: ["Leather", "Tobacco"],
      base: ["Vetiver", "Patchouli", "Amber"],
    },
  },
  {
    id: "7",
    name: "Silk Magnolia",
    brand: "Vernont",
    price: 265,
    image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=800&q=80",
    category: "Eau de Parfum",
    gender: "women",
    isNew: true,
    collection: "Floral",
    description: "A luminous floral bouquet with dewy magnolia petals.",
    notes: {
      top: ["Lemon", "Pear"],
      heart: ["Magnolia", "Peony"],
      base: ["White Tea", "Musk"],
    },
  },
  {
    id: "8",
    name: "Royal Sandalwood",
    brand: "Vernont",
    price: 425,
    image: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&q=80",
    category: "Parfum Intense",
    gender: "men",
    isNew: true,
    collection: "Heritage",
    description: "A regal woody fragrance with the finest Indian sandalwood.",
    notes: {
      top: ["Cardamom", "Nutmeg"],
      heart: ["Sandalwood", "Rose"],
      base: ["Musk", "Tonka Bean"],
    },
  },
  {
    id: "9",
    name: "Ocean Breeze",
    brand: "Vernont",
    price: 195,
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&q=80",
    category: "Eau de Toilette",
    gender: "men",
    collection: "Fresh",
    description: "A refreshing aquatic scent inspired by Mediterranean coasts.",
    notes: {
      top: ["Sea Salt", "Citrus"],
      heart: ["Marine Notes", "Lavender"],
      base: ["Driftwood", "Musk"],
    },
  },
  {
    id: "10",
    name: "Vanilla Orchid",
    brand: "Vernont",
    price: 285,
    image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800&q=80",
    category: "Eau de Parfum",
    gender: "women",
    isBestseller: true,
    collection: "Gourmand",
    description: "A sensual blend of exotic orchid and warm vanilla.",
    notes: {
      top: ["Mandarin", "Pear"],
      heart: ["Black Orchid", "Jasmine"],
      base: ["Vanilla", "Patchouli", "Sandalwood"],
    },
  },
  {
    id: "11",
    name: "Bergamot Bliss",
    brand: "Vernont",
    price: 215,
    image: "https://images.unsplash.com/photo-1595535873420-a599195b3f4a?w=800&q=80",
    category: "Eau de Cologne",
    gender: "unisex",
    collection: "Fresh",
    description: "A sparkling citrus fragrance with Italian bergamot.",
    notes: {
      top: ["Bergamot", "Lemon"],
      heart: ["Neroli", "Petitgrain"],
      base: ["White Musk", "Cedar"],
    },
  },
  {
    id: "12",
    name: "Spiced Woods",
    brand: "Vernont",
    price: 310,
    image: "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?w=800&q=80",
    category: "Eau de Parfum",
    gender: "men",
    isBestseller: true,
    collection: "Heritage",
    description: "A sophisticated woody spicy composition for the modern gentleman.",
    notes: {
      top: ["Cinnamon", "Ginger"],
      heart: ["Cedar", "Vetiver"],
      base: ["Oud", "Amber", "Musk"],
    },
  },
];

export const getProductsByGender = (gender: "women" | "men" | "unisex") => {
  if (gender === "unisex") {
    return products.filter(p => p.gender === "unisex");
  }
  return products.filter(p => p.gender === gender || p.gender === "unisex");
};

export const getNewArrivals = () => products.filter(p => p.isNew);

export const getBestsellers = () => products.filter(p => p.isBestseller);

export const getProductsByCollection = (collection: string) =>
  products.filter(p => p.collection?.toLowerCase() === collection.toLowerCase());

export const getProductById = (id: string) => products.find(p => p.id === id);
