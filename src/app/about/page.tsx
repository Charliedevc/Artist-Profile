import { pageMetadata } from "../site-metadata";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-shell";
import { artist } from "@/content/artist";
import { portrait } from "@/content/signature";

export const metadata = pageMetadata("/about", "About", artist.biography);

export default function AboutPage() {
  return <>
    <SiteHeader />
    <main id="main" className="page-width interior artist-story">
      <header className="night-heading"><h1>About <em>{artist.name}</em></h1></header>
      <section className="story-scene" aria-label="Artist biography">
        <div className="story-image"><Image src={portrait.src} alt={portrait.alt} fill sizes="(max-width: 700px) 90vw, 53vw" preload /></div>
        <div className="story-copy">
          <p>{artist.biography}</p>
          <Link href="/music" className="night-link">Explore the discography <ArrowUpRight size={18} aria-hidden="true" /></Link>
        </div>
      </section>
    </main>
    <SiteFooter />
  </>;
}
