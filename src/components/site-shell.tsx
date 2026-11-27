import Link from "next/link";
import { artist } from "@/content/artist";
import { featuredRelease } from "@/content/signature";
import type { Release } from "@/content/music-types";
import { ListenButton } from "@/features/player/player-ui";
import { playerRelease } from "@/features/releases/player-release";
import { Navigation } from "./navigation";

export function SiteHeader({ release = featuredRelease }: { release?: Release }) {
  return <header className="site-header page-width">
    <Link href="/" className="wordmark" aria-label="Narçi home">{artist.name}</Link>
    <Navigation>{release && <ListenButton release={playerRelease(release)} label="Listen" />}</Navigation>
  </header>;
}

export function SiteFooter() {
  return <footer className="site-footer page-width">
    <Link href="/" className="wordmark">{artist.name}</Link>
    <a href={artist.subscription.signupUrl}>Subscribe on UnitedMasters <span aria-hidden="true">↗</span></a>
  </footer>;
}

export function PageHeading({ label, title }: { label: string; title: string }) {
  return <header className="page-heading">
    <p className="eyebrow era-label">{label}</p>
    <h1>{title}</h1>
  </header>;
}
