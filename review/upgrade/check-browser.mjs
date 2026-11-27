import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { releases } from "../../src/content/releases.ts";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.NARCI_PLAYWRIGHT || "playwright");
const [phase, origin] = process.argv.slice(2);
assert.ok(phase === "before" || phase === "after");
const output = resolve("review/upgrade", phase);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
const evidence = { browser: browser.version(), origin, viewports: {}, errors: [], routes: [] };

try {
  for (const [name, width, height] of [["desktop", 1440, 900], ["tablet", 768, 1024], ["mobile", 390, 844]]) {
    const context = await browser.newContext({ viewport: { width, height } });
    await context.addInitScript(() => {
      window.samples = { lcp: 0, cls: 0 };
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) window.samples.lcp = entry.startTime;
      }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.samples.cls += entry.value;
      }).observe({ type: "layout-shift", buffered: true });
    });
    const page = await context.newPage();
    page.on("pageerror", error => evidence.errors.push(String(error)));
    page.on("console", message => {
      if (message.type() === "error") evidence.errors.push({ text: message.text(), url: message.location().url });
    });
    for (const [label, path] of [["home", "/"], ["catalog", "/music"], ["brielle", "/music/brielle"]]) {
      assert.equal((await page.goto(origin + path, { waitUntil: "networkidle" })).status(), 200);
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: resolve(output, name + "-" + label + ".jpg"), quality: 86 });
      evidence.viewports[name] ??= {};
      evidence.viewports[name][label] = await page.evaluate(() => {
        const resources = performance.getEntriesByType("resource");
        return {
          ...window.samples,
          jsTransferBytes: resources.filter(entry => entry.name.includes(".js")).reduce((sum, entry) => sum + entry.transferSize, 0),
          horizontalOverflow: document.documentElement.scrollWidth - innerWidth,
        };
      });
      assert.equal(evidence.viewports[name][label].horizontalOverflow, 0);
    }
    const trigger = page.getByRole("button", { name: "Open listening room", exact: true }).first();
    await trigger.click();
    await page.getByRole("dialog").waitFor();
    await page.waitForFunction(() => {
      const panel = document.querySelector(".listening-inner");
      return panel && getComputedStyle(panel).opacity === "1";
    });
    await page.screenshot({ path: resolve(output, name + "-listening.jpg"), quality: 86 });
    await page.keyboard.press("Escape");
    await page.getByRole("dialog").waitFor({ state: "hidden" });
    assert.equal(await trigger.evaluate(node => node === document.activeElement), true);
    await context.close();
  }
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 },
    ...(phase === "after" ? { recordVideo: { dir: output, size: { width: 1280, height: 800 } } } : {}),
  });
  const page = await context.newPage();
  await page.goto(origin);
  await page.waitForTimeout(1400);
  if (phase === "after") {
    await page.keyboard.press("Tab");
    assert.equal(await page.locator(":focus").textContent(), "Skip to content");
    assert.equal(await page.getByRole("link", { name: "Explore Brielle" }).getAttribute("href"), "/music/brielle");
    await page.mouse.wheel(0, 350);
    await page.waitForTimeout(1050);
  }
  await page.getByRole("link", { name: "Featured release" }).click();
  await page.waitForTimeout(1450);
  await page.getByRole("link", { name: "Brielle release page" }).click();
  await page.getByRole("heading", { name: "Brielle", exact: true }).waitFor();
  await page.waitForTimeout(900);
  if (phase === "after") {
    await page.getByRole("button", { name: "Open listening room", exact: true }).first().click();
    await page.getByRole("dialog").getByRole("link", { name: "Release and streaming links" }).waitFor();
    assert.equal(await page.getByRole("dialog").getByRole("button", { name: "Play preview" }).count(), 0);
    assert.ok(await page.getByRole("dialog").getByRole("link", { name: "Spotify" }).count());
    await page.waitForTimeout(1500);
    await page.keyboard.press("Escape");
  }
  await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Music" }).click();
  const search = page.getByRole("searchbox");
  await search.fill("Malasia");
  await page.getByRole("status").filter({ hasText: "2 releases" }).waitFor();
  await page.waitForTimeout(1200);
  await search.fill("zzz-no-results");
  await page.getByText("No releases match your search.").waitFor();
  await page.waitForTimeout(850);
  if (phase === "after") {
    await page.getByRole("button", { name: "Clear filters" }).click();
    await page.getByRole("status").filter({ hasText: "26 releases" }).waitFor();
    assert.equal(await search.evaluate(node => node === document.activeElement), true);
  }
  await page.getByRole("navigation").getByRole("link", { name: "Visuals" }).click();
  await page.waitForTimeout(1250);
  await page.getByRole("navigation").getByRole("link", { name: "About" }).click();
  await page.waitForTimeout(1250);
  const video = page.video();
  await context.close();
  if (video) {
    await video.saveAs(resolve(output, "walkthrough.webm"));
    await video.delete();
  }
  const routes = await Promise.all(releases.map(async item => {
    const response = await fetch(origin + "/music/" + item.slug);
    const html = await response.text();
    assert.equal(response.status, 200);
    for (const { url } of item.streamingLinks) assert.ok(html.includes(url.replaceAll("&", "&amp;")) || html.includes(url), url);
    return { slug: item.slug, streamingLinks: item.streamingLinks.length };
  }));
  evidence.routes = routes;
  assert.equal(routes.length, 26);
  assert.equal(routes.reduce((sum, item) => sum + item.streamingLinks, 0), 53);
  assert.equal((await fetch(origin + "/music/qa-missing-release")).status, 404);
  if (phase === "after") {
    assert.deepEqual(evidence.errors, []);
    const narrow = await browser.newContext({ viewport: { width: 320, height: 568 }, reducedMotion: "reduce" });
    const smallPage = await narrow.newPage();
    await smallPage.goto(origin);
    assert.equal(await smallPage.locator(".hero-portrait").evaluate(node => getComputedStyle(node).transform), "none");
    assert.equal(await smallPage.evaluate(() => document.documentElement.scrollWidth - innerWidth), 0);
    await narrow.close();
    const response = await fetch(origin);
    assert.equal(response.headers.get("x-content-type-options"), "nosniff");
    assert.equal(response.headers.get("x-frame-options"), "DENY");
    assert.equal(response.headers.get("x-powered-by"), null);
  }
} finally {
  await browser.close();
  await writeFile(resolve(output, "evidence.json"), JSON.stringify(evidence, null, 2) + "\n");
}
