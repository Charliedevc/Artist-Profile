export interface Credit {
  name: string;
  role: string;
}

export interface StreamingLink {
  platform: string;
  url: string;
}

export interface ArtworkReference {
  sourceUrl: string;
  approvedAssetUrl?: string;
}

export interface ReleaseTrack {
  title: string;
  durationSeconds?: number;
  credits?: readonly Credit[];
  /** Lyrics approved for public display. */
  lyrics?: string;
}

export interface Release {
  slug: string;
  title: string;
  listedYear: number;
  unitedMastersUrl: string;
  artwork: ArtworkReference;
  streamingLinks: readonly StreamingLink[];
  releaseDate?: string;
  format?: "single" | "ep" | "album" | "other";
  credits?: readonly Credit[];
  tracks?: readonly ReleaseTrack[];
  landingPage?: { themeId: string };
}

/** Public projection of an approved announcement. Drafts belong in private storage. */
export interface UpcomingAnnouncement {
  slug: string;
  title: string;
  summary?: string;
  releaseDate?: string;
}

/** Public preview metadata. Resolve protected audio on the server after an entitlement check. */
export interface ExclusivePreview {
  id: string;
  title: string;
  access: "subscriber";
  releaseSlug?: string;
}
