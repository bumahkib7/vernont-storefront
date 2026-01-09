'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from '@tanstack/react-query';
import {
  productsApi,
  collectionsApi,
  categoriesApi,
  tagsApi,
  cartApi,
  shippingApi,
  regionsApi,
  authApi,
  customerApi,
  ordersApi,
  returnsApi,
  exchangesApi,
  marketingApi,
  type Product,
  type ProductsListResponse,
  type ProductCollection,
  type CollectionsListResponse,
  type ProductCategory,
  type CategoriesListResponse,
  type ProductTag,
  type TagsListResponse,
  type Cart,
  type CartResponse,
  type ShippingOption,
  type ShippingOptionsResponse,
  type PaymentSession,
  type PaymentSessionResponse,
  type Order,
  type OrderResponse,
  type OrderListResponse,
  type CompleteCartResponse,
  type TrackOrderResponse,
  type Region,
  type RegionsListResponse,
  type Customer,
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
} from './api';

// ==================
// QUERY KEYS
// ==================
export const queryKeys = {
  // Products
  products: {
    all: ['products'] as const,
    list: (params?: Parameters<typeof productsApi.list>[0]) =>
      [...queryKeys.products.all, 'list', params] as const,
    byHandle: (handle: string, currency?: string) =>
      [...queryKeys.products.all, 'handle', handle, currency] as const,
    byId: (id: string, currency?: string) =>
      [...queryKeys.products.all, 'id', id, currency] as const,
    search: (query: string, limit?: number) =>
      [...queryKeys.products.all, 'search', query, limit] as const,
  },

  // Collections
  collections: {
    all: ['collections'] as const,
    list: () => [...queryKeys.collections.all, 'list'] as const,
    byHandle: (handle: string) =>
      [...queryKeys.collections.all, 'handle', handle] as const,
    products: (handle: string, params?: Parameters<typeof collectionsApi.getProducts>[1]) =>
      [...queryKeys.collections.all, 'products', handle, params] as const,
  },

  // Categories
  categories: {
    all: ['categories'] as const,
    list: () => [...queryKeys.categories.all, 'list'] as const,
    products: (handle: string, params?: Parameters<typeof categoriesApi.getProducts>[1]) =>
      [...queryKeys.categories.all, 'products', handle, params] as const,
  },

  // Tags
  tags: {
    all: ['tags'] as const,
    list: (params?: Parameters<typeof tagsApi.list>[0]) =>
      [...queryKeys.tags.all, 'list', params] as const,
    byId: (id: string) => [...queryKeys.tags.all, 'id', id] as const,
  },

  // Cart
  cart: {
    all: ['cart'] as const,
    byId: (cartId: string) => [...queryKeys.cart.all, cartId] as const,
  },

  // Shipping
  shipping: {
    all: ['shipping'] as const,
    options: (cartId: string) => [...queryKeys.shipping.all, 'options', cartId] as const,
    byRegion: (regionId: string) => [...queryKeys.shipping.all, 'region', regionId] as const,
  },

  // Regions
  regions: {
    all: ['regions'] as const,
    list: () => [...queryKeys.regions.all, 'list'] as const,
    byId: (regionId: string) => [...queryKeys.regions.all, regionId] as const,
  },

  // Customer
  customer: {
    all: ['customer'] as const,
    profile: () => [...queryKeys.customer.all, 'profile'] as const,
    addresses: () => [...queryKeys.customer.all, 'addresses'] as const,
  },

  // Auth
  auth: {
    all: ['auth'] as const,
    me: () => [...queryKeys.auth.all, 'me'] as const,
  },

  // Orders
  orders: {
    all: ['orders'] as const,
    list: (params?: { offset?: number; limit?: number }) =>
      [...queryKeys.orders.all, 'list', params] as const,
    byId: (orderId: string) => [...queryKeys.orders.all, orderId] as const,
    track: (orderNumber: string, email: string) =>
      [...queryKeys.orders.all, 'track', orderNumber, email] as const,
  },

  // Returns
  returns: {
    all: ['returns'] as const,
    list: (params?: { offset?: number; limit?: number }) =>
      [...queryKeys.returns.all, 'list', params] as const,
    byId: (returnId: string) => [...queryKeys.returns.all, returnId] as const,
    eligibility: (orderId: string) =>
      [...queryKeys.returns.all, 'eligibility', orderId] as const,
  },

  // Exchanges
  exchanges: {
    all: ['exchanges'] as const,
    list: (params?: { offset?: number; limit?: number }) =>
      [...queryKeys.exchanges.all, 'list', params] as const,
    eligibility: (orderId: string) =>
      [...queryKeys.exchanges.all, 'eligibility', orderId] as const,
  },

  // Marketing
  marketing: {
    all: ['marketing'] as const,
    preferences: (customerId: string) =>
      [...queryKeys.marketing.all, 'preferences', customerId] as const,
  },
} as const;

