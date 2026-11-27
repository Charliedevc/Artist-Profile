"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { artist } from "@/content/artist";

const links = [
  { href: "/", label: "Home" },
  { href: "/music", label: "Music" },
  { href: "/visuals", label: "Visuals" },
  { href: "/about", label: "About" },
];

export function Navigation({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return <nav aria-label="Main navigation">
    {links.map(({ href, label }) => {
      const active = pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
      return <Link href={href} key={href}
        aria-current={active ? (pathname === href ? "page" : "location") : undefined}>{label}</Link>;
    })}
    <a href={artist.subscription.signupUrl}>Subscribe</a>
    {children}
  </nav>;
}
