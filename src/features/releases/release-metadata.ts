import { artist } from "@/content/artist";
import type { Release } from "@/content/music-types";

export function releaseDescription(release: Release) {
  return `Explore ${release.title} by ${artist.name}, listed in ${release.listedYear}. Find streaming links and release information.`;
}

export function approvedSocialArtwork(release: Release) {
  const artwork = release.artwork.approvedAssetUrl;
  return artwork && /^https?:\/\//i.test(artwork) ? artwork : undefined;
}

export function releaseJsonLd(release: Release) {
  const byArtist = { "@type": "MusicGroup", name: artist.name };
  const tracks = release.tracks?.map((track) => ({
    "@type": "MusicRecording",
    name: track.title,
    byArtist,
    duration: track.durationSeconds === undefined ? undefined : `PT${track.durationSeconds}S`,
  }));
  const releaseType = { album: "AlbumRelease", ep: "EPRelease", single: "SingleRelease", other: undefined };
  const format = release.format && releaseType[release.format];
  const data = {
    "@context": "https://schema.org",
    "@type": format ? "MusicAlbum" : "MusicRelease",
    name: release.title,
    ...(format ? { byArtist, albumReleaseType: `https://schema.org/${format}` } : { about: byArtist }),
    track: tracks,
    numTracks: tracks?.length,
    datePublished: release.releaseDate,
    image: approvedSocialArtwork(release),
    sameAs: [release.unitedMastersUrl, ...release.streamingLinks.map(({ url }) => url)],
  };
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
