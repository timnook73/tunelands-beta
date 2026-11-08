/* Service Worker: Programmdateien zwischenspeichern, damit die Seite offline startet. Daten (stats.fm, Cover) werden nie hier gecacht. */
const V = 'kk-shell-v3';
const SHELL = ['./', 'index.html', 'app.css', 'app.js', 'site.js', 'config.js', 'atlas.js', 'pipeline.js', 'worker.js', 'viewer.js', 'viewer.css', 'viewer.html', 'how.html', 'about.html', 'gallery.html', 'friends.html', 'profile.html', 'impressum.html', 'datenschutz.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL).catch(() => { })).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;           // fremde Hosts (API, Cover) laufen am Service Worker vorbei
  e.respondWith(caches.open(V).then(async c => {
    const hit = await c.match(e.request);
    const net = fetch(e.request).then(r => { if (r && r.ok) c.put(e.request, r.clone()); return r; }).catch(() => hit);
    return hit || net;                                                                // stale-while-revalidate
  }));
});
