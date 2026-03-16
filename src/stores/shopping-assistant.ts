import { create } from "zustand";

export interface ProductContext {
  name: string;
  brand?: string;
  price?: string;
  id: string;
  image?: string;
  variantId?: string;
}

interface ShoppingAssistantState {
  isOpen: boolean;
  productContext: ProductContext | null;
  prefillMessage: string | null;

  /** Nudge banner shown above the chat bubble */
  nudgeMessage: string | null;
  nudgeDismissed: boolean;

  open: () => void;
  openWithProduct: (product: ProductContext) => void;
  openWithMessage: (message: string) => void;
  close: () => void;
  clearContext: () => void;

  /** Set product context without opening chat (for nudges) */
  setProductContext: (product: ProductContext) => void;

  /** Show a proactive nudge above the bubble */
  showNudge: (message: string) => void;
  dismissNudge: () => void;
}

export const useShoppingAssistantStore = create<ShoppingAssistantState>((set) => ({
  isOpen: false,
  productContext: null,
  prefillMessage: null,
  nudgeMessage: null,
  nudgeDismissed: false,
  open: () => set({ isOpen: true, nudgeMessage: null }),
  openWithProduct: (product) => set({ isOpen: true, productContext: product, nudgeMessage: null }),
  openWithMessage: (message) => set({ isOpen: true, prefillMessage: message, nudgeMessage: null }),
  close: () => set({ isOpen: false }),
  clearContext: () => set({ productContext: null, prefillMessage: null }),
  setProductContext: (product) => set({ productContext: product }),
  showNudge: (message) => set((s) => s.nudgeDismissed ? s : { nudgeMessage: message }),
  dismissNudge: () => set({ nudgeMessage: null, nudgeDismissed: true }),
}));
