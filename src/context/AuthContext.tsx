"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { authApi, customerApi } from "@/lib/api";

// User info - combines auth info with customer profile
interface User {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  customerId?: string | null;
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

interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Check auth status on mount by calling /auth/customer/me
  // If cookies are valid, this returns user info
  // If not authenticated, this throws 401
  const checkAuth = useCallback(async () => {
    try {
      const response = await authApi.getMe();
      // The response has user info (normalized by schema transform)
      if (response?.user) {
        const baseUser = {
          id: response.user.userId || '',
          email: response.user.email || '',
          customerId: response.user.customerId,
        };

        // Try to get customer profile for first/last name
        try {
          const profileResponse = await customerApi.getProfile();
          if (profileResponse.customer) {
            setUser({
              ...baseUser,
              firstName: profileResponse.customer.first_name,
              lastName: profileResponse.customer.last_name,
              phone: profileResponse.customer.phone,
            });
          } else {
            setUser(baseUser);
          }
        } catch {
          // Profile fetch failed, use base user
          setUser(baseUser);
        }
      } else {
        // No user in response, not authenticated
        setUser(null);
      }
    } catch (error) {
      // Not authenticated - cookies invalid or expired
      console.debug("Auth check failed:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Backend sets HTTP-only cookies automatically
      await authApi.login({ email, password });
      // Fetch full user info including profile
      await checkAuth();
    } finally {
      setIsLoading(false);
    }
  }, [checkAuth]);

  const loginWithGoogle = useCallback(async (idToken: string) => {
    setIsLoading(true);
    try {
      await authApi.loginWithGoogle({ idToken });
      // Fetch full user info including profile
      await checkAuth();
    } finally {
      setIsLoading(false);
    }
  }, [checkAuth]);

  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    try {
      await authApi.register(data);
      // Fetch full user info including profile
      await checkAuth();
    } finally {
      setIsLoading(false);
    }
  }, [checkAuth]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
    } catch (error) {
      // Ignore logout errors - clear state anyway
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    await checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        loginWithGoogle,
        register,
        logout,
        refreshUser,
      }}
    >
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
