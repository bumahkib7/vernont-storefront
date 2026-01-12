import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vernont.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/account/",
          "/checkout/",
          "/cart/",
          "/login",
          "/register",
          "/forgot-password",
          "/reset-password",
          "/track",
          "/_next/",
          "/admin/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/api/",
          "/account/",
          "/checkout/",
          "/cart/",
          "/login",
          "/register",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
