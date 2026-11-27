import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site-shell";

export default function NotFound() {
  return <>
    <SiteHeader />
    <main id="main" className="page-width interior">
      <h1>Page unavailable</h1>
      <p>Explore Narçi’s releases in the discography.</p>
      <Link className="text-link" href="/music">Browse discography <span aria-hidden="true">→</span></Link>
    </main>
    <SiteFooter />
  </>;
}
