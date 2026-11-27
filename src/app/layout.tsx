import type { Metadata } from "next";
import type { ReactNode } from "react";
import { artist } from "@/content/artist";
import { releases } from "@/content/releases";
import { featuredRelease, publicPreviews } from "@/content/signature";
import { PlayerProvider } from "@/features/player/player-provider";
import { ListeningRoom, PlayerDock } from "@/features/player/player-ui";
import { playerRelease } from "@/features/releases/player-release";
import { pageMetadata } from "./site-metadata";
import "./globals.css";
import "./after-hours.css";

export const metadata: Metadata = {
  ...pageMetadata("/"),
  title: { default: artist.name, template: `%s | ${artist.name}` },
};

const queue = publicPreviews.flatMap((preview) => {
  const release = releases.find(({ slug }) => slug === preview.releaseSlug);
  return release ? [{ ...preview, release: playerRelease(release) }] : [];
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <PlayerProvider queue={queue} initialRelease={featuredRelease ? playerRelease(featuredRelease) : null}>
          {children}
          <PlayerDock />
          <ListeningRoom />
        </PlayerProvider>
      </body>
    </html>
  );
}
