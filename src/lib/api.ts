/**
 * Vernont Storefront API Client
 * Complete type-safe API client with Zod validation
 */

import { z } from 'zod';
import {
  ProductSchema,
  ProductsListResponseSchema,
  ProductCollectionSchema,
  CollectionsListResponseSchema,
  CategoriesListResponseSchema,
  ProductTagSchema,
  TagsListResponseSchema,
  CartResponseSchema,
  ShippingOptionsResponseSchema,
  PaymentSessionResponseSchema,
  OrderSchema,
  OrderResponseSchema,
  OrderListResponseSchema,
  CompleteCartResponseSchema,
  TrackOrderResponseSchema,
  RegionSchema,
  RegionsListResponseSchema,
  CustomerSchema,
  CustomerResponseSchema,
  CustomerAddressSchema,
  CustomerAddressesResponseSchema,
  AuthResponseSchema,
  MeResponseSchema,
  ReturnResponseSchema,
  ReturnListResponseSchema,
  ReturnEligibilityResponseSchema,
  ExchangeResponseSchema,
  ExchangeListResponseSchema,
  ExchangeEligibilityResponseSchema,
  MarketingPreferenceSchema,
  StoreSettingsResponseSchema,
  StoreFeaturesResponseSchema,
  parseResponse,
  formatPrice,
  priceFromMinor,
  type Product,
  type ProductsListResponse,
  type ProductCollection,
  type CollectionsListResponse,
  type CategoriesListResponse,
  type ProductCategory,
  type ProductTag,
  type TagsListResponse,
  type CartResponse,
  type ShippingOptionsResponse,
  type PaymentSessionResponse,
  type Order,
  type OrderResponse,
  type OrderListResponse,
  type CompleteCartResponse,
  type TrackOrderResponse,
  type Region,
  type RegionsListResponse,
  type CustomerResponse,
  type CustomerAddress,
  type CustomerAddressesResponse,
  type AuthResponse,
  type MeResponse,
  type ReturnResponse,
  type ReturnListResponse,
  type ReturnEligibilityResponse,
  type ExchangeResponse,
  type ExchangeListResponse,
  type ExchangeEligibilityResponse,
  type MarketingPreference,
  type Address,
  type StoreSettingsResponse,
  type StoreFeaturesResponse,
} from './schemas';

// Re-export types and utilities
export * from './schemas';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// API Error
export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Utility function for making API requests with optional Zod validation
// Authentication is handled via HTTP-only cookies (credentials: 'include')
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  schema?: z.ZodSchema<T>
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Send HTTP-only cookies with requests
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: 'An error occurred' };
    }

    throw new ApiError(
      response.status,
      errorData.error?.code || 'UNKNOWN_ERROR',
      errorData.error?.message || errorData.message || 'An error occurred'
    );
  }

  const data = await response.json();

  if (schema) {
    return parseResponse(schema, data);
  }

  return data as T;
}

