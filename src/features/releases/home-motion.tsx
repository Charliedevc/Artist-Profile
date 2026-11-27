"use client";

import { motion, useScroll, useSpring, useTransform, type MotionStyle, type MotionValue } from "motion/react";
import { useRef, type ComponentPropsWithoutRef, type ReactNode } from "react";

type SceneStyle = MotionStyle & { [property: `--${string}`]: string | number | MotionValue<string> | MotionValue<number> };

export function HeroScene({ portrait, children }: { portrait: ReactNode; children: ReactNode }) {
  const target = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target, offset: ["start start", "end start"] });
  const portraitShift = useTransform(scrollYProgress, [0, 1], ["0px", "112px"]);
  const portraitScale = useTransform(scrollYProgress, [0, 1], [1, 1.21]);
  const typeShift = useTransform(scrollYProgress, [0, 1], ["0px", "-74px"]);
  const exitShade = useTransform(scrollYProgress, [0.12, 0.9], [0, 0.86]);
  const style: SceneStyle = {
    "--hero-portrait-shift": portraitShift,
    "--hero-portrait-scale": portraitScale,
    "--hero-type-shift": typeShift,
    "--hero-exit-shade": exitShade,
  };

  return <motion.section ref={target} className="hero grain" aria-labelledby="home-title" style={style}>
    <div className="hero-media">{portrait}</div>
    {children}
  </motion.section>;
}

type EditorialProps = Pick<ComponentPropsWithoutRef<"section">, "id" | "className" | "aria-labelledby" | "style" | "children">;

export function EditorialScene({ style, treatment = "type", ...props }: EditorialProps & {
  treatment?: "sleeve" | "type" | "portrait";
}) {
  const target = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target, offset: ["start end", "end start"] });
  const progress = useSpring(scrollYProgress, { stiffness: 210, damping: 34, restDelta: 0.002 });
  const titleShift = useTransform(progress, [0, 0.42, 1], ["30px", "0px", treatment === "type" ? "0px" : "-22px"]);
  const imageShift = useTransform(progress, [0, 0.5, 1], ["-28px", "0px", "28px"]);
  const sleeveSpread = useTransform(progress, [0.12, 0.56, 0.95], ["32px", "12px", "23px"]);
  const atmosphere = useTransform(progress, [0, 0.44, 1], [0.55, 1, 0.72]);

  const sceneStyle: SceneStyle = {
    ...style,
    "--editorial-title-shift": titleShift,
    "--editorial-image-shift": imageShift,
    "--sleeve-spread": sleeveSpread,
    "--editorial-atmosphere": atmosphere,
  };

  return <motion.section {...props} ref={target} style={sceneStyle} />;
}
