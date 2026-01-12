import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartApi, Cart, CartResponse } from "@/lib/api";
import { useUIStore } from "@/stores/ui";

// Query keys
export const cartKeys = {
  all: ["cart"] as const,
  current: () => [...cartKeys.all, "current"] as const,
};

/**
 * Hook to fetch current cart from server (via HTTP-only cookie session)
 */
export function useCartQuery() {
  return useQuery({
    queryKey: cartKeys.current(),
    queryFn: async () => {
      const response = await cartApi.getCurrent();
      return response?.cart ?? null;
    },
    staleTime: 60 * 1000, // Cart is fresh for 1 minute
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    retry: 1,
  });
}

/**
 * Hook to add item to cart
 */
export function useAddToCart() {
  const queryClient = useQueryClient();
  const { openCart, currency } = useUIStore();

  return useMutation({
    mutationFn: async ({ variantId, quantity = 1 }: { variantId: string; quantity?: number }) => {
      // Get current cart or create new one
      let cart = queryClient.getQueryData<Cart | null>(cartKeys.current());

      if (!cart) {
        // Try to get from server first
        const response = await cartApi.getCurrent();
        cart = response?.cart ?? null;

        if (!cart) {
          // Create new cart
          const createResponse = await cartApi.create({
            currency_code: currency.toLowerCase(),
          });
          cart = createResponse.cart;
        }
      }

      // Add item to cart
      const response = await cartApi.addLineItem(cart.id, {
        variant_id: variantId,
        quantity,
      });

      return response.cart;
    },
    onSuccess: (cart) => {
      // Update cache with new cart data
      queryClient.setQueryData(cartKeys.current(), cart);
      // Open cart drawer
      openCart();
    },
    onError: (error) => {
      console.error("Failed to add item to cart:", error);
    },
  });
}

/**
 * Hook to update item quantity
 */
export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      lineItemId,
      quantity,
    }: {
      lineItemId: string;
      quantity: number;
    }) => {
      const cart = queryClient.getQueryData<Cart | null>(cartKeys.current());
      if (!cart) throw new Error("No cart found");

      if (quantity < 1) {
        // Remove item
        const response = await cartApi.removeLineItem(cart.id, lineItemId);
        return response.cart;
      }

      const response = await cartApi.updateLineItem(cart.id, lineItemId, { quantity });
      return response.cart;
    },
    // Optimistic update for better UX
    onMutate: async ({ lineItemId, quantity }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: cartKeys.current() });

      // Snapshot previous value
      const previousCart = queryClient.getQueryData<Cart | null>(cartKeys.current());

      // Optimistically update
      if (previousCart) {
        const updatedCart = {
          ...previousCart,
          items: quantity < 1
            ? previousCart.items.filter((item) => item.id !== lineItemId)
            : previousCart.items.map((item) =>
                item.id === lineItemId ? { ...item, quantity } : item
              ),
        };
        queryClient.setQueryData(cartKeys.current(), updatedCart);
      }

      return { previousCart };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.current(), context.previousCart);
      }
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: cartKeys.current() });
    },
  });
}

/**
 * Hook to remove item from cart
 */
export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lineItemId: string) => {
      const cart = queryClient.getQueryData<Cart | null>(cartKeys.current());
      if (!cart) throw new Error("No cart found");

      const response = await cartApi.removeLineItem(cart.id, lineItemId);
      return response.cart;
    },
    // Optimistic update
    onMutate: async (lineItemId) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.current() });
      const previousCart = queryClient.getQueryData<Cart | null>(cartKeys.current());

      if (previousCart) {
        const updatedCart = {
          ...previousCart,
          items: previousCart.items.filter((item) => item.id !== lineItemId),
        };
        queryClient.setQueryData(cartKeys.current(), updatedCart);
      }

      return { previousCart };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.current(), context.previousCart);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.current() });
    },
  });
}

/**
 * Hook to update cart (email, shipping address, etc.)
 */
export function useUpdateCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Parameters<typeof cartApi.update>[1]) => {
      const cart = queryClient.getQueryData<Cart | null>(cartKeys.current());
      if (!cart) throw new Error("No cart found");

      const response = await cartApi.update(cart.id, data);
      return response.cart;
    },
    onSuccess: (cart) => {
      queryClient.setQueryData(cartKeys.current(), cart);
    },
  });
}

/**
 * Hook to add shipping method to cart
 */
export function useAddShippingMethod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (optionId: string) => {
      const cart = queryClient.getQueryData<Cart | null>(cartKeys.current());
      if (!cart) throw new Error("No cart found");

      const response = await cartApi.addShippingMethod(cart.id, { option_id: optionId });
      return response.cart;
    },
    onSuccess: (cart) => {
      queryClient.setQueryData(cartKeys.current(), cart);
    },
  });
}

/**
 * Hook to clear cart from cache (after successful checkout)
 */
export function useClearCart() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.setQueryData(cartKeys.current(), null);
    queryClient.invalidateQueries({ queryKey: cartKeys.current() });
  };
}

/**
 * Combined hook that provides all cart functionality
 * Similar API to the old CartContext but using TanStack Query
 */
export function useCart() {
  const { data: cart, isLoading, error, refetch } = useCartQuery();
  const addToCart = useAddToCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const updateCart = useUpdateCart();
  const addShipping = useAddShippingMethod();
  const clearCart = useClearCart();

  const { isCartOpen, openCart, closeCart, toggleCart, currency, setCurrency } = useUIStore();

  const items = cart?.items ?? [];
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart?.subtotal ?? 0;
  const total = cart?.total ?? 0;

  return {
    // Cart data
    cart,
    items,
    itemCount,
    subtotal,
    total,

    // Loading states
    isLoading,
    error,
    isAddingItem: addToCart.isPending,
    isUpdating: updateItem.isPending || removeItem.isPending,

    // Currency
    currency,
    setCurrency,

    // UI state
    isCartOpen,
    openCart,
    closeCart,
    toggleCart,

    // Actions
    addItem: (variantId: string, quantity?: number) =>
      addToCart.mutateAsync({ variantId, quantity }),
    updateQuantity: (lineItemId: string, quantity: number) =>
      updateItem.mutateAsync({ lineItemId, quantity }),
    removeItem: (lineItemId: string) => removeItem.mutateAsync(lineItemId),
    updateCart: updateCart.mutateAsync,
    addShippingMethod: (optionId: string) => addShipping.mutateAsync(optionId),
    refreshCart: refetch,
    clearCart,
  };
}
