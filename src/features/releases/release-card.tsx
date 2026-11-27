import Image from "next/image";
import Link from "next/link";
import type { Release } from "@/content/music-types";
import { releaseArtwork } from "@/content/signature";

export function ReleaseCard({ release, gallery = false }: { release: Release; gallery?: boolean }) {
  return (
    <Link className="release-card" href={`/music/${release.slug}`}>
      <span className="release-card-art">
        <Image src={releaseArtwork(release)} alt="" width={520} height={520}
          sizes={gallery ? "(max-width: 700px) 73vw, (max-width: 1050px) 45vw, 32vw" : "(max-width: 700px) 45vw, (max-width: 1050px) 29vw, 23vw"} />
      </span>
      <span className="release-card-caption">
        <span className="release-card-title">{release.title}</span>
        <span className="eyebrow release-year">{release.listedYear}</span>
        <span className="release-card-arrow" aria-hidden="true">↗</span>
      </span>
    </Link>
  );
}

export function StreamingLinks({ release }: { release: Release }) {
  return <ul className="streaming-links" aria-label="Streaming platforms">
    {release.streamingLinks.map(({ platform, url }) => <li key={url}>
      <a href={url}>{platform} <span aria-hidden="true">↗</span></a>
    </li>)}
  </ul>;
}