// ==================
// AUTH API
// ==================
// Authentication uses HTTP-only cookies set by the backend
// No token handling needed in frontend - cookies are sent automatically
export const authApi = {
  async register(data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }): Promise<AuthResponse> {
    // Backend sets HTTP-only cookies automatically
    return apiRequest<AuthResponse>(
      '/auth/customer/emailpass/register',
      { method: 'POST', body: JSON.stringify(data) },
      AuthResponseSchema
    );
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    // Backend sets HTTP-only cookies automatically
    return apiRequest<AuthResponse>(
      '/auth/customer/emailpass',
      { method: 'POST', body: JSON.stringify(data) },
      AuthResponseSchema
    );
  },

  async loginWithGoogle(data: { idToken: string }): Promise<AuthResponse> {
    // Backend sets HTTP-only cookies automatically
    return apiRequest<AuthResponse>(
      '/auth/customer/google',
      { method: 'POST', body: JSON.stringify(data) },
      AuthResponseSchema
    );
  },

  async getMe(): Promise<MeResponse> {
    // Cookies are sent automatically with credentials: 'include'
    return apiRequest('/auth/customer/me', {}, MeResponseSchema);
  },

  async refresh(): Promise<AuthResponse> {
    // Refresh token is in HTTP-only cookie, backend reads it automatically
    return apiRequest<AuthResponse>(
      '/auth/refresh',
      { method: 'POST' },
      AuthResponseSchema
    );
  },

  async logout(): Promise<void> {
    // Backend clears HTTP-only cookies
    await apiRequest('/auth/logout', { method: 'POST' });
  },

  async forgotPassword(email: string): Promise<void> {
    await apiRequest('/api/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async resetPassword(data: { token: string; password: string }): Promise<void> {
    await apiRequest('/api/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async deleteAccount(): Promise<{ status: string }> {
    return apiRequest<{ status: string }>(
      '/auth/customer/delete',
      { method: 'DELETE' },
      z.object({ status: z.string() })
    );
  },
};

// ==================
// PRODUCTS API
// ==================
export const productsApi = {
  async list(params?: {
    categoryId?: string;
    categoryIds?: string[];
    brandId?: string;
    brandIds?: string[];
    handle?: string;
    query?: string;
    minPrice?: number;
    maxPrice?: number;
    onSale?: boolean;
    sortBy?: string;
    sortDirection?: string;
    limit?: number;
    page?: number;
    currencyCode?: string;
  }): Promise<ProductsListResponse> {
    const searchParams = new URLSearchParams();
    if (params) {
      if (params.categoryId) searchParams.append('categoryId', params.categoryId);
      if (params.categoryIds) params.categoryIds.forEach(id => searchParams.append('categoryIds', id));
      if (params.brandId) searchParams.append('brandId', params.brandId);
      if (params.brandIds) params.brandIds.forEach(id => searchParams.append('brandIds', id));
      if (params.handle) searchParams.append('handle', params.handle);
      if (params.query) searchParams.append('query', params.query);
      if (params.minPrice) searchParams.append('minPrice', String(params.minPrice));
      if (params.maxPrice) searchParams.append('maxPrice', String(params.maxPrice));
      if (params.onSale !== undefined) searchParams.append('onSale', String(params.onSale));
      if (params.sortBy) searchParams.append('sortBy', params.sortBy);
      if (params.sortDirection) searchParams.append('sortDirection', params.sortDirection);
      if (params.limit) searchParams.append('size', String(params.limit));
      if (params.page) searchParams.append('page', String(params.page));
      if (params.currencyCode) searchParams.append('currencyCode', params.currencyCode);
    }
    const query = searchParams.toString();
    return apiRequest(
      `/storefront/products${query ? `?${query}` : ''}`,
      {},
      ProductsListResponseSchema
    );
  },

  async getByHandle(handle: string, currencyCode?: string): Promise<{ product: Product }> {
    // Fetch products and find by handle client-side (backend may not filter by handle correctly)
    const params = new URLSearchParams({ size: '100' });
    if (currencyCode) params.append('currencyCode', currencyCode);

    const response = await apiRequest<ProductsListResponse>(
      `/storefront/products?${params.toString()}`,
      {},
      ProductsListResponseSchema
    );

    const product = response.items.find(p => p.handle === handle);
    if (!product) {
      throw new ApiError(404, 'NOT_FOUND', `Product with handle '${handle}' not found`);
    }

    return { product };
  },

  async getById(id: string, currencyCode?: string): Promise<{ product: Product }> {
    // Use the list endpoint - products are returned with id
    const params = new URLSearchParams({ size: '50' });
    if (currencyCode) params.append('currencyCode', currencyCode);

    const response = await apiRequest<ProductsListResponse>(
      `/storefront/products?${params.toString()}`,
      {},
      ProductsListResponseSchema
    );

    const product = response.items.find(p => p.id === id);
    if (!product) {
      throw new ApiError(404, 'NOT_FOUND', `Product with id '${id}' not found`);
    }

    return { product };
  },

  async search(query: string, limit = 10): Promise<{ products: Product[] }> {
    const response = await apiRequest<ProductsListResponse>(
      `/storefront/products?query=${encodeURIComponent(query)}&size=${limit}`,
      {},
      ProductsListResponseSchema
    );
    return { products: response.items };
  },

  async getSuggestions(query: string, limit = 5): Promise<{ products: string[]; brands: string[] }> {
    if (query.length < 2) {
      return { products: [], brands: [] };
    }
    return apiRequest(
      `/storefront/products/suggestions?query=${encodeURIComponent(query)}&limit=${limit}`
    );
  },
};

// ==================
// COLLECTIONS API
// ==================
export const collectionsApi = {
  async list(): Promise<CollectionsListResponse> {
    return apiRequest('/store/collections', {}, CollectionsListResponseSchema);
  },

  async getByHandle(handle: string): Promise<{ collection: ProductCollection }> {
    return apiRequest(
      `/store/collections/${handle}`,
      {},
      z.object({ collection: ProductCollectionSchema })
    );
  },

  async getProducts(handle: string, params?: {
    limit?: number;
    offset?: number;
    currency?: string;
  }): Promise<ProductsListResponse> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, String(value));
      });
    }
    const query = searchParams.toString();
    return apiRequest(
      `/store/collections/${handle}/products${query ? `?${query}` : ''}`,
      {},
      ProductsListResponseSchema
    );
  },
};

