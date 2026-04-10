import {
  Check,
  Truck,
  ArrowCounterClockwise,
  Gift,
  Star,
  Sparkle,
} from "@phosphor-icons/react/ssr";
import type { VerticalConfig } from "./types";
import { DEFAULT_TRUST_BADGES, DEFAULT_SHIPPING_FEATURES } from "./_defaults";

export const eyewearConfig: VerticalConfig = {
  id: "eyewear",
  label: "Eyewear",
  catalogPath: "/eyewear",

  // ==================
  // Product domain
  // ==================
  product: {
    metadataNamespace: "eyewear",
    defaultCategory: "Sunglasses",

    searchPlaceholder: "MagnifyingGlass frames, brands...",
    popularSearches: ["Jacques Marie Mage", "Sunglasses", "Acetate", "Luxury", "Polarized", "Round"],
    suggestedSearches: ["Jacques Marie Mage", "Sunglasses", "Luxury Eyewear", "New Arrivals"],

    quickFilters: [
      { label: "All", value: "" },
      { label: "Sunglasses", value: "sunglasses" },
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

    catalogTitle: "All Eyewear",
    catalogDescription: "Designer frames from luxury and premium brands",

    comparisonSpecs: [
      {
        title: "Frame Specifications",
        specs: [
          { label: "Frame Shape", key: "frameShape" },
          { label: "Frame Material", key: "frameMaterial" },
          { label: "Made In", key: "madeIn" },
        ],
      },
      {
        title: "Measurements",
        specs: [
          { label: "Lens Width", key: "lensWidth", unit: "mm" },
          { label: "Bridge Width", key: "bridgeWidth", unit: "mm" },
          { label: "Temple Length", key: "templeLength", unit: "mm" },
          { label: "Weight", key: "weight", unit: "g", fromItem: true },
        ],
      },
      {
        title: "Lens Features",
        specs: [
          { label: "Lens Type", key: "lensType" },
          { label: "UV Protection", key: "uvProtection" },
        ],
      },
    ],
  },

  // ==================
  // Content
  // ==================
  content: {
    hero: {
      subtitle: "Designer Eyewear",
      headline: "Find Your",
      headlineAccent: "Perfect Frame",
      description:
        "Discover designer frames from luxury and premium brands. Complimentary cleaning kit with every order.",
      primaryCta: { label: "Shop Now", href: "/eyewear" },
      secondaryCta: { label: "View Brands", href: "/brands" },
      backgroundImage: "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=1200&q=80",
    },

    trustBadges: DEFAULT_TRUST_BADGES,

    trustBand: [
      { icon: Check, label: "Authentic Products" },
      { icon: Truck, label: "Fast UK Delivery" },
      { icon: ArrowCounterClockwise, label: "30-Day Returns" },
      { icon: Gift, label: "Free Case & Cloth" },
    ],

    trustBandCatalog: [
      { icon: Check, label: "100% Authentic" },
      { icon: Truck, label: "UK & International Shipping" },
      { icon: Check, label: "30-day returns" },
      { icon: Check, label: "Free case & cleaning kit" },
    ],

    shippingFeatures: DEFAULT_SHIPPING_FEATURES,

    announcements: [
      { icon: Gift, text: "Complimentary case & cleaning kit with every order" },
      { icon: Gift, text: "Complimentary gift wrapping on all orders" },
      { icon: Sparkle, text: "Free samples with every purchase" },
    ],

    testimonials: [
      {
        id: 1,
        text: "Perfect fit, arrived in 2 days. The quality of the frames is outstanding.",
        author: "Sarah T.",
        location: "London",
        rating: 5,
      },
      {
        id: 2,
        text: "Best selection of designer eyewear I've found online. The cleaning kit is a nice touch.",
        author: "James M.",
        location: "Manchester",
        rating: 5,
      },
      {
        id: 3,
        text: "Customer service helped me find the perfect frame shape for my face. Exceptional.",
        author: "Emily R.",
        location: "Edinburgh",
        rating: 5,
      },
    ],

    newsletterCta: {
      headline: "Get 10% Off Your First Order",
      description: "Plus early access to new arrivals and exclusive offers.",
    },

    footerDescription:
      "Designer frames from luxury and premium brands. Complimentary cleaning kit with every order.",

    visualCategories: [],

    shopBySection: {
      title: "Shop by Frame Shape",
      description: "Select your preferred frame styles",
      items: [
        "Aviator", "Cat-eye", "Wayfarer", "Round", "Square",
        "Rectangular", "Oversized", "Geometric", "Wrap", "Butterfly",
      ],
      buildUrl: (selected: string[]) => `/eyewear?shapes=${selected.join(",")}`,
    },

    reviewSummary: {
      rating: "4.8",
      count: "12,400+",
    },

    siteMetadata: {
      titleDefault: "Vernont | Designer & Luxury Eyewear",
      titleTemplate: "%s | Vernont",
      description:
        "Shop designer frames from luxury and premium brands. 30-day returns and complimentary cleaning kit with every order.",
      keywords: [
        "sunglasses", "eyewear", "designer frames", "luxury sunglasses",
        "polarized", "optical frames",
      ],
    },
  },

  // ==================
  // Navigation
  // ==================
  navigation: {
    shopDropdownItems: [
      { label: "All Eyewear", href: "/eyewear" },
      { label: "Sunglasses", href: "/eyewear?category=sunglasses" },
      { label: "New Arrivals", href: "/eyewear?sort=newest" },
      { label: "Pre-Owned", href: "/pre-owned" },
    ],

    discoverItems: [],

    footerBrandLinks: [
      { label: "All Brands", href: "/brands" },
      { label: "Jacques Marie Mage", href: "/brands/jacques-marie-mage" },
    ],

    footerShopLinks: [
      { label: "All Eyewear", href: "/eyewear" },
      { label: "Sunglasses", href: "/eyewear?category=sunglasses" },
      { label: "New Arrivals", href: "/eyewear?sort=newest" },
      { label: "Pre-Owned", href: "/pre-owned" },
    ],
  },

  // ==================
  // Guides
  // ==================
  guides: {
    faceShapes: [],

    lensTypes: [],

    frameSizes: [
      { size: "XS (Extra Small)", lensWidth: "44-46 mm", bridgeWidth: "16-17 mm", templeLength: "130-135 mm" },
      { size: "S (Small)", lensWidth: "47-49 mm", bridgeWidth: "17-18 mm", templeLength: "135-140 mm" },
      { size: "M (Medium)", lensWidth: "50-53 mm", bridgeWidth: "18-20 mm", templeLength: "140-145 mm" },
      { size: "L (Large)", lensWidth: "54-57 mm", bridgeWidth: "20-22 mm", templeLength: "145-150 mm" },
      { size: "XL (Extra Large)", lensWidth: "58-62 mm", bridgeWidth: "22-24 mm", templeLength: "150-155 mm" },
    ],

    frameMaterials: [
      {
        name: "Acetate",
        weight: "Light-Medium",
        durability: "High",
        hypoallergenic: "Yes",
        description:
          "A plant-based plastic known for rich colours and patterns. Acetate frames are lightweight, flexible, and can be adjusted for a custom fit. Our most popular material for everyday eyewear.",
      },
      {
        name: "Stainless Steel",
        weight: "Light",
        durability: "Very High",
        hypoallergenic: "Yes",
        description:
          "Sleek and minimalist, metal frames offer a refined look. Stainless steel is corrosion-resistant and holds its shape well, making it an excellent choice for a polished, understated style.",
      },
      {
        name: "Titanium",
        weight: "Ultra-Light",
        durability: "Exceptional",
        hypoallergenic: "Yes",
        description:
          "The premium choice for eyewear. Titanium is incredibly strong yet feather-light, naturally hypoallergenic, and highly resistant to corrosion. Ideal for all-day comfort and longevity.",
      },
      {
        name: "Mixed (Acetate + Metal)",
        weight: "Light-Medium",
        durability: "High",
        hypoallergenic: "Varies",
        description:
          "Combining the best of both worlds, mixed-material frames pair acetate fronts with metal temples for a distinctive, modern look. A versatile option that bridges casual and formal wear.",
      },
    ],

    careTips: [
      "Always use both hands when putting on or removing your frames to maintain alignment",
      "Clean lenses with the included microfiber cloth and lens spray - avoid paper towels or clothing",
      "Store your eyewear in the provided hard case when not in use to prevent scratches",
      "Avoid leaving frames in hot environments like car dashboards, which can warp the material",
      "Have your frames professionally adjusted every 6 months for the best fit and comfort",
    ],

    sizeMeasurementNote:
      "* Measurements are printed on the inside of the temple arm (e.g. 52-18-140). Use a ruler to measure an existing pair for comparison.",
  },

  // ==================
  // Collection images
  // ==================
  collectionImages: {
    defaultImages: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&q=80",
      "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&q=80",
      "https://images.unsplash.com/photo-1577803645773-f96470509666?w=800&q=80",
      "https://images.unsplash.com/photo-1556015048-4d3aa10df74c?w=800&q=80",
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&q=80",
      "https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=800&q=80",
    ],
    handleMap: {
      "for-him": "https://images.unsplash.com/photo-1523875194681-bedd468c58bf?w=800&q=80",
      "for-her": "https://images.unsplash.com/photo-1520367445093-50dc08a59d9d?w=800&q=80",
      "unisex": "https://images.unsplash.com/photo-1556015048-4d3aa10df74c?w=800&q=80",
      "summer": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80",
      "winter": "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&q=80",
      "spring": "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&q=80",
      "autumn": "https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=800&q=80",
      "fall": "https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=800&q=80",
      "evening": "https://images.unsplash.com/photo-1577803645773-f96470509666?w=800&q=80",
      "day": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
      "office": "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&q=80",
      "date-night": "https://images.unsplash.com/photo-1577803645773-f96470509666?w=800&q=80",
      "aviator": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80",
      "cat-eye": "https://images.unsplash.com/photo-1520367445093-50dc08a59d9d?w=800&q=80",
      "round": "https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=800&q=80",
      "wayfarer": "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&q=80",
      "oversized": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
      "rectangular": "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&q=80",
      "sport": "https://images.unsplash.com/photo-1556015048-4d3aa10df74c?w=800&q=80",
      "optical": "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&q=80",
      "new": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80",
      "new-arrivals": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80",
      "bestsellers": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
      "best-sellers": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
      "gifts": "https://images.unsplash.com/photo-1556015048-4d3aa10df74c?w=800&q=80",
      "gift-sets": "https://images.unsplash.com/photo-1556015048-4d3aa10df74c?w=800&q=80",
      "sale": "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&q=80",
      "luxury": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
      "niche": "https://images.unsplash.com/photo-1577803645773-f96470509666?w=800&q=80",
      "designer": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80",
    },
  },
};
