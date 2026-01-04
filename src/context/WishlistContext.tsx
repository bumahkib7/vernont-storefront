"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface WishlistContextType {
  items: string[];
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
  toggleItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  itemCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("vernont-wishlist");
    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("vernont-wishlist", JSON.stringify(items));
  }, [items]);

  const addItem = (id: string) => {
    setItems((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item !== id));
  };

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isInWishlist = (id: string) => items.includes(id);

  return (
    <WishlistContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        toggleItem,
        isInWishlist,
        itemCount: items.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
