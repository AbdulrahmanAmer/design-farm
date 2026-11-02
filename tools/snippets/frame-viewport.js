/*
 * frame-viewport.js — see a desktop layout inside a narrow preview pane.
 *
 * Paste into the browser console (or a JS tool) on any playground page. It
 * replaces the page with an iframe rendered at WIDTH css px, so media queries
 * see a real desktop viewport, then scales it down to fit the pane.
 * Why: some preview panes only capture their own (≈800px) viewport, and
 * emulated viewports get cropped instead of scaled.
 *
 * Then scroll a region into view with:  frame.style.top = "-470px"
 */
(async (WIDTH = 1440, ROUTE = location.hash || "#") => {
  document.body.innerHTML =
    `<iframe id="frame" src="/${location.search}${ROUTE}" style="position:fixed;top:0;left:0;` +
    `width:${WIDTH}px;height:1200px;border:0;transform-origin:0 0"></iframe>`;
  document.body.style.overflow = "hidden";
  const frame = document.getElementById("frame");
  await new Promise((r) => frame.addEventListener("load", r, { once: true }));
  await new Promise((r) => setTimeout(r, 800));
  const h = frame.contentDocument.documentElement.scrollHeight;
  frame.style.height = `${h}px`;
  frame.style.transform = `scale(${innerWidth / WIDTH})`;
  window.frame = frame;
  return { width: WIDTH, height: h, scale: innerWidth / WIDTH };
})();
