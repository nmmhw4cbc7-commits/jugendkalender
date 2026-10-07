const CACHE = 'jugendkalender-v13';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/maskable-512.png'];
const FONTS = ['cormorant-garamond-latin-400-italic','cormorant-garamond-latin-400-normal','cormorant-garamond-latin-600-italic','cormorant-garamond-latin-600-normal','great-vibes-latin-400-normal'].map(f => './fonts/' + f + '.woff2');

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL).then(() => Promise.all(FONTS.map(u => c.add(u).catch(() => {}))))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Externe Anfragen (Supabase) nicht abfangen, damit keine Daten im Cache landen
  if (url.origin !== location.origin) return;

  // Geburtstagsdatei: erst Netz, offline letzter Stand
  if (url.pathname.endsWith('.csv')) {
    e.respondWith(
      fetch(req).then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
        return res;
      }).catch(() => caches.match(req))
    );
    return;
  }

  // App-Dateien: erst Cache, im Hintergrund aktualisieren
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(hit => {
      const net = fetch(req).then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
        return res;
      }).catch(() => hit);
      return hit || net;
    })
  );
});
