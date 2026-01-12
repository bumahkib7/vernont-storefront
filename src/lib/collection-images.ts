// Curated fragrance images for collections
// Using high-quality Unsplash images that match fragrance/perfume aesthetics

const FRAGRANCE_IMAGES = [
  "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80", // Perfume bottles on shelf
  "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800&q=80", // Luxury perfume
  "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80", // Elegant perfume bottle
  "https://images.unsplash.com/photo-1619994403073-2cec844b8e63?w=800&q=80", // Perfume with flowers
  "https://images.unsplash.com/photo-1590736969955-71cc94801759?w=800&q=80", // Perfume aesthetic
  "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80", // Luxury fragrance
  "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800&q=80", // Perfume bottles
  "https://images.unsplash.com/photo-1608528577891-eb055944f2e7?w=800&q=80", // Minimalist perfume
];

// Map specific collection handles to themed images
const COLLECTION_IMAGE_MAP: Record<string, string> = {
  // Gender-based collections
  "for-him": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&q=80",
  "for-her": "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&q=80",
  "unisex": "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80",

  // Season collections
  "summer": "https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?w=800&q=80",
  "winter": "https://images.unsplash.com/photo-1610461888750-10bfc601b874?w=800&q=80",
  "spring": "https://images.unsplash.com/photo-1619994403073-2cec844b8e63?w=800&q=80",
  "autumn": "https://images.unsplash.com/photo-1608528577891-eb055944f2e7?w=800&q=80",
  "fall": "https://images.unsplash.com/photo-1608528577891-eb055944f2e7?w=800&q=80",

  // Occasion collections
  "evening": "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800&q=80",
  "day": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80",
  "office": "https://images.unsplash.com/photo-1590736969955-71cc94801759?w=800&q=80",
  "date-night": "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800&q=80",

  // Type collections
  "fresh": "https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?w=800&q=80",
  "oriental": "https://images.unsplash.com/photo-1610461888750-10bfc601b874?w=800&q=80",
  "woody": "https://images.unsplash.com/photo-1608528577891-eb055944f2e7?w=800&q=80",
  "floral": "https://images.unsplash.com/photo-1619994403073-2cec844b8e63?w=800&q=80",
  "citrus": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80",
  "aquatic": "https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?w=800&q=80",
  "spicy": "https://images.unsplash.com/photo-1610461888750-10bfc601b874?w=800&q=80",
  "gourmand": "https://images.unsplash.com/photo-1590736969955-71cc94801759?w=800&q=80",

  // Special collections
  "new": "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80",
  "new-arrivals": "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80",
  "bestsellers": "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800&q=80",
  "best-sellers": "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800&q=80",
  "gifts": "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80",
  "gift-sets": "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80",
  "sale": "https://images.unsplash.com/photo-1590736969955-71cc94801759?w=800&q=80",
  "luxury": "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800&q=80",
  "niche": "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800&q=80",
  "designer": "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80",
};

/**
 * Get a curated fragrance image for a collection
 * Ignores backend thumbnails and uses curated images instead
 */
export function getCollectionImage(handle: string, index: number = 0): string {
  // Normalize handle for matching
  const normalizedHandle = handle.toLowerCase().replace(/[_\s]/g, "-");

  // Check for exact match in our map
  if (COLLECTION_IMAGE_MAP[normalizedHandle]) {
    return COLLECTION_IMAGE_MAP[normalizedHandle];
  }

  // Check for partial match
  for (const [key, image] of Object.entries(COLLECTION_IMAGE_MAP)) {
    if (normalizedHandle.includes(key) || key.includes(normalizedHandle)) {
      return image;
    }
  }

  // Use index-based fallback from our curated list
  return FRAGRANCE_IMAGES[index % FRAGRANCE_IMAGES.length];
}

/**
 * Get hero image for collection page banner
 * Returns a higher quality/different crop version
 */
export function getCollectionHeroImage(handle: string): string {
  // Use the same logic but with different size parameter
  const baseImage = getCollectionImage(handle, 0);
  return baseImage.replace("w=800", "w=1920");
}
