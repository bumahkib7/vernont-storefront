"use client";

import { createContext, useContext, ReactNode } from "react";
import { useCart as useCartHook } from "@/hooks/useCart";
import { Cart, CartLineItem } from "@/lib/api";

// Currency formatting utilities
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

/**
 * CartProvider - Backwards compatible wrapper around Zustand + TanStack Query
 *
 * This provides the same API as the old CartContext but uses:
 * - TanStack Query for server state management
 * - Zustand for UI state (cart drawer open/close, currency)
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const {
    cart,
    items,
    itemCount,
    subtotal,
    total,
    isLoading,
    error,
    isCartOpen,
    openCart,
    closeCart,
    toggleCart,
    currency,
    setCurrency,
    addItem,
    updateQuantity,
    removeItem,
    refreshCart,
    clearCart,
  } = useCartHook();

  const value: CartContextType = {
    cart: cart ?? null,
    items,
    isOpen: isCartOpen,
    loading: isLoading,
    error: error?.message ?? null,
    itemCount,
    subtotal,
    total,
    currency,
    setCurrency,
    addItem: async (variantId, quantity = 1) => {
      await addItem(variantId, quantity);
    },
    removeItem: async (lineItemId) => {
      await removeItem(lineItemId);
    },
    updateQuantity: async (lineItemId, quantity) => {
      await updateQuantity(lineItemId, quantity);
    },
    clearCart,
    refreshCart: async () => {
      await refreshCart();
    },
    openCart,
    closeCart,
    toggleCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

/**
 * useCart hook - for backwards compatibility
 * Prefer using useCartHook from @/hooks/useCart directly
 */
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
