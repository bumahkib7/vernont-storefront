// Collection image utilities
// Uses vertical config for curated images per collection handle

import { collectionImages } from "@/config/vertical";

/**
 * Get a curated image for a collection
 * Ignores backend thumbnails and uses curated images instead
 */
export function getCollectionImage(handle: string, index: number = 0): string {
  const normalizedHandle = handle.toLowerCase().replace(/[_\s]/g, "-");

  // Check for exact match in config handle map
  if (collectionImages.handleMap[normalizedHandle]) {
    return collectionImages.handleMap[normalizedHandle];
  }

  // Check for partial match
  for (const [key, image] of Object.entries(collectionImages.handleMap)) {
    if (normalizedHandle.includes(key) || key.includes(normalizedHandle)) {
      return image;
    }
  }

  // Use index-based fallback from curated defaults
  return collectionImages.defaultImages[index % collectionImages.defaultImages.length];
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
