import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi, customerApi, ApiError } from "@/lib/api";
import { useAuthStore } from "@/stores/auth";
import { useEffect } from "react";

// Query keys
export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
};

/**
 * Hook to check current auth session on mount
 */
export function useAuthSession() {
  const { setAuth, clearAuth, setLoading, isAuthenticated } = useAuthStore();

  const query = useQuery({
    queryKey: authKeys.me(),
    queryFn: async () => {
      const response = await authApi.getMe();
      return response;
    },
    retry: false, // Don't retry auth check
    staleTime: 5 * 60 * 1000, // Session is fresh for 5 minutes
  });

  // Sync query result to Zustand store
  useEffect(() => {
    if (query.isSuccess && query.data) {
      // Transform API response to match User interface
      const userData = query.data.user;
      const user = {
        id: userData.userId || "",
        email: userData.email,
        roles: userData.roles || [],
        emailVerified: true, // Assume verified if logged in
        customerId: userData.customerId || null,
      };
      setAuth(user, null); // Customer info will be fetched separately if needed
    } else if (query.isError) {
      // Only clear auth if the error is a 401 (unauthorized)
      // This prevents clearing auth on network errors or other issues
      if (query.error instanceof ApiError && query.error.status === 401) {
        clearAuth();
      }
    }
    // Only set loading to false when we have a definitive answer
    // If we're already authenticated (from persisted state), don't show loading
    if (!query.isLoading || isAuthenticated) {
      setLoading(query.isLoading && !isAuthenticated);
    }
  }, [query.isSuccess, query.isError, query.isLoading, query.data, query.error, setAuth, clearAuth, setLoading, isAuthenticated]);

  return query;
}

/**
 * Hook for login
 */
export function useLogin() {
  const queryClient = useQueryClient();
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await authApi.login(data);
      return response;
    },
    onSuccess: (data) => {
      // Transform API response to match User interface
      const userData = data.user;
      const user = userData ? {
        id: userData.id || userData.userId || "",
        email: userData.email || "",
        roles: [],
        emailVerified: false, // Will be updated from /me endpoint
        customerId: userData.customerId || null,
      } : null;
      if (user) {
        setAuth(user, null);
      }
      // Invalidate and refetch auth state to get customer info
      queryClient.invalidateQueries({ queryKey: authKeys.me() });
    },
  });
}

/**
 * Hook for Google login
 */
export function useGoogleLogin() {
  const queryClient = useQueryClient();
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: async (data: { idToken: string }) => {
      const response = await authApi.loginWithGoogle(data);
      return response;
    },
    onSuccess: (data) => {
      // Transform API response to match User interface
      const userData = data.user;
      const user = userData ? {
        id: userData.id || userData.userId || "",
        email: userData.email || "",
        roles: [],
        emailVerified: false, // Will be updated from /me endpoint
        customerId: userData.customerId || null,
      } : null;
      if (user) {
        setAuth(user, null);
      }
      queryClient.invalidateQueries({ queryKey: authKeys.me() });
    },
  });
}

/**
 * Hook for registration
 */
export function useRegister() {
  const queryClient = useQueryClient();
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: async (data: {
      email: string;
      password: string;
      firstName?: string;
      lastName?: string;
    }) => {
      const response = await authApi.register(data);
      return response;
    },
    onSuccess: (data) => {
      // Transform API response to match User interface
      const userData = data.user;
      const user = userData ? {
        id: userData.id || userData.userId || "",
        email: userData.email || "",
        roles: [],
        emailVerified: false, // Will be updated from /me endpoint
        customerId: userData.customerId || null,
      } : null;
      if (user) {
        setAuth(user, null);
      }
      queryClient.invalidateQueries({ queryKey: authKeys.me() });
    },
  });
}

/**
 * Hook for logout
 */
export function useLogout() {
  const queryClient = useQueryClient();
  const { clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      await authApi.logout();
    },
    onSuccess: () => {
      clearAuth();
      // Clear all cached data
      queryClient.clear();
    },
    onError: () => {
      // Still clear local state even if server call fails
      clearAuth();
      queryClient.clear();
    },
  });
}

/**
 * Combined hook for auth state and actions
 */
export function useAuth() {
  const {
    user,
    customer,
    isAuthenticated,
    isLoading: storeLoading,
  } = useAuthStore();

  const { isLoading: queryLoading, refetch } = useAuthSession();
  const login = useLogin();
  const googleLogin = useGoogleLogin();
  const register = useRegister();
  const logout = useLogout();

  return {
    // State
    user,
    customer,
    isAuthenticated,
    isLoading: storeLoading || queryLoading,

    // Mutations
    login: login.mutateAsync,
    loginWithGoogle: googleLogin.mutateAsync,
    register: register.mutateAsync,
    logout: logout.mutateAsync,
    refreshSession: refetch,

    // Loading states
    isLoggingIn: login.isPending,
    isRegistering: register.isPending,
    isLoggingOut: logout.isPending,

    // Errors
    loginError: login.error,
    registerError: register.error,
  };
}
