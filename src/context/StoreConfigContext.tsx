"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useMemo,
} from "react";
import {
  storeSettingsApi,
  type StoreSettingsPublic,
  type PublicThemeInfo,
  type StoreFeatures,
  type SocialLinks,
  type PublicPolicies,
  type PublicShippingInfo,
  type PublicSeoInfo,
} from "@/lib/api";

// Default store ID - can be configured via env or detected
const DEFAULT_STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || "default";

// Default theme values matching globals.css
const DEFAULT_THEME: PublicThemeInfo = {
  primary_color: "#1A1A1A",
  primary_foreground: "#FDFBF7",
  secondary_color: "#F5F0E8",
  secondary_foreground: "#1A1A1A",
  accent_color: "#D4AF37",
  accent_foreground: "#1A1A1A",
  background_color: "#FDFBF7",
  foreground_color: "#1A1A1A",
  card_color: "#FFFFFF",
  card_foreground: "#1A1A1A",
  muted_color: "#F5F0E8",
  muted_foreground: "#6B6B6B",
  border_color: "#E5E0D8",
  input_color: "#E5E0D8",
  ring_color: "#D4AF37",
  gold_color: "#D4AF37",
  champagne_color: "#F7E7CE",
  rose_gold_color: "#B76E79",
  destructive_color: "#DC2626",
  heading_font: "Playfair Display",
  body_font: "Crimson Pro",
  accent_font: "Cormorant Garamond",
  border_radius: "0.5rem",
};

const DEFAULT_FEATURES: StoreFeatures = {
  reviews_enabled: false,
  wishlist_enabled: true,
  gift_cards_enabled: false,
  guest_checkout_enabled: true,
  newsletter_enabled: true,
  product_comparison_enabled: false,
};

interface StoreConfigContextType {
  // Store info
  storeId: string;
  storeName: string;
  description: string | null;
  logoUrl: string | null;
  faviconUrl: string | null;
  contactEmail: string | null;
  contactPhone: string | null;

  // Settings objects
  settings: StoreSettingsPublic | null;
  theme: PublicThemeInfo;
  features: StoreFeatures;
  socialLinks: SocialLinks | null;
  policies: PublicPolicies | null;
  shippingInfo: PublicShippingInfo | null;
  seo: PublicSeoInfo | null;

  // Localization
  timezone: string;
  defaultLocale: string;
  dateFormat: string;
  currencyDisplayFormat: string;

  // State
  loading: boolean;
  error: string | null;
  initialized: boolean;

  // Actions
  refreshSettings: () => Promise<void>;
  isFeatureEnabled: (feature: keyof StoreFeatures) => boolean;
}

const StoreConfigContext = createContext<StoreConfigContextType | undefined>(
  undefined
);

interface StoreConfigProviderProps {
  children: ReactNode;
  storeId?: string;
}

