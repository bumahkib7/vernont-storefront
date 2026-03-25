/**
 * Data transformation utilities
 * Transforms API responses to component-friendly formats
 */

import type { Product, ProductCollection, StorefrontVariant, VerticalMetadata } from './schemas';
import { priceFromMinor } from './schemas';
import { resolveImageUrl } from './api';
import { product as productConfig } from '@/config/vertical';

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
  frameShape?: string;
  frameMaterial?: string;
  lensType?: string[];
  frameColor?: string;
  lensColor?: string;
  eyewearCategory?: string;
  measurements?: {
    lensWidth?: number | null;
    bridgeWidth?: number | null;
    templeLength?: number | null;
    lensHeight?: number | null;
  };
  frameSize?: string;
  uvProtection?: string;
  weight?: number;
  madeIn?: string;
  faceShapes?: string[];
  condition?: string;
  isPreOwned: boolean;
  conditionGrade?: 'A' | 'B' | 'C';
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
  const variants = product.variants ?? [];
  const firstVariant = variants[0];

  // Get price from first variant or lowestPriceMinor (prices are in minor units - pence/cents)
  const priceMinor = firstVariant?.priceMinor ?? product.lowestPriceMinor ?? 0;
  const price = priceFromMinor(priceMinor);

  // Get original/compare-at price if exists
  const compareAtPriceMinor = firstVariant?.compareAtPriceMinor;
  const originalPrice = compareAtPriceMinor ? priceFromMinor(compareAtPriceMinor) : undefined;

  // Gender from backend field, with fallback to title parsing
  let gender: 'women' | 'men' | 'unisex' = 'unisex';
  if (product.gender) {
    const g = product.gender.toLowerCase();
    if (g === 'female' || g === 'women') gender = 'women';
    else if (g === 'male' || g === 'men') gender = 'men';
    else gender = 'unisex';
  } else {
    const titleLower = product.title.toLowerCase();
    const descLower = (product.description ?? '').toLowerCase();
    const combined = `${titleLower} ${descLower}`;
    if (combined.includes('women') || combined.includes('her') || combined.includes('feminine') || combined.includes('pour femme')) {
      gender = 'women';
    } else if (combined.includes(' men') || combined.includes(' him') || combined.includes('masculine') || combined.includes('pour homme')) {
      gender = 'men';
    }
  }

  // Check for new/bestseller in title/description (since we don't have tags)
  const textLower = `${product.title.toLowerCase()} ${(product.description ?? '').toLowerCase()}`;
  const isNew = textLower.includes('new arrival') || textLower.includes('new release');
  const isBestseller = textLower.includes('bestseller') || textLower.includes('best seller');

  // Extract vertical-specific metadata using configured namespace
  const eyewearMetadata = product.metadata?.[productConfig.metadataNamespace] as VerticalMetadata | undefined;

  // Collect all images from imageUrls array, resolving through the /files proxy
  const rawImages: string[] = [];
  if (product.thumbnail) rawImages.push(product.thumbnail);
  if (product.imageUrls && product.imageUrls.length > 0) {
    rawImages.push(...product.imageUrls);
  }

  // Resolve URLs through the backend proxy and dedupe
  const resolvedImages = rawImages
    .map(url => resolveImageUrl(url))
    .filter((url): url is string => url !== null);
  const uniqueImages = [...new Set(resolvedImages)];

  const resolvedThumbnail = resolveImageUrl(product.thumbnail);

  return {
    id: product.id,
    handle: product.handle,
    name: product.title,
    brand: product.brand ?? 'Vernont',
    price,
    originalPrice,
    image: resolvedThumbnail ?? uniqueImages[0] ?? '/placeholder.jpg',
    images: uniqueImages.length > 0 ? uniqueImages : ['/placeholder.jpg'],
    category: eyewearMetadata?.category || 'Sunglasses',
    gender,
    isNew,
    isBestseller,
    description: product.description ?? undefined,
    frameShape: eyewearMetadata?.frameShape ?? undefined,
    frameMaterial: eyewearMetadata?.frameMaterial ?? product.material ?? undefined,
    lensType: eyewearMetadata?.lensType ?? undefined,
    frameColor: eyewearMetadata?.frameColor ?? undefined,
    lensColor: eyewearMetadata?.lensColor ?? undefined,
    eyewearCategory: eyewearMetadata?.category ?? undefined,
    measurements: eyewearMetadata?.measurements ?? undefined,
    frameSize: eyewearMetadata?.frameSize ?? undefined,
    uvProtection: eyewearMetadata?.uvProtection ?? undefined,
    weight: eyewearMetadata?.weight ?? undefined,
    madeIn: eyewearMetadata?.madeIn ?? product.originCountry ?? undefined,
    faceShapes: eyewearMetadata?.faceShapes ?? undefined,
    condition: product.condition ?? 'new',
    isPreOwned: product.condition?.startsWith('pre_owned') ?? false,
    conditionGrade: product.condition?.startsWith('pre_owned')
      ? (product.condition.slice(-1).toUpperCase() as 'A' | 'B' | 'C')
      : undefined,
    currency: product.currency ?? firstVariant?.currency ?? 'GBP',
    variantId: firstVariant?.id,
    variants: variants.map((v: StorefrontVariant) => {
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

/**
 * Get pre-owned products
 */
export function getPreOwnedProducts(products: DisplayProduct[]): DisplayProduct[] {
  return products.filter(p => p.isPreOwned);
}

/**
 * Filter pre-owned by grade
 */
export function filterByGrade(products: DisplayProduct[], grade: 'A' | 'B' | 'C'): DisplayProduct[] {
  return products.filter(p => p.conditionGrade === grade);
}
