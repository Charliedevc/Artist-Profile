"use client";

import { useRef, useState } from "react";
import type { Release } from "@/content/music-types";
import { ReleaseCard } from "./release-card";

export function Discography({ releases }: { releases: readonly Release[] }) {
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("");
  const [sort, setSort] = useState("newest");
  const years = [...new Set(releases.map((release) => release.listedYear))].sort((a, b) => b - a);
  const dateKey = (release: Release) => release.releaseDate ?? `${release.listedYear}`;
  const needle = query.trim().toLocaleLowerCase();
  const results = releases
    .filter((release) => release.title.toLocaleLowerCase().includes(needle) && (!year || String(release.listedYear) === year))
    .sort((a, b) => sort === "oldest" ? dateKey(a).localeCompare(dateKey(b)) : dateKey(b).localeCompare(dateKey(a)));
  const search = useRef<HTMLInputElement>(null);

  function clearFilters() {
    setQuery("");
    setYear("");
    search.current?.focus();
  }

  return <>
    <div className="catalog-controls">
      <label>Search releases<input ref={search} type="search" value={query} onChange={(event) => setQuery(event.currentTarget.value)} placeholder="Release title" /></label>
      <label>Year<select value={year} onChange={(event) => setYear(event.currentTarget.value)}>
        <option value="">All years</option>
        {years.map((value) => <option key={value}>{value}</option>)}
      </select></label>
      <label>Sort<select value={sort} onChange={(event) => setSort(event.currentTarget.value)}>
        <option value="newest">Newest first</option><option value="oldest">Oldest first</option>
      </select></label>
    </div>
    <p className="eyebrow catalog-count" role="status">{results.length} {results.length === 1 ? "release" : "releases"}</p>
    {results.length ? <ul className="catalog-grid">
      {results.map((release) => <li key={release.slug}><ReleaseCard release={release} compact /></li>)}
    </ul> : <div className="catalog-empty">
      <p>No releases match your search.</p>
      <button className="solid-button" type="button" onClick={clearFilters}>Clear filters</button>
    </div>}
  </>;
}
