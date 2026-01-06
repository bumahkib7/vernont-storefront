"use client";

import { useState, useCallback, useEffect } from 'react';
import { cartApi, Cart, PaymentSession, CompleteCartResponse, ApiError } from '@/lib/api';

const CART_ID_KEY = 'vernont-cart-id';

/**
 * Hook for managing cart state with the backend API
 * This can be used alongside or instead of the local CartContext
 */
export function useApiCart() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentSession, setPaymentSession] = useState<PaymentSession | null>(null);

  // Get cart ID from storage
  const getCartId = useCallback((): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(CART_ID_KEY);
  }, []);

  // Save cart ID to storage
  const saveCartId = useCallback((cartId: string) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CART_ID_KEY, cartId);
  }, []);

  // Clear cart ID from storage
  const clearCartId = useCallback(() => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(CART_ID_KEY);
  }, []);

  // Initialize cart on mount
  useEffect(() => {
    const cartId = getCartId();
    if (cartId) {
      fetchCart(cartId);
    }
  }, []);

  // Fetch existing cart
  const fetchCart = useCallback(async (cartId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await cartApi.get(cartId);
      setCart(response.cart);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        // Cart not found, clear the stored ID
        clearCartId();
        setCart(null);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to fetch cart');
      }
    } finally {
      setLoading(false);
    }
  }, [clearCartId]);

  // Create a new cart
  const createCart = useCallback(async (data?: {
    region_id?: string;
    email?: string;
    currency_code?: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await cartApi.create(data);
      setCart(response.cart);
      saveCartId(response.cart.id);
      return response.cart;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create cart');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [saveCartId]);

  // Ensure cart exists, create if not
  const ensureCart = useCallback(async (data?: {
    region_id?: string;
    email?: string;
    currency_code?: string;
  }): Promise<Cart> => {
    const cartId = getCartId();

    if (cartId && cart) {
      return cart;
    }

    if (cartId) {
      try {
        const response = await cartApi.get(cartId);
        setCart(response.cart);
        return response.cart;
      } catch {
        // Cart not found, create new one
      }
    }

    return createCart(data);
  }, [getCartId, cart, createCart]);

  // Add item to cart
  const addItem = useCallback(async (variantId: string, quantity: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      const currentCart = await ensureCart();
      const response = await cartApi.addLineItem(currentCart.id, {
        variant_id: variantId,
        quantity,
      });
      setCart(response.cart);
      return response.cart;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [ensureCart]);

  // Update item quantity
  const updateItem = useCallback(async (lineId: string, quantity: number) => {
    if (!cart) return;

    setLoading(true);
    setError(null);

    try {
      const response = await cartApi.updateLineItem(cart.id, lineId, { quantity });
      setCart(response.cart);
      return response.cart;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update item');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [cart]);

  // Remove item from cart
  const removeItem = useCallback(async (lineId: string) => {
    if (!cart) return;

    setLoading(true);
    setError(null);

    try {
      const response = await cartApi.removeLineItem(cart.id, lineId);
      setCart(response.cart);
      return response.cart;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove item');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [cart]);

  // Update cart (email, shipping address, etc.)
  const updateCart = useCallback(async (data: {
    email?: string;
    region_id?: string;
    promo_codes?: string[];
    shipping_address?: {
      first_name: string;
      last_name: string;
      address_1: string;
      address_2?: string;
      city: string;
      postal_code: string;
      country_code: string;
      phone?: string;
    };
  }) => {
    if (!cart) return;

    setLoading(true);
    setError(null);

    try {
      const response = await cartApi.update(cart.id, data);
      setCart(response.cart);
      return response.cart;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update cart');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [cart]);

  // Add shipping method
  const addShippingMethod = useCallback(async (optionId: string) => {
    if (!cart) return;

    setLoading(true);
    setError(null);

    try {
      const response = await cartApi.addShippingMethod(cart.id, { option_id: optionId });
      setCart(response.cart);
      return response.cart;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add shipping method');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [cart]);

  // Create payment session (Stripe PaymentIntent)
  const createPaymentSession = useCallback(async (email?: string): Promise<PaymentSession> => {
    if (!cart) throw new Error('No cart found');

    setLoading(true);
    setError(null);

    try {
      const response = await cartApi.createPaymentSession(cart.id, { email });
      setPaymentSession(response.payment_session);
      return response.payment_session;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create payment session');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [cart]);

  // Confirm payment and create order
  const confirmPayment = useCallback(async (paymentIntentId: string): Promise<CompleteCartResponse['order']> => {
    if (!cart) throw new Error('No cart found');

    setLoading(true);
    setError(null);

    try {
      const response = await cartApi.confirmPayment(cart.id, paymentIntentId);
      // Clear cart after successful order
      clearCartId();
      setCart(null);
      setPaymentSession(null);
      return response.order;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to confirm payment');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [cart, clearCartId]);

  // Clear cart
  const clearCart = useCallback(() => {
    clearCartId();
    setCart(null);
    setPaymentSession(null);
    setError(null);
  }, [clearCartId]);

  return {
    // State
    cart,
    loading,
    error,
    paymentSession,

    // Computed
    itemCount: cart?.items?.length || 0,
    subtotal: cart?.subtotal || 0,
    total: cart?.total || 0,
    isEmpty: !cart?.items?.length,

    // Actions
    createCart,
    ensureCart,
    fetchCart,
    addItem,
    updateItem,
    removeItem,
    updateCart,
    addShippingMethod,
    createPaymentSession,
    confirmPayment,
    clearCart,
  };
}

export default useApiCart;
