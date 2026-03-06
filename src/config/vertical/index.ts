import { eyewearConfig } from "./eyewear";

// Active vertical — change this import to switch verticals
export const verticalConfig = eyewearConfig;

// Destructured re-exports for convenience
export const { product, content, guides, navigation, collectionImages } = verticalConfig;

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
} from "./types";

// Re-export defaults for pages that need store-wide (non-vertical) links
export { DEFAULT_HELP_LINKS, DEFAULT_COMPANY_LINKS } from "./_defaults";
