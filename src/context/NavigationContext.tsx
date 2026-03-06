"use client";

import { createContext, useContext, ReactNode, useMemo } from "react";
import { useCollections, useCategories } from "@/lib/hooks";
import { navigation, verticalConfig } from "@/config/vertical";

interface NavItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
  dropdownItems?: { label: string; href: string }[];
}

interface NavigationContextType {
  // Main navigation items (for header)
  mainNav: NavItem[];
  // Shop categories
  shopCategories: { label: string; href: string; handle: string }[];
  // Collections
  collections: { label: string; href: string; handle: string }[];
  // Gender/audience categories
  genderCategories: { label: string; href: string }[];
  // Footer links
  footerShopLinks: { label: string; href: string }[];
  footerBrandLinks: { label: string; href: string }[];
  // Loading states
  isLoading: boolean;
  error: Error | null;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

// Static fallback items from vertical config
const STATIC_SHOP_ITEMS = navigation.shopDropdownItems;
const STATIC_DISCOVER_ITEMS = navigation.discoverItems;

export function NavigationProvider({ children }: { children: ReactNode }) {
  const { data: collectionsData, isLoading: collectionsLoading, error: collectionsError } = useCollections();
  const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError } = useCategories();

  const isLoading = collectionsLoading || categoriesLoading;
  const error = collectionsError || categoriesError || null;

  // Process collections into nav items
  const collections = useMemo(() => {
    if (!collectionsData?.collections) return [];
    return collectionsData.collections.map((collection) => ({
      label: collection.title,
      href: `/collections/${collection.handle}`,
      handle: collection.handle,
    }));
  }, [collectionsData]);

  // Process categories into nav items
  const shopCategories = useMemo(() => {
    if (!categoriesData?.product_categories) return [];
    return categoriesData.product_categories
      .filter((cat) => !cat.parent_category_id) // Only top-level categories
      .map((category) => ({
        label: category.name,
        href: `/category/${category.handle}`,
        handle: category.handle,
      }));
  }, [categoriesData]);

  // Gender categories (derived from categories or static)
  const genderCategories = useMemo(() => {
    const categories = categoriesData?.product_categories || [];
    const genderCats = categories.filter((cat) =>
      ["women", "men", "unisex", "for-her", "for-him"].some(
        (g) => cat.handle?.toLowerCase().includes(g) || cat.name?.toLowerCase().includes(g)
      )
    );

    if (genderCats.length > 0) {
      return genderCats.map((cat) => ({
        label: cat.name,
        href: `/category/${cat.handle}`,
      }));
    }

    // Fallback to static
    return [
      { label: "For Her", href: "/eyewear?category=women" },
      { label: "For Him", href: "/eyewear?category=men" },
      { label: "Unisex", href: "/eyewear?category=unisex" },
    ];
  }, [categoriesData]);

  // Build main navigation
  const mainNav = useMemo((): NavItem[] => {
    // Shop dropdown - combine categories and static items
    const shopDropdownItems = [
      ...navigation.shopDropdownItems,
      ...genderCategories,
    ];

    // Collections dropdown
    const collectionsDropdownItems = collections.length > 0
      ? [
          { label: "All Collections", href: "/collections" },
          ...collections.slice(0, 6), // Limit to 6 items
        ]
      : [
          { label: "All Collections", href: "/collections" },
          { label: "New Arrivals", href: "/collections/new-arrivals" },
          { label: "Best Sellers", href: "/collections/best-sellers" },
          { label: "Gift Sets", href: "/collections/gift-sets" },
        ];

    return [
      {
        label: "Shop",
        href: verticalConfig.catalogPath,
        hasDropdown: true,
        dropdownItems: shopDropdownItems,
      },
      {
        label: "Collections",
        href: "/collections",
        hasDropdown: true,
        dropdownItems: collectionsDropdownItems,
      },
      {
        label: "Brands",
        href: "/brands",
        hasDropdown: true,
        dropdownItems: [
          { label: "All Brands", href: "/brands" },
          { label: "Designer", href: "/brands?type=designer" },
          { label: "Niche", href: "/brands?type=niche" },
        ],
      },
      {
        label: "Discover",
        href: "/discover",
        hasDropdown: true,
        dropdownItems: STATIC_DISCOVER_ITEMS,
      },
    ];
  }, [collections, genderCategories]);

  // Footer shop links
  const footerShopLinks = useMemo(() => {
    return [
      ...navigation.footerShopLinks,
      ...genderCategories.slice(0, 3),
    ];
  }, [genderCategories]);

  // Footer brand links from vertical config
  const footerBrandLinks = useMemo(() => navigation.footerBrandLinks, []);

  return (
    <NavigationContext.Provider
      value={{
        mainNav,
        shopCategories,
        collections,
        genderCategories,
        footerShopLinks,
        footerBrandLinks,
        isLoading,
        error,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
}
