import { eyewearConfig } from "./eyewear";
// Import new verticals so they self-register
import "./shoes";
import "./bags";

// Active vertical — primary/default for root layout metadata
export const verticalConfig = eyewearConfig;

// Destructured re-exports for convenience (backward compat)
export const { product, content, guides, navigation, collectionImages } = verticalConfig;

// Registry exports for multi-vertical pages
export { getVertical, getAllVerticals, getVerticalByPath } from "./registry";

// Re-export types
export type {
  VerticalConfig,
  ProductDomainConfig,
  ContentConfig,
  NavigationConfig,
  GuideConfig,
  CollectionImagesConfig,
  NavLink,
  IconBadge,
  QuickFilter,
  SortOption,
  ComparisonSpec,
  ComparisonSpecGroup,
  HeroConfig,
  ShippingFeature,
  Announcement,
  Testimonial,
  VisualCategory,
  ShopBySection,
  FaceShapeData,
  LensTypeData,
  FrameSizeData,
  FrameMaterialData,
  SeoContentConfig,
  SeoGuarantee,
  SeoFaq,
  ProductStyleCard,
} from "./types";

// Re-export defaults for pages that need store-wide (non-vertical) links
export { DEFAULT_HELP_LINKS, DEFAULT_COMPANY_LINKS } from "./_defaults";
