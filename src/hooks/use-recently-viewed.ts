"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "vernont_recently_viewed";
const MAX_ITEMS = 10;

function readIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeIds(ids: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // storage full or unavailable — silently ignore
  }
}

export function useRecentlyViewed() {
  const [recentIds, setRecentIds] = useState<string[]>([]);

  // Hydrate from localStorage on mount
  useEffect(() => {
    setRecentIds(readIds());
  }, []);

  const addProduct = useCallback((id: string) => {
    setRecentIds((prev) => {
      const filtered = prev.filter((existing) => existing !== id);
      const next = [id, ...filtered].slice(0, MAX_ITEMS);
      writeIds(next);
      return next;
    });
  }, []);

  return { recentIds, addProduct };
}