// ==================
// CATEGORIES API
// ==================
export const categoriesApi = {
  async list(): Promise<CategoriesListResponse> {
    return apiRequest('/store/product-categories', {}, CategoriesListResponseSchema);
  },

  async getByHandle(handle: string): Promise<{ product_category: ProductCategory }> {
    // First fetch with handle filter
    const response = await apiRequest(
      `/store/product-categories?handle=${encodeURIComponent(handle)}`,
      {},
      CategoriesListResponseSchema
    );
    const category = response.product_categories[0];
    if (!category) {
      throw new Error(`Category not found: ${handle}`);
    }
    return { product_category: category };
  },

  async getProducts(handle: string, params?: {
    limit?: number;
    offset?: number;
    currency?: string;
  }): Promise<ProductsListResponse> {
    // First get the category by handle to get its ID
    const { product_category } = await categoriesApi.getByHandle(handle);

    // Then fetch products by category ID
    const searchParams = new URLSearchParams();
    searchParams.append('categoryId', product_category.id);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, String(value));
      });
    }
    return apiRequest(
      `/store/products?${searchParams.toString()}`,
      {},
      ProductsListResponseSchema
    );
  },
};

// ==================
// TAGS API
// ==================
export const tagsApi = {
  async list(params?: {
    offset?: number;
    limit?: number;
    order?: string;
    q?: string;
  }): Promise<TagsListResponse> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, String(value));
      });
    }
    const query = searchParams.toString();
    return apiRequest(
      `/store/product-tags${query ? `?${query}` : ''}`,
      {},
      TagsListResponseSchema
    );
  },

  async getById(id: string): Promise<{ product_tag: ProductTag }> {
    return apiRequest(
      `/store/product-tags/${id}`,
      {},
      z.object({ product_tag: ProductTagSchema })
    );
  },
};

