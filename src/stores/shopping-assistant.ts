import { create } from "zustand";

interface ProductContext {
  name: string;
  brand?: string;
  price?: string;
  id: string;
}

interface ShoppingAssistantState {
  isOpen: boolean;
  productContext: ProductContext | null;
  prefillMessage: string | null;
  open: () => void;
  openWithProduct: (product: ProductContext) => void;
  openWithMessage: (message: string) => void;
  close: () => void;
  clearContext: () => void;
}

export const useShoppingAssistantStore = create<ShoppingAssistantState>((set) => ({
  isOpen: false,
  productContext: null,
  prefillMessage: null,
  open: () => set({ isOpen: true }),
  openWithProduct: (product) => set({ isOpen: true, productContext: product }),
  openWithMessage: (message) => set({ isOpen: true, prefillMessage: message }),
  close: () => set({ isOpen: false }),
  clearContext: () => set({ productContext: null, prefillMessage: null }),
}));
