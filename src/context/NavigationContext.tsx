"use client";

import { createContext, useContext, ReactNode, useMemo } from "react";
import { useCollections, useCategories } from "@/lib/hooks";

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

// Static fallback items when API is loading or fails
const STATIC_SHOP_ITEMS = [
  { label: "All Fragrances", href: "/fragrances" },
  { label: "For Her", href: "/fragrances?category=women" },
  { label: "For Him", href: "/fragrances?category=men" },
  { label: "Unisex", href: "/fragrances?category=unisex" },
  { label: "New Arrivals", href: "/fragrances?sort=newest" },
  { label: "Best Sellers", href: "/fragrances?sort=bestselling" },
];

const STATIC_DISCOVER_ITEMS = [
  { label: "Fragrance Quiz", href: "/quiz" },
  { label: "Shop by Notes", href: "/fragrances?view=notes" },
  { label: "Shop by Occasion", href: "/fragrances?view=occasion" },
  { label: "Compare Scents", href: "/compare" },
];

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
      { label: "For Her", href: "/fragrances?category=women" },
      { label: "For Him", href: "/fragrances?category=men" },
      { label: "Unisex", href: "/fragrances?category=unisex" },
    ];
  }, [categoriesData]);

  // Build main navigation
  const mainNav = useMemo((): NavItem[] => {
    // Shop dropdown - combine categories and static items
    const shopDropdownItems = [
      { label: "All Fragrances", href: "/fragrances" },
      ...genderCategories,
      { label: "Gift Sets", href: "/fragrances?category=gift-sets" },
      { label: "Discovery Sets", href: "/fragrances?category=discovery" },
      { label: "New Arrivals", href: "/fragrances?sort=newest" },
      { label: "Best Sellers", href: "/fragrances?sort=bestselling" },
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
        href: "/fragrances",
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
    const baseLinks = [
      { label: "All Fragrances", href: "/fragrances" },
      ...genderCategories.slice(0, 3),
      { label: "New Arrivals", href: "/fragrances?sort=newest" },
      { label: "Best Sellers", href: "/fragrances?sort=bestselling" },
      { label: "Gift Sets", href: "/fragrances?category=gift-sets" },
    ];
    return baseLinks;
  }, [genderCategories]);

  // Footer brand links (static for now, could be fetched from API)
  const footerBrandLinks = useMemo(() => [
    { label: "All Brands", href: "/brands" },
    { label: "Designer", href: "/brands?type=designer" },
    { label: "Niche", href: "/brands?type=niche" },
  ], []);

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
