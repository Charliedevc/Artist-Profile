import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/site-shell";
import { Navigation } from "@/components/navigation";
import { artist } from "@/content/artist";
import { releases } from "@/content/releases";
import { featuredRelease, portrait, releaseArtwork, releaseDate } from "@/content/signature";
import { ListenButton } from "@/features/player/player-ui";
import { ReleaseGallery } from "@/features/releases/gallery";
import { playerRelease } from "@/features/releases/player-release";
import { StreamingLinks } from "@/features/releases/release-card";
import { releaseTheme } from "@/features/releases/release-theme";
import { EditorialScene, HeroScene } from "@/features/releases/home-motion";

export default function Home() {
  const release = featuredRelease;
  const playbackRelease = release ? playerRelease(release) : undefined;
  const gallery = releases.filter((item) => item.slug !== release?.slug);
  const lead = gallery.find((item) => item.slug === "at-jade");
  const alternate = gallery.find((item) => item.slug === "at-jade-part-2");
  const rest = gallery.filter((item) => item !== lead && item !== alternate);
  const selected = [lead, ...rest.slice(0, 3), alternate, ...rest.slice(3)].filter((item) => item !== undefined);

  return <>
    <main id="main" className="signature-home">
      <HeroScene portrait={<Image className="hero-portrait" src={portrait.src} alt={portrait.alt} fill sizes="100vw" preload />}>
        <header className="hero-header page-width">
          <Link href="/" className="wordmark" aria-label="Narçi home">{artist.name}</Link>
          <Navigation />
        </header>
        <div className="hero-copy page-width">
          <p className="eyebrow hero-genre">Dark R&B <span aria-hidden="true">/</span> New Jazz</p>
          <h1 id="home-title"><span>{artist.name}</span></h1>
          <div className="hero-actions">
            {playbackRelease && <ListenButton release={playbackRelease} label={`Listen to ${playbackRelease.title}`} />}
            {release && <a href="#featured" className="hero-scroll eyebrow">Featured release <span aria-hidden="true">↓</span></a>}
          </div>
        </div>
      </HeroScene>

      {release && playbackRelease && <EditorialScene id="featured" className="featured" treatment="sleeve" aria-labelledby="featured-title" style={releaseTheme(release)}>
        <div className="featured-layout page-width">
          <p className="eyebrow era-label featured-label">Featured release <span aria-hidden="true">/</span> {release.listedYear}</p>
          <div className="featured-artwork">
            <div className="featured-sleeve">
              <Link className="featured-image grain" href={playbackRelease.href} aria-label={`${release.title} cover artwork, release page`}>
                <Image src={releaseArtwork(release)} alt={`${release.title} cover artwork`}
                  width={520} height={520} sizes="(max-width: 700px) 88vw, 48vw" />
              </Link>
            </div>
          </div>
          <div className="featured-copy">
            <h2 id="featured-title">{release.title}</h2>
            <p className="eyebrow era-label">{artist.name} / <time dateTime={release.releaseDate}>{releaseDate(release)}</time></p>
            <ListenButton release={playbackRelease} label="Open listening room" />
            <StreamingLinks release={release} />
            <Link className="text-link" href={playbackRelease.href}>{release.title} release page <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </EditorialScene>}

      <EditorialScene className="home-catalog" aria-labelledby="home-catalog-title" style={releaseTheme(release)}>
        <div className="page-width section-heading">
          <div><p className="eyebrow era-label">Selected releases</p><h2 id="home-catalog-title">Discography</h2></div>
          <Link className="text-link" href="/music">View all {releases.length} releases <span aria-hidden="true">→</span></Link>
        </div>
        <ReleaseGallery releases={selected.slice(0, 8)} />
      </EditorialScene>

      <EditorialScene className="home-closing" treatment="portrait" aria-labelledby="home-visuals-title">
        <div className="page-width home-closing-layout">
          <Link href="/visuals" className="home-portrait-link" aria-label="Explore Narçi’s visuals">
            <div className="visual-photo"><Image src={portrait.src} alt={portrait.alt} fill sizes="(max-width: 700px) 100vw, 55vw" /></div>
          </Link>
          <div className="home-closing-copy">
            <p className="eyebrow era-label">Visuals</p>
            <h2 id="home-visuals-title">Narçi in motion</h2>
            <Link className="text-link" href="/visuals">Explore visuals <span aria-hidden="true">→</span></Link>
            <section className="home-about" aria-labelledby="home-about-title">
              <h2 id="home-about-title">About Narçi</h2>
              <p>{artist.biography}</p>
              <Link className="text-link" href="/about">Artist biography <span aria-hidden="true">→</span></Link>
            </section>
          </div>
        </div>
      </EditorialScene>
    </main>
    <SiteFooter />
  </>;
}
