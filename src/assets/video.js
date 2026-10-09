// Click-to-load video embeds. The page ships only a poster link; the YouTube
// (youtube-nocookie.com) or Vimeo player is created when the visitor presses play.
(function () {
  document.querySelectorAll("[data-video-embed]").forEach(function (frame) {
    var poster = frame.querySelector(".video-poster");
    if (!poster) return;
    poster.addEventListener("click", function (ev) {
      if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.button === 1) return; // let "open in new tab" work
      ev.preventDefault();
      var iframe = document.createElement("iframe");
      iframe.src = frame.getAttribute("data-video-embed");
      iframe.title = "Video: " + (frame.getAttribute("data-video-title") || "exhibit");
      iframe.loading = "lazy";
      iframe.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      frame.replaceChildren(iframe);
      frame.classList.add("is-playing");
      iframe.focus();
    });
  });
})();
