---
layout: base.njk
title: Submit a specimen
permalink: /submit/
---
<div class="prose">

# Donate a specimen

Found some prime slop in the wild? The archive wants it, in any medium: writing, pictures, or video.

## What we're looking for

- **Text** that was clearly machine-generated and published somewhere real: LinkedIn posts, product listings, recipe blogs, homework, customer-service replies, fiction, poems, press releases.
- **Images**: AI art and photos in the wild, like extra fingers, melted signage, Shrimp Jesus, impossible product photos, or a screenshot of slop where it was published.
- **Video**: AI ads, narrated "facts" channels, uncanny clips. Send a YouTube or Vimeo link; the museum embeds videos rather than hosting them.
- Weird, funny, uncanny, or tragically overconfident.
- **Not** private messages, and nothing that identifies a private person. Blank out or blur names, faces of private people, emails, and handles (in screenshots too).

## How to submit

<div class="notice">

**TODO (Geoff):** pick one of these and delete the other.

1. **GitHub issue form (free).** Visitors open a pre-filled issue at
   <a href="{{ site.repo }}/issues/new?template=submit-slop.yml">{{ site.repo }}/issues/new?template=submit-slop.yml</a>.
   The template is already in `.github/ISSUE_TEMPLATE/submit-slop.yml`. This needs a GitHub account to submit.
2. **Google Form or Tally form (free, no account needed for visitors).** Paste the form link into
   `src/_data/site.json` → `submitFormUrl`. {% if site.submitFormUrl %}<a href="{{ site.submitFormUrl }}">Open the submission form →</a>{% else %}*(Form link not set yet.)*{% endif %}

</div>

Please include:

- **The slop itself**: the text copied exactly (typos and all), and/or the image or a link to it, and/or a YouTube or Vimeo link for video
- **For images and video, a short description** of what's in it (this becomes the alt text and caption, so everyone can enjoy the exhibit)
- **Credit**: who made or posted it, if known
- **Where you spotted it**: site or app, e.g. "LinkedIn", "Amazon listing", "a 9th-grade essay"
- **When you spotted it** (roughly is fine)
- **Telltale signs**, e.g. `delve`, `tapestry`, `fake confidence`, `broken poem`

**Big image?** Shrink it first with [Squoosh](https://squoosh.app/), a free tool that works right in your browser (nothing to install, no account). Drop your image in, choose **WebP** on the right, and lower the quality slider until the file size shown is under **300 KB**. If it's still too big, use **Resize** to make it about 1200 pixels wide. Then download it and attach it to your submission.

A curator reviews every submission, removes personal info, compresses images so the site stays fast (and free), and adds it as a new exhibit.

</div>
