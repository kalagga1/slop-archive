// Random-slop machinery. Loads /slop.json once (path-prefix safe via the <link> tag in base.njk).
(function () {
  const link = document.getElementById("slop-data");
  if (!link) return;
  let cache = null;
  let lastUrl = null;

  async function load() {
    if (!cache) {
      const res = await fetch(link.href);
      cache = await res.json();
    }
    return cache;
  }

  async function pick() {
    const all = await load();
    const here = location.pathname;
    let pool = all.filter((e) => !here.endsWith(e.url) && e.url !== lastUrl);
    if (!pool.length) pool = all;
    const choice = pool[Math.floor(Math.random() * pool.length)];
    lastUrl = choice.url;
    return choice;
  }

  // Exhibit URLs in the JSON are root-relative; resolve them against the site base.
  function resolve(url) {
    const base = new URL(link.href, location.href); // .../slop.json
    return new URL("." + url, new URL(".", base)).href;
  }

  // Images can be site paths ("/assets/exhibits/x.webp") or full URLs.
  function resolveAsset(src) {
    return /^https?:/i.test(src) ? src : resolve(src);
  }

  async function go() {
    const e = await pick();
    location.href = resolve(e.url);
  }

  async function show() {
    const stage = document.getElementById("random-stage");
    if (!stage) return go();
    const e = await pick();
    const f = (k) => stage.querySelector('[data-f="' + k + '"]');
    f("no").textContent = "Exhibit " + e.no;
    f("title").textContent = e.title;
    f("html").innerHTML = e.html; // curated, repo-controlled content
    f("spotted").textContent = "Spotted in: " + e.spotted_in + " · " + e.spotted_on;
    f("example").hidden = !(e.labels || []).includes("example");
    f("link").href = resolve(e.url);
    const wrap = f("imagewrap"), img = f("image");
    if (wrap && img) {
      if (e.image) { img.src = resolveAsset(e.image.src); img.alt = e.image.alt || ""; wrap.hidden = false; }
      else { img.removeAttribute("src"); img.alt = ""; wrap.hidden = true; }
    }
    const vw = f("videowrap");
    if (vw) { vw.hidden = !e.video; f("video").href = resolve(e.url); }
    stage.hidden = false;
    stage.classList.remove("pop");
    void stage.offsetWidth; // restart animation
    stage.classList.add("pop");
    stage.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  document.querySelectorAll("[data-random-show]").forEach((b) => b.addEventListener("click", show));
  document.querySelectorAll("[data-random-button]").forEach((b) => b.addEventListener("click", go));
  document.querySelectorAll("[data-random-link]").forEach((a) =>
    a.addEventListener("click", (ev) => { ev.preventDefault(); go(); })
  );
  if (document.querySelector("[data-random-auto]")) go();
})();