// ==================
// PRODUCTS HOOKS
// ==================

/**
 * Fetch products list with optional filters
 */
export function useProducts(
  params?: Parameters<typeof productsApi.list>[0],
  options?: Omit<UseQueryOptions<ProductsListResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.products.list(params),
    queryFn: () => productsApi.list(params),
    ...options,
  });
}

/**
 * Fetch a single product by handle
 */
export function useProductByHandle(
  handle: string,
  currency?: string,
  options?: Omit<UseQueryOptions<{ product: Product }>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.products.byHandle(handle, currency),
    queryFn: () => productsApi.getByHandle(handle, currency),
    enabled: !!handle,
    ...options,
  });
}

/**
 * Fetch a single product by ID
 */
export function useProductById(
  id: string,
  currency?: string,
  options?: Omit<UseQueryOptions<{ product: Product }>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.products.byId(id, currency),
    queryFn: () => productsApi.getById(id, currency),
    enabled: !!id,
    ...options,
  });
}

/**
 * Search products
 */
export function useProductSearch(
  query: string,
  limit = 10,
  options?: Omit<UseQueryOptions<{ products: Product[] }>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.products.search(query, limit),
    queryFn: () => productsApi.search(query, limit),
    enabled: query.length >= 2,
    ...options,
  });
}

// ==================
// COLLECTIONS HOOKS
// ==================

/**
 * Fetch all collections
 */
export function useCollections(
  options?: Omit<UseQueryOptions<CollectionsListResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.collections.list(),
    queryFn: () => collectionsApi.list(),
    ...options,
  });
}

/**
 * Fetch a collection by handle
 */
export function useCollectionByHandle(
  handle: string,
  options?: Omit<UseQueryOptions<{ collection: ProductCollection }>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.collections.byHandle(handle),
    queryFn: () => collectionsApi.getByHandle(handle),
    enabled: !!handle,
    ...options,
  });
}

/**
 * Fetch products in a collection
 */
export function useCollectionProducts(
  handle: string,
  params?: Parameters<typeof collectionsApi.getProducts>[1],
  options?: Omit<UseQueryOptions<ProductsListResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.collections.products(handle, params),
    queryFn: () => collectionsApi.getProducts(handle, params),
    enabled: !!handle,
    ...options,
  });
}

// ==================
// CATEGORIES HOOKS
// ==================

/**
 * Fetch all categories
 */
export function useCategories(
  options?: Omit<UseQueryOptions<CategoriesListResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.categories.list(),
    queryFn: () => categoriesApi.list(),
    ...options,
  });
}

/**
 * Fetch products by category
 */
export function useCategoryProducts(
  handle: string,
  params?: Parameters<typeof categoriesApi.getProducts>[1],
  options?: Omit<UseQueryOptions<ProductsListResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.categories.products(handle, params),
    queryFn: () => categoriesApi.getProducts(handle, params),
    enabled: !!handle,
    ...options,
  });
}

