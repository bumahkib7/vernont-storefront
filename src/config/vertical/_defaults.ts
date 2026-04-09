import { Check, Truck, ArrowCounterClockwise, Shield, Globe, ShieldCheck } from "@phosphor-icons/react/ssr";
import type { IconBadge, ShippingFeature, NavLink } from "./types";

// Trust badges used in footer and product pages
export const DEFAULT_TRUST_BADGES: IconBadge[] = [
  { icon: Check, label: "100% Authentic" },
  { icon: Truck, label: "UK & International Shipping" },
  { icon: ArrowCounterClockwise, label: "30-day returns" },
  { icon: Shield, label: "Secure checkout" },
];

// Shipping features for the banner section
export const DEFAULT_SHIPPING_FEATURES: ShippingFeature[] = [
  { icon: Truck, title: "UK Delivery", description: "Fast & reliable shipping" },
  { icon: Globe, title: "International Shipping", description: "EU & Worldwide delivery" },
  { icon: ArrowCounterClockwise, title: "30-Day Returns", description: "Hassle-free returns" },
  { icon: ShieldCheck, title: "Secure Checkout", description: "100% secure payment" },
];

// Help links (not vertical-specific)
export const DEFAULT_HELP_LINKS: NavLink[] = [
  { label: "Contact Us", href: "/contact" },
  { label: "Shipping & Delivery", href: "/shipping" },
  { label: "Returns & Exchanges", href: "/returns" },
  { label: "FAQ", href: "/faq" },
  { label: "Track Order", href: "/track" },
  { label: "Size Guide", href: "/size-guide" },
];

// Company links (not vertical-specific)
export const DEFAULT_COMPANY_LINKS: NavLink[] = [
  { label: "About Us", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Press", href: "/press" },
  { label: "Affiliate Program", href: "/affiliates" },
];

// Free shipping threshold — null means no free shipping.
// When store settings provide a value, use that instead.
export const FREE_SHIPPING_THRESHOLD: number | null = null;
