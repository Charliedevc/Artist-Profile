import type { Release } from "@/content/music-types";
import { releaseArtwork } from "@/content/signature";
import type { PlayerRelease } from "@/features/player/player-provider";

export function playerRelease(release: Release): PlayerRelease {
  return { slug: release.slug, title: release.title, artwork: releaseArtwork(release), href: `/music/${release.slug}` };
}