// ==================
// TAGS HOOKS
// ==================

/**
 * Fetch all product tags
 */
export function useTags(
  params?: Parameters<typeof tagsApi.list>[0],
  options?: Omit<UseQueryOptions<TagsListResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.tags.list(params),
    queryFn: () => tagsApi.list(params),
    ...options,
  });
}

/**
 * Fetch a tag by ID
 */
export function useTagById(
  id: string,
  options?: Omit<UseQueryOptions<{ product_tag: ProductTag }>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.tags.byId(id),
    queryFn: () => tagsApi.getById(id),
    enabled: !!id,
    ...options,
  });
}

// ==================
// CART HOOKS
// ==================

/**
 * Fetch cart by ID
 */
export function useCart(
  cartId: string | null,
  options?: Omit<UseQueryOptions<CartResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.cart.byId(cartId ?? ''),
    queryFn: () => cartApi.get(cartId!),
    enabled: !!cartId,
    ...options,
  });
}

/**
 * Create a new cart
 */
export function useCreateCart(
  options?: UseMutationOptions<
    CartResponse,
    Error,
    Parameters<typeof cartApi.create>[0]
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => cartApi.create(data),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.cart.byId(data.cart.id), data);
    },
    ...options,
  });
}

/**
 * Update cart
 */
export function useUpdateCart(
  cartId: string,
  options?: UseMutationOptions<
    CartResponse,
    Error,
    Parameters<typeof cartApi.update>[1]
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => cartApi.update(cartId, data),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.cart.byId(cartId), data);
    },
    ...options,
  });
}

/**
 * Add line item to cart
 */
export function useAddToCart(
  cartId: string,
  options?: UseMutationOptions<
    CartResponse,
    Error,
    { variant_id: string; quantity: number }
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => cartApi.addLineItem(cartId, data),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.cart.byId(cartId), data);
    },
    ...options,
  });
}

/**
 * Update line item quantity
 */
export function useUpdateCartItem(
  cartId: string,
  options?: UseMutationOptions<
    CartResponse,
    Error,
    { lineId: string; quantity: number }
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lineId, quantity }) =>
      cartApi.updateLineItem(cartId, lineId, { quantity }),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.cart.byId(cartId), data);
    },
    ...options,
  });
}

/**
 * Remove line item from cart
 */
export function useRemoveCartItem(
  cartId: string,
  options?: UseMutationOptions<CartResponse, Error, string>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lineId) => cartApi.removeLineItem(cartId, lineId),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.cart.byId(cartId), data);
    },
    ...options,
  });
}

/**
 * Add shipping method to cart
 */
export function useAddShippingMethod(
  cartId: string,
  options?: UseMutationOptions<CartResponse, Error, { option_id: string }>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => cartApi.addShippingMethod(cartId, data),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.cart.byId(cartId), data);
    },
    ...options,
  });
}

/**
 * Create payment session
 */
export function useCreatePaymentSession(
  cartId: string,
  options?: UseMutationOptions<
    PaymentSessionResponse,
    Error,
    Parameters<typeof cartApi.createPaymentSession>[1]
  >
) {
  return useMutation({
    mutationFn: (data) => cartApi.createPaymentSession(cartId, data),
    ...options,
  });
}

/**
 * Confirm payment and create order
 */
export function useConfirmPayment(
  cartId: string,
  options?: UseMutationOptions<CompleteCartResponse, Error, string>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentIntentId) => cartApi.confirmPayment(cartId, paymentIntentId),
    onSuccess: () => {
      // Invalidate cart after successful order
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.byId(cartId) });
    },
    ...options,
  });
}

/**
 * Complete cart (create order)
 */
export function useCompleteCart(
  cartId: string,
  options?: UseMutationOptions<CompleteCartResponse, Error, void>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cartApi.complete(cartId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.byId(cartId) });
    },
    ...options,
  });
}

