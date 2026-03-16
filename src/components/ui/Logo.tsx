"use client";

import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  variant?: "default" | "dark";
  className?: string;
  showText?: boolean;
}

export function Logo({ variant = "default", className = "", showText = true }: LogoProps) {
  const textColor = variant === "dark" ? "text-white" : "text-black";

  return (
    <Link href="/" className={`flex items-center ${className}`}>
      {showText ? (
        <span
          className={`text-xl font-semibold tracking-[0.25em] uppercase ${textColor}`}
        >
          VERNONT
        </span>
      ) : (
        <Image
          src={variant === "dark" ? "/logo-dark.svg" : "/logo.svg"}
          alt="Vernont"
          width={160}
          height={32}
          priority
        />
      )}
    </Link>
  );
}

export function LogoIcon({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <div
      className={`flex items-center justify-center bg-black text-white ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.625,
      }}
    >
      V
    </div>
  );
}
