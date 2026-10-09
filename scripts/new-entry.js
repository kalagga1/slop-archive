// Usage: npm run new -- "Title of the slop"
// Creates src/entries/NNNN-title-slug.md with the next exhibit number and a front-matter template.
import fs from "node:fs";
import path from "node:path";

const title = process.argv.slice(2).join(" ").trim();
if (!title) {
  console.error('Usage: npm run new -- "Title of the slop"');
  process.exit(1);
}
const dir = path.join(process.cwd(), "src", "entries");
const nums = fs.readdirSync(dir).map((f) => parseInt(f, 10)).filter((n) => !isNaN(n));
const next = (nums.length ? Math.max(...nums) : 0) + 1;
const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50);
const file = path.join(dir, `${String(next).padStart(4, "0")}-${slug}.md`);
const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(
  file,
  `---
title: ${JSON.stringify(title)}
exhibit: ${next}
spotted_in: "WHERE IT WAS FOUND (e.g. LinkedIn post)"
spotted_on: "${today}"
labels: [delve]
submitted_by: ""
curator_note: ""
# Optional IMAGE: a file in src/assets/exhibits/ (e.g. "shrimp-jesus.webp") or a full
# https:// URL. Shown as a framed artwork above the text and tagged "image" automatically.
# Compress local files first: WebP, under ~300 KB, about 1200px wide is plenty
# (e.g. "cwebp -q 75 -resize 1200 0 in.png -o out.webp" or squoosh.app).
# image_alt describes what's in the picture for screen readers (required if you add an image).
image: ""
image_alt: ""
image_credit: ""   # e.g. "Posted on Facebook, 2024" or "Screenshot via @someone"
# Optional VIDEO: a YouTube or Vimeo link. Shown as a click-to-load player above the text,
# and the entry is added to the "video" tag automatically.
video: ""
# Delete any optional lines you don't use.
---
Paste the slop here, exactly as found. For images and video, write a description or
transcript here instead (it's what search and the random button show).
`
);
console.log("Created", path.relative(process.cwd(), file));
