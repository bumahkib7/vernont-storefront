/**
 * Data transformation utilities
 * Transforms API responses to component-friendly formats
 */

import type { Product, ProductCollection, StorefrontVariant } from './schemas';
import { priceFromMinor } from './schemas';

/**
 * Component-friendly product format
 */
export interface DisplayProduct {
  id: string;
  handle: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string;
  gender: 'women' | 'men' | 'unisex';
  isNew: boolean;
  isBestseller: boolean;
  collection?: string;
  description?: string;
  notes?: {
    top: string[];
    heart: string[];
    base: string[];
  };
  variantId?: string;
  currency?: string;
  variants: Array<{
    id: string;
    title: string;
    price: number;
    originalPrice?: number;
    sku: string;
    inventoryQuantity?: number;
  }>;
}

/**
 * Component-friendly collection format
 */
export interface DisplayCollection {
  id: string;
  handle: string;
  name: string;
  description?: string;
  image?: string;
}

/**
 * Transform API Product (StorefrontProductDto) to DisplayProduct
 */
export function transformProduct(product: Product): DisplayProduct {
  // Get first variant for default pricing
  const firstVariant = product.variants[0];

  // Get price from first variant or lowestPriceMinor (prices are in minor units - pence/cents)
  const priceMinor = firstVariant?.priceMinor ?? product.lowestPriceMinor ?? 0;
  const price = priceFromMinor(priceMinor);

  // Get original/compare-at price if exists
  const compareAtPriceMinor = firstVariant?.compareAtPriceMinor;
  const originalPrice = compareAtPriceMinor ? priceFromMinor(compareAtPriceMinor) : undefined;

  // Since StorefrontProductDto doesn't have tags/categories, we determine gender from title/description
  const titleLower = product.title.toLowerCase();
  const descLower = (product.description ?? '').toLowerCase();
  const combined = `${titleLower} ${descLower}`;

  let gender: 'women' | 'men' | 'unisex' = 'unisex';
  if (combined.includes('women') || combined.includes('her') || combined.includes('feminine') || combined.includes('pour femme')) {
    gender = 'women';
  } else if (combined.includes(' men') || combined.includes(' him') || combined.includes('masculine') || combined.includes('pour homme')) {
    gender = 'men';
  }

  // Check for new/bestseller in title/description (since we don't have tags)
  const isNew = combined.includes('new arrival') || combined.includes('new release');
  const isBestseller = combined.includes('bestseller') || combined.includes('best seller');

  // Collect all images from imageUrls array (these are strings in the DTO)
  const images: string[] = [];
  if (product.thumbnail) images.push(product.thumbnail);
  if (product.imageUrls && product.imageUrls.length > 0) {
    images.push(...product.imageUrls);
  }

  // Dedupe images
  const uniqueImages = [...new Set(images)];

  return {
    id: product.handle, // Use handle as ID for URL routing
    handle: product.handle,
    name: product.title,
    brand: product.brand ?? 'Vernont',
    price,
    originalPrice,
    image: product.thumbnail ?? uniqueImages[0] ?? '/placeholder.jpg',
    images: uniqueImages.length > 0 ? uniqueImages : ['/placeholder.jpg'],
    category: 'Eau de Parfum', // Default category since DTO doesn't include it
    gender,
    isNew,
    isBestseller,
    description: product.description ?? undefined,
    currency: product.currency ?? firstVariant?.currency ?? 'GBP',
    variantId: firstVariant?.id,
    variants: product.variants.map((v: StorefrontVariant) => {
      const vPrice = v.priceMinor ?? 0;
      const vCompareAt = v.compareAtPriceMinor;
      return {
        id: v.id,
        title: v.title ?? 'Default',
        price: priceFromMinor(vPrice),
        originalPrice: vCompareAt ? priceFromMinor(vCompareAt) : undefined,
        sku: v.sku ?? '',
        inventoryQuantity: v.inventoryQuantity ?? undefined,
      };
    }),
  };
}

/**
 * Transform array of API Products
 */
export function transformProducts(products: Product[]): DisplayProduct[] {
  return products.map(transformProduct);
}

/**
 * Transform API Collection (StoreCollectionDto) to DisplayCollection
 */
export function transformCollection(collection: ProductCollection): DisplayCollection {
  return {
    id: collection.id,
    handle: collection.handle,
    name: collection.title,
    // StoreCollectionDto doesn't have description or imageUrl
  };
}

/**
 * Transform array of API Collections
 */
export function transformCollections(collections: ProductCollection[]): DisplayCollection[] {
  return collections.map(transformCollection);
}

/**
 * Filter products by gender
 */
export function filterByGender(products: DisplayProduct[], gender: 'women' | 'men' | 'unisex'): DisplayProduct[] {
  if (gender === 'unisex') {
    return products.filter(p => p.gender === 'unisex');
  }
  // For men/women, also include unisex products
  return products.filter(p => p.gender === gender || p.gender === 'unisex');
}

/**
 * Get new arrivals
 */
export function getNewArrivals(products: DisplayProduct[]): DisplayProduct[] {
  return products.filter(p => p.isNew);
}

/**
 * Get bestsellers
 */
export function getBestsellers(products: DisplayProduct[]): DisplayProduct[] {
  return products.filter(p => p.isBestseller);
}

/**
 * Filter by collection
 */
export function filterByCollection(products: DisplayProduct[], collection: string): DisplayProduct[] {
  return products.filter(p => p.collection?.toLowerCase() === collection.toLowerCase());
}
