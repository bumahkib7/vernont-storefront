"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useScroll, useTransform, MotionValue, motionValue } from "framer-motion";

interface UseHeroScrollResult {
  heroRef: (node: HTMLDivElement | null) => void;
  heroY: MotionValue<string>;
  heroOpacity: MotionValue<number>;
  heroScale: MotionValue<number>;
}

// Static values for SSR/pre-hydration
const staticProgress = motionValue(0);

/**
 * Custom hook for hero parallax scroll effects.
 * Uses callback ref pattern to handle SSR/hydration issues with Framer Motion's useScroll.
 */
export function useHeroScroll(): UseHeroScrollResult {
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const elementRef = useRef<HTMLDivElement | null>(null);

  // Callback ref - called when element mounts/unmounts
  const heroRef = useCallback((node: HTMLDivElement | null) => {
    elementRef.current = node;
    setElement(node);
  }, []);

  // Only track scroll when element exists in DOM
  const { scrollYProgress } = useScroll(
    element
      ? {
          target: elementRef,
          offset: ["start start", "end start"],
        }
      : {}
  );

  // Use actual scroll progress when element exists, otherwise use static value
  const progress = element ? scrollYProgress : staticProgress;

  const heroY = useTransform(progress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(progress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(progress, [0, 1], [1, 1.1]);

  return { heroRef, heroY, heroOpacity, heroScale };
}
