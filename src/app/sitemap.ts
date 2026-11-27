import type { MetadataRoute } from "next";
import { releases } from "@/content/releases";
import { siteOrigin } from "./site-metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteOrigin) return [];
  return ["/", "/music", "/visuals", "/about", ...releases.map(({ slug }) => `/music/${slug}`)]
    .map((path) => ({ url: new URL(path, siteOrigin).href }));
}
