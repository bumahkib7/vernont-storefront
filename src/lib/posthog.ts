import posthog from "posthog-js";

/**
 * PostHog Analytics Utility
 *
 * Tracking functions for e-commerce events that match backend analytics.
 * All events use the same user ID (distinctId) for correlation with backend.
 *
 * Important: These events link with backend PostHogService for complete
 * analytics including session replays, error tracking, and funnel analysis.
 */

// Track product view
export function trackProductView(productId: string, productTitle: string, price?: number) {
  posthog.capture("product_viewed", {
    product_id: productId,
    product_title: productTitle,
    price: price || 0,
  });
}

// Track add to cart
export function trackAddToCart(
  productId: string,
  variantId: string | null,
  quantity: number,
  price: number
) {
  posthog.capture("cart_add", {
    product_id: productId,
    variant_id: variantId || "",
    quantity,
    price,
  });
}

// Track remove from cart
export function trackRemoveFromCart(productId: string, variantId: string | null) {
  posthog.capture("cart_remove", {
    product_id: productId,
    variant_id: variantId || "",
  });
}

// Track checkout started
export function trackCheckoutStarted(cartValue: number, itemCount: number) {
  posthog.capture("checkout_started", {
    cart_value: cartValue,
    item_count: itemCount,
  });
}

// Track purchase
export function trackPurchase(
  orderId: string,
  total: number,
  itemCount: number,
  paymentMethod: string
) {
  posthog.capture("purchase", {
    order_id: orderId,
    total,
    item_count: itemCount,
    payment_method: paymentMethod,
  });
}

// Track user registration
export function trackUserRegistration(email: string, method: string = "email") {
  posthog.capture("user_registered", {
    method,
  });
  // Also identify the user
  posthog.identify(undefined, {
    email,
    registration_method: method,
  });
}

// Track user login
export function trackUserLogin(userId: string, method: string = "email") {
  posthog.identify(userId);
  posthog.capture("user_logged_in", {
    method,
  });
}

// Track product search
export function trackProductSearch(query: string, resultsCount: number) {
  posthog.capture("product_searched", {
    query,
    results_count: resultsCount,
  });
}

// Track search with no results
export function trackSearchNoResults(query: string) {
  posthog.capture("search_no_results", {
    query,
  });
}

// Track add to wishlist
export function trackAddToWishlist(productId: string, productTitle: string) {
  posthog.capture("wishlist_add", {
    product_id: productId,
    product_title: productTitle,
  });
}

// Track remove from wishlist
export function trackRemoveFromWishlist(productId: string) {
  posthog.capture("wishlist_remove", {
    product_id: productId,
  });
}

// Track filter applied
export function trackFilterApplied(filterType: string, filterValue: string) {
  posthog.capture("filter_applied", {
    filter_type: filterType,
    filter_value: filterValue,
  });
}

// Track newsletter signup
export function trackNewsletterSignup(email: string) {
  posthog.capture("newsletter_signup", {
    email,
  });
}

// Track user logout
export function trackUserLogout() {
  posthog.capture("user_logged_out");
  posthog.reset();
}
