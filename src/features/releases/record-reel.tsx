"use client";

import { useRef } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { ReleaseCard, StreamingLinks } from "./release-card";
import type { Release } from "@/content/music-types";

export function RecordReel({ releases }: { releases: readonly Release[] }) {
  const reel = useRef<HTMLOListElement>(null);

  function advance(direction: number) {
    const track = reel.current;
    const card = track?.firstElementChild;
    if (!track || !card) return;
    const gap = Number.parseFloat(getComputedStyle(track).columnGap);
    track.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap),
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }

  return <div className="record-reel">
    <div className="reel-tools">
      <button type="button" className="icon-button" onClick={() => advance(-1)} aria-label="Previous covers"><ArrowLeft aria-hidden="true" /></button>
      <button type="button" className="icon-button" onClick={() => advance(1)} aria-label="Next covers"><ArrowRight aria-hidden="true" /></button>
    </div>
    <ol ref={reel} className="reel-track" aria-label="Featured release covers">
      {releases.map(release => <li key={release.slug}>
        <ReleaseCard release={release} gallery />
        <StreamingLinks release={release} />
        {release.streamingLinks.length === 0 && <a className="night-link" href={release.unitedMastersUrl}>UnitedMasters <ArrowUpRight size={14} aria-hidden="true" /></a>}
      </li>)}
    </ol>
  </div>;
}
