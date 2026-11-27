"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function SleeveScene({ children }: { children: ReactNode }) {
  const stage = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = stage.current;
    if (!section) return;
    const motion = matchMedia("(prefers-reduced-motion: no-preference) and (min-height: 620px)");
    let frame = 0;
    let previous = -1;

    const draw = () => {
      frame = 0;
      const distance = section.offsetHeight - (section.firstElementChild?.clientHeight ?? innerHeight);
      const progress = Math.min(1, Math.max(0, -section.getBoundingClientRect().top / Math.max(1, distance)));
      if (progress === previous) return;
      previous = progress;
      section.style.setProperty("--sleeve-progress", String(progress));
    };
    const schedule = () => {
      if (motion.matches && !frame) frame = requestAnimationFrame(draw);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      previous = -1;
      section.style.removeProperty("--sleeve-progress");
      schedule();
    };

    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    motion.addEventListener("change", sync);
    sync();
    return () => {
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      motion.removeEventListener("change", sync);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <section className="sleeve-scene" ref={stage} aria-labelledby="home-title">
    <div className="sleeve-frame">{children}</div>
  </section>;
}