// ==================
// SHIPPING HOOKS
// ==================

/**
 * Fetch shipping options for a cart
 */
export function useShippingOptions(
  cartId: string | null,
  options?: Omit<UseQueryOptions<ShippingOptionsResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.shipping.options(cartId ?? ''),
    queryFn: () => shippingApi.getOptions(cartId!),
    enabled: !!cartId,
    ...options,
  });
}

/**
 * Fetch shipping options by region
 */
export function useShippingOptionsByRegion(
  regionId: string | null,
  options?: Omit<UseQueryOptions<ShippingOptionsResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.shipping.byRegion(regionId ?? ''),
    queryFn: () => shippingApi.getByRegion(regionId!),
    enabled: !!regionId,
    ...options,
  });
}

// ==================
// REGIONS HOOKS
// ==================

/**
 * Fetch all regions
 */
export function useRegions(
  options?: Omit<UseQueryOptions<RegionsListResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.regions.list(),
    queryFn: () => regionsApi.list(),
    ...options,
  });
}

/**
 * Fetch region by ID
 */
export function useRegion(
  regionId: string | null,
  options?: Omit<UseQueryOptions<{ region: Region }>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.regions.byId(regionId ?? ''),
    queryFn: () => regionsApi.get(regionId!),
    enabled: !!regionId,
    ...options,
  });
}

// ==================
// AUTH HOOKS
// ==================

/**
 * Get current authenticated user
 */
export function useMe(
  options?: Omit<UseQueryOptions<MeResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: () => authApi.getMe(),
    retry: false,
    ...options,
  });
}

/**
 * Register a new customer
 */
export function useRegister(
  options?: UseMutationOptions<
    AuthResponse,
    Error,
    Parameters<typeof authApi.register>[0]
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => authApi.register(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
      queryClient.invalidateQueries({ queryKey: queryKeys.customer.profile() });
    },
    ...options,
  });
}

/**
 * Login customer
 */
export function useLogin(
  options?: UseMutationOptions<
    AuthResponse,
    Error,
    Parameters<typeof authApi.login>[0]
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => authApi.login(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
      queryClient.invalidateQueries({ queryKey: queryKeys.customer.profile() });
    },
    ...options,
  });
}

/**
 * Login with Google
 */
export function useLoginWithGoogle(
  options?: UseMutationOptions<AuthResponse, Error, { idToken: string }>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => authApi.loginWithGoogle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
      queryClient.invalidateQueries({ queryKey: queryKeys.customer.profile() });
    },
    ...options,
  });
}

/**
 * Logout customer
 */
export function useLogout(options?: UseMutationOptions<void, Error, void>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: queryKeys.auth.all });
      queryClient.removeQueries({ queryKey: queryKeys.customer.all });
    },
    ...options,
  });
}

/**
 * Delete account
 */
export function useDeleteAccount(options?: UseMutationOptions<{ status: string }, Error, void>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.deleteAccount(),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: queryKeys.auth.all });
      queryClient.removeQueries({ queryKey: queryKeys.customer.all });
    },
    ...options,
  });
}

/**
 * Forgot password
 */
export function useForgotPassword(
  options?: UseMutationOptions<void, Error, string>
) {
  return useMutation({
    mutationFn: (email) => authApi.forgotPassword(email),
    ...options,
  });
}

/**
 * Reset password
 */
export function useResetPassword(
  options?: UseMutationOptions<
    void,
    Error,
    Parameters<typeof authApi.resetPassword>[0]
  >
) {
  return useMutation({
    mutationFn: (data) => authApi.resetPassword(data),
    ...options,
  });
}

/**
 * Refresh token
 */
export function useRefreshToken(
  options?: UseMutationOptions<AuthResponse, Error, void>
) {
  return useMutation({
    mutationFn: () => authApi.refresh(),
    ...options,
  });
}

// ==================
// CUSTOMER HOOKS
// ==================

