/**
 * Vernont Storefront API Schemas
 * These schemas match the exact DTOs returned by the backend
 */

import { z } from 'zod';

// ==================
// UTILITY FUNCTIONS
// ==================

/**
 * Format price from minor units (cents) to display string
 */
export function formatPrice(priceMinor: number, currency = 'GBP'): string {
  const price = priceMinor / 100;
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
  }).format(price);
}

/**
 * Convert minor units to major units
 */
export function priceFromMinor(priceMinor: number): number {
  return priceMinor / 100;
}

/**
 * Parse and validate response data
 */
export function parseResponse<T>(schema: z.ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error('Schema validation failed:', result.error.issues);
    throw new Error(`Invalid response data: ${result.error.message}`);
  }
  return result.data;
}

// ==================
// PRODUCT SCHEMAS (match StorefrontProductDto)
// ==================

/**
 * StorefrontVariantDto
 */
export const StorefrontVariantSchema = z.object({
  id: z.string(),
  title: z.string().nullable().optional(),
  sku: z.string().nullable().optional(),
  priceMinor: z.number().nullable().optional(),
  compareAtPriceMinor: z.number().nullable().optional(),
  currency: z.string().nullable().optional(),
  inventoryQuantity: z.number().nullable().optional(),
});

export type StorefrontVariant = z.infer<typeof StorefrontVariantSchema>;

/**
 * Fragrance Notes schema - matches backend FragranceNotes
 */
export const FragranceNotesSchema = z.object({
  top: z.array(z.string()).nullable().optional(),
  heart: z.array(z.string()).nullable().optional(),
  base: z.array(z.string()).nullable().optional(),
});

export type FragranceNotes = z.infer<typeof FragranceNotesSchema>;

/**
 * Fragrance Metadata schema - matches backend FragranceMetadata
 */
export const FragranceMetadataSchema = z.object({
  notes: FragranceNotesSchema.nullable().optional(),
  concentration: z.string().nullable().optional(),
  longevity: z.number().nullable().optional(),
  sillage: z.number().nullable().optional(),
  gender: z.string().nullable().optional(),
  season: z.array(z.string()).nullable().optional(),
  occasion: z.array(z.string()).nullable().optional(),
  ingredients: z.string().nullable().optional(),
});

export type FragranceMetadata = z.infer<typeof FragranceMetadataSchema>;

/**
 * Product metadata schema
 */
export const ProductMetadataSchema = z.object({
  fragrance: FragranceMetadataSchema.nullable().optional(),
}).passthrough();

export type ProductMetadata = z.infer<typeof ProductMetadataSchema>;

/**
 * StorefrontProductDto
 */
export const StorefrontProductSchema = z.object({
  id: z.string(),
  handle: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
  thumbnail: z.string().nullable().optional(),
  imageUrls: z.array(z.string()).default([]),
  brand: z.string().nullable().optional(),
  lowestPriceMinor: z.number().nullable().optional(),
  currency: z.string().nullable().optional(),
  variants: z.array(StorefrontVariantSchema).default([]),
  metadata: ProductMetadataSchema.nullable().optional(),
});

export type StorefrontProduct = z.infer<typeof StorefrontProductSchema>;

/**
 * FilterOption
 */
export const FilterOptionSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string().nullable().optional(),
  count: z.number().default(0),
});

export type FilterOption = z.infer<typeof FilterOptionSchema>;

/**
 * PriceRange
 */
export const PriceRangeSchema = z.object({
  min: z.number(),
  max: z.number(),
  currency: z.string(),
});

export type PriceRange = z.infer<typeof PriceRangeSchema>;

/**
 * FilterOptions
 */
export const FilterOptionsSchema = z.object({
  brands: z.array(FilterOptionSchema).default([]),
  categories: z.array(FilterOptionSchema).default([]),
  sizes: z.array(z.string()).default([]),
  colors: z.array(z.string()).default([]),
  priceRange: PriceRangeSchema.nullable().optional(),
});

export type FilterOptions = z.infer<typeof FilterOptionsSchema>;

/**
 * ListProductsOutput - GET /storefront/products response
 */
export const ProductsListResponseSchema = z.object({
  items: z.array(StorefrontProductSchema),
  page: z.number(),
  size: z.number(),
  total: z.number(),
  filters: FilterOptionsSchema.nullable().optional(),
});

