"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { favoritesApi, type Favorite } from "@/lib/api";

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

const LOCAL_STORAGE_KEY = "vernont-wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [items, setItems] = useState<string[]>([]);
  const [itemDetails, setItemDetails] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Load from localStorage (for guests or initial load)
  const loadFromLocalStorage = useCallback(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setItems(parsed);
        setItemDetails(parsed.map((id: string) => ({ productId: id })));
      }
    } catch (error) {
      console.error("Failed to load wishlist from localStorage:", error);
    }
  }, []);

  // Save to localStorage
  const saveToLocalStorage = useCallback((productIds: string[]) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(productIds));
    } catch (error) {
      console.error("Failed to save wishlist to localStorage:", error);
    }
  }, []);

  // Load from backend API
  const loadFromApi = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await favoritesApi.list();
      const productIds = response.favorites.map((f) => f.productId);
      setItems(productIds);
      setItemDetails(
        response.favorites.map((f) => ({
          productId: f.productId,
          productHandle: f.productHandle,
          productTitle: f.productTitle,
          productThumbnail: f.productThumbnail,
        }))
      );
      // Also update localStorage for offline access
      saveToLocalStorage(productIds);
    } catch (error) {
      console.error("Failed to load wishlist from API:", error);
      // Fallback to localStorage
      loadFromLocalStorage();
    } finally {
      setIsLoading(false);
    }
  }, [loadFromLocalStorage, saveToLocalStorage]);

  // Sync localStorage items to backend (after login)
  const syncToBackend = useCallback(async () => {
    const localItems = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!localItems) return;

    try {
      const productIds = JSON.parse(localItems);
      if (productIds.length > 0) {
        const response = await favoritesApi.sync(productIds);
        const newIds = response.favorites.map((f) => f.productId);
        setItems(newIds);
        setItemDetails(
          response.favorites.map((f) => ({
            productId: f.productId,
            productHandle: f.productHandle,
            productTitle: f.productTitle,
            productThumbnail: f.productThumbnail,
          }))
        );
        saveToLocalStorage(newIds);
      }
    } catch (error) {
      console.error("Failed to sync wishlist to backend:", error);
    }
  }, [saveToLocalStorage]);

  // Initialize wishlist
  useEffect(() => {
    if (authLoading) return;

    if (isAuthenticated) {
      // User is logged in - sync any local items then load from API
      syncToBackend().then(() => loadFromApi());
    } else {
      // Guest - use localStorage only
      loadFromLocalStorage();
    }
    setHasInitialized(true);
  }, [isAuthenticated, authLoading, loadFromApi, loadFromLocalStorage, syncToBackend]);

  // Add item
  const addItem = useCallback(
    async (id: string) => {
      // Optimistic update
      setItems((prev) => (prev.includes(id) ? prev : [...prev, id]));
      setItemDetails((prev) =>
        prev.some((item) => item.productId === id)
          ? prev
          : [...prev, { productId: id }]
      );

      if (isAuthenticated) {
        try {
          const favorite = await favoritesApi.add(id);
          // Update with full details from server
          setItemDetails((prev) =>
            prev.map((item) =>
              item.productId === id
                ? {
                    productId: favorite.productId,
                    productHandle: favorite.productHandle,
                    productTitle: favorite.productTitle,
                    productThumbnail: favorite.productThumbnail,
                  }
                : item
            )
          );
        } catch (error) {
          console.error("Failed to add to wishlist:", error);
          // Revert on error
          setItems((prev) => prev.filter((item) => item !== id));
          setItemDetails((prev) => prev.filter((item) => item.productId !== id));
        }
      }

      // Always update localStorage
      saveToLocalStorage([...items, id]);
    },
    [isAuthenticated, items, saveToLocalStorage]
  );

  // Remove item
  const removeItem = useCallback(
    async (id: string) => {
      // Optimistic update
      setItems((prev) => prev.filter((item) => item !== id));
      setItemDetails((prev) => prev.filter((item) => item.productId !== id));

      if (isAuthenticated) {
        try {
          await favoritesApi.remove(id);
        } catch (error) {
          console.error("Failed to remove from wishlist:", error);
          // Revert on error
          setItems((prev) => [...prev, id]);
          setItemDetails((prev) => [...prev, { productId: id }]);
        }
      }

      // Always update localStorage
      saveToLocalStorage(items.filter((item) => item !== id));
    },
    [isAuthenticated, items, saveToLocalStorage]
  );

  // Toggle item
  const toggleItem = useCallback(
    async (id: string) => {
      if (items.includes(id)) {
        await removeItem(id);
      } else {
        await addItem(id);
      }
    },
    [items, addItem, removeItem]
  );

  // Check if in wishlist
  const isInWishlist = useCallback((id: string) => items.includes(id), [items]);

  // Refresh wishlist
  const refresh = useCallback(async () => {
    if (isAuthenticated) {
      await loadFromApi();
    } else {
      loadFromLocalStorage();
    }
  }, [isAuthenticated, loadFromApi, loadFromLocalStorage]);

  return (
    <WishlistContext.Provider
      value={{
        items,
        itemDetails,
        addItem,
        removeItem,
        toggleItem,
        isInWishlist,
        itemCount: items.length,
        isLoading,
        refresh,
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
