// Cache-first so the game is fully playable with no signal.
// Bump VERSION whenever content or code changes, or phones will keep the old copy.
const VERSION = "ms-v24";
const ASSETS = ["./", "./index.html", "./engine.js", "./ui.js", "./icon.svg",
  "./manifest.webmanifest", "./content/game.json", "./content/events.json", "./content/rival.json",
  "./packs.js", "./content/packs/manifest.json"];

self.addEventListener("install", e => {
  // the packs the manifest lists are cached too, so every pack plays offline
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(ASSETS)
    .then(() => fetch("./content/packs/manifest.json")).then(r => r.json())
    .then(m => c.addAll((m.packs || []).map(id => `./content/packs/${id}.json`))).catch(() => {}))
    .then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(hit => {
      const net = fetch(e.request).then(res => {
        if (res && res.ok) caches.open(VERSION).then(c => c.put(e.request, res.clone()));
        return res;
      }).catch(() => hit);
      return hit || net;   // cache-first, refresh in background
    })
  );
});