export type ProductsListResponse = z.infer<typeof ProductsListResponseSchema>;

/**
 * SearchSuggestionsResponse - GET /storefront/products/suggestions
 */
export const SearchSuggestionsResponseSchema = z.object({
  products: z.array(z.string()),
  brands: z.array(z.string()),
});

export type SearchSuggestionsResponse = z.infer<typeof SearchSuggestionsResponseSchema>;

// Alias for backward compatibility
export const ProductSchema = StorefrontProductSchema;
export type Product = StorefrontProduct;
export const ProductVariantSchema = StorefrontVariantSchema;
export type ProductVariant = StorefrontVariant;

// ==================
// COLLECTION SCHEMAS (match StoreCollectionDto)
// ==================

/**
 * StoreCollectionDto
 */
export const StoreCollectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  handle: z.string(),
  description: z.string().nullable().optional(),
  thumbnail: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type StoreCollection = z.infer<typeof StoreCollectionSchema>;

/**
 * StoreCollectionListResponse
 */
export const CollectionsListResponseSchema = z.object({
  collections: z.array(StoreCollectionSchema),
  count: z.number(),
  offset: z.number(),
  limit: z.number(),
});

export type CollectionsListResponse = z.infer<typeof CollectionsListResponseSchema>;

/**
 * StoreCollectionResponse
 */
export const CollectionResponseSchema = z.object({
  collection: StoreCollectionSchema,
});

export type CollectionResponse = z.infer<typeof CollectionResponseSchema>;

// Aliases
export const ProductCollectionSchema = StoreCollectionSchema;
export type ProductCollection = StoreCollection;

// ==================
// CATEGORY SCHEMAS (match StoreProductCategoryDto)
// ==================

export const StoreCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  handle: z.string(),
  is_active: z.boolean().optional(),
  parent_category_id: z.string().nullable().optional(),
  rank: z.number().default(0),
  created_at: z.string(),
  updated_at: z.string(),
});

export type StoreCategory = z.infer<typeof StoreCategorySchema>;

export const CategoriesListResponseSchema = z.object({
  product_categories: z.array(StoreCategorySchema),
  count: z.number(),
  offset: z.number(),
  limit: z.number(),
});

export type CategoriesListResponse = z.infer<typeof CategoriesListResponseSchema>;

// Alias
export const ProductCategorySchema = StoreCategorySchema;
export type ProductCategory = StoreCategory;

// ==================
// TAG SCHEMAS
// ==================

