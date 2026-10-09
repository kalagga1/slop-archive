---
layout: base.njk
title: Forum
permalink: /forum/
---
<div class="prose">

# The Slop Lounge (forum)

The Slop Lounge is the museum's subreddit, **r/{{ site.forum.subreddit }}**. Share fresh slop you've spotted in the wild, argue about why it always says *delve*, and suggest new exhibits. Reading is open to everyone, and posting needs only a free Reddit account.

{% if site.forum.live %}
<p><a class="btn" href="{{ site.forum.url }}" rel="noopener">Enter the Slop Lounge on Reddit →</a></p>
{% else %}
<div class="notice">

**Opening soon.** The Slop Lounge's doors open shortly at <strong>r/{{ site.forum.subreddit }}</strong>. Check back in a few days.

</div>
{% endif %}

What to talk about:

- **Fresh slop**: "you won't believe what my fridge's manual said"
- **Slop theory**: why does it say *delve* so much?
- **Curator's desk**: suggestions, tag ideas, and site feedback

Want to donate a specimen to the collection instead? See [Submit](/submit/).

<p class="small">Prefer GitHub? There's also a quieter corner in the archive's <a href="{{ site.forum.discussionsUrl }}" rel="noopener">GitHub Discussions</a>.</p>

</div>
