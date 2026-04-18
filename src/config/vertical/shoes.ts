import type { VerticalConfig } from "./types";
import { registerVertical } from "./registry";
import { DEFAULT_TRUST_BADGES, DEFAULT_SHIPPING_FEATURES } from "./_defaults";

export const shoesConfig: VerticalConfig = {
  id: "shoes",
  label: "Shoes",
  catalogPath: "/shoes",
  productType: "SHOES",

  product: {
    metadataNamespace: "shoes",
    defaultCategory: "Sneakers",
    searchPlaceholder: "Search sneakers, boots, heels...",
    popularSearches: ["Nike", "Adidas", "New Balance", "Sneakers", "Boots", "Loafers"],
    suggestedSearches: ["Designer Sneakers", "Leather Boots", "New Arrivals", "Luxury Shoes"],
    quickFilters: [
      { label: "All", value: "" },
      { label: "Sneakers", value: "sneakers" },
      { label: "Boots", value: "boots" },
      { label: "New Arrivals", value: "newest" },
    ],
    sortOptions: [
      { value: "featured", label: "Featured" },
      { value: "bestselling", label: "Best Selling" },
      { value: "price-low", label: "Price: Low to High" },
      { value: "price-high", label: "Price: High to Low" },
      { value: "newest", label: "Newest First" },
      { value: "rating", label: "Highest Rated" },
    ],
    comparisonSpecs: [
      {
        title: "Construction",
        specs: [
          { label: "Sole Type", key: "soleType" },
          { label: "Upper Material", key: "upperMaterial" },
          { label: "Closure", key: "closure" },
          { label: "Made In", key: "origin" },
        ],
      },
      {
        title: "Sizing",
        specs: [
          { label: "Size System", key: "sizeSystem" },
          { label: "Width", key: "width" },
          { label: "Fit", key: "fitType" },
        ],
      },
    ],
    catalogTitle: "All Shoes",
    catalogDescription: "Pre-owned designer shoes, authenticated and curated. Free UK delivery.",
  },

  content: {
    hero: {
      subtitle: "Pre-Owned & Authenticated",
      headline: "Designer Shoes",
      headlineAccent: "Curated for You",
      description: "Step into luxury with our hand-picked collection of pre-owned designer footwear. Every pair authenticated and inspected.",
      primaryCta: { label: "Shop All Shoes", href: "/shoes" },
      secondaryCta: { label: "New Arrivals", href: "/shoes?sort=newest" },
    },
    trustBadges: DEFAULT_TRUST_BADGES,
    trustBand: DEFAULT_TRUST_BADGES,
    trustBandCatalog: DEFAULT_TRUST_BADGES,
    shippingFeatures: DEFAULT_SHIPPING_FEATURES,
    announcements: [],
    newsletterCta: {
      headline: "First access to new drops",
      description: "Be the first to know when new designer shoes arrive in our collection.",
    },
    footerDescription: "Vernont curates pre-owned designer shoes from the world's most coveted brands.",
    visualCategories: [],
    shopBySection: {
      title: "Shop by Style",
      description: "Find your perfect pair",
      items: ["Sneakers", "Boots", "Loafers", "Heels", "Sandals", "Oxfords"],
      buildUrl: (selected: string[]) => `/shoes?styles=${selected.join(",")}`,
    },
    reviewSummary: { rating: "4.8", count: "3,200+" },
    siteMetadata: {
      titleDefault: "Designer Shoes | Vernont",
      titleTemplate: "%s | Vernont Shoes",
      description: "Shop pre-owned designer shoes. Authenticated sneakers, boots, heels, and more from luxury brands. Free UK delivery & 30-day returns.",
      keywords: ["designer shoes", "pre-owned shoes", "luxury sneakers", "designer boots", "authenticated footwear"],
    },
  },

  seoContent: {
    editorialIntro: {
      label: "The Vernont Edit",
      headline: "Designer shoes, authenticated & curated",
      body: "Every pair is inspected by our footwear specialists for authenticity, condition, and quality. We source from trusted channels to bring you the best in pre-owned designer footwear.",
    },
    guarantees: [
      { icon: "ShieldCheck", title: "100% Authentic", body: "Every pair verified and certified" },
      { icon: "Eye", title: "Expert Inspection", body: "Checked by our footwear specialists" },
      { icon: "ArrowCounterClockwise", title: "30-Day Returns", body: "Free UK returns, no questions" },
      { icon: "Ruler", title: "Size Guidance", body: "Detailed measurements on every pair" },
      { icon: "Truck", title: "Free UK Shipping", body: "Next-day delivery available" },
    ],
    productStyles: {
      sectionLabel: "Shop by style",
      heading: "Shoes for every occasion",
      items: [
        { title: "Sneakers", body: "Casual luxury from the world's most coveted brands" },
        { title: "Boots", body: "From Chelsea to combat — timeless styles in premium leather" },
        { title: "Loafers", body: "Effortless sophistication for work and weekend" },
        { title: "Heels", body: "Statement-making stilettos, blocks, and platforms" },
        { title: "Sandals", body: "Designer slides and straps for warmer days" },
        { title: "Oxfords", body: "Classic lace-ups crafted from the finest materials" },
      ],
    },
    faqs: [
      { q: "Are all your shoes authentic?", a: "Yes. Every pair is authenticated by our specialist team using industry-standard verification methods. We source from authorized retailers and verified luxury channels." },
      { q: "How do I know which size to choose?", a: "We provide detailed size information including the size system (EU, UK, US), width, and fit guidance. Check the 'Sizing' section on each product page for measurements." },
      { q: "What condition are pre-owned shoes in?", a: "We grade every pair: Grade A (excellent, minimal wear), Grade B (good, light signs of use), Grade C (fair, visible wear). Full condition details are shown on each listing." },
      { q: "Can I return shoes if they don't fit?", a: "Absolutely. We offer a 30-day return policy. If the fit isn't right, return them in their original condition for a full refund. UK returns are free." },
    ],
  },

  navigation: {
    shopDropdownItems: [
      { label: "All Shoes", href: "/shoes" },
      { label: "Sneakers", href: "/shoes?category=sneakers" },
      { label: "Boots", href: "/shoes?category=boots" },
      { label: "New Arrivals", href: "/shoes?sort=newest" },
    ],
    discoverItems: [],
    footerBrandLinks: [
      { label: "All Brands", href: "/brands" },
    ],
    footerShopLinks: [
      { label: "All Shoes", href: "/shoes" },
      { label: "Sneakers", href: "/shoes?category=sneakers" },
      { label: "Boots", href: "/shoes?category=boots" },
      { label: "New Arrivals", href: "/shoes?sort=newest" },
    ],
  },

  collectionImages: {
    defaultImages: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80",
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80",
    ],
    handleMap: {
      sneakers: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
      boots: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&q=80",
      loafers: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=800&q=80",
    },
  },
};

registerVertical(shoesConfig);
