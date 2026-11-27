import { artist } from "./artist";
import { releases } from "./releases";
import type { Release } from "./music-types";

export const portrait = {
  src: "/media/signature/narci-portrait.webp",
  referenceUrl: artist.photography[0].sourceUrl,
  alt: "Narçi looking into the camera in a patterned jacket and headscarf",
};

export const featuredRelease = releases.find((release) => release.slug === artist.featuredReleaseSlug);

export const releaseArtwork = (release: Release) =>
  release.artwork.approvedAssetUrl ?? `/media/signature/covers/${release.slug}.webp`;

export function releaseDate(release: Release) {
  if (!release.releaseDate) return String(release.listedYear);
  return new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" })
    .format(new Date(release.releaseDate + "T00:00:00Z"));
}

export interface PublicPreview {
  id: string;
  title: string;
  releaseSlug: string;
  /** Explicitly approved public excerpts only. Protected media belongs behind server authorization. */
  src: `/media/previews/${string}`;
  peaks?: readonly number[];
  duration?: number;
}

export const publicPreviews: readonly PublicPreview[] = [];

export interface PublicVisual {
  title: string;
  src: `/media/visuals/${string}`;
  poster?: string;
  captions: `/media/visuals/${string}`;
}

export const publicVisuals: readonly PublicVisual[] = [];
