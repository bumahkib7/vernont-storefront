import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface WishlistItem {
  productId: string;
  productHandle?: string | null;
  productTitle?: string | null;
  productThumbnail?: string | null;
}

interface WishlistState {
  items: string[];
  itemDetails: WishlistItem[];

  // Actions
  setItems: (items: string[], details?: WishlistItem[]) => void;
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  updateItemDetails: (productId: string, details: Partial<WishlistItem>) => void;
  clear: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      items: [],
      itemDetails: [],

      setItems: (items, details) =>
        set({
          items,
          itemDetails: details ?? items.map((id) => ({ productId: id })),
        }),

      addItem: (item) =>
        set((state) => {
          if (state.items.includes(item.productId)) return state;
          return {
            items: [...state.items, item.productId],
            itemDetails: [...state.itemDetails, item],
          };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((id) => id !== productId),
          itemDetails: state.itemDetails.filter((item) => item.productId !== productId),
        })),

      updateItemDetails: (productId, details) =>
        set((state) => ({
          itemDetails: state.itemDetails.map((item) =>
            item.productId === productId ? { ...item, ...details } : item
          ),
        })),

      clear: () => set({ items: [], itemDetails: [] }),
    }),
    {
      name: "vernont-wishlist",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Selector hooks
export const useWishlistItems = () => useWishlistStore((state) => state.items);
export const useWishlistDetails = () => useWishlistStore((state) => state.itemDetails);
export const useIsInWishlist = (productId: string) =>
  useWishlistStore((state) => state.items.includes(productId));
