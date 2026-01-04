"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  itemCount: number;
  subtotal: number;
  currency: string;
  setCurrency: (currency: string) => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  clearCart: () => void;
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
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currency, setCurrency] = useState("GBP");

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("vernont-cart");
    const savedCurrency = localStorage.getItem("vernont-currency");
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
    if (savedCurrency) {
      setCurrency(savedCurrency);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("vernont-cart", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("vernont-currency", currency);
  }, [currency]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const addItem = (newItem: CartItem) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.id === newItem.id && item.size === newItem.size
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += newItem.quantity;
        return updated;
      }
      return [...prev, newItem];
    });
    setIsOpen(true);
  };

  const removeItem = (id: string, size: string) => {
    setItems((prev) => prev.filter((item) => !(item.id === id && item.size === size)));
  };

  const updateQuantity = (id: string, size: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(id, size);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === id && item.size === size ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setItems([]);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        itemCount,
        subtotal,
        currency,
        setCurrency,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
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

export function formatPrice(price: number, currency: string = "GBP"): string {
  const converted = price * currencyRates[currency];
  const symbol = currencySymbols[currency];
  return `${symbol}${converted.toFixed(2)}`;
}

export { currencySymbols };
