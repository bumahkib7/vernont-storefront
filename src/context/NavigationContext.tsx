"use client";

import { createContext, useContext, ReactNode, useMemo } from "react";
import { useCollections, useCategories, useBrands } from "@/lib/hooks";
import { navigation, verticalConfig, getAllVerticals } from "@/config/vertical";

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

export function NavigationProvider({ children }: { children: ReactNode }) {
  const { data: collectionsData, isLoading: collectionsLoading, error: collectionsError } = useCollections();
  const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError } = useCategories();
  const { data: brandsData, isLoading: brandsLoading, error: brandsError } = useBrands();

  const isLoading = collectionsLoading || categoriesLoading || brandsLoading;
  const error = collectionsError || categoriesError || brandsError || null;

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

  // Top brands sorted by product count (for nav dropdowns and footer)
  const topBrands = useMemo(() => {
    if (!brandsData?.brands) return [];
    return [...brandsData.brands]
      .sort((a, b) => b.product_count - a.product_count)
      .slice(0, 8);
  }, [brandsData]);

  // Build main navigation
  const mainNav = useMemo((): NavItem[] => {
    // Shop dropdown — combine items from all registered verticals + gender categories
    const allVerticals = getAllVerticals();
    const shopDropdownItems = [
      ...allVerticals.flatMap((v) => v.navigation.shopDropdownItems),
      ...genderCategories,
    ];

    // Collections dropdown
    const collectionsDropdownItems = collections.length > 0
      ? [
          { label: "All Collections", href: "/collections" },
          ...collections.slice(0, 6),
        ]
      : [
          { label: "All Collections", href: "/collections" },
          { label: "New Arrivals", href: "/collections/new-arrivals" },
          { label: "Best Sellers", href: "/collections/best-sellers" },
          { label: "Gift Sets", href: "/collections/gift-sets" },
        ];

    // Brands dropdown — real brands from API
    const brandsDropdownItems = topBrands.length > 0
      ? [
          { label: "All Brands", href: "/brands" },
          ...topBrands.slice(0, 6).map((b) => ({
            label: b.name,
            href: `/brands/${b.slug}`,
          })),
          { label: "View All Brands", href: "/brands" },
        ]
      : [
          { label: "All Brands", href: "/brands" },
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
        dropdownItems: brandsDropdownItems,
      },
    ];
  }, [collections, genderCategories, topBrands]);

  // Footer shop links — include all verticals + real categories
  const footerShopLinks = useMemo(() => {
    const allVerticals = getAllVerticals();
    const verticalLinks = allVerticals.map((v) => ({
      label: `All ${v.label}`,
      href: v.catalogPath,
    }));
    if (shopCategories.length > 0) {
      return [
        ...verticalLinks,
        ...shopCategories.slice(0, 4).map((c) => ({
          label: c.label,
          href: c.href,
        })),
      ];
    }
    return [
      ...verticalLinks,
      ...genderCategories.slice(0, 3),
    ];
  }, [shopCategories, genderCategories]);

  // Footer brand links — real brands from API
  const footerBrandLinks = useMemo(() => {
    if (topBrands.length > 0) {
      return [
        { label: "All Brands", href: "/brands" },
        ...topBrands.slice(0, 6).map((b) => ({
          label: b.name,
          href: `/brands/${b.slug}`,
        })),
      ];
    }
    return navigation.footerBrandLinks;
  }, [topBrands]);

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
