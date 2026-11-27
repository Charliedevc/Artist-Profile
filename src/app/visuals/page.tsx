import { pageMetadata } from "../site-metadata";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site-shell";
import { portrait, publicVisuals, releaseArtwork } from "@/content/signature";
import { releases } from "@/content/releases";

export const metadata = pageMetadata("/visuals", "Visuals", "Explore Narçi’s official portrait and release artwork.");

const studies = ["brielle", "prom-night", "save-the-bees"];

export default function VisualsPage() {
  return <>
    <SiteHeader />
    <main id="main" className="page-width interior visual-studies">
      <header className="night-heading"><h1>Visual <em>studies</em></h1></header>
      <figure className="visual-contact">
        <div><Image src={portrait.src} alt={portrait.alt} fill sizes="(max-width: 700px) 55vw, 45vw" preload /></div>
        <div aria-hidden="true"><Image src={portrait.src} alt="" fill sizes="(max-width: 700px) 35vw, 34vw" /></div>
        <figcaption className="eyebrow">Narçi · Portrait and detail</figcaption>
      </figure>
      <section className="night-section" aria-labelledby="cover-gallery">
        <div className="night-section-head"><h2 id="cover-gallery">Cover studies</h2></div>
        <ul className="cover-studies">
          {studies.map(slug => {
            const release = releases.find(item => item.slug === slug);
            return release && <li key={slug}><Link href={`/music/${slug}`}>
              <Image src={releaseArtwork(release)} alt="" width={520} height={520} sizes="(max-width: 700px) 77vw, 40vw" />
              <span>{release.title}</span>
            </Link></li>;
          })}
        </ul>
      </section>
      {publicVisuals.length > 0 && <div className="visual-grid">
        {publicVisuals.map((visual) => <section key={visual.src}>
          <h2>{visual.title}</h2>
          <video controls playsInline preload="none" poster={visual.poster} src={visual.src}>
            <track default kind="captions" src={visual.captions} srcLang="en" label="English" />
          </video>
        </section>)}
      </div>}
    </main>
    <SiteFooter />
  </>;
}
