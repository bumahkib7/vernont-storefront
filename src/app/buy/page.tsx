"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAddToCart } from "@/hooks/useCart";

/**
 * Google Shopping Direct Checkout Landing Page
 *
 * This page handles direct checkout links from Google Shopping ads.
 * URL format: /buy?variant_id={id}&quantity={qty}
 *
 * Flow:
 * 1. Extract variant_id and quantity from URL params
 * 2. Add product to cart automatically
 * 3. Redirect to /checkout
 *
 * This keeps Google Shopping traffic separate from normal browsing flow.
 */
export default function BuyNowPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const addToCart = useAddToCart();
  const [error, setError] = useState<string | null>(null);

  const variantId = searchParams.get("variant_id");
  const quantity = parseInt(searchParams.get("quantity") || "1", 10);

  useEffect(() => {
    const addAndRedirect = async () => {
      // Validate variant_id parameter
      if (!variantId) {
        setError("Missing product ID. Please check the link and try again.");
        return;
      }

      try {
        // Add item to cart
        await addToCart.mutateAsync({
          variantId,
          quantity: quantity > 0 ? quantity : 1,
        });

        // Wait briefly to ensure cart is updated
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Redirect to checkout
        router.push("/checkout");
      } catch (err: any) {
        console.error("Failed to add item to cart:", err);
        setError(
          err.message || "Failed to add product to cart. Please try again."
        );
      }
    };

    addAndRedirect();
  }, [variantId, quantity]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {error ? (
          // Error State
          <div className="space-y-6">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto">
              <svg
                className="h-8 w-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2">
                Oops! Something went wrong
              </h1>
              <p className="text-[#666] mb-6">{error}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => router.push("/eyewear")}
                  className="px-6 py-3 bg-[#1A1A1A] text-white text-sm uppercase tracking-wider font-medium hover:bg-black transition-colors"
                >
                  Browse Eyewear
                </button>
                <button
                  onClick={() => router.push("/")}
                  className="px-6 py-3 border border-[#E5E5E5] text-sm uppercase tracking-wider font-medium hover:bg-[#FAFAFA] transition-colors"
                >
                  Go Home
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Loading State
          <div className="space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#FAFAFA] flex items-center justify-center mx-auto">
              <div className="h-8 w-8 border-4 border-[#E5E5E5] border-t-[#1A1A1A] rounded-full animate-spin" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2">
                Adding to cart...
              </h1>
              <p className="text-[#666]">
                Preparing your purchase. You'll be redirected to checkout in a moment.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
