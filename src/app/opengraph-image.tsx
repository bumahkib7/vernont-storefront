import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Vernont - Designer & Niche Fragrances";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000000",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 40,
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 400,
              letterSpacing: "0.2em",
              color: "#FFFFFF",
            }}
          >
            VERNONT
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: "#999999",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Designer & Niche Fragrances
        </div>

        {/* Subtle line */}
        <div
          style={{
            width: 120,
            height: 1,
            backgroundColor: "#333333",
            marginTop: 40,
            marginBottom: 40,
          }}
        />

        {/* Stats */}
        <div
          style={{
            display: "flex",
            gap: 60,
            color: "#666666",
            fontSize: 18,
          }}
        >
          <span>2,400+ Fragrances</span>
          <span>180+ Brands</span>
          <span>Free Shipping</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
