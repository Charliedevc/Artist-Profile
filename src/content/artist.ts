import type { ArtworkReference } from "./music-types";

interface ArtistProfile {
  name: string;
  biography: string;
  distribution: { platform: "UnitedMasters"; profileUrl: string };
  photography: readonly ArtworkReference[];
  featuredReleaseSlug: string | null;
  subscription: { platform: "UnitedMasters"; signupUrl: string };
}

export const artist: ArtistProfile = {
  name: "Narçi",
  biography:
    "Narçi’s story began on the east side of St. Louis. After moving to New Jersey at seven, Narçi began making beats and went on to teach themself production and engineering. Rap has been a lifelong practice.",
  distribution: {
    platform: "UnitedMasters",
    profileUrl: "https://unitedmasters.com/a/swoove",
  },
  photography: [{ sourceUrl: "https://united-masters.imgix.net/mYcByeH2x7qi" }],
  featuredReleaseSlug: "brielle",
  subscription: {
    platform: "UnitedMasters",
    signupUrl: "https://unitedmasters.com/a/swoove",
  },
};
