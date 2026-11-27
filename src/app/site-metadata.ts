import type { Metadata } from "next";
import { artist } from "@/content/artist";
import { portrait } from "@/content/signature";

export const siteDescription = "The official website of Narçi. Explore Dark R&B and New Jazz releases, visuals, and artist updates.";

function getOrigin() {
  const configured = process.env.NARCI_SITE_ORIGIN;
  if (!configured) return undefined;

  const url = new URL(configured);
  if (url.protocol !== "https:" || configured.replace(/\/$/, "") !== url.origin) {
    throw new Error("NARCI_SITE_ORIGIN must be an HTTPS origin without a path.");
  }
  return url.origin;
}

export const siteOrigin = getOrigin();

export function pageMetadata(path: string, title?: string, description = siteDescription,
  artwork: { src: string; alt: string } = portrait): Metadata {
  const displayTitle = title ? `${title} | ${artist.name}` : artist.name;
  const url = siteOrigin ? new URL(path, siteOrigin).href : undefined;
  const image = siteOrigin ? new URL(artwork.src, siteOrigin).href : undefined;
  return {
    title,
    description,
    ...(url ? { alternates: { canonical: url } } : {}),
    openGraph: {
      type: "website", siteName: artist.name, title: displayTitle, description, url,
      images: image ? [{ url: image, alt: artwork.alt }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary", title: displayTitle, description,
      images: image ? [{ url: image, alt: artwork.alt }] : undefined,
    },
  };
}
