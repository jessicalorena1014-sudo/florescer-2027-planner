// Planner Florescer 2027 — Service Worker
// Network-first for HTML, cache-first for assets, offline fallback.
const VERSION = "florescer-v1";
const HTML_CACHE = `${VERSION}-html`;
const ASSET_CACHE = `${VERSION}-assets`;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(HTML_CACHE).then((c) => c.add("/")).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // HTML navigations → network first, fallback to cached shell
  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);
          const cache = await caches.open(HTML_CACHE);
          cache.put("/", fresh.clone());
          return fresh;
        } catch {
          const cache = await caches.open(HTML_CACHE);
          return (await cache.match("/")) || new Response("Offline", { status: 503 });
        }
      })(),
    );
    return;
  }

  // Static assets → cache first
  if (/\.(?:js|css|woff2?|ttf|png|jpg|jpeg|svg|webp|ico|webmanifest)$/.test(url.pathname)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(ASSET_CACHE);
        const cached = await cache.match(req);
        if (cached) return cached;
        try {
          const fresh = await fetch(req);
          if (fresh.ok) cache.put(req, fresh.clone());
          return fresh;
        } catch {
          return cached || Response.error();
        }
      })(),
    );
  }
});
