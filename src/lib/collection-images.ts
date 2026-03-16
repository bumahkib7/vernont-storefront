// Collection image utilities
// Prefers real thumbnails from the API, falls back to curated config images

import { collectionImages } from "@/config/vertical";
import { resolveImageUrl } from "@/lib/api";

// Fallback placeholder images (generic eyewear)
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80",
  "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
  "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&q=80",
  "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&q=80",
];

/**
 * Get an image for a collection.
 * Priority: API thumbnail > config handle map > fallback
 */
export function getCollectionImage(handle: string, index: number = 0, apiThumbnail?: string | null): string {
  // 1. Use real API thumbnail if available
  const resolved = resolveImageUrl(apiThumbnail);
  if (resolved) return resolved;

  const normalizedHandle = handle.toLowerCase().replace(/[_\s]/g, "-");

  // 2. Check config handle map
  if (collectionImages.handleMap[normalizedHandle]) {
    return collectionImages.handleMap[normalizedHandle];
  }

  // 3. Partial match in config
  for (const [key, image] of Object.entries(collectionImages.handleMap)) {
    if (normalizedHandle.includes(key) || key.includes(normalizedHandle)) {
      return image;
    }
  }

  // 4. Fallback
  return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
}

/**
 * Get hero image for collection page banner
 */
export function getCollectionHeroImage(handle: string, apiThumbnail?: string | null): string {
  const baseImage = getCollectionImage(handle, 0, apiThumbnail);
  // For Unsplash URLs, request higher resolution
  if (baseImage.includes("unsplash.com")) {
    return baseImage.replace("w=800", "w=1920");
  }
  return baseImage;
}
