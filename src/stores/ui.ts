import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UIState {
  // Cart drawer
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Search
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;

  // Mobile menu
  isMobileMenuOpen: boolean;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleMobileMenu: () => void;

  // Currency (persisted)
  currency: string;
  setCurrency: (currency: string) => void;

  // Notifications
  notification: { message: string; type: "success" | "error" | "info" } | null;
  showNotification: (message: string, type?: "success" | "error" | "info") => void;
  clearNotification: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Cart drawer
      isCartOpen: false,
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

      // Search
      isSearchOpen: false,
      openSearch: () => set({ isSearchOpen: true }),
      closeSearch: () => set({ isSearchOpen: false }),
      toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),

      // Mobile menu
      isMobileMenuOpen: false,
      openMobileMenu: () => set({ isMobileMenuOpen: true }),
      closeMobileMenu: () => set({ isMobileMenuOpen: false }),
      toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

      // Currency
      currency: "GBP",
      setCurrency: (currency) => set({ currency }),

      // Notifications
      notification: null,
      showNotification: (message, type = "info") => {
        set({ notification: { message, type } });
        // Auto-clear after 5 seconds
        setTimeout(() => set({ notification: null }), 5000);
      },
      clearNotification: () => set({ notification: null }),
    }),
    {
      name: "vernont-ui",
      storage: createJSONStorage(() => localStorage),
      // Only persist currency preference
      partialize: (state) => ({
        currency: state.currency,
      }),
    }
  )
);

// Selector hooks
export const useIsCartOpen = () => useUIStore((state) => state.isCartOpen);
export const useCurrency = () => useUIStore((state) => state.currency);
export const useNotification = () => useUIStore((state) => state.notification);
