"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useEffect, useRef } from "react";
import { productsApi } from "@/lib/api";

const MAX_COMPARE_ITEMS = 3;
const LOCAL_STORAGE_KEY = "vernont-compare";

interface CompareItem {
  id: string;
  name: string;
  brand?: string;
  thumbnail?: string;
  price: number; // Major units (e.g., 200 for £200)
  originalPrice?: number;
  handle: string;
  frameShape?: string;
  frameMaterial?: string;
  lensType?: string[];
  measurements?: {
    lensWidth?: number | null;
    bridgeWidth?: number | null;
    templeLength?: number | null;
    lensHeight?: number | null;
  };
  uvProtection?: string;
  weight?: number;
  madeIn?: string;
}

interface CompareContextType {
  items: CompareItem[];
  itemIds: string[];
  addToCompare: (item: CompareItem) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  isComparing: (id: string) => boolean;
  isCompareFull: boolean;
  itemCount: number;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CompareItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!saved) return [];

      const parsed = JSON.parse(saved) as CompareItem[];
      // Migrate old data: prices > 10000 are likely in minor units (pence)
      // Convert them to major units by dividing by 100
      const migrated = parsed.map(item => ({
        ...item,
        price: item.price > 10000 ? item.price / 100 : item.price,
        originalPrice: item.originalPrice && item.originalPrice > 10000
          ? item.originalPrice / 100
          : item.originalPrice,
      }));

      // Save migrated data
      if (JSON.stringify(migrated) !== saved) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(migrated));
      }

      return migrated;
    } catch {
      return [];
    }
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Persist to localStorage
  const saveToLocalStorage = useCallback((newItems: CompareItem[]) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newItems));
    } catch (error) {
      console.error("Failed to save compare items:", error);
    }
  }, []);

  // Track which product IDs we've already fetched specs for
  const fetchedSpecsRef = useRef<Set<string>>(new Set());

  // Fetch specs for items that don't have them yet
  useEffect(() => {
    for (const item of items) {
      if (fetchedSpecsRef.current.has(item.id)) continue;
      if (item.frameShape || item.frameMaterial || item.measurements) continue;

      fetchedSpecsRef.current.add(item.id);

      productsApi.getSpecifications(item.id).then((specs) => {
        if (!specs) return;
        setItems((prev) => {
          const updated = prev.map((i) => {
            if (i.id !== item.id) return i;
            return {
              ...i,
              frameShape: i.frameShape || specs.frame?.shape || undefined,
              frameMaterial: i.frameMaterial || specs.frame?.material || undefined,
              madeIn: i.madeIn || specs.madeIn || undefined,
              uvProtection: i.uvProtection || specs.lens?.uvProtection || undefined,
              lensType: i.lensType || (specs.lens?.technology ? [specs.lens.technology] : undefined),
              measurements: i.measurements || (specs.measurements ? {
                lensWidth: specs.measurements.lensWidth ?? undefined,
                bridgeWidth: specs.measurements.bridgeWidth ?? undefined,
                templeLength: specs.measurements.templeLength ?? undefined,
                lensHeight: specs.measurements.lensHeight ?? undefined,
              } : undefined),
            };
          });
          saveToLocalStorage(updated);
          return updated;
        });
      });
    }
  }, [items, saveToLocalStorage]);

  // Add item to compare
  const addToCompare = useCallback(
    (item: CompareItem) => {
      setItems((prev) => {
        // Don't add if already comparing or at max
        if (prev.some((i) => i.id === item.id) || prev.length >= MAX_COMPARE_ITEMS) {
          return prev;
        }
        const newItems = [...prev, item];
        saveToLocalStorage(newItems);
        return newItems;
      });
    },
    [saveToLocalStorage]
  );

  // Remove item from compare
  const removeFromCompare = useCallback(
    (id: string) => {
      setItems((prev) => {
        const newItems = prev.filter((item) => item.id !== id);
        saveToLocalStorage(newItems);
        return newItems;
      });
    },
    [saveToLocalStorage]
  );

  // Clear all items
  const clearCompare = useCallback(() => {
    setItems([]);
    saveToLocalStorage([]);
  }, [saveToLocalStorage]);

  // Check if item is being compared
  const isComparing = useCallback((id: string) => items.some((item) => item.id === id), [items]);

  // Drawer controls
  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
  const toggleDrawer = useCallback(() => setIsDrawerOpen((prev) => !prev), []);

  return (
    <CompareContext.Provider
      value={{
        items,
        itemIds: items.map((i) => i.id),
        addToCompare,
        removeFromCompare,
        clearCompare,
        isComparing,
        isCompareFull: items.length >= MAX_COMPARE_ITEMS,
        itemCount: items.length,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        toggleDrawer,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
}
