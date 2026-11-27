import Image from "next/image";
import Link from "next/link";
import type { Release } from "@/content/music-types";
import { releaseArtwork } from "@/content/signature";

export function ReleaseCard({ release, gallery = false, compact = false }: {
  release: Release; gallery?: boolean; compact?: boolean;
}) {
  let sizes = "(max-width: 700px) 45vw, (max-width: 1050px) 29vw, 23vw";
  if (gallery) sizes = "(max-width: 700px) 73vw, 26vw";
  if (compact) sizes = "74px";
  return (
    <Link className="release-card" href={`/music/${release.slug}`}>
      <span className="release-card-art">
        <Image src={releaseArtwork(release)} alt="" width={520} height={520}
          sizes={sizes} />
      </span>
      <span className="release-card-caption">
        <span className="release-card-title">{release.title}</span>
        <span className="eyebrow release-year">{release.listedYear}</span>
        <span className="release-card-arrow" aria-hidden="true">↗</span>
      </span>
    </Link>
  );
}

export function StreamingLinks({ release }: { release: Pick<Release, "streamingLinks"> }) {
  if (!release.streamingLinks.length) return null;
  return <ul className="streaming-links" aria-label="Streaming platforms">
    {release.streamingLinks.map(({ platform, url }) => <li key={url}>
      <a href={url}>{platform} <span aria-hidden="true">↗</span></a>
    </li>)}
  </ul>;
}
