import { Check, Truck, RotateCcw, Shield, Globe, ShieldCheck } from "lucide-react";
import type { IconBadge, ShippingFeature, NavLink } from "./types";

// Trust badges used in footer and product pages
export const DEFAULT_TRUST_BADGES: IconBadge[] = [
  { icon: Check, label: "100% Authentic" },
  { icon: Truck, label: "Free shipping £75+" },
  { icon: RotateCcw, label: "30-day returns" },
  { icon: Shield, label: "Secure checkout" },
];

// Shipping features for the banner section
export const DEFAULT_SHIPPING_FEATURES: ShippingFeature[] = [
  { icon: Truck, title: "Free UK Delivery", description: "On orders over £75" },
  { icon: Globe, title: "International Shipping", description: "EU & Worldwide delivery" },
  { icon: RotateCcw, title: "30-Day Returns", description: "Hassle-free returns" },
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

// Free shipping threshold in minor units (pence)
export const FREE_SHIPPING_THRESHOLD = 7500;