export function StoreConfigProvider({
  children,
  storeId = DEFAULT_STORE_ID,
}: StoreConfigProviderProps) {
  const [settings, setSettings] = useState<StoreSettingsPublic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Fetch settings from API
  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await storeSettingsApi.getSettings(storeId);
      setSettings(response.settings);
    } catch (err) {
      // Silently fail - store settings endpoint may not be implemented
      // The app will use default theme values from globals.css
      if (process.env.NODE_ENV === 'development') {
        console.debug("Store settings not available, using defaults");
      }
      // Don't set error state - this is expected when endpoint doesn't exist
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, [storeId]);

  // Initialize on mount
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Apply theme CSS variables when settings change
  useEffect(() => {
    if (!settings?.theme) return;

    const theme = settings.theme;
    const root = document.documentElement;

    // Apply all theme colors as CSS variables
    root.style.setProperty("--primary", theme.primary_color);
    root.style.setProperty("--primary-foreground", theme.primary_foreground);
    root.style.setProperty("--secondary", theme.secondary_color);
    root.style.setProperty("--secondary-foreground", theme.secondary_foreground);
    root.style.setProperty("--accent", theme.accent_color);
    root.style.setProperty("--accent-foreground", theme.accent_foreground);
    root.style.setProperty("--background", theme.background_color);
    root.style.setProperty("--foreground", theme.foreground_color);
    root.style.setProperty("--card", theme.card_color);
    root.style.setProperty("--card-foreground", theme.card_foreground);
    root.style.setProperty("--muted", theme.muted_color);
    root.style.setProperty("--muted-foreground", theme.muted_foreground);
    root.style.setProperty("--border", theme.border_color);
    root.style.setProperty("--input", theme.input_color);
    root.style.setProperty("--ring", theme.ring_color);
    root.style.setProperty("--gold", theme.gold_color);
    root.style.setProperty("--champagne", theme.champagne_color);
    root.style.setProperty("--rose-gold", theme.rose_gold_color);
    root.style.setProperty("--destructive", theme.destructive_color);
    root.style.setProperty("--radius", theme.border_radius);

    // Update favicon if provided
    if (settings.favicon_url) {
      const existingFavicon = document.querySelector(
        'link[rel="icon"]'
      ) as HTMLLinkElement;
      if (existingFavicon) {
        existingFavicon.href = settings.favicon_url;
      } else {
        const favicon = document.createElement("link");
        favicon.rel = "icon";
        favicon.href = settings.favicon_url;
        document.head.appendChild(favicon);
      }
    }

    // Update document title if SEO title provided
    if (settings.seo?.meta_title) {
      document.title = settings.seo.meta_title;
    }
  }, [settings]);

  // Derived values with defaults
  const theme = settings?.theme ?? DEFAULT_THEME;
  const features = settings?.features ?? DEFAULT_FEATURES;

  // Check if a feature is enabled
  const isFeatureEnabled = useCallback(
    (feature: keyof StoreFeatures): boolean => {
      return features[feature] ?? false;
    },
    [features]
  );

  const value = useMemo<StoreConfigContextType>(
    () => ({
      storeId,
      storeName: settings?.store_name ?? "Vernont",
      description: settings?.description ?? null,
      logoUrl: settings?.logo_url ?? null,
      faviconUrl: settings?.favicon_url ?? null,
      contactEmail: settings?.contact_email ?? null,
      contactPhone: settings?.contact_phone ?? null,
      settings,
      theme,
      features,
      socialLinks: settings?.social_links ?? null,
      policies: settings?.policies ?? null,
      shippingInfo: settings?.shipping_info ?? null,
      seo: settings?.seo ?? null,
      timezone: settings?.timezone ?? "UTC",
      defaultLocale: settings?.default_locale ?? "en-GB",
      dateFormat: settings?.date_format ?? "DD/MM/YYYY",
      currencyDisplayFormat: settings?.currency_display_format ?? "SYMBOL_BEFORE",
      loading,
      error,
      initialized,
      refreshSettings: fetchSettings,
      isFeatureEnabled,
    }),
    [
      storeId,
      settings,
      theme,
      features,
      loading,
      error,
      initialized,
      fetchSettings,
      isFeatureEnabled,
    ]
  );

  return (
    <StoreConfigContext.Provider value={value}>
      {children}
    </StoreConfigContext.Provider>
  );
}

/**
 * Hook to access store configuration
 */
export function useStoreConfig() {
  const context = useContext(StoreConfigContext);
  if (!context) {
    throw new Error("useStoreConfig must be used within a StoreConfigProvider");
  }
  return context;
}

/**
 * Hook to check if a feature is enabled
 */
export function useFeature(feature: keyof StoreFeatures): boolean {
  const { isFeatureEnabled } = useStoreConfig();
  return isFeatureEnabled(feature);
}

/**
 * Hook to get theme values
 */
export function useTheme() {
  const { theme } = useStoreConfig();
  return theme;
}

/**
 * Hook to get store branding (logo, name, etc.)
 */
export function useStoreBranding() {
  const { storeName, logoUrl, faviconUrl, description } = useStoreConfig();
  return { storeName, logoUrl, faviconUrl, description };
}

/**
 * Hook to get social links
 */
export function useSocialLinks() {
  const { socialLinks } = useStoreConfig();
  return socialLinks;
}

/**
 * Hook to get store policies
 */
export function usePolicies() {
  const { policies } = useStoreConfig();
  return policies;
}

/**
 * Hook to get SEO info
 */
export function useSeo() {
  const { seo, storeName, description } = useStoreConfig();
  return {
    title: seo?.meta_title ?? storeName,
    description: seo?.meta_description ?? description,
    ogImage: seo?.og_image,
  };
}
