import type { Icon } from "@phosphor-icons/react";

// ==================
// Shared primitives
// ==================

export interface NavLink {
  label: string;
  href: string;
}

export interface IconBadge {
  icon: Icon;
  label: string;
}

// ==================
// Product domain
// ==================

export interface QuickFilter {
  label: string;
  value: string;
}

export interface SortOption {
  value: string;
  label: string;
}

export interface ComparisonSpec {
  label: string;
  key: string;
  unit?: string;
  fromItem?: boolean;
}

export interface ComparisonSpecGroup {
  title: string;
  specs: ComparisonSpec[];
}

export interface ProductDomainConfig {
  metadataNamespace: string;
  quickFilters: QuickFilter[];
  sortOptions: SortOption[];
  defaultCategory: string;
  searchPlaceholder: string;
  popularSearches: string[];
  suggestedSearches: string[];
  comparisonSpecs: ComparisonSpecGroup[];
  catalogTitle: string;
  catalogDescription: string;
}

// ==================
// Content
// ==================

export interface HeroConfig {
  subtitle: string;
  headline: string;
  headlineAccent: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  backgroundImage?: string;
}

export interface ShippingFeature {
  icon: Icon;
  title: string;
  description: string;
}

export interface Announcement {
  icon: Icon;
  text: string;
}

export interface Testimonial {
  id: number;
  text: string;
  author: string;
  location: string;
  rating: number;
}

export interface VisualCategory {
  label: string;
  href: string;
  image: string;
}

export interface ShopBySection {
  title: string;
  description: string;
  items: string[];
  buildUrl: (selected: string[]) => string;
}

export interface ReviewSummary {
  rating: string;
  count: string;
}

export interface SiteMetadata {
  titleDefault: string;
  titleTemplate: string;
  description: string;
  keywords: string[];
}

export interface ContentConfig {
  hero: HeroConfig;
  trustBadges: IconBadge[];
  trustBand: IconBadge[];
  trustBandCatalog: IconBadge[];
  shippingFeatures: ShippingFeature[];
  announcements: Announcement[];
  testimonials: Testimonial[];
  newsletterCta: { headline: string; description: string };
  footerDescription: string;
  visualCategories: VisualCategory[];
  shopBySection: ShopBySection;
  reviewSummary: ReviewSummary;
  siteMetadata: SiteMetadata;
}

// ==================
// Navigation
// ==================

export interface NavigationConfig {
  shopDropdownItems: NavLink[];
  discoverItems: NavLink[];
  footerBrandLinks: NavLink[];
  footerShopLinks: NavLink[];
}

// ==================
// Guides
// ==================

export interface FaceShapeData {
  id: string;
  name: string;
  description: string;
  recommended: string[];
  avoid: string[];
  tip: string;
}

export interface LensTypeData {
  name: string;
  icon: Icon;
  description: string;
  bestFor: string[];
  howItWorks: string;
}

export interface FrameSizeData {
  size: string;
  lensWidth: string;
  bridgeWidth: string;
  templeLength: string;
}

export interface FrameMaterialData {
  name: string;
  weight: string;
  durability: string;
  hypoallergenic: string;
  description: string;
}

export interface GuideConfig {
  faceShapes: FaceShapeData[];
  lensTypes: LensTypeData[];
  frameSizes: FrameSizeData[];
  frameMaterials: FrameMaterialData[];
  careTips: string[];
  sizeMeasurementNote: string;
}

// ==================
// Collection images
// ==================

export interface CollectionImagesConfig {
  defaultImages: string[];
  handleMap: Record<string, string>;
}

// ==================
// Root config
// ==================

export interface VerticalConfig {
  id: string;
  label: string;
  catalogPath: string;
  product: ProductDomainConfig;
  content: ContentConfig;
  guides: GuideConfig;
  navigation: NavigationConfig;
  collectionImages: CollectionImagesConfig;
}
