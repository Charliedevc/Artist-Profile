import type { CSSProperties } from "react";
import type { Release } from "@/content/music-types";

const themes: Record<string, { accent: string; atmosphere: string; deep: string }> = {
  brielle: { accent: "#f0bcaa", atmosphere: "#3a2029", deep: "#211418" },
};

export function releaseTheme(release?: Release): CSSProperties {
  const theme = themes[release?.landingPage?.themeId ?? release?.slug ?? ""];
  if (!theme) return {};
  return { "--era-accent": theme.accent, "--era-atmosphere": theme.atmosphere, "--era-deep": theme.deep } as CSSProperties;
}
