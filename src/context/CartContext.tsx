"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { cartApi, Cart, CartLineItem, ApiError } from "@/lib/api";

const CART_ID_KEY = "vernont-cart-id";
const CURRENCY_KEY = "vernont-currency";

interface CartContextType {
  // Cart state
  cart: Cart | null;
  items: CartLineItem[];
  isOpen: boolean;
  loading: boolean;
  error: string | null;

  // Computed
  itemCount: number;
  subtotal: number;
  total: number;

  // Currency
  currency: string;
  setCurrency: (currency: string) => void;

  // Cart operations
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  removeItem: (lineItemId: string) => Promise<void>;
  updateQuantity: (lineItemId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  refreshCart: () => Promise<void>;

  // UI state
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const currencyRates: Record<string, number> = {
  GBP: 1,
  EUR: 1.17,
  USD: 1.27,
  AED: 4.66,
  CHF: 1.12,
};

const currencySymbols: Record<string, string> = {
  GBP: "£",
  EUR: "€",
  USD: "$",
  AED: "د.إ",
  CHF: "CHF",
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currency, setCurrencyState] = useState("GBP");
  const [initialized, setInitialized] = useState(false);

  // Get cart ID from storage
  const getCartId = useCallback((): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(CART_ID_KEY);
  }, []);

  // Save cart ID to storage
  const saveCartId = useCallback((cartId: string) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(CART_ID_KEY, cartId);
  }, []);

  // Clear cart ID from storage
  const clearCartId = useCallback(() => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(CART_ID_KEY);
  }, []);

  // Initialize cart on mount
  useEffect(() => {
    const initCart = async () => {
      if (initialized) return;

      // Load currency preference
      const savedCurrency = localStorage.getItem(CURRENCY_KEY);
      if (savedCurrency) {
        setCurrencyState(savedCurrency);
      }

      const cartId = getCartId();
      if (cartId) {
        try {
          setLoading(true);
          const response = await cartApi.get(cartId);
          setCart(response.cart);
        } catch (err) {
          // Cart not found or expired, clear it
          if (err instanceof ApiError && err.status === 404) {
            clearCartId();
          }
          console.warn("Failed to load cart:", err);
        } finally {
          setLoading(false);
        }
      }
      setInitialized(true);
    };

    initCart();
  }, [initialized, getCartId, clearCartId]);

  // Save currency preference
  const setCurrency = useCallback((newCurrency: string) => {
    setCurrencyState(newCurrency);
    if (typeof window !== "undefined") {
      localStorage.setItem(CURRENCY_KEY, newCurrency);
    }
  }, []);

  // Ensure cart exists (create if needed)
  const ensureCart = useCallback(async (): Promise<Cart> => {
    if (cart) return cart;

    const cartId = getCartId();
    if (cartId) {
      try {
        const response = await cartApi.get(cartId);
        setCart(response.cart);
        return response.cart;
      } catch {
        // Cart expired or not found
        clearCartId();
      }
    }

    // Create new cart
    const response = await cartApi.create({
      currency_code: currency.toLowerCase(),
    });
    setCart(response.cart);
    saveCartId(response.cart.id);
    return response.cart;
  }, [cart, currency, getCartId, clearCartId, saveCartId]);

  // Refresh cart from server
  const refreshCart = useCallback(async () => {
    const cartId = getCartId();
    if (!cartId) return;

    try {
      setLoading(true);
      const response = await cartApi.get(cartId);
      setCart(response.cart);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        clearCartId();
        setCart(null);
      }
    } finally {
      setLoading(false);
    }
  }, [getCartId, clearCartId]);

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
      setIsOpen(true); // Open cart drawer when item added
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to add item to cart";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [ensureCart]);

  // Remove item from cart
  const removeItem = useCallback(async (lineItemId: string) => {
    if (!cart) return;

    setLoading(true);
    setError(null);

    try {
      const response = await cartApi.removeLineItem(cart.id, lineItemId);
      setCart(response.cart);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to remove item";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [cart]);

  // Update item quantity
  const updateQuantity = useCallback(async (lineItemId: string, quantity: number) => {
    if (!cart) return;

    if (quantity < 1) {
      await removeItem(lineItemId);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await cartApi.updateLineItem(cart.id, lineItemId, { quantity });
      setCart(response.cart);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update quantity";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [cart, removeItem]);

  // Clear cart (local state only - doesn't delete from server)
  const clearCart = useCallback(() => {
    clearCartId();
    setCart(null);
    setError(null);
  }, [clearCartId]);

  // UI state handlers
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);

  // Computed values
  const items = cart?.items ?? [];
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  // Prices from backend are in minor units (cents)
  const subtotal = cart?.subtotal ?? 0;
  const total = cart?.total ?? 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        items,
        isOpen,
        loading,
        error,
        itemCount,
        subtotal,
        total,
        currency,
        setCurrency,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        refreshCart,
        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

// Format price from minor units (cents) to display string
export function formatPrice(priceMinor: number, currency: string = "GBP"): string {
  const price = priceMinor / 100;
  const converted = price * currencyRates[currency];
  const symbol = currencySymbols[currency];
  return `${symbol}${converted.toFixed(2)}`;
}

// Format price that's already in major units
export function formatPriceMajor(price: number, currency: string = "GBP"): string {
  const converted = price * currencyRates[currency];
  const symbol = currencySymbols[currency];
  return `${symbol}${converted.toFixed(2)}`;
}

export { currencySymbols };
