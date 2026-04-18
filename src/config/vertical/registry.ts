import type { VerticalConfig } from "./types";

const verticals = new Map<string, VerticalConfig>();

export function registerVertical(config: VerticalConfig) {
  if (verticals.has(config.id)) {
    console.warn(`Vertical "${config.id}" already registered, overwriting.`);
  }
  verticals.set(config.id, config);
}

export function getVertical(id: string): VerticalConfig | undefined {
  return verticals.get(id);
}

export function getAllVerticals(): VerticalConfig[] {
  return Array.from(verticals.values());
}

export function getVerticalByPath(path: string): VerticalConfig | undefined {
  return getAllVerticals().find((v) => v.catalogPath === path);
}
