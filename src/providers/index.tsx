"use client";

import { ReactNode } from "react";
import { QueryProvider } from "./QueryProvider";

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Combined providers for the app
 * - QueryProvider: TanStack Query for server state
 * - Zustand stores are automatically available (no provider needed)
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      {children}
    </QueryProvider>
  );
}

// Re-export individual providers
export { QueryProvider } from "./QueryProvider";
