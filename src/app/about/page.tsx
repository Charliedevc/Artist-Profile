import type { Metadata } from "next";
import Image from "next/image";
import { PageHeading, SiteFooter, SiteHeader } from "@/components/site-shell";
import { artist } from "@/content/artist";
import { portrait } from "@/content/signature";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return <>
    <SiteHeader />
    <main id="main" className="page-width interior">
      <PageHeading label="Dark R&B / New Jazz" title="About Narçi" />
      <section className="about-page-grid">
        <Image src={portrait.src} alt={portrait.alt} width={700} height={820} sizes="(max-width: 700px) 88vw, 46vw" />
        <div><p>{artist.biography}</p>
          <a className="text-link" href={artist.subscription.signupUrl}>Subscribe on UnitedMasters <span aria-hidden="true">↗</span></a>
        </div>
      </section>
    </main>
    <SiteFooter />
  </>;
}
