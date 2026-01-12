"use client";

import { createContext, useContext, ReactNode } from "react";
import { useWishlist as useWishlistHook } from "@/hooks/useWishlist";

interface WishlistItem {
  productId: string;
  productHandle?: string | null;
  productTitle?: string | null;
  productThumbnail?: string | null;
}

interface WishlistContextType {
  items: string[];
  itemDetails: WishlistItem[];
  addItem: (id: string) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  toggleItem: (id: string) => Promise<void>;
  isInWishlist: (id: string) => boolean;
  itemCount: number;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

/**
 * WishlistProvider - Backwards compatible wrapper around Zustand + TanStack Query
 */
export function WishlistProvider({ children }: { children: ReactNode }) {
  const {
    items,
    itemDetails,
    itemCount,
    isLoading,
    addItem,
    removeItem,
    toggleItem,
    isInWishlist,
    refresh,
  } = useWishlistHook();

  const value: WishlistContextType = {
    items,
    itemDetails,
    itemCount,
    isLoading,
    addItem: async (id) => {
      await addItem(id);
    },
    removeItem: async (id) => {
      await removeItem(id);
    },
    toggleItem: async (id) => {
      await toggleItem(id);
    },
    isInWishlist,
    refresh: async () => {
      await refresh();
    },
  };

  return (
    <WishlistContext.Provider value={value}>
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
