const CACHE_NAME = "meeting-light-v1";
const ASSETS_TO_CACHE = [
  "/remote-meeting-lighting/",
  "/remote-meeting-lighting/index.html",
  "/remote-meeting-lighting/styles.css",
  "/remote-meeting-lighting/script.js",
  "/remote-meeting-lighting/site.webmanifest",
  "/remote-meeting-lighting/favicon.svg",
  "/remote-meeting-lighting/favicon.ico",
  "/remote-meeting-lighting/favicon-96x96.png",
  "/remote-meeting-lighting/apple-touch-icon.png",
  "/remote-meeting-lighting/web-app-manifest-192x192.png",
  "/remote-meeting-lighting/web-app-manifest-512x512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE)),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request)),
  );
});
