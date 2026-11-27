import { ArrowDown } from "lucide-react";
import { pageMetadata } from "../site-metadata";
import { SiteFooter, SiteHeader } from "@/components/site-shell";
import { releases } from "@/content/releases";
import { featuredRelease } from "@/content/signature";
import { Discography } from "@/features/releases/discography";
import { RecordReel } from "@/features/releases/record-reel";

export const metadata = pageMetadata("/music", "Discography", "Browse Narçi’s releases by title and year, and find streaming links for each record.");

export default function MusicPage() {
  const opening = [featuredRelease?.slug, "prom-night", "save-the-bees"]
    .flatMap(slug => releases.filter(release => release.slug === slug));
  const reel = [...new Set([...opening, ...releases])];
  return <>
    <SiteHeader />
    <main id="main" className="page-width interior archive-page">
      <header className="night-heading">
        <h1>Discography</h1>
        <a className="night-link" href="#release-archive">Search all {releases.length} releases <ArrowDown size={18} aria-hidden="true" /></a>
      </header>
      <RecordReel releases={reel} />
      <section id="release-archive" className="night-section" aria-labelledby="catalog-title" tabIndex={-1}>
        <div className="night-section-head"><h2 id="catalog-title">Full catalog</h2></div>
        <Discography releases={releases} />
      </section>
    </main>
    <SiteFooter />
  </>;
}
