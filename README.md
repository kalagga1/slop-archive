# The Slop Archive

A free museum of AI slop in every medium: **text** (the LinkedIn posts that *delve*, the product listings that loop forever, the poems that run out of rhymes), **images** (seven-fingered hands, garbled birthday cakes, Shrimp Jesus), and **video** (AI ads, narrated "facts" channels).

It's a **static site** built with [Eleventy (11ty)](https://www.11ty.dev/). There's no server and no database. Every exhibit is a Markdown file, images are small compressed files, and videos are embedded from YouTube/Vimeo, so it hosts free on **Cloudflare Pages** or **GitHub Pages**.

> The collection starts with 100 real, sourced AI slop exhibits (No. 0012–0111). Each lists its sources on the exhibit page, and the research notes are in `docs/research-index.md`. Numbers 0001–0011 are unused on purpose, so existing exhibit URLs never change.

## What's inside

| Page | URL | Source |
|---|---|---|
| Home with the big **🎰 Random slop** button | `/` | `src/index.njk` |
| One page per exhibit | `/exhibits/<slug>/` | `src/entries/*.md` + `src/_includes/entry.njk` |
| All exhibits | `/exhibits/` | `src/exhibits.njk` |
| Tag index and one page per tag | `/tags/`, `/tags/<tag>/` | `src/tags.njk`, `src/tag.njk` |
| Random redirect | `/random/` | `src/random.njk` |
| Submit instructions | `/submit/` | `src/submit.md` |
| Forum (links to GitHub Discussions) | `/forum/` | `src/forum.md` |
| Gift shop (print-on-demand merch) | `/shop/` | `src/shop.njk` + `src/_data/merch.json` |
| Slop of the Week newsletter | `/newsletter/` | `src/newsletter.njk` + `src/_includes/newsletter-box.njk` |
| Image and video exhibits (auto tags) | `/tags/image/`, `/tags/video/` | `src/tag.njk` |
| About, 404 | `/about/`, `/404.html` | `src/about.md`, `src/404.md` |
| Data for the random button | `/slop.json` | `src/slop.json.njk` |

Styling is all in one file: `src/assets/style.css`. The random button is `src/assets/random.js`.

## Site artwork

The site's own artwork is in `src/assets/img/` (copied to `/assets/img/`). Exhibit images go in `src/assets/exhibits/` instead; see [Image exhibits](#image-exhibits-optional). The site artwork files are hand-built SVGs plus small optimized PNGs:

| File | Used for |
|---|---|
| `logo.svg`, `logo.png` / `logo-dark.svg`, `logo-dark.png` | Full logo with wordmark (for light / dark backgrounds) |
| `logo-mark.svg`, `logo-mark-dark.svg`, `logo-mark.png` | The museum-and-blob icon alone. The header uses an inline copy in `src/_includes/logo-mark.svg` |
| `favicon.svg`, `favicon.ico` (also copied to `/favicon.ico`), `favicon-32.png`, `apple-touch-icon.png`, `icon-192.png` | Browser tab and home-screen icons |
| `og-image.png` (1200×630) | Link preview on social media and chat apps |
| `hero.svg` (`hero.png` is a PNG copy for other uses) | Home page banner |

**Set `url` in `src/_data/site.json` to your real domain** (e.g. `https://sloparchive.org`, or `https://USERNAME.github.io` for GitHub Pages; the `/slop-archive/` prefix is added automatically). Link previews need an absolute image URL, and it's built from that value. A page can use its own preview image with `ogImage: "/assets/img/whatever.png"` in its front matter.

## Run it locally

