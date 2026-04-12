import type { NextConfig } from "next";

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const baseConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: __dirname,
  },
  // Target modern browsers to reduce polyfills (ES2020+)
  // Excludes legacy polyfills for Array.at, flat, flatMap, Object.fromEntries, etc.
  // .browserslistrc specifies modern browser targets
  compiler: {
    // Remove console.* in production
    removeConsole: process.env.NODE_ENV === "production",
  },
  // Proxy /api/proxy/* to the backend so auth cookies are same-origin (fixes mobile Safari)
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: `${API_URL}/:path*`,
      },
      // Pinterest catalog feeds - proxy to backend
      {
        source: "/pinterest-catalog.csv",
        destination: `${API_URL}/pinterest-catalog.csv`,
      },
      {
        source: "/pinterest-catalog.xml",
        destination: `${API_URL}/pinterest-catalog.xml`,
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/files/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8080",
        pathname: "/files/**",
      },
      {
        protocol: "https",
        hostname: "*.runixcloud.dev",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.workers.dev",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.vernont.com",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    // Long-cache static assets served from the public/ directory.
    // /_next/static/* already gets `public, max-age=31536000, immutable`
    // from Next.js automatically (hashed filenames). This extends the same
    // treatment to /public/* (non-hashed but versioned in git).
    //
    // Cache-Control: immutable tells browsers + Cloudflare's edge cache to
    // hold the response for a year without revalidation. Safe because any
    // changed file gets a new commit → new container → new origin response.
    const immutableYear = "public, max-age=31536000, immutable";

    // Security headers for all routes
    const securityHeaders = [
      {
        key: "Content-Security-Policy",
        value: [
          "default-src 'self' data: blob:",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://eu-assets.i.posthog.com https://us-assets.i.posthog.com https://api.mapbox.com https://static.klaviyo.com https://static-tracking.klaviyo.com https://js.stripe.com",
          "style-src 'self' 'unsafe-inline' https://api.mapbox.com https://fonts.googleapis.com",
          "img-src 'self' data: blob: https: http:",
          "font-src 'self' data: https://fonts.gstatic.com",
          "connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://region1.google-analytics.com https://*.analytics.google.com https://eu.i.posthog.com https://eu.posthog.com https://us.i.posthog.com https://us.posthog.com https://eu-assets.i.posthog.com https://us-assets.i.posthog.com https://*.klaviyo.com https://api.mapbox.com https://events.mapbox.com https://*.runixcloud.dev https://*.amazonaws.com https://*.workers.dev https://cdn.vernont.com https://images.unsplash.com https://api.stripe.com http://localhost:* http://127.0.0.1:*",
          "frame-src 'self' https://js.stripe.com https://challenges.cloudflare.com",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
          "frame-ancestors 'none'",
          "upgrade-insecure-requests",
        ].join("; "),
      },
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
      {
        key: "X-Content-Type-Options",
        value: "nosniff",
      },
      {
        key: "X-Frame-Options",
        value: "DENY",
      },
      {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
      },
      {
        key: "Permissions-Policy",
        value: [
          "camera=()",
          "microphone=()",
          "geolocation=()",
          "interest-cohort=()",
          "payment=(self)",
          "usb=()",
        ].join(", "),
      },
    ];

    // Additional security headers applied to every route. These live on a
    // separate `/:path*` entry placed AFTER the specific static-asset rules
    // so the asset rules still win for cache headers. The CSP here is
    // Report-Only so nothing breaks if the policy misses a domain — switch
    // to enforced mode after a monitoring window.
    const extraSecurityHeaders = [
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
      {
        key: "X-Content-Type-Options",
        value: "nosniff",
      },
      {
        key: "X-Frame-Options",
        value: "DENY",
      },
      {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
      },
      {
        key: "Permissions-Policy",
        value:
          "camera=(), microphone=(), geolocation=(self), interest-cohort=()",
      },
      {
        key: "X-DNS-Prefetch-Control",
        value: "on",
      },
      {
        key: "Content-Security-Policy-Report-Only",
        value:
          "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://*.posthog.com https://*.i.posthog.com https://js.stripe.com https://challenges.cloudflare.com https://static.klaviyo.com https://static-tracking.klaviyo.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://*.runixcloud.dev https://www.google-analytics.com https://region1.google-analytics.com https://*.analytics.google.com https://*.posthog.com https://*.i.posthog.com https://api.stripe.com https://*.klaviyo.com; frame-src https://js.stripe.com https://challenges.cloudflare.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';",
      },
    ];

    return [
      {
        // Apply security headers to all routes
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: immutableYear }],
      },
      {
        // Root-level static files: favicon, logos, manifest, svg icons, etc.
        source: "/:path*\\.(svg|png|jpg|jpeg|gif|webp|avif|ico|woff|woff2|ttf|otf)",
        headers: [{ key: "Cache-Control", value: immutableYear }],
      },
      {
        source: "/manifest.json",
        headers: [{ key: "Cache-Control", value: "public, max-age=3600" }],
      },
      {
        // Additional hardening headers (HSTS, Permissions-Policy with
        // geolocation=(self), DNS-prefetch, CSP Report-Only). Placed after
        // the specific asset rules so Next picks the first match for cache
        // headers on static assets.
        source: "/:path*",
        headers: extraSecurityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/fragrances",
        destination: "/eyewear",
        permanent: true,
      },
      {
        source: "/fragrances/:path*",
        destination: "/eyewear/:path*",
        permanent: true,
      },
      {
        source: "/fragrance-quiz",
        destination: "/eyewear",
        permanent: true,
      },
      {
        source: "/quiz",
        destination: "/eyewear",
        permanent: true,
      },
      {
        source: "/face-shape-guide",
        destination: "/eyewear",
        permanent: true,
      },
      {
        source: "/lens-guide",
        destination: "/eyewear",
        permanent: true,
      },
      {
        source: "/compare",
        destination: "/eyewear",
        permanent: true,
      },
      {
        source: "/discover",
        destination: "/eyewear",
        permanent: true,
      },
    ];
  },
};

export default withBundleAnalyzer(baseConfig);
