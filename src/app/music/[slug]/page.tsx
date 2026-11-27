import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/site-shell";
import { releases } from "@/content/releases";
import { publicPreviews, releaseArtwork, releaseDate } from "@/content/signature";
import { ListenButton } from "@/features/player/player-ui";
import { StreamingLinks } from "@/features/releases/release-card";
import { releaseTheme } from "@/features/releases/release-theme";
import { playerRelease } from "@/features/releases/player-release";
import { ArtworkReveal } from "@/features/releases/artwork-reveal";
import { approvedSocialArtwork, releaseDescription, releaseJsonLd } from "@/features/releases/release-metadata";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return releases.map(({ slug }) => ({ slug }));
}

async function findRelease(params: Props["params"]) {
  const { slug } = await params;
  const release = releases.find((item) => item.slug === slug);
  if (!release) notFound();
  return release;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const release = await findRelease(params);
  const description = releaseDescription(release);
  const artwork = approvedSocialArtwork(release);
  return {
    title: release.title,
    description,
    openGraph: {
      title: `${release.title} | Narçi`,
      description,
      images: artwork ? [{ url: artwork, alt: `${release.title} cover artwork` }] : undefined,
    },
  };
}

export default async function ReleasePage({ params }: Props) {
  const release = await findRelease(params);
  const hasPreview = publicPreviews.some((preview) => preview.releaseSlug === release.slug);

  return <div className="release-page" style={releaseTheme(release)}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: releaseJsonLd(release) }} />
    <SiteHeader />
    <main id="main">
      <section className="album-stage grain">
        <div className="page-width">
          <Link className="text-link album-back" href="/music">← Discography</Link>
          <div className="album-grid">
            <div className="album-copy">
              <p className="eyebrow era-label">Narçi / <time dateTime={release.releaseDate}>{releaseDate(release)}</time></p>
              <h1 className={release.title.length > 13 ? "long-title" : undefined}>{release.title}</h1>
              <ListenButton release={playerRelease(release)} label={hasPreview ? "Preview listening room" : "Open listening room"} />
              <StreamingLinks release={release} />
            </div>
            <ArtworkReveal>
              <Image className="album-cover" src={releaseArtwork(release)} alt={`${release.title} cover artwork`}
                width={520} height={520} sizes="(max-width: 700px) 88vw, 47vw" preload />
            </ArtworkReveal>
          </div>
        </div>
      </section>
      <section className="page-width release-details">
        {release.tracks?.length ? <div><h2>Track list</h2>
          <ol>{release.tracks.map((track, index) => <li key={index}>
            {track.title}
            {track.durationSeconds !== undefined && <time dateTime={`PT${track.durationSeconds}S`}>
              {" · "}{Math.floor(track.durationSeconds / 60)}:{String(track.durationSeconds % 60).padStart(2, "0")}
            </time>}
            {track.credits?.length ? <ul aria-label={`${track.title} credits`}>
              {track.credits.map((credit, index) => <li key={index}>{credit.name} · {credit.role}</li>)}
            </ul> : null}
            {track.lyrics && <details><summary>Lyrics for {track.title}</summary>
              <p className="track-lyrics">{track.lyrics}</p>
            </details>}
          </li>)}</ol>
        </div> : null}
        {release.credits?.length ? <div><h2>Credits</h2>
          <ul>{release.credits.map((credit, index) => <li key={index}>{credit.name} · {credit.role}</li>)}</ul>
        </div> : null}
        <div><h2>Release information</h2>
          <a className="text-link" href={release.unitedMastersUrl}>View on UnitedMasters <span aria-hidden="true">↗</span></a>
        </div>
      </section>
    </main>
    <SiteFooter />
  </div>;
}
