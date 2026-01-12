import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  roles: string[];
  emailVerified: boolean;
  customerId?: string | null;
}

interface Customer {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  hasAccount: boolean;
}

interface AuthState {
  user: User | null;
  customer: Customer | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setAuth: (user: User, customer?: Customer | null) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  updateCustomer: (customer: Customer) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      customer: null,
      isAuthenticated: false,
      isLoading: true,

      setAuth: (user, customer = null) =>
        set({
          user,
          customer,
          isAuthenticated: true,
          isLoading: false,
        }),

      clearAuth: () =>
        set({
          user: null,
          customer: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      setLoading: (isLoading) => set({ isLoading }),

      updateCustomer: (customer) => set({ customer }),
    }),
    {
      name: "vernont-auth",
      storage: createJSONStorage(() => localStorage),
      // Only persist user and customer, not loading state
      partialize: (state) => ({
        user: state.user,
        customer: state.customer,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Selector hooks for better performance
export const useUser = () => useAuthStore((state) => state.user);
export const useCustomer = () => useAuthStore((state) => state.customer);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