export const ProductTagSchema = z.object({
  id: z.string(),
  value: z.string(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type ProductTag = z.infer<typeof ProductTagSchema>;

export const TagsListResponseSchema = z.object({
  product_tags: z.array(ProductTagSchema),
  count: z.number(),
  offset: z.number(),
  limit: z.number(),
});

export type TagsListResponse = z.infer<typeof TagsListResponseSchema>;

// ==================
// CART SCHEMAS (match CartController response format)
// ==================

export const CartLineItemSchema = z.object({
  id: z.string(),
  cart_id: z.string(),
  variant_id: z.string(),
  title: z.string(),
  thumbnail: z.string().nullable().optional(),
  product_handle: z.string().nullable().optional(),
  variant_title: z.string().nullable().optional(),
  quantity: z.number(),
  unit_price: z.number(),
  subtotal: z.number(),
  total: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type CartLineItem = z.infer<typeof CartLineItemSchema>;

export const CartSchema = z.object({
  id: z.string(),
  email: z.string().nullable().optional(),
  customer_id: z.string().nullable().optional(),
  region_id: z.string().nullable().optional(),
  currency_code: z.string().nullable().optional(),
  items: z.array(CartLineItemSchema).default([]),
  subtotal: z.number(),
  tax_total: z.number(),
  shipping_total: z.number(),
  discount_total: z.number(),
  gift_card_code: z.string().nullable().optional(),
  gift_card_total: z.number().default(0),
  total: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Cart = z.infer<typeof CartSchema>;

export const CartResponseSchema = z.object({
  cart: CartSchema,
});

export type CartResponse = z.infer<typeof CartResponseSchema>;

// ==================
// PAYMENT SESSION SCHEMAS
// ==================

export const PaymentSessionSchema = z.object({
  payment_intent_id: z.string(),
  client_secret: z.string(),
  publishable_key: z.string(),
  amount: z.number(),
  currency: z.string(),
  status: z.string(),
});

export type PaymentSession = z.infer<typeof PaymentSessionSchema>;

export const PaymentSessionResponseSchema = z.object({
  payment_session: PaymentSessionSchema,
});

export type PaymentSessionResponse = z.infer<typeof PaymentSessionResponseSchema>;

// ==================
// CUSTOMER SCHEMAS (match StoreCustomer DTOs)
// ==================

export const StoreCustomerAddressSchema = z.object({
  id: z.string(),
  customer_id: z.string().nullable().optional(),
  company: z.string().nullable().optional(),
  first_name: z.string().nullable().optional(),
  last_name: z.string().nullable().optional(),
  address_1: z.string().nullable().optional(),
  address_2: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  country_code: z.string().nullable().optional(),
  province: z.string().nullable().optional(),
  postal_code: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
  deleted_at: z.string().nullable().optional(),
  metadata: z.record(z.string(), z.any()).nullable().optional(),
});

export type StoreCustomerAddress = z.infer<typeof StoreCustomerAddressSchema>;

export const StoreOrderSummarySchema = z.object({
  id: z.string(),
  display_id: z.number().nullable().optional(),
  status: z.string(),
  fulfillment_status: z.string(),
  payment_status: z.string(),
  total: z.number(),
  currency_code: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type StoreOrderSummary = z.infer<typeof StoreOrderSummarySchema>;

export const StoreCustomerSchema = z.object({
  id: z.string(),
  email: z.string(),
  first_name: z.string().nullable().optional(),
  last_name: z.string().nullable().optional(),
  billing_address_id: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  has_account: z.boolean(),
  orders: z.array(StoreOrderSummarySchema).nullable().optional(),
  addresses: z.array(StoreCustomerAddressSchema).nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
  deleted_at: z.string().nullable().optional(),
  metadata: z.record(z.string(), z.any()).nullable().optional(),
});

export type StoreCustomer = z.infer<typeof StoreCustomerSchema>;

export const CustomerResponseSchema = z.object({
  customer: StoreCustomerSchema,
});

export type CustomerResponse = z.infer<typeof CustomerResponseSchema>;

export const CustomerAddressesResponseSchema = z.object({
  addresses: z.array(StoreCustomerAddressSchema),
  count: z.number(),
  offset: z.number(),
  limit: z.number(),
});

export type CustomerAddressesResponse = z.infer<typeof CustomerAddressesResponseSchema>;

export const CustomerAddressResponseSchema = z.object({
  address: StoreCustomerAddressSchema,
});

export type CustomerAddressResponse = z.infer<typeof CustomerAddressResponseSchema>;

// Aliases for backward compatibility
export const CustomerSchema = StoreCustomerSchema;
export type Customer = StoreCustomer;
export const CustomerAddressSchema = StoreCustomerAddressSchema;
export type CustomerAddress = StoreCustomerAddress;

// ==================
// ORDER SCHEMAS (match StoreOrder DTOs)
// ==================

export const StoreOrderLineItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
  thumbnail: z.string().nullable().optional(),
  variant_id: z.string().nullable().optional(),
  variant_title: z.string().nullable().optional(),
  quantity: z.number(),
  unit_price: z.number(),
  total: z.number(),
  currency_code: z.string(),
});

export type StoreOrderLineItem = z.infer<typeof StoreOrderLineItemSchema>;

export const StoreOrderSchema = z.object({
  id: z.string(),
  display_id: z.number().nullable().optional(),
  status: z.string(),
  fulfillment_status: z.string(),
  payment_status: z.string(),
  email: z.string(),
  customer_id: z.string().nullable().optional(),
  subtotal: z.number(),
  tax: z.number(),
  shipping: z.number(),
  discount: z.number(),
  total: z.number(),
  currency_code: z.string(),
  item_count: z.number(),
  items: z.array(StoreOrderLineItemSchema).nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
  completed_at: z.string().nullable().optional(),
});

export type StoreOrder = z.infer<typeof StoreOrderSchema>;

export const OrderResponseSchema = z.object({
  order: StoreOrderSchema,
});

export type OrderResponse = z.infer<typeof OrderResponseSchema>;

export const OrderListResponseSchema = z.object({
  orders: z.array(StoreOrderSchema),
  count: z.number(),
  offset: z.number(),
  limit: z.number(),
});

export type OrderListResponse = z.infer<typeof OrderListResponseSchema>;

// Complete cart response (after checkout)
export const CompleteCartResponseSchema = z.object({
  type: z.literal('order'),
  order: z.object({
    id: z.string(),
    display_id: z.number().optional(),
    status: z.string(),
    email: z.string().optional(),
    total: z.number(),
    currency_code: z.string().optional(),
    payment_status: z.string().optional(),
  }),
});

export type CompleteCartResponse = z.infer<typeof CompleteCartResponseSchema>;

// Aliases
export const OrderSchema = StoreOrderSchema;
export type Order = StoreOrder;
export const OrderLineItemSchema = StoreOrderLineItemSchema;
export type OrderLineItem = StoreOrderLineItem;

// ==================
// ORDER TRACKING SCHEMAS
// ==================

export const TrackingStepSchema = z.object({
  status: z.string(),
  date: z.string(),
  location: z.string(),
  completed: z.boolean(),
  current: z.boolean(),
});

export type TrackingStep = z.infer<typeof TrackingStepSchema>;

export const TrackOrderResponseSchema = z.object({
  orderId: z.string(),
  displayId: z.number(),
  email: z.string(),
  status: z.string(),
  paymentStatus: z.string(),
  fulfillmentStatus: z.string(),
  total: z.number(),
  currencyCode: z.string(),
  itemCount: z.number(),
  trackingNumber: z.string().nullable().optional(),
  carrier: z.string().nullable().optional(),
  trackingUrl: z.string().nullable().optional(),
  steps: z.array(TrackingStepSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type TrackOrderResponse = z.infer<typeof TrackOrderResponseSchema>;

// ==================
// REGION SCHEMAS
// ==================

export const RegionSchema = z.object({
  id: z.string(),
  name: z.string(),
  currency_code: z.string(),
  tax_rate: z.number().optional(),
  countries: z.array(z.object({
    id: z.string().optional(),
    iso_2: z.string(),
    name: z.string(),
  })).optional(),
});

export type Region = z.infer<typeof RegionSchema>;

export const RegionsListResponseSchema = z.object({
  regions: z.array(RegionSchema),
  count: z.number().optional(),
});

export type RegionsListResponse = z.infer<typeof RegionsListResponseSchema>;

export const RegionResponseSchema = z.object({
  region: RegionSchema,
});

export type RegionResponse = z.infer<typeof RegionResponseSchema>;

// ==================
// SHIPPING SCHEMAS
// ==================

export const ShippingOptionSchema = z.object({
  id: z.string(),
  name: z.string(),
  price_type: z.string().optional(),
  amount: z.number(),
  region_id: z.string().optional(),
  provider_id: z.string().optional(),
  data: z.record(z.string(), z.any()).optional(),
});

export type ShippingOption = z.infer<typeof ShippingOptionSchema>;

export const ShippingOptionsResponseSchema = z.object({
  shipping_options: z.array(ShippingOptionSchema),
});

export type ShippingOptionsResponse = z.infer<typeof ShippingOptionsResponseSchema>;

// ==================
// AUTH SCHEMAS
// ==================

// Auth response can vary - tokens may be in cookies (HTTP-only) or response body
export const AuthResponseSchema = z.object({
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
  expiresIn: z.number().optional(),
  tokenType: z.string().optional(),
  // Some backends return user info directly in auth response
  user: z.object({
    userId: z.string().optional(),
    id: z.string().optional(),
    email: z.string().optional(),
    customerId: z.string().nullable().optional(),
  }).optional(),
  // Or just a message
  message: z.string().optional(),
}).passthrough(); // Allow additional unknown fields

export type AuthResponse = z.infer<typeof AuthResponseSchema>;

export const UserInfoSchema = z.object({
  userId: z.string().optional(),
  id: z.string().optional(),
  email: z.string(),
  customerId: z.string().nullable().optional(),
  roles: z.array(z.string()).optional(),
}).transform((data) => ({
  // Normalize userId - could come as 'id' or 'userId'
  userId: data.userId || data.id || '',
  email: data.email,
  customerId: data.customerId,
  roles: data.roles,
}));

export type UserInfo = z.infer<typeof UserInfoSchema>;

// Me response can be wrapped or direct
export const MeResponseSchema = z.union([
  // Wrapped format: { user: { ... } }
  z.object({
    user: z.object({
      userId: z.string().optional(),
      id: z.string().optional(),
      email: z.string(),
      customerId: z.string().nullable().optional(),
      roles: z.array(z.string()).optional(),
    }),
  }),
  // Direct format: { userId, email, ... }
  z.object({
    userId: z.string().optional(),
    id: z.string().optional(),
    email: z.string(),
    customerId: z.string().nullable().optional(),
    roles: z.array(z.string()).optional(),
  }),
]).transform((data) => {
  // Normalize to always have user wrapper
  if ('user' in data && data.user) {
    return {
      user: {
        userId: data.user.userId || data.user.id || '',
        email: data.user.email,
        customerId: data.user.customerId,
        roles: data.user.roles,
      },
    };
  }
  // Direct format - wrap it
  const direct = data as { userId?: string; id?: string; email: string; customerId?: string | null; roles?: string[] };
  return {
    user: {
      userId: direct.userId || direct.id || '',
      email: direct.email,
      customerId: direct.customerId,
      roles: direct.roles,
    },
  };
});

export type MeResponse = z.infer<typeof MeResponseSchema>;

// ==================
// RETURN SCHEMAS
// ==================

export const StoreReturnItemSchema = z.object({
  id: z.string(),
  orderLineItemId: z.string(),
  variantId: z.string().nullable().optional(),
  title: z.string(),
  description: z.string().nullable().optional(),
  thumbnail: z.string().nullable().optional(),
  quantity: z.number(),
  unitPrice: z.number(),
  total: z.number(),
});

export type StoreReturnItem = z.infer<typeof StoreReturnItemSchema>;

export const StoreReturnSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  orderDisplayId: z.number().nullable().optional(),
  status: z.string(),
  reason: z.string(),
  reasonNote: z.string().nullable().optional(),
  refundAmount: z.number(),
  currencyCode: z.string(),
  items: z.array(StoreReturnItemSchema),
  requestedAt: z.string(),
  approvedAt: z.string().nullable().optional(),
  receivedAt: z.string().nullable().optional(),
  refundedAt: z.string().nullable().optional(),
  returnDeadline: z.string(),
  daysRemaining: z.number(),
  canCancel: z.boolean(),
});

export type StoreReturn = z.infer<typeof StoreReturnSchema>;

export const ReturnResponseSchema = z.object({
  return_request: StoreReturnSchema,
});

export type ReturnResponse = z.infer<typeof ReturnResponseSchema>;

export const ReturnListResponseSchema = z.object({
  returns: z.array(StoreReturnSchema),
  count: z.number(),
  offset: z.number(),
  limit: z.number(),
});

export type ReturnListResponse = z.infer<typeof ReturnListResponseSchema>;

export const EligibleItemSchema = z.object({
  orderLineItemId: z.string(),
  variantId: z.string().nullable().optional(),
  title: z.string(),
  thumbnail: z.string().nullable().optional(),
  quantity: z.number(),
  returnableQuantity: z.number(),
  unitPrice: z.number(),
  currencyCode: z.string(),
});

export type EligibleItem = z.infer<typeof EligibleItemSchema>;

export const ReturnEligibilityResponseSchema = z.object({
  eligible: z.boolean(),
  deadline: z.string().nullable().optional(),
  daysRemaining: z.number().nullable().optional(),
  reason: z.string().nullable().optional(),
  items: z.array(EligibleItemSchema),
});

export type ReturnEligibilityResponse = z.infer<typeof ReturnEligibilityResponseSchema>;

// ==================
// EXCHANGE SCHEMAS
// ==================

export const ExchangeSchema = z.object({
  id: z.string(),
  order_id: z.string(),
  status: z.string(),
  return_items: z.array(StoreReturnItemSchema).optional(),
  additional_items: z.array(z.object({
    variant_id: z.string(),
    quantity: z.number(),
  })).optional(),
  difference_due: z.number().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Exchange = z.infer<typeof ExchangeSchema>;

export const ExchangeResponseSchema = z.object({
  exchange: ExchangeSchema,
});

export type ExchangeResponse = z.infer<typeof ExchangeResponseSchema>;

export const ExchangeListResponseSchema = z.object({
  exchanges: z.array(ExchangeSchema),
  count: z.number(),
  offset: z.number(),
  limit: z.number(),
});

export type ExchangeListResponse = z.infer<typeof ExchangeListResponseSchema>;

export const ExchangeEligibilityResponseSchema = z.object({
  eligible: z.boolean(),
  reason: z.string().optional(),
});

export type ExchangeEligibilityResponse = z.infer<typeof ExchangeEligibilityResponseSchema>;

// ==================
// MARKETING SCHEMAS
// ==================

export const MarketingPreferenceSchema = z.object({
  customer_id: z.string(),
  email_marketing: z.boolean(),
  sms_marketing: z.boolean(),
  push_notifications: z.boolean(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type MarketingPreference = z.infer<typeof MarketingPreferenceSchema>;

// ==================
// ADDRESS SCHEMA (for cart/checkout)
// ==================

export const AddressSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  company: z.string().optional(),
  address_1: z.string(),
  address_2: z.string().optional(),
  city: z.string(),
  province: z.string().optional(),
  postal_code: z.string(),
  country_code: z.string(),
  phone: z.string().optional(),
});

export type Address = z.infer<typeof AddressSchema>;

// ==================
// STORE SETTINGS SCHEMAS
// ==================

export const SocialLinksSchema = z.object({
  facebook: z.string().nullable().optional(),
  instagram: z.string().nullable().optional(),
  twitter: z.string().nullable().optional(),
  tiktok: z.string().nullable().optional(),
  youtube: z.string().nullable().optional(),
  pinterest: z.string().nullable().optional(),
  linkedin: z.string().nullable().optional(),
});

export type SocialLinks = z.infer<typeof SocialLinksSchema>;

export const StoreFeaturesSchema = z.object({
  reviews_enabled: z.boolean(),
  wishlist_enabled: z.boolean(),
  gift_cards_enabled: z.boolean(),
  guest_checkout_enabled: z.boolean(),
  newsletter_enabled: z.boolean(),
  product_comparison_enabled: z.boolean(),
});

export type StoreFeatures = z.infer<typeof StoreFeaturesSchema>;

export const PublicPoliciesSchema = z.object({
  return_policy_url: z.string().nullable().optional(),
  return_policy_summary: z.string().nullable().optional(),
  shipping_policy_url: z.string().nullable().optional(),
  terms_url: z.string().nullable().optional(),
  privacy_url: z.string().nullable().optional(),
  return_window_days: z.number(),
});

export type PublicPolicies = z.infer<typeof PublicPoliciesSchema>;

export const PublicShippingInfoSchema = z.object({
  free_shipping_threshold: z.number().nullable().optional(),
  international_shipping_enabled: z.boolean(),
  estimated_delivery_days_min: z.number(),
  estimated_delivery_days_max: z.number(),
});

export type PublicShippingInfo = z.infer<typeof PublicShippingInfoSchema>;

export const PublicSeoInfoSchema = z.object({
  meta_title: z.string().nullable().optional(),
  meta_description: z.string().nullable().optional(),
  og_image: z.string().nullable().optional(),
});

export type PublicSeoInfo = z.infer<typeof PublicSeoInfoSchema>;

export const PublicThemeInfoSchema = z.object({
  primary_color: z.string(),
  primary_foreground: z.string(),
  secondary_color: z.string(),
  secondary_foreground: z.string(),
  accent_color: z.string(),
  accent_foreground: z.string(),
  background_color: z.string(),
  foreground_color: z.string(),
  card_color: z.string(),
  card_foreground: z.string(),
  muted_color: z.string(),
  muted_foreground: z.string(),
  border_color: z.string(),
  input_color: z.string(),
  ring_color: z.string(),
  gold_color: z.string(),
  champagne_color: z.string(),
  rose_gold_color: z.string(),
  destructive_color: z.string(),
  heading_font: z.string(),
  body_font: z.string(),
  accent_font: z.string(),
  border_radius: z.string(),
});

export type PublicThemeInfo = z.infer<typeof PublicThemeInfoSchema>;

export const StoreSettingsPublicSchema = z.object({
  id: z.string(),
  store_name: z.string(),
  description: z.string().nullable().optional(),
  logo_url: z.string().nullable().optional(),
  favicon_url: z.string().nullable().optional(),
  contact_email: z.string().nullable().optional(),
  contact_phone: z.string().nullable().optional(),
  social_links: SocialLinksSchema.nullable().optional(),
  timezone: z.string(),
  default_locale: z.string(),
  date_format: z.string(),
  currency_display_format: z.string(),
  features: StoreFeaturesSchema,
  policies: PublicPoliciesSchema.nullable().optional(),
  shipping_info: PublicShippingInfoSchema.nullable().optional(),
  seo: PublicSeoInfoSchema.nullable().optional(),
  theme: PublicThemeInfoSchema.nullable().optional(),
});

export type StoreSettingsPublic = z.infer<typeof StoreSettingsPublicSchema>;

export const StoreSettingsResponseSchema = z.object({
  settings: StoreSettingsPublicSchema,
});

export type StoreSettingsResponse = z.infer<typeof StoreSettingsResponseSchema>;

export const StoreFeaturesResponseSchema = z.object({
  reviews: z.boolean(),
  wishlist: z.boolean(),
  gift_cards: z.boolean(),
  guest_checkout: z.boolean(),
  newsletter: z.boolean(),
  product_comparison: z.boolean(),
  customer_tiers: z.boolean(),
});

export type StoreFeaturesResponse = z.infer<typeof StoreFeaturesResponseSchema>;

// ==================
// REVIEW SCHEMAS
// ==================

export const ReviewImageSchema = z.object({
  url: z.string(),
  thumbnail_url: z.string().nullable().optional(),
  caption: z.string().nullable().optional(),
  sort_order: z.number().optional(),
});

export type ReviewImage = z.infer<typeof ReviewImageSchema>;

export const ReviewSchema = z.object({
  id: z.string(),
  product_id: z.string(),
  customer_id: z.string(),
  customer_name: z.string(),
  customer_avatar: z.string().nullable().optional(),
  rating: z.number(),
  title: z.string(),
  content: z.string(),
  pros: z.array(z.string()).nullable().optional(),
  cons: z.array(z.string()).nullable().optional(),
  images: z.array(ReviewImageSchema).nullable().optional(),
  verified_purchase: z.boolean(),
  variant_title: z.string().nullable().optional(),
  helpful_count: z.number(),
  not_helpful_count: z.number(),
  status: z.string(),
  is_featured: z.boolean(),
  is_edited: z.boolean(),
  admin_response: z.string().nullable().optional(),
  admin_response_at: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Review = z.infer<typeof ReviewSchema>;

export const RatingDistributionItemSchema = z.object({
  stars: z.number(),
  count: z.number(),
  percent: z.number(),
});

export type RatingDistributionItem = z.infer<typeof RatingDistributionItemSchema>;

export const ReviewStatsSchema = z.object({
  product_id: z.string(),
  average_rating: z.union([z.number(), z.string()]).transform(v => typeof v === 'string' ? parseFloat(v) : v),
  total_reviews: z.number(),
  verified_purchase_count: z.number(),
  with_images_count: z.number(),
  recommendation_percent: z.number(),
  rating_distribution: z.array(RatingDistributionItemSchema),
});

export type ReviewStats = z.infer<typeof ReviewStatsSchema>;

export const ReviewListResponseSchema = z.object({
  reviews: z.array(ReviewSchema),
  page: z.number(),
  size: z.number(),
  total: z.number(),
  stats: ReviewStatsSchema.nullable().optional(),
});

export type ReviewListResponse = z.infer<typeof ReviewListResponseSchema>;

export const ReviewResponseSchema = z.object({
  review: ReviewSchema,
});

export type ReviewResponse = z.infer<typeof ReviewResponseSchema>;

export const ReviewStatsResponseSchema = z.object({
  stats: ReviewStatsSchema,
});

export type ReviewStatsResponse = z.infer<typeof ReviewStatsResponseSchema>;

export const BatchReviewStatsResponseSchema = z.object({
  stats: z.record(z.string(), ReviewStatsSchema),
});

export type BatchReviewStatsResponse = z.infer<typeof BatchReviewStatsResponseSchema>;