/**
 * Fetch current customer profile
 */
export function useCustomer(
  options?: Omit<UseQueryOptions<CustomerResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.customer.profile(),
    queryFn: () => customerApi.getProfile(),
    retry: false,
    ...options,
  });
}

/**
 * Update customer profile
 */
export function useUpdateCustomer(
  options?: UseMutationOptions<
    CustomerResponse,
    Error,
    Parameters<typeof customerApi.updateProfile>[0]
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => customerApi.updateProfile(data),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.customer.profile(), data);
    },
    ...options,
  });
}

/**
 * Fetch customer addresses
 */
export function useCustomerAddresses(
  options?: Omit<UseQueryOptions<CustomerAddressesResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.customer.addresses(),
    queryFn: () => customerApi.listAddresses(),
    ...options,
  });
}

/**
 * Create customer address
 */
export function useCreateAddress(
  options?: UseMutationOptions<
    CustomerResponse,
    Error,
    Parameters<typeof customerApi.createAddress>[0]
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => customerApi.createAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customer.addresses() });
      queryClient.invalidateQueries({ queryKey: queryKeys.customer.profile() });
    },
    ...options,
  });
}

/**
 * Update customer address
 */
export function useUpdateAddress(
  options?: UseMutationOptions<
    CustomerResponse,
    Error,
    { addressId: string; data: Parameters<typeof customerApi.updateAddress>[1] }
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ addressId, data }) => customerApi.updateAddress(addressId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customer.addresses() });
      queryClient.invalidateQueries({ queryKey: queryKeys.customer.profile() });
    },
    ...options,
  });
}

/**
 * Delete customer address
 */
export function useDeleteAddress(
  options?: UseMutationOptions<{ address: CustomerAddress }, Error, string>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (addressId) => customerApi.deleteAddress(addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customer.addresses() });
      queryClient.invalidateQueries({ queryKey: queryKeys.customer.profile() });
    },
    ...options,
  });
}

// ==================
// ORDERS HOOKS
// ==================

/**
 * Fetch customer orders
 */
export function useOrders(
  params?: { offset?: number; limit?: number },
  options?: Omit<UseQueryOptions<OrderListResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.orders.list(params),
    queryFn: () => ordersApi.list(params),
    ...options,
  });
}

/**
 * Fetch order by ID
 */
export function useOrder(
  orderId: string | null,
  options?: Omit<UseQueryOptions<OrderResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.orders.byId(orderId ?? ''),
    queryFn: () => ordersApi.get(orderId!),
    enabled: !!orderId,
    ...options,
  });
}

/**
 * Track order by order number and email
 */
export function useTrackOrder(
  orderNumber: string | null,
  email: string,
  options?: Omit<UseQueryOptions<TrackOrderResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.orders.track(orderNumber ?? '', email),
    queryFn: () => ordersApi.track({ orderNumber: orderNumber!, email }),
    enabled: !!orderNumber && !!email,
    ...options,
  });
}

/**
 * Create order from cart
 */
export function useCreateOrderFromCart(
  options?: UseMutationOptions<
    OrderResponse,
    Error,
    Parameters<typeof ordersApi.createFromCart>[0]
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => ordersApi.createFromCart(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
    },
    ...options,
  });
}

/**
 * Cancel order
 */
export function useCancelOrder(
  options?: UseMutationOptions<
    { message: string },
    Error,
    { orderId: string; reason?: string; token?: string }
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, ...data }) => ordersApi.cancel(orderId, data),
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.byId(orderId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.list() });
    },
    ...options,
  });
}

// ==================
// RETURNS HOOKS
// ==================

/**
 * Fetch customer returns
 */
export function useReturns(
  params?: { offset?: number; limit?: number },
  options?: Omit<UseQueryOptions<ReturnListResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.returns.list(params),
    queryFn: () => returnsApi.list(params),
    ...options,
  });
}

/**
 * Fetch return by ID
 */
