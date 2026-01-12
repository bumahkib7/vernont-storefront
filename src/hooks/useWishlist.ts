import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { favoritesApi } from "@/lib/api";
import { useWishlistStore } from "@/stores/wishlist";
import { useAuthStore } from "@/stores/auth";
import { useEffect } from "react";

// Query keys
export const wishlistKeys = {
  all: ["wishlist"] as const,
  list: () => [...wishlistKeys.all, "list"] as const,
};

/**
 * Hook to fetch wishlist from server (for authenticated users)
 */
export function useWishlistQuery() {
  const { isAuthenticated } = useAuthStore();
  const { setItems } = useWishlistStore();

  const query = useQuery({
    queryKey: wishlistKeys.list(),
    queryFn: async () => {
      const response = await favoritesApi.list();
      return response.favorites;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Sync to Zustand store when data changes
  useEffect(() => {
    if (query.data) {
      setItems(
        query.data.map((f) => f.productId),
        query.data.map((f) => ({
          productId: f.productId,
          productHandle: f.productHandle,
          productTitle: f.productTitle,
          productThumbnail: f.productThumbnail,
        }))
      );
    }
  }, [query.data, setItems]);

  return query;
}

/**
 * Hook to sync local wishlist to server (after login)
 */
export function useSyncWishlist() {
  const queryClient = useQueryClient();
  const { setItems } = useWishlistStore();

  return useMutation({
    mutationFn: async (productIds: string[]) => {
      const response = await favoritesApi.sync(productIds);
      return response.favorites;
    },
    onSuccess: (favorites) => {
      setItems(
        favorites.map((f) => f.productId),
        favorites.map((f) => ({
          productId: f.productId,
          productHandle: f.productHandle,
          productTitle: f.productTitle,
          productThumbnail: f.productThumbnail,
        }))
      );
      queryClient.invalidateQueries({ queryKey: wishlistKeys.list() });
    },
  });
}

/**
 * Hook to add item to wishlist
 */
export function useAddToWishlist() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const { addItem, removeItem } = useWishlistStore();

  return useMutation({
    mutationFn: async (productId: string) => {
      if (isAuthenticated) {
        return await favoritesApi.add(productId);
      }
      // For guests, just return a minimal object
      return { productId };
    },
    onMutate: async (productId) => {
      // Optimistic update
      addItem({ productId });
      return { productId };
    },
    onSuccess: (favorite, productId) => {
      if (isAuthenticated && 'productTitle' in favorite && favorite.productTitle) {
        // Update with full details from server
        const { updateItemDetails } = useWishlistStore.getState();
        updateItemDetails(productId, {
          productHandle: favorite.productHandle || null,
          productTitle: favorite.productTitle,
          productThumbnail: favorite.productThumbnail || null,
        });
      }
    },
    onError: (_err, productId) => {
      // Revert on error
      removeItem(productId);
    },
    onSettled: () => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: wishlistKeys.list() });
      }
    },
  });
}

/**
 * Hook to remove item from wishlist
 */
export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const { addItem, removeItem } = useWishlistStore();

  return useMutation({
    mutationFn: async (productId: string) => {
      if (isAuthenticated) {
        await favoritesApi.remove(productId);
      }
      return productId;
    },
    onMutate: async (productId) => {
      // Snapshot for rollback
      const { itemDetails } = useWishlistStore.getState();
      const removedItem = itemDetails.find((item) => item.productId === productId);
      // Optimistic update
      removeItem(productId);
      return { productId, removedItem };
    },
    onError: (_err, _productId, context) => {
      // Revert on error
      if (context?.removedItem) {
        addItem(context.removedItem);
      }
    },
    onSettled: () => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: wishlistKeys.list() });
      }
    },
  });
}

/**
 * Combined hook for wishlist functionality
 */
export function useWishlist() {
  const { items, itemDetails } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();
  const { isLoading, refetch } = useWishlistQuery();
  const addMutation = useAddToWishlist();
  const removeMutation = useRemoveFromWishlist();
  const syncMutation = useSyncWishlist();

  // Sync local items to backend when user logs in
  useEffect(() => {
    if (isAuthenticated && items.length > 0) {
      syncMutation.mutate(items);
    }
  }, [isAuthenticated]); // Only run when auth state changes

  const isInWishlist = (productId: string) => items.includes(productId);

  const toggleItem = async (productId: string) => {
    if (isInWishlist(productId)) {
      await removeMutation.mutateAsync(productId);
    } else {
      await addMutation.mutateAsync(productId);
    }
  };

  return {
    items,
    itemDetails,
    itemCount: items.length,
    isLoading: isLoading || addMutation.isPending || removeMutation.isPending,

    // Actions
    addItem: (productId: string) => addMutation.mutateAsync(productId),
    removeItem: (productId: string) => removeMutation.mutateAsync(productId),
    toggleItem,
    isInWishlist,
    refresh: refetch,
  };
}
