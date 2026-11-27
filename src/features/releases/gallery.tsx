"use client";

import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, useScroll } from "motion/react";
import type { Release } from "@/content/music-types";
import { ReleaseCard } from "./release-card";

export function ReleaseGallery({ releases }: { releases: readonly Release[] }) {
  const rail = useRef<HTMLUListElement>(null);
  const { scrollXProgress } = useScroll({ container: rail, axis: "x" });

  function move(direction: number) {
    const list = rail.current;
    if (!list) return;
    const first = list.children[0];
    if (!first) return;
    const origin = first.getBoundingClientRect().left;
    const offsets = Array.from(list.children, (item) => item.getBoundingClientRect().left - origin);
    const left = direction > 0
      ? offsets.find((offset) => offset > list.scrollLeft + 2) ?? list.scrollWidth
      : offsets.findLast((offset) => offset < list.scrollLeft - 2) ?? 0;
    list.scrollTo({
      left,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }

  return <div className="release-gallery">
    <div className="gallery-controls">
      <button className="icon-button" type="button" onClick={() => move(-1)} aria-label="Previous releases" aria-controls="release-gallery"><ArrowLeft /></button>
      <button className="icon-button" type="button" onClick={() => move(1)} aria-label="Next releases" aria-controls="release-gallery"><ArrowRight /></button>
    </div>
    <ul ref={rail} className="gallery-rail" id="release-gallery" aria-label="Selected releases">
      {releases.map((release) => <li key={release.slug}><ReleaseCard release={release} gallery /></li>)}
    </ul>
    <div className="gallery-progress page-width" aria-hidden="true">
      <motion.div style={{ scaleX: scrollXProgress }} />
    </div>
  </div>;
}