export function useReturn(
  returnId: string | null,
  options?: Omit<UseQueryOptions<ReturnResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.returns.byId(returnId ?? ''),
    queryFn: () => returnsApi.get(returnId!),
    enabled: !!returnId,
    ...options,
  });
}

/**
 * Check return eligibility for an order
 */
export function useReturnEligibility(
  orderId: string | null,
  options?: Omit<UseQueryOptions<ReturnEligibilityResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.returns.eligibility(orderId ?? ''),
    queryFn: () => returnsApi.checkEligibility(orderId!),
    enabled: !!orderId,
    ...options,
  });
}

/**
 * Create a return request
 */
export function useCreateReturn(
  options?: UseMutationOptions<
    ReturnResponse,
    Error,
    Parameters<typeof returnsApi.create>[0]
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => returnsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.returns.all });
    },
    ...options,
  });
}

/**
 * Cancel a return request
 */
export function useCancelReturn(
  options?: UseMutationOptions<{ message: string }, Error, string>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (returnId) => returnsApi.cancel(returnId),
    onSuccess: (_, returnId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.returns.byId(returnId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.returns.list() });
    },
    ...options,
  });
}

// ==================
// EXCHANGES HOOKS
// ==================

/**
 * Fetch customer exchanges
 */
export function useExchanges(
  params?: { offset?: number; limit?: number },
  options?: Omit<UseQueryOptions<ExchangeListResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.exchanges.list(params),
    queryFn: () => exchangesApi.list(params),
    ...options,
  });
}

/**
 * Check exchange eligibility for an order
 */
export function useExchangeEligibility(
  orderId: string | null,
  options?: Omit<UseQueryOptions<ExchangeEligibilityResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.exchanges.eligibility(orderId ?? ''),
    queryFn: () => exchangesApi.checkEligibility(orderId!),
    enabled: !!orderId,
    ...options,
  });
}

/**
 * Create an exchange request
 */
export function useCreateExchange(
  options?: UseMutationOptions<
    ExchangeResponse,
    Error,
    Parameters<typeof exchangesApi.create>[0]
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => exchangesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.exchanges.all });
    },
    ...options,
  });
}

// ==================
// MARKETING HOOKS
// ==================

/**
 * Fetch marketing preferences
 */
export function useMarketingPreferences(
  customerId: string | null,
  options?: Omit<UseQueryOptions<MarketingPreference>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.marketing.preferences(customerId ?? ''),
    queryFn: () => marketingApi.getPreferences(customerId!),
    enabled: !!customerId,
    ...options,
  });
}

/**
 * Update marketing preferences
 */
export function useUpdateMarketingPreferences(
  customerId: string,
  options?: UseMutationOptions<
    MarketingPreference,
    Error,
    Parameters<typeof marketingApi.updatePreferences>[1]
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => marketingApi.updatePreferences(customerId, data),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.marketing.preferences(customerId), data);
    },
    ...options,
  });
}

/**
 * Unsubscribe from marketing
 */
export function useUnsubscribeMarketing(
  customerId: string,
  options?: UseMutationOptions<void, Error, string | undefined>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reason) => marketingApi.unsubscribe(customerId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.marketing.preferences(customerId) });
    },
    ...options,
  });
}

/**
 * Resubscribe to marketing
 */
export function useResubscribeMarketing(
  customerId: string,
  options?: UseMutationOptions<MarketingPreference, Error, void>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => marketingApi.resubscribe(customerId),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.marketing.preferences(customerId), data);
    },
    ...options,
  });
}

/**
 * Public email subscribe (no auth required)
 */
export function usePublicSubscribe(
  options?: UseMutationOptions<
    { status: string },
    Error,
    Parameters<typeof marketingApi.publicSubscribe>[0]
  >
) {
  return useMutation({
    mutationFn: (data) => marketingApi.publicSubscribe(data),
    ...options,
  });
}
