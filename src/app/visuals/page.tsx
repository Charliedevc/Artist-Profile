import type { Metadata } from "next";
import Image from "next/image";
import { PageHeading, SiteFooter, SiteHeader } from "@/components/site-shell";
import { portrait, publicVisuals } from "@/content/signature";

export const metadata: Metadata = { title: "Visuals" };

export default function VisualsPage() {
  return <>
    <SiteHeader />
    <main id="main" className="page-width interior">
      <PageHeading label="Narçi" title="Visuals" />
      {publicVisuals.length ? <div className="visual-grid">
        {publicVisuals.map((visual) => <section key={visual.src}>
          <h2>{visual.title}</h2>
          <video controls playsInline preload="none" poster={visual.poster} src={visual.src}>
            <track default kind="captions" src={visual.captions} srcLang="en" label="English" />
          </video>
        </section>)}
      </div> : <section className="visual-feature">
        <div className="visual-photo"><Image src={portrait.src} alt={portrait.alt} fill sizes="(max-width: 700px) 100vw, 55vw" /></div>
        <div><h2>Narçi in motion</h2><p>Music videos and campaign visuals are unavailable here for now.</p></div>
      </section>}
    </main>
    <SiteFooter />
  </>;
}
