import { HtmlBasePlugin } from "@11ty/eleventy";
import fs from "node:fs";
import path from "node:path";

// ---- Video support (optional `video:` front matter) -------------------------
// Turns a YouTube or Vimeo URL into privacy-friendly embed info. Nothing is
// hosted here and nothing loads from YouTube/Vimeo until a visitor presses play.
function parseStart(v) {
  if (!v) return 0;
  if (/^\d+$/.test(v)) return parseInt(v, 10);
  const m = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(v);
  return m ? (+m[1] || 0) * 3600 + (+m[2] || 0) * 60 + (+m[3] || 0) : 0;
}
export function videoInfo(raw) {
  if (!raw || typeof raw !== "string") return null;
  let u;
  try { u = new URL(raw.trim()); } catch { return null; }
  const host = u.hostname.replace(/^(www|m|music)\./, "");
  const parts = u.pathname.split("/").filter(Boolean);
  const start = parseStart(u.searchParams.get("t") || u.searchParams.get("start"));
  let id = null;
  if (host === "youtu.be") id = parts[0];
  else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (parts[0] === "watch") id = u.searchParams.get("v");
    else if (["shorts", "embed", "live", "v"].includes(parts[0])) id = parts[1];
  }
  if (id && /^[\w-]{11}$/.test(id)) {
    const q = new URLSearchParams({ autoplay: "1", rel: "0", modestbranding: "1" });
    if (start) q.set("start", String(start));
    return {
      provider: "youtube", providerName: "YouTube", id,
      embed: `https://www.youtube-nocookie.com/embed/${id}?${q}`,
      watch: `https://www.youtube.com/watch?v=${id}${start ? `&t=${start}s` : ""}`,
      vertical: parts[0] === "shorts",
    };
  }
  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const nums = parts.filter((p) => /^\d+$/.test(p));
    const vid = nums[0];
    if (vid) {
      // Unlisted videos: vimeo.com/ID/HASH or ?h=HASH
      const after = parts[parts.indexOf(vid) + 1];
      const hash = u.searchParams.get("h") || (after && /^[0-9a-f]{6,}$/i.test(after) ? after : "");
      const q = new URLSearchParams({ autoplay: "1", dnt: "1" });
      if (hash) q.set("h", hash);
      return {
        provider: "vimeo", providerName: "Vimeo", id: vid,
        embed: `https://player.vimeo.com/video/${vid}?${q}${start ? `#t=${start}s` : ""}`,
        watch: `https://vimeo.com/${vid}${hash ? "/" + hash : ""}`,
        vertical: false,
      };
    }
  }
  // Not YouTube/Vimeo: no embed, the layout just shows a plain link.
  console.warn(`[slop-archive] video URL is not a recognised YouTube/Vimeo link, showing it as a plain link: ${raw}`);
  return { provider: "link", providerName: u.hostname, id: null, embed: null, watch: u.href, vertical: false };
}
// ---- Image support (optional `image:` front matter) -------------------------
// `image:` can be a file in src/assets/exhibits/ ("shrimp-jesus.webp"), a site path
// ("/assets/exhibits/shrimp-jesus.webp"), or a full https:// URL hosted elsewhere.
// Keep local files small (WebP, under ~300 KB) so hosting stays free.
const EXHIBIT_IMG_DIR = "src/assets/exhibits";
const IMG_BUDGET_KB = 300;
const warnedImages = new Set();
export function imageInfo(raw) {
  if (!raw || typeof raw !== "string") return null;
  const v = raw.trim();
  if (/^https?:\/\//i.test(v)) return { src: v, local: false, host: new URL(v).hostname };
  const rel = v.replace(/^\/?(assets\/exhibits\/)?/, "");
  const file = path.join(EXHIBIT_IMG_DIR, rel);
  if (!warnedImages.has(file)) {
    warnedImages.add(file);
    if (!fs.existsSync(file)) {
      console.warn(`[slop-archive] image not found: ${file} (put exhibit images in ${EXHIBIT_IMG_DIR}/)`);
    } else {
      const kb = Math.round(fs.statSync(file).size / 1024);
      if (kb > IMG_BUDGET_KB) console.warn(`[slop-archive] ${file} is ${kb} KB. Please compress it (WebP, under ~${IMG_BUDGET_KB} KB) to keep hosting free.`);
    }
  }
  return { src: "/assets/exhibits/" + rel, local: true, host: null };
}

// Labels shown on the site: the entry's own labels, plus automatic "image" and "video" labels.
export function allLabels(data) {
  const labels = [...(data.labels || [])];
  if (data.image && !labels.includes("image")) labels.push("image");
  if (data.video && !labels.includes("video")) labels.push("video");
  return labels;
}

export default function (eleventyConfig) {
  // Makes every href/src respect the path prefix (needed for GitHub Pages project sites
  // like https://USERNAME.github.io/slop-archive/). Build with: npx eleventy --pathprefix=/slop-archive/
  eleventyConfig.addPlugin(HtmlBasePlugin);

  // Keep single line breaks inside slop exactly as found (poems, emoji lists, etc.).
  eleventyConfig.amendLibrary("md", (md) => md.set({ breaks: true }));

  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  // Browsers ask for /favicon.ico at the site root no matter what, so put a copy there too.
  eleventyConfig.addPassthroughCopy({ "src/assets/img/favicon.ico": "favicon.ico" });

  // All exhibits, newest exhibit number first.
  eleventyConfig.addCollection("slop", (api) =>
    api.getFilteredByGlob("src/entries/*.md").sort((a, b) => b.data.exhibit - a.data.exhibit)
  );

  // One record per label: { name, slug, entries[] }, sorted by popularity then name.
  eleventyConfig.addCollection("slopTags", (api) => {
    const slugify = eleventyConfig.getFilter("slugify");
    const map = new Map();
    for (const item of api.getFilteredByGlob("src/entries/*.md")) {
      for (const label of allLabels(item.data)) {
        if (!map.has(label)) map.set(label, { name: label, slug: slugify(label), entries: [] });
        map.get(label).entries.push(item);
      }
    }
    for (const t of map.values()) t.entries.sort((a, b) => b.data.exhibit - a.data.exhibit);
    return [...map.values()].sort((a, b) => b.entries.length - a.entries.length || a.name.localeCompare(b.name));
  });

  eleventyConfig.addFilter("exhibitNo", (n) => "No. " + String(n).padStart(4, "0"));
  eleventyConfig.addFilter("prettyDate", (s) => {
    const d = new Date(s + "T00:00:00Z");
    return isNaN(d) ? s : d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
  });
  eleventyConfig.addFilter("head", (arr, n) => (n < 0 ? arr.slice(n) : arr.slice(0, n)));
  eleventyConfig.addFilter("videoInfo", videoInfo);
  eleventyConfig.addFilter("imageInfo", imageInfo);
  eleventyConfig.addFilter("allLabels", allLabels);
  eleventyConfig.addFilter("hasTag", (tags, slug) => (tags || []).some((t) => t.slug === slug));
  // `source:` front matter can be a single URL string or a list of URLs.
  eleventyConfig.addFilter("asList", (v) => (v == null || v === "" ? [] : Array.isArray(v) ? v.filter(Boolean) : [v]));
  // Short, readable link text for a source URL: "theverge.com/2016/3/24/…"
  eleventyConfig.addFilter("sourceLabel", (raw) => {
    try {
      const u = new URL(String(raw));
      const host = u.hostname.replace(/^www\./, "");
      let rest = decodeURIComponent(u.pathname).replace(/\/$/, "");
      if (rest.length > 48) rest = rest.slice(0, 47) + "…";
      return host + rest;
    } catch { return String(raw); }
  });
  eleventyConfig.addFilter("json", (v) => JSON.stringify(v));

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