You need [Node.js](https://nodejs.org/) 18 or newer.

```bash
npm install
npm start          # dev server with live reload at http://localhost:8080
npm run build      # writes the finished site to _site/
```

## Add an entry

**Quick way:**

```bash
npm run new -- "Thrilled to Announce That I Have Delved"
```

This creates `src/entries/0112-thrilled-to-announce-that-i-have-delved.md`. Open it and fill in the fields.

**By hand:** create `src/entries/NNNN-some-slug.md`:

```markdown
---
title: "Premium Ergonomic Spoon for Men Women Kids Spoon Gift"
exhibit: 112                      # unique number, shown as "No. 0112"
spotted_in: "Amazon listing"      # where it was found
spotted_on: "2026-10-07"          # keep the quotes
labels: [product listing, keyword soup, fake confidence]
submitted_by: "anonymous"         # optional
curator_note: "Optional witty museum-label note."   # optional
image: "my-specimen.webp"         # optional, file in src/assets/exhibits/ or a full URL
image_alt: "What the picture shows, for screen readers"   # required if you add an image
image_credit: "Posted on Facebook, 2024"                 # optional caption credit
video: "https://www.youtube.com/watch?v=VIDEO_ID"     # optional, YouTube or Vimeo
---
Paste the slop here exactly as found. Line breaks are kept.
```

Tags are created automatically from `labels`, so a new label gets its own `/tags/...` page. Content is Markdown, so `**bold**`, lists, and `>` quotes all work.

### Image exhibits (optional)

For slop that is a picture (AI art, impossible product photos, seven-fingered hands, or a screenshot of slop where it was published), add an `image:` line:

```yaml
image: "shrimp-jesus.webp"                          # a file in src/assets/exhibits/
image: "/assets/exhibits/shrimp-jesus.webp"         # same thing, written as a site path
image: "https://upload.wikimedia.org/…/file.jpg"    # or an image hosted elsewhere (check you're allowed to hotlink it)
image_alt: "A crucifix made entirely of shrimp, floating over the ocean"   # describe it: screen readers and search use this
image_credit: "Viral Facebook post, 2024"           # optional, shown on the frame's brass plaque
image_width: 1200                                   # optional, avoids layout jump while loading
image_height: 900
```

What happens:

- The exhibit page shows the image as a **framed artwork** (gilded frame, mat, brass plaque) **above the specimen text**. It's lazy-loaded with `loading="lazy"` and always has alt text (falls back to the title if `image_alt` is missing, but please write a real description). Clicking it opens the full-size file.
- The entry is tagged **image** automatically (`/tags/image/`), and an **Images** link appears in the nav as soon as at least one entry has an image. The home page's 🎰 Random slop button shows the image too.
- Use the entry text for the original caption, the post text, or a description. If there's nothing to say, leave the body empty and only the framed image is shown.
- Logic: `eleventy.config.js` (`imageInfo`), `src/_includes/entry.njk`, `src/assets/style.css` (`.artwork`).

**Keep images small so hosting stays free.** Convert to **WebP**, about **1200px wide**, **under ~300 KB** each (the build prints a warning for local files over 300 KB, or if a file is missing). Easy ways:

- Website: [squoosh.app](https://squoosh.app/) (drag in, pick WebP, quality ~75, resize to 1200 wide).
- Command line: `cwebp -q 75 -resize 1200 0 input.png -o src/assets/exhibits/name.webp`
- Blur or crop out names, faces of private people, and handles in screenshots before adding them.

Cloudflare Pages allows 20,000 files of up to 25 MB each, and GitHub recommends repos stay under about 1 GB, so at ~150 KB per image you have room for thousands of image exhibits.

### Video exhibits (optional)

The archive never hosts video files. For slop that is a video (AI ads, narrated "facts" channels, Shrimp Jesus compilations), add a `video:` line with a **YouTube or Vimeo** link and paste the **transcript or a description** as the entry text, so visitors can read along and search can find it.

```yaml
video: "https://www.youtube.com/watch?v=VIDEO_ID"   # also youtu.be/…, youtube.com/shorts/…, ?t=90 start times
video: "https://vimeo.com/123456789"                # unlisted: https://vimeo.com/123456789/abcdef1234
video_poster: "/assets/img/posters/my-poster.jpg"   # optional local still image for the play screen
```

What happens:

- The exhibit page shows a **click-to-load player** above the specimen text. Until someone presses play, the page makes **no requests** to YouTube or Vimeo (no cookies, no tracking). YouTube plays from `youtube-nocookie.com` (privacy-enhanced mode); Vimeo plays with `dnt=1`. Shorts get a vertical frame.
- The entry is tagged **video** automatically (`/tags/video/`), and a **Videos** link appears in the nav as soon as at least one entry has a video.
- Any other kind of URL is shown as a plain link (the build prints a warning).
- The logic lives in `eleventy.config.js` (`videoInfo`), `src/_includes/entry.njk`, and `src/assets/video.js`.

**Before publishing a submission:** remove names, emails, and handles of private people (and blur them in screenshots).

## Deploy (free)

### Option A: Cloudflare Pages (recommended, easiest custom domain)

1. Push this folder to a GitHub (or GitLab) repo.
2. In the Cloudflare dashboard, go to **Workers & Pages → Create → Pages → Connect to Git** and pick the repo.
3. Build settings:
   - Framework preset: **Eleventy** (or None)
   - Build command: `npm run build`
   - Build output directory: `_site`
   - Environment variable (optional): `NODE_VERSION` = `20`
4. Deploy. You get `https://<project>.pages.dev`. Add your domain under **Custom domains**.

Every push to `main` redeploys automatically.

### Option B: GitHub Pages

1. Push to a GitHub repo, e.g. `slop-archive`.
2. Go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
3. The included workflow `.github/workflows/deploy-pages.yml` builds and deploys on every push to `main`.

The site will be at `https://<username>.github.io/slop-archive/`. The workflow builds with `--pathprefix=/<repo-name>/`, so all links work under that sub-path. **If you add a custom domain** (Settings → Pages → Custom domain), the site moves to the root of that domain, so change the build step to plain `npx eleventy`.

To preview a prefixed build locally: `npx eleventy --pathprefix=/slop-archive/`.

## Submissions

`src/submit.md` has a **TODO**. Pick one:

- **GitHub issue form:** already included at `.github/ISSUE_TEMPLATE/submit-slop.yml`. Submitters need a GitHub account. Replace `YOUR-GITHUB-USERNAME` in `src/_data/site.json` → `repo`.
- **Google Form / Tally (no account needed):** create the form with fields for title, text, where spotted, date, and tags. Paste its URL into `src/_data/site.json` → `submitFormUrl`.

Either way, a human copies approved submissions into `src/entries/`. Only reviewed content goes on the site.

## Comments (Giscus) and the forum (GitHub Discussions)

Comments use [Giscus](https://giscus.app/). It's free, stores comments in the repo's **GitHub Discussions**, and commenters sign in with GitHub. The forum uses the same Discussions, so everything lives in one place.

**Status:** enabled. `src/_data/site.json` → `giscus` points at `kalagga1/slop-archive`, category **Announcements** (only maintainers and giscus can start threads there), mapping **pathname**. Each exhibit gets its own thread, created on the first comment. The comments block is in `src/_includes/entry.njk` (`COMMENTS SLOT`).

**The [giscus GitHub App](https://github.com/apps/giscus) must be installed on the repo** or the comment box shows "giscus is not installed on this repository." Install it once (choose *Only select repositories* → `slop-archive`). To check: `curl 'https://giscus.app/api/discussions/categories?repo=kalagga1/slop-archive'`.

To use a different category (for example a dedicated **Exhibit comments** Announcement-type category made in the Discussions settings), get its ID from https://giscus.app or:

```bash
gh api graphql -f query='{repository(owner:"kalagga1",name:"slop-archive"){id discussionCategories(first:20){nodes{id name}}}}'
```

and update `category` / `categoryId` in `site.json`. Set `enabled` to `false` to hide comments again.

**Forum:** `/forum/` links to https://github.com/kalagga1/slop-archive/discussions.

## Gift shop (merch)

`/shop/` is a museum gift shop with 12 slogan products (t-shirts, mugs, stickers, a tote, a hoodie). The designs are pure text, so you can recreate them in any print-on-demand designer in minutes.

1. Open a free print-on-demand store: [Redbubble](https://www.redbubble.com/) (easiest, they handle everything), [Spring](https://www.spri.ng/) (formerly Teespring), or [Printful](https://www.printful.com/) (connects to your own Shopify/Etsy/etc.). They print and ship each item when ordered, so there's no inventory to buy.
2. Upload a design for each slogan you want to sell.
3. Put your store link in `src/_data/site.json`:

```json
"shop": { "url": "https://YOUR-STORE.redbubble.com", "provider": "Redbubble" }
```

While `url` still starts with `TODO`, every Buy button jumps to a "store opening soon" note on the page. To link a product straight to its own listing, add `"url": "https://…"` to that product in `src/_data/merch.json`. Edit that file to add, remove, or reword products. `style` picks the card color: `ink`, `slime`, `brass`, `paper`, or `rope`.

## Newsletter (Slop of the Week)

A signup box appears on the home page, in the footer of every page, and on `/newsletter/`. Until you configure it, it shows a disabled form with a **Coming soon** button. Everything is set in `src/_data/site.json` → `newsletter`, then rebuild:

**Buttondown** (simplest, free up to 100 subscribers, works as a plain HTML form):

1. Sign up at [buttondown.com](https://buttondown.com/) and pick a username.
2. Set:

```json
"newsletter": { "enabled": true, "name": "Slop of the Week", "provider": "buttondown", "username": "your-buttondown-username" }
```

**beehiiv** (free up to 2,500 subscribers):

1. In beehiiv, go to **Grow → Subscribe Forms**, create a form, and copy the embed's `src` URL (it looks like `https://embeds.beehiiv.com/xxxxxxxx-xxxx-…`).
2. Set `"provider": "beehiiv"`, `"embedUrl": "https://embeds.beehiiv.com/…"`, `"enabled": true`. It shows as a lazy-loaded iframe.

**Substack** (free, Substack takes 10% only if you charge for subscriptions):

1. Create a publication, e.g. `slopoftheweek.substack.com`.
2. Set `"provider": "substack"`, `"embedUrl": "https://slopoftheweek.substack.com/embed"`, `"enabled": true`. Or leave `embedUrl` empty and set `"archiveUrl": "https://slopoftheweek.substack.com"` to show a plain "Subscribe on Substack" button instead.

**Any other provider** (Mailchimp, ConvertKit/Kit, MailerLite…): set `"provider": "form"`, `"formAction"` to the form's POST URL, and optionally `"emailField"` if the email input isn't called `email`.

## Project layout

```
eleventy.config.js        # collections (slop, slopTags), filters, path-prefix plugin
src/_data/site.json       # site title, repo URL, submit form URL, Giscus, shop and newsletter config
src/_data/merch.json      # gift shop products
src/_includes/base.njk    # page shell + nav
src/_includes/entry.njk   # exhibit page (framed image, video player, specimen, label) + comments slot
src/_includes/newsletter-box.njk  # Slop of the Week signup box (home, footer, /newsletter/)
src/shop.njk, src/newsletter.njk  # gift shop and newsletter pages
src/entries/*.md          # the exhibits (one file each)
src/assets/style.css      # the one stylesheet
src/assets/random.js      # random button
src/assets/video.js       # click-to-load video player
src/assets/img/           # logo, favicons, social image, hero banner
src/assets/exhibits/      # exhibit images (compressed WebP, under ~300 KB each)
scripts/new-entry.js      # `npm run new -- "Title"`
.github/                  # issue form for submissions, GitHub Pages workflow
```
