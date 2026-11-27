import Link from "next/link";
import { artist } from "@/content/artist";
import { Navigation } from "./navigation";

export function SiteHeader() {
  return <header className="site-header page-width">
    <Link href="/" className="wordmark" aria-label="Narçi home">{artist.name}</Link>
    <Navigation />
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
