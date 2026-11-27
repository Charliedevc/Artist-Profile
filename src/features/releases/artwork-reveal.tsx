"use client";

import { useAnimate, useReducedMotion } from "motion/react";
import { useEffect, type ReactNode } from "react";

export function ArtworkReveal({ children }: { children: ReactNode }) {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const artwork = scope.current;
    const animation = animate(artwork, { opacity: [0.82, 1], clipPath: ["inset(0 0 8% 0)", "inset(0 0 0% 0)"] }, {
      duration: 0.56,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => {
      animation.stop();
      artwork.style.removeProperty("opacity");
      artwork.style.removeProperty("clip-path");
    };
  }, [animate, reducedMotion, scope]);

  return <div className="album-sleeve" ref={scope}>{children}</div>;
}
