import type { CSSProperties } from "react";
import type { Release } from "@/content/music-types";

const themes: Record<string, { accent: string; atmosphere: string; deep: string }> = {
  brielle: { accent: "#f0bcaa", atmosphere: "#3a2029", deep: "#371923" },
  "prom-night": { accent: "#f2c7b9", atmosphere: "#422125", deep: "#2c171e" },
  "save-the-bees": { accent: "#eacf9e", atmosphere: "#382a1c", deep: "#261d18" },
};

export function releaseTheme(release?: Release): CSSProperties {
  const theme = themes[release?.landingPage?.themeId ?? release?.slug ?? ""];
  if (!theme) return {};
  return { "--era-accent": theme.accent, "--era-atmosphere": theme.atmosphere, "--era-deep": theme.deep } as CSSProperties;
}
