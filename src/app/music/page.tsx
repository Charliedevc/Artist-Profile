import type { Metadata } from "next";
import { PageHeading, SiteFooter, SiteHeader } from "@/components/site-shell";
import { releases } from "@/content/releases";
import { Discography } from "@/features/releases/discography";
import { featuredRelease } from "@/content/signature";
import { releaseTheme } from "@/features/releases/release-theme";
import { ReleaseCard } from "@/features/releases/release-card";

export const metadata: Metadata = { title: "Discography" };

export default function MusicPage() {
  const center = featuredRelease ?? releases[0];
  const [left, right] = ["at-jade", "u-played-me-acapella", "prom-night"]
    .map((slug) => releases.find((release) => release.slug === slug && release !== center))
    .filter((release) => release !== undefined);
  const selection = [left, center, right].filter((release) => release !== undefined);

  return <>
    <SiteHeader />
    <main id="main" className="page-width interior music-index">
      <section className="music-masthead" style={releaseTheme(featuredRelease)} aria-label="Discography and selected releases">
        <div className="music-masthead-copy">
          <PageHeading label={`${releases.length} releases / UnitedMasters catalog`} title="Discography" />
          <a className="text-link archive-jump" href="#release-archive">Browse all releases <span aria-hidden="true">↓</span></a>
        </div>
        <ul className="music-stack" aria-label="Selected releases">
          {selection.map((release) => <li key={release.slug}><ReleaseCard release={release} gallery /></li>)}
        </ul>
      </section>
      <section id="release-archive" aria-label="Full release catalog" tabIndex={-1}>
        <Discography releases={releases} />
      </section>
    </main>
    <SiteFooter />
  </>;
}
