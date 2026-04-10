import type { NextConfig } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  // Proxy /api/proxy/* to the backend so auth cookies are same-origin (fixes mobile Safari)
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: `${API_URL}/:path*`,
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
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
    return [
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

export default nextConfig;
