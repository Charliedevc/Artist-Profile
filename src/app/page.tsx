import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-shell";
import { artist } from "@/content/artist";
import { releases } from "@/content/releases";
import { featuredRelease, portrait, releaseArtwork } from "@/content/signature";
import { ListenButton } from "@/features/player/player-ui";
import { playerRelease } from "@/features/releases/player-release";
import { RecordReel } from "@/features/releases/record-reel";
import { SleeveScene } from "@/features/releases/sleeve-scene";

export default function Home() {
  const release = featuredRelease;
  return <>
    <SiteHeader />
    <main id="main">
      <SleeveScene>
        <div className="night-portrait">
          <Image src={portrait.src} alt={portrait.alt} fill sizes="(max-width: 700px) 100vw, 72vw" preload />
        </div>
        <div className="night-title">
          <p className="eyebrow">Dark R&amp;B / New Jazz</p>
          <h1 id="home-title">{artist.name}</h1>
          {release && <a className="night-link" href="#featured">Enter {release.title} <ArrowDown size={18} aria-hidden="true" /></a>}
        </div>
        {release && <div className="night-insert" aria-hidden="true">
          <Image src={releaseArtwork(release)} alt="" fill sizes="(max-width: 700px) 30vw, 24vw" />
        </div>}
      </SleeveScene>
      {release && <section id="featured" tabIndex={-1} className="night-feature" aria-labelledby="featured-title">
        <div className="page-width">
          <Image src={releaseArtwork(release)} alt={`${release.title} cover artwork`} width={690} height={690} sizes="(max-width: 700px) 88vw, 52vw" />
          <div className="night-feature-copy">
            <h2 id="featured-title">{release.title}</h2>
            <p className="eyebrow">Featured release · {release.listedYear}</p>
            <Link className="night-link" href={`/music/${release.slug}`}>Explore the release <ArrowUpRight size={18} aria-hidden="true" /></Link>
            <ListenButton release={playerRelease(release)} label="Where to listen" />
          </div>
        </div>
      </section>}
      <section className="page-width night-section" aria-labelledby="selected-title">
        <div className="night-section-head">
          <h2 id="selected-title">Discography</h2>
          <Link className="night-link" href="/music">All {releases.length} releases <ArrowUpRight size={18} aria-hidden="true" /></Link>
        </div>
        <RecordReel releases={releases.filter(item => item !== release).slice(0, 5)} />
      </section>
    </main>
    <SiteFooter />
  </>;
}