// ==================
// CART API
// ==================
export const cartApi = {
  async create(data?: {
    region_id?: string;
    email?: string;
    currency_code?: string;
    items?: Array<{ variant_id: string; quantity: number }>;
  }): Promise<CartResponse> {
    return apiRequest(
      '/store/carts',
      { method: 'POST', body: data ? JSON.stringify(data) : undefined },
      CartResponseSchema
    );
  },

  async get(cartId: string): Promise<CartResponse> {
    return apiRequest(`/store/carts/${cartId}`, {}, CartResponseSchema);
  },

  async update(cartId: string, data: {
    email?: string;
    region_id?: string;
    promo_codes?: string[];
    gift_card_code?: string;
    shipping_address?: Address;
    billing_address?: Address | { address_id?: string };
  }): Promise<CartResponse> {
    return apiRequest(
      `/store/carts/${cartId}`,
      { method: 'POST', body: JSON.stringify(data) },
      CartResponseSchema
    );
  },

  async addLineItem(cartId: string, data: { variant_id: string; quantity: number }): Promise<CartResponse> {
    return apiRequest(
      `/store/carts/${cartId}/line-items`,
      { method: 'POST', body: JSON.stringify(data) },
      CartResponseSchema
    );
  },

  async updateLineItem(cartId: string, lineId: string, data: { quantity: number }): Promise<CartResponse> {
    return apiRequest(
      `/store/carts/${cartId}/line-items/${lineId}`,
      { method: 'POST', body: JSON.stringify(data) },
      CartResponseSchema
    );
  },

  async removeLineItem(cartId: string, lineId: string): Promise<CartResponse> {
    return apiRequest(
      `/store/carts/${cartId}/line-items/${lineId}`,
      { method: 'DELETE' },
      CartResponseSchema
    );
  },

  async addShippingMethod(cartId: string, data: { option_id: string }): Promise<CartResponse> {
    return apiRequest(
      `/store/carts/${cartId}/shipping-methods`,
      { method: 'POST', body: JSON.stringify(data) },
      CartResponseSchema
    );
  },

  async createPaymentSession(cartId: string, data?: {
    email?: string;
    metadata?: Record<string, string>;
    gift_card_code?: string;
  }): Promise<PaymentSessionResponse> {
    return apiRequest(
      `/store/carts/${cartId}/payment-sessions`,
      { method: 'POST', body: data ? JSON.stringify(data) : undefined },
      PaymentSessionResponseSchema
    );
  },

  async confirmPayment(cartId: string, paymentIntentId: string): Promise<CompleteCartResponse> {
    return apiRequest(
      `/store/carts/${cartId}/confirm-payment`,
      { method: 'POST', body: JSON.stringify({ payment_intent_id: paymentIntentId }) },
      CompleteCartResponseSchema
    );
  },

  async complete(cartId: string): Promise<CompleteCartResponse> {
    return apiRequest(`/store/carts/${cartId}/complete`, { method: 'POST' }, CompleteCartResponseSchema);
  },

  async validateGiftCard(cartId: string, code: string): Promise<{ valid: boolean; balance?: number; currency_code?: string; error?: string }> {
    const response = await fetch(`${API_BASE_URL}/store/carts/${cartId}/gift-cards/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ code }),
    });
    const data = await response.json();
    if (!response.ok) {
      return { valid: false, error: data.error || 'Invalid gift card' };
    }
    return data;
  },
};

// ==================
// SHIPPING API
// ==================
export const shippingApi = {
  async getOptions(cartId?: string): Promise<ShippingOptionsResponse> {
    const params = cartId ? `?cart_id=${cartId}` : '';
    return apiRequest(`/store/shipping-options${params}`, {}, ShippingOptionsResponseSchema);
  },

  async getByRegion(regionId: string): Promise<ShippingOptionsResponse> {
    return apiRequest(`/store/shipping-options?region_id=${regionId}`, {}, ShippingOptionsResponseSchema);
  },
};

// ==================
// REGIONS API
// ==================
export const regionsApi = {
  async list(): Promise<RegionsListResponse> {
    return apiRequest('/store/regions', {}, RegionsListResponseSchema);
  },

  async get(regionId: string): Promise<{ region: Region }> {
    return apiRequest(`/store/regions/${regionId}`, {}, z.object({ region: RegionSchema }));
  },
};

// ==================
// CUSTOMER API
// ==================
export const customerApi = {
  async getProfile(fields?: string): Promise<CustomerResponse> {
    const query = fields ? `?fields=${fields}` : '';
    return apiRequest(`/store/customers/me${query}`, {}, CustomerResponseSchema);
  },

  async updateProfile(data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
  }): Promise<CustomerResponse> {
    return apiRequest(
      '/store/customers/me',
      { method: 'POST', body: JSON.stringify(data) },
      CustomerResponseSchema
    );
  },

  async listAddresses(): Promise<CustomerAddressesResponse> {
    return apiRequest('/store/customers/me/addresses', {}, CustomerAddressesResponseSchema);
  },

  async createAddress(data: {
    first_name?: string;
    last_name?: string;
    company?: string;
    address_1: string;
    address_2?: string;
    city: string;
    country_code: string;
    province?: string;
    postal_code: string;
    phone?: string;
    metadata?: Record<string, unknown>;
  }): Promise<CustomerResponse> {
    return apiRequest(
      '/store/customers/me/addresses',
      { method: 'POST', body: JSON.stringify(data) },
      CustomerResponseSchema
    );
  },

  async updateAddress(addressId: string, data: {
    first_name?: string;
    last_name?: string;
    company?: string;
    address_1?: string;
    address_2?: string;
    city?: string;
    country_code?: string;
    province?: string;
    postal_code?: string;
    phone?: string;
    metadata?: Record<string, unknown>;
  }): Promise<CustomerResponse> {
    return apiRequest(
      `/store/customers/me/addresses/${addressId}`,
      { method: 'POST', body: JSON.stringify(data) },
      CustomerResponseSchema
    );
  },

  async deleteAddress(addressId: string): Promise<{ address: CustomerAddress }> {
    return apiRequest(
      `/store/customers/me/addresses/${addressId}`,
      { method: 'DELETE' },
      z.object({ address: CustomerAddressSchema })
    );
  },
};

// ==================
// ORDERS API
// ==================
export const ordersApi = {
  async list(params?: { offset?: number; limit?: number }): Promise<OrderListResponse> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, String(value));
      });
    }
    const query = searchParams.toString();
    return apiRequest(`/store/orders${query ? `?${query}` : ''}`, {}, OrderListResponseSchema);
  },

  async get(orderId: string): Promise<OrderResponse> {
    return apiRequest(`/store/orders/${orderId}`, {}, OrderResponseSchema);
  },

  async createFromCart(data: {
    cartId: string;
    customerId?: string;
    email: string;
  }): Promise<OrderResponse> {
    return apiRequest(
      '/store/orders/from-cart',
      { method: 'POST', body: JSON.stringify(data) },
      OrderResponseSchema
    );
  },

  async cancel(orderId: string, data?: { reason?: string; token?: string }): Promise<{ message: string }> {
    return apiRequest(
      `/store/orders/${orderId}/cancel`,
      { method: 'POST', body: data ? JSON.stringify(data) : undefined },
      z.object({ message: z.string() })
    );
  },

  async track(data: { orderNumber: string; email: string }): Promise<TrackOrderResponse> {
    return apiRequest(
      '/store/orders/track',
      { method: 'POST', body: JSON.stringify(data) },
      TrackOrderResponseSchema
    );
  },
};

// ==================
// RETURNS API
// ==================
export const returnsApi = {
  async create(data: {
    orderId: string;
    items: Array<{ orderLineItemId: string; quantity: number }>;
    reason: string;
    reasonNote?: string;
  }): Promise<ReturnResponse> {
    return apiRequest(
      '/store/returns',
      { method: 'POST', body: JSON.stringify(data) },
      ReturnResponseSchema
    );
  },

  async list(params?: { offset?: number; limit?: number }): Promise<ReturnListResponse> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, String(value));
      });
    }
    const query = searchParams.toString();
    return apiRequest(`/store/returns${query ? `?${query}` : ''}`, {}, ReturnListResponseSchema);
  },

  async get(returnId: string): Promise<ReturnResponse> {
    return apiRequest(`/store/returns/${returnId}`, {}, ReturnResponseSchema);
  },

  async cancel(returnId: string): Promise<{ message: string }> {
    return apiRequest(
      `/store/returns/${returnId}`,
      { method: 'DELETE' },
      z.object({ message: z.string() })
    );
  },

  async checkEligibility(orderId: string): Promise<ReturnEligibilityResponse> {
    return apiRequest(
      `/store/returns/orders/${orderId}/return-eligibility`,
      {},
      ReturnEligibilityResponseSchema
    );
  },
};

// ==================
// EXCHANGES API
// ==================
export const exchangesApi = {
  async create(data: {
    orderId: string;
    items: Array<{
      orderLineItemId: string;
      quantity: number;
      newVariantId: string;
      reason?: string;
    }>;
    note?: string;
  }): Promise<ExchangeResponse> {
    return apiRequest(
      '/store/exchanges',
      { method: 'POST', body: JSON.stringify(data) },
      ExchangeResponseSchema
    );
  },

  async list(params?: { offset?: number; limit?: number }): Promise<ExchangeListResponse> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, String(value));
      });
    }
    const query = searchParams.toString();
    return apiRequest(`/store/exchanges${query ? `?${query}` : ''}`, {}, ExchangeListResponseSchema);
  },

  async checkEligibility(orderId: string): Promise<ExchangeEligibilityResponse> {
    return apiRequest(
      `/store/exchanges/orders/${orderId}/eligibility`,
      {},
      ExchangeEligibilityResponseSchema
    );
  },
};

// ==================
// MARKETING API
// ==================
export const marketingApi = {
  async getPreferences(customerId: string): Promise<MarketingPreference> {
    return apiRequest(
      `/store/marketing/preferences/${customerId}`,
      {},
      MarketingPreferenceSchema
    );
  },

  async updatePreferences(customerId: string, data: {
    marketingEmailsEnabled?: boolean;
    priceDropAlertsEnabled?: boolean;
    newArrivalsEnabled?: boolean;
    weeklyDigestEnabled?: boolean;
    promotionalEnabled?: boolean;
    emailFrequency?: 'DAILY' | 'WEEKLY' | 'MONTHLY';
    preferredCategories?: string[];
    preferredBrands?: string[];
    excludedCategories?: string[];
    excludedBrands?: string[];
  }): Promise<MarketingPreference> {
    return apiRequest(
      `/store/marketing/preferences/${customerId}`,
      { method: 'PATCH', body: JSON.stringify(data) },
      MarketingPreferenceSchema
    );
  },

  async unsubscribe(customerId: string, reason?: string): Promise<void> {
    await apiRequest(
      `/store/marketing/preferences/${customerId}/unsubscribe`,
      { method: 'POST', body: reason ? JSON.stringify({ reason }) : undefined }
    );
  },

  async resubscribe(customerId: string): Promise<MarketingPreference> {
    return apiRequest(
      `/store/marketing/preferences/${customerId}/resubscribe`,
      { method: 'POST' },
      MarketingPreferenceSchema
    );
  },

  async publicSubscribe(data: {
    email: string;
    firstName?: string;
    lastName?: string;
  }): Promise<{ status: string }> {
    return apiRequest(
      '/store/marketing/preferences/public/subscribe-email',
      { method: 'POST', body: JSON.stringify(data) },
      z.object({ status: z.string() })
    );
  },
};

// ==================
// STORE SETTINGS API
// ==================
export const storeSettingsApi = {
  /**
   * Get public store settings for storefront
   */
  async getSettings(storeId: string): Promise<StoreSettingsResponse> {
    return apiRequest(
      `/store/settings/${storeId}`,
      {},
      StoreSettingsResponseSchema
    );
  },

  /**
   * Get feature flags only (lighter request)
   */
  async getFeatures(storeId: string): Promise<StoreFeaturesResponse> {
    return apiRequest(
      `/store/settings/${storeId}/features`,
      {},
      StoreFeaturesResponseSchema
    );
  },

  /**
   * Get shipping info only
   */
  async getShipping(storeId: string): Promise<Record<string, unknown>> {
    return apiRequest(`/store/settings/${storeId}/shipping`);
  },

  /**
   * Get policies only
   */
  async getPolicies(storeId: string): Promise<Record<string, unknown>> {
    return apiRequest(`/store/settings/${storeId}/policies`);
  },
};

// ==================
// FAVORITES/WISHLIST API
// ==================

// Favorites schemas
const FavoriteSchema = z.object({
  id: z.string(),
  productId: z.string(),
  productHandle: z.string().nullable(),
  productTitle: z.string().nullable(),
  productThumbnail: z.string().nullable(),
  alertEnabled: z.boolean(),
  priceThreshold: z.number().nullable(),
  createdAt: z.string(),
});

const FavoritesListResponseSchema = z.object({
  favorites: z.array(FavoriteSchema),
});

const FavoriteCheckResponseSchema = z.object({
  productId: z.string(),
  isFavorite: z.boolean(),
});

const CheckFavoritesResponseSchema = z.object({
  favorites: z.record(z.string(), z.boolean()),
});

export type Favorite = z.infer<typeof FavoriteSchema>;
export type FavoritesListResponse = z.infer<typeof FavoritesListResponseSchema>;

export const favoritesApi = {
  /**
   * Get all favorites for logged-in user
   */
  async list(): Promise<FavoritesListResponse> {
    return apiRequest('/store/favorites', {}, FavoritesListResponseSchema);
  },

  /**
   * Add product to favorites
   */
  async add(productId: string, alertEnabled = false): Promise<Favorite> {
    return apiRequest(
      '/store/favorites',
      {
        method: 'POST',
        body: JSON.stringify({ productId, alertEnabled }),
      },
      FavoriteSchema
    );
  },

  /**
   * Remove product from favorites
   */
  async remove(productId: string): Promise<void> {
    await apiRequest(`/store/favorites/${productId}`, { method: 'DELETE' }, z.any());
  },

  /**
   * Check if product is in favorites
   */
  async check(productId: string): Promise<boolean> {
    const response = await apiRequest(
      `/store/favorites/check/${productId}`,
      {},
      FavoriteCheckResponseSchema
    );
    return response.isFavorite;
  },

  /**
   * Check multiple products at once
   */
  async checkMultiple(productIds: string[]): Promise<Record<string, boolean>> {
    const response = await apiRequest(
      '/store/favorites/check',
      {
        method: 'POST',
        body: JSON.stringify({ productIds }),
      },
      CheckFavoritesResponseSchema
    );
    return response.favorites;
  },

  /**
   * Sync favorites from localStorage (for migration after login)
   */
  async sync(productIds: string[]): Promise<FavoritesListResponse> {
    return apiRequest(
      '/store/favorites/sync',
      {
        method: 'POST',
        body: JSON.stringify({ productIds }),
      },
      FavoritesListResponseSchema
    );
  },

  /**
   * Update favorite settings (alerts, price threshold)
   */
  async update(
    productId: string,
    options: { alertEnabled?: boolean; priceThreshold?: number }
  ): Promise<Favorite> {
    return apiRequest(
      `/store/favorites/${productId}`,
      {
        method: 'PATCH',
        body: JSON.stringify(options),
      },
      FavoriteSchema
    );
  },
};

// Default export with all APIs
const api = {
  auth: authApi,
  products: productsApi,
  collections: collectionsApi,
  categories: categoriesApi,
  tags: tagsApi,
  cart: cartApi,
  shipping: shippingApi,
  regions: regionsApi,
  customer: customerApi,
  orders: ordersApi,
  returns: returnsApi,
  exchanges: exchangesApi,
  marketing: marketingApi,
  storeSettings: storeSettingsApi,
  favorites: favoritesApi,
  utils: { formatPrice, priceFromMinor },
};

export default api;
