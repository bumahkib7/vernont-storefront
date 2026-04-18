import type { VerticalConfig } from "./types";
import { registerVertical } from "./registry";
import { DEFAULT_TRUST_BADGES, DEFAULT_SHIPPING_FEATURES } from "./_defaults";

export const bagsConfig: VerticalConfig = {
  id: "bags",
  label: "Bags",
  catalogPath: "/bags",
  productType: "BAGS",

  product: {
    metadataNamespace: "bags",
    defaultCategory: "Totes",
    searchPlaceholder: "Search totes, crossbody, clutches...",
    popularSearches: ["Louis Vuitton", "Gucci", "Tote", "Crossbody", "Leather", "Clutch"],
    suggestedSearches: ["Designer Totes", "Leather Crossbody", "New Arrivals", "Luxury Bags"],
    quickFilters: [
      { label: "All", value: "" },
      { label: "Totes", value: "tote" },
      { label: "Crossbody", value: "crossbody" },
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
        title: "Details",
        specs: [
          { label: "Type", key: "bagType" },
          { label: "Material", key: "exterior" },
          { label: "Closure", key: "closure" },
          { label: "Made In", key: "origin" },
        ],
      },
      {
        title: "Dimensions",
        specs: [
          { label: "Height", key: "heightCm", unit: "cm" },
          { label: "Width", key: "widthCm", unit: "cm" },
          { label: "Depth", key: "depthCm", unit: "cm" },
          { label: "Weight", key: "weight", unit: "g" },
        ],
      },
    ],
    catalogTitle: "All Bags",
    catalogDescription: "Pre-owned designer bags, authenticated and curated. Free UK delivery.",
  },

  content: {
    hero: {
      subtitle: "Pre-Owned & Authenticated",
      headline: "Designer Bags",
      headlineAccent: "Curated for You",
      description: "Discover our hand-picked collection of pre-owned designer bags. Every piece authenticated and inspected by our specialists.",
      primaryCta: { label: "Shop All Bags", href: "/bags" },
      secondaryCta: { label: "New Arrivals", href: "/bags?sort=newest" },
    },
    trustBadges: DEFAULT_TRUST_BADGES,
    trustBand: DEFAULT_TRUST_BADGES,
    trustBandCatalog: DEFAULT_TRUST_BADGES,
    shippingFeatures: DEFAULT_SHIPPING_FEATURES,
    announcements: [],
    newsletterCta: {
      headline: "First access to new arrivals",
      description: "Be the first to know when new designer bags arrive in our collection.",
    },
    footerDescription: "Vernont curates pre-owned designer bags from the world's most coveted luxury houses.",
    visualCategories: [],
    shopBySection: {
      title: "Shop by Style",
      description: "Find your perfect bag",
      items: ["Totes", "Crossbody", "Shoulder", "Backpacks", "Clutches", "Belt Bags"],
      buildUrl: (selected: string[]) => `/bags?styles=${selected.join(",")}`,
    },
    reviewSummary: { rating: "4.9", count: "1,800+" },
    siteMetadata: {
      titleDefault: "Designer Bags | Vernont",
      titleTemplate: "%s | Vernont Bags",
      description: "Shop pre-owned designer bags. Authenticated totes, crossbody bags, clutches, and more from luxury brands. Free UK delivery & 30-day returns.",
      keywords: ["designer bags", "pre-owned bags", "luxury handbags", "designer tote", "authenticated bags"],
    },
  },

  seoContent: {
    editorialIntro: {
      label: "The Vernont Edit",
      headline: "Designer bags, authenticated & curated",
      body: "Every bag is inspected by our leather goods specialists for authenticity, craftsmanship, and condition. We source from trusted channels to bring you the finest in pre-owned luxury.",
    },
    guarantees: [
      { icon: "ShieldCheck", title: "100% Authentic", body: "Every bag verified and certified" },
      { icon: "Eye", title: "Expert Inspection", body: "Checked by our leather goods specialists" },
      { icon: "ArrowCounterClockwise", title: "30-Day Returns", body: "Free UK returns, no questions" },
      { icon: "Package", title: "Original Packaging", body: "Dust bag and box when available" },
      { icon: "Truck", title: "Free UK Shipping", body: "Insured next-day delivery" },
    ],
    productStyles: {
      sectionLabel: "Shop by style",
      heading: "A bag for every occasion",
      items: [
        { title: "Totes", body: "Spacious everyday bags for work and weekend" },
        { title: "Crossbody", body: "Hands-free style with adjustable straps" },
        { title: "Shoulder", body: "Classic silhouettes from iconic luxury houses" },
        { title: "Backpacks", body: "Modern luxury meets everyday functionality" },
        { title: "Clutches", body: "Evening elegance in compact form" },
        { title: "Belt Bags", body: "Trend-forward hands-free styling" },
      ],
    },
    faqs: [
      { q: "Are all your bags authentic?", a: "Yes. Every bag is authenticated using industry-standard verification methods including hardware inspection, stitching analysis, and material verification. We source from authorized retailers and verified luxury channels." },
      { q: "What condition are pre-owned bags in?", a: "We grade every bag: Grade A (excellent, minimal signs of use), Grade B (good, light patina or wear), Grade C (fair, visible wear). Full condition details and close-up photos are shown on each listing." },
      { q: "Do bags come with original packaging?", a: "When available, we include the original dust bag, box, and authenticity cards. Packaging details are listed on each product page." },
      { q: "Can I return a bag if I change my mind?", a: "Yes. We offer a 30-day return policy. Return your bag in its original condition for a full refund. UK returns are free and fully insured." },
    ],
  },

  navigation: {
    shopDropdownItems: [
      { label: "All Bags", href: "/bags" },
      { label: "Totes", href: "/bags?category=totes" },
      { label: "Crossbody", href: "/bags?category=crossbody" },
      { label: "New Arrivals", href: "/bags?sort=newest" },
    ],
    discoverItems: [],
    footerBrandLinks: [
      { label: "All Brands", href: "/brands" },
    ],
    footerShopLinks: [
      { label: "All Bags", href: "/bags" },
      { label: "Totes", href: "/bags?category=totes" },
      { label: "Crossbody", href: "/bags?category=crossbody" },
      { label: "New Arrivals", href: "/bags?sort=newest" },
    ],
  },

  collectionImages: {
    defaultImages: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80",
    ],
    handleMap: {
      totes: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80",
      crossbody: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
      clutches: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80",
    },
  },
};

registerVertical(bagsConfig);
