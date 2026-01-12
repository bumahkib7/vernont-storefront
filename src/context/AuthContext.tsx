"use client";

import { createContext, useContext, ReactNode } from "react";
import { useAuth as useAuthHook } from "@/hooks/useAuth";

// User info - combines auth info with customer profile
interface User {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  customerId?: string | null;
}

interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

interface AuthContextType {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider - Backwards compatible wrapper around Zustand + TanStack Query
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    user: authUser,
    customer,
    isAuthenticated,
    isLoading,
    login: authLogin,
    loginWithGoogle: authGoogleLogin,
    register: authRegister,
    logout: authLogout,
    refreshSession,
  } = useAuthHook();

  // Map to legacy User type
  const user: User | null = authUser
    ? {
        id: authUser.id,
        email: authUser.email,
        firstName: customer?.firstName ?? authUser.firstName,
        lastName: customer?.lastName ?? authUser.lastName,
        phone: customer?.phone,
        customerId: authUser.customerId,
      }
    : null;

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login: async (email, password) => {
      await authLogin({ email, password });
    },
    loginWithGoogle: async (idToken) => {
      await authGoogleLogin({ idToken });
    },
    register: async (data) => {
      await authRegister(data);
    },
    logout: async () => {
      await authLogout();
    },
    refreshUser: async () => {
      await refreshSession();
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
