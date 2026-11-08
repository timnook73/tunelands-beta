/* Klangkarte – Startseite und Ablauf: Nutzername -> stats.fm abrufen -> Karte berechnen (Worker) -> Cover laden -> Viewer starten */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const I18N = {
    de: {
      'nav.privacy': 'Datenschutz', 'nav.how': 'So geht’s', 'nav.faq': 'Fragen',
      'brand': 'Klangkarte', 'hero.kicker': 'Klangkarte', 'hero.title': 'Deine Musik als Landkarte.', 'hero.lead': 'Jeder Artist, jeder Song, den du je gehört hast – als Karte, auf der ähnliche Musik nebeneinander liegt. Je länger du etwas gehört hast, desto größer wird es.',
      'in.prefix': 'stats.fm/user/', 'in.prefix2': 'Freund: stats.fm/user/', 'in.cmp': '+ Mit einem Freund vergleichen', 'in.cmp.ph': 'name-des-freundes', 'in.placeholder': 'dein-name', 'in.go': 'Karte erstellen', 'in.hint': 'Dein stats.fm-Profil muss öffentlich sein. Alles wird in deinem Browser berechnet – es wird nichts auf einem Server gespeichert.',
      'src.title': 'Woher kommen deine Daten?', 'src.statsfm': 'stats.fm', 'src.statsfm.d': 'Am schnellsten: Nutzername eingeben, fertig. Funktioniert mit Spotify und Apple Music.', 'src.spotify': 'Spotify-Datenexport', 'src.spotify.d': 'Du hast keinen stats.fm-Account? Lade deinen Export von Spotify hoch.', 'src.lastfm': 'Last.fm', 'src.lastfm.d': 'Kommt bald.', 'src.soon': 'bald',
      'how.title': 'In drei Schritten', 'how.1': 'Nutzername eingeben', 'how.1d': 'Dein stats.fm-Name genügt – kein Login, keine Anmeldung.', 'how.2': 'Berechnen lassen', 'how.2d': 'Deine Streams werden geladen, ähnliche Artists gefunden und zu Genre-Kontinenten geordnet. Das dauert etwa eine Minute.', 'how.3': 'Erkunden & teilen', 'how.3d': 'Zoome hinein, filtere nach Tag, finde Verbindungen zwischen Artists und exportiere die Karte als PDF.',
      'faq.title': 'Fragen', 'faq.q1': 'Was passiert mit meinen Daten?', 'faq.a1': 'Die Seite ruft öffentliche Daten deines stats.fm-Profils direkt in deinem Browser ab und berechnet die Karte lokal. Es gibt keinen Server, der deine Daten empfängt oder speichert.',
      'faq.q2': 'Mein Profil wird nicht gefunden.', 'faq.a2': 'Prüfe die Schreibweise deines Namens (stats.fm → Profil → Link). In den Datenschutz-Einstellungen von stats.fm müssen „Streams“ und „Top-Listen“ öffentlich sein.', 'faq.q3': 'Wie lange dauert es?', 'faq.a3': 'Je nach Größe deiner Historie 30 Sekunden bis wenige Minuten. Bei sehr großen Profilen zeigen wir die 2.600 meistgehörten Artists.', 'faq.q4': 'Kostet das etwas?', 'faq.a4': 'Die Karte ist kostenlos.',
      'foot.made': 'Gebaut mit Daten von stats.fm. Nicht mit Spotify oder stats.fm verbunden.', 'foot.imprint': 'Impressum', 'foot.privacy': 'Datenschutz', 'foot.feedback': 'Feedback', 'foot.donate': 'Projekt unterstützen',
      'p.title': 'Deine Musik wird kartiert …', 'p.profile': 'Profil laden', 'p.streams': 'Streams laden', 'p.compute': 'Karte berechnen', 'p.images': 'Cover laden', 'p.start': 'Karte öffnen',
      'p.streams.n': '{n} Streams', 'p.images.n': '{n} / {m} Cover', 'p.compute.sub.model': 'Hörverlauf auswerten', 'p.compute.sub.similarity': 'Ähnliche Artists finden', 'p.compute.sub.cluster': 'Kontinente bilden', 'p.compute.sub.layout': 'Karte anordnen', 'p.compute.sub.export': 'Fertigstellen',
      'err.friend': 'Das Profil deines Freundes konnte nicht geladen werden: ', 'p.cancel': 'Abbrechen', 'err.title': 'Das hat leider nicht geklappt', 'err.back': 'Zurück',
      'err.notfound': 'Diesen stats.fm-Nutzer gibt es nicht. Prüfe die Schreibweise.', 'err.private': 'Dieses Profil ist privat. Stelle in stats.fm unter Einstellungen → Datenschutz „Streams“ und „Top-Listen“ auf öffentlich und versuche es noch einmal.', 'err.network': 'Keine Verbindung zu stats.fm. Prüfe deine Internetverbindung und versuche es noch einmal.', 'err.empty': 'In diesem Profil wurden keine Streams gefunden.', 'err.generic': 'Unerwarteter Fehler: {m}',
      'p.read': 'Datei lesen', 'p.lookup': 'Artists und Cover nachschlagen', 'p.lookup.artists': 'Genres der Artists suchen', 'p.lookup.covers': 'Cover suchen',
      'sp.title': 'Spotify-Datenexport', 'sp.lead': 'Lade deinen Streaming-Verlauf von Spotify hoch. Die Dateien bleiben auf deinem Gerät; nur Künstlernamen werden bei stats.fm nachgeschlagen, um Genres und Cover zu finden.', 'sp.how': 'So bekommst du den Export',
      'sp.s1': 'Öffne spotify.com/account/privacy und melde dich an.', 'sp.s2': 'Wähle „Erweiterter Streaming-Verlauf“ (Extended streaming history) und fordere die Daten an.', 'sp.s3': 'Spotify schickt dir eine E-Mail mit einem Download-Link. Das dauert meist ein paar Tage, manchmal bis zu 30 Tage.', 'sp.s4': 'Lade die ZIP-Datei herunter und wähle sie unten aus, oder die Dateien „Streaming_History_Audio_….json“ daraus.',
      'sp.drop': 'ZIP oder JSON-Dateien hierher ziehen oder auswählen', 'sp.name': 'Anzeigename', 'sp.name.ph': 'Mein Spotify', 'sp.files': '{n} Datei(en) ausgewählt', 'err.export': 'In diesen Dateien wurde kein Streaming-Verlauf gefunden. Du brauchst die Dateien „Streaming_History_Audio_….json“ aus dem erweiterten Export.', 'err.zip': 'Die ZIP-Datei konnte nicht gelesen werden.',
      'recent.title': 'Zuletzt geöffnet', 'recent.saved': 'gespeichert am {d} · {n} Artists', 'recent.remove': 'Entfernen',
      'demo.badge': 'Demo-Karte', 'demo.title': 'Schau dir eine fertige Karte an', 'demo.d': 'Das ist die Karte von timnook73, der das Projekt baut – als Beispiel, was dich erwartet. Deine eigene Karte erstellst du oben in einer Minute.', 'demo.go': 'Demo-Karte öffnen', 'faq.q5': 'Brauche ich ein Konto oder ein Login?', 'faq.a5': 'Nein. Es gibt keine Registrierung. Du gibst nur deinen stats.fm-Namen ein (oder lädst deinen Spotify-Export hoch) und bekommst deine Karte.', 'faq.q6': 'Funktioniert das mit Spotify, Apple Music oder Last.fm?', 'faq.a6': 'Ja, über stats.fm: Es verbindet sich mit Spotify und Apple Music, deine Karte nutzt dann dessen öffentliche Daten. Ohne stats.fm kannst du den Spotify-Datenexport hochladen. Last.fm folgt später.', 'faq.q7': 'Wo wird meine Karte gespeichert? Kann ich sie teilen?', 'faq.a7': 'Fertige Karten bleiben nur in deinem Browser (unter „Zuletzt geöffnet“). Teilen kannst du sie als Bild oder PDF-Poster. Wenn du den Link mit deinem Namen weitergibst, berechnet die Seite die Karte beim Öffnen neu – das klappt nur bei öffentlichem stats.fm-Profil.', 'faq.q8': 'Warum stimmen Genres oder Kontinente manchmal nicht?', 'faq.a8': 'Genres kommen von stats.fm und werden automatisch zu Kontinenten gebündelt, das ist nicht immer perfekt. In der Karte kannst du in der Detailansicht eines Artists oder Songs über „Fehler melden“ Kontinent und Genre für deine Karte selbst korrigieren.', 'faq.q9': 'Kann ich meine Karte aktuell halten?', 'faq.a9': 'Ja, bei stats.fm-Karten lassen sich neue Streams nachladen, und der Live-Modus zeigt laufend, was du gerade hörst.', 'faq.q10': 'Ist das eine App?', 'faq.a10': 'Es ist eine Web-App. Am Handy kannst du sie über das Browser-Menü („Zum Startbildschirm hinzufügen“, in Safari über „Teilen“) wie eine App ablegen.', 'faq.q11': 'Wer steckt dahinter? Ist das offiziell von stats.fm oder Spotify?', 'faq.a11': 'Nein, es ist ein unabhängiges Ein-Personen-Projekt ohne Verbindung zu stats.fm oder Spotify. Die Daten kommen aus den öffentlichen Schnittstellen von stats.fm.', 'faq.q12': 'Was bedeutet „Beta“ und wie gebe ich Feedback?', 'faq.a12': 'Das Projekt ist noch jung: Es kann Fehler geben und Dinge ändern sich. Über „Feedback“ unten (oder in der Karte im Menü) erreichst du die kurze Umfrage. Das hilft am meisten.',
      'lang.switch': 'English'
    },
    en: {
      'nav.privacy': 'Privacy', 'nav.how': 'How it works', 'nav.faq': 'FAQ',
      'brand': 'Tunelands', 'hero.kicker': 'Tunelands', 'hero.title': 'Your music as a map.', 'hero.lead': 'Every artist and song you ever played – on a map where similar music sits side by side. The longer you listened, the bigger it grows.',
      'in.prefix': 'stats.fm/user/', 'in.prefix2': 'Friend: stats.fm/user/', 'in.cmp': '+ Compare with a friend', 'in.cmp.ph': 'friends-name', 'in.placeholder': 'your-name', 'in.go': 'Create my map', 'in.hint': 'Your stats.fm profile must be public. Everything is computed in your browser – nothing is stored on a server.',
      'src.title': 'Where does your data come from?', 'src.statsfm': 'stats.fm', 'src.statsfm.d': 'Fastest: enter your username, done. Works with Spotify and Apple Music.', 'src.spotify': 'Spotify data export', 'src.spotify.d': 'No stats.fm account? Upload your export from Spotify.', 'src.lastfm': 'Last.fm', 'src.lastfm.d': 'Coming soon.', 'src.soon': 'soon',
      'how.title': 'Three steps', 'how.1': 'Enter your username', 'how.1d': 'Your stats.fm name is enough – no login, no sign-up.', 'how.2': 'Let it compute', 'how.2d': 'Your streams are loaded, similar artists found and arranged into genre continents. Takes about a minute.', 'how.3': 'Explore & share', 'how.3d': 'Zoom in, filter by day, find connections between artists and export the map as a PDF.',
      'faq.title': 'FAQ', 'faq.q1': 'What happens to my data?', 'faq.a1': 'This page fetches the public data of your stats.fm profile directly in your browser and computes the map locally. There is no server that receives or stores your data.',
      'faq.q2': 'My profile is not found.', 'faq.a2': 'Check the spelling of your name (stats.fm → profile → link). In stats.fm’s privacy settings “Streams” and “Top lists” must be public.', 'faq.q3': 'How long does it take?', 'faq.a3': 'Between 30 seconds and a few minutes depending on your history. For very large profiles we show the 2,600 most played artists.', 'faq.q4': 'Does it cost anything?', 'faq.a4': 'The map is free.',
      'foot.made': 'Built with data from stats.fm. Not affiliated with Spotify or stats.fm.', 'foot.imprint': 'Legal notice', 'foot.privacy': 'Privacy', 'foot.feedback': 'Feedback', 'foot.donate': 'Support the project',
      'p.title': 'Mapping your music …', 'p.profile': 'Loading profile', 'p.streams': 'Loading streams', 'p.compute': 'Computing the map', 'p.images': 'Loading covers', 'p.start': 'Opening the map',
      'p.streams.n': '{n} streams', 'p.images.n': '{n} / {m} covers', 'p.compute.sub.model': 'Analysing listening history', 'p.compute.sub.similarity': 'Finding similar artists', 'p.compute.sub.cluster': 'Forming continents', 'p.compute.sub.layout': 'Arranging the map', 'p.compute.sub.export': 'Finishing',
      'err.friend': 'Your friend’s profile could not be loaded: ', 'p.cancel': 'Cancel', 'err.title': 'That did not work', 'err.back': 'Back',
      'err.notfound': 'This stats.fm user does not exist. Check the spelling.', 'err.private': 'This profile is private. In stats.fm go to Settings → Privacy, make “Streams” and “Top lists” public and try again.', 'err.network': 'Could not reach stats.fm. Check your connection and try again.', 'err.empty': 'No streams were found in this profile.', 'err.generic': 'Unexpected error: {m}',
      'p.read': 'Reading file', 'p.lookup': 'Looking up artists and covers', 'p.lookup.artists': 'Searching artist genres', 'p.lookup.covers': 'Searching covers',
      'sp.title': 'Spotify data export', 'sp.lead': 'Upload your streaming history from Spotify. The files stay on your device; only artist names are looked up at stats.fm to find genres and covers.', 'sp.how': 'How to get your export',
      'sp.s1': 'Open spotify.com/account/privacy and sign in.', 'sp.s2': 'Choose “Extended streaming history” and request your data.', 'sp.s3': 'Spotify emails you a download link. This usually takes a few days, sometimes up to 30 days.', 'sp.s4': 'Download the ZIP file and select it below, or the “Streaming_History_Audio_….json” files from it.',
      'sp.drop': 'Drag ZIP or JSON files here or choose', 'sp.name': 'Display name', 'sp.name.ph': 'My Spotify', 'sp.files': '{n} file(s) selected', 'err.export': 'No streaming history was found in these files. You need the “Streaming_History_Audio_….json” files from the extended export.', 'err.zip': 'The ZIP file could not be read.',
      'recent.title': 'Recently opened', 'recent.saved': 'saved {d} · {n} artists', 'recent.remove': 'Remove',
      'demo.badge': 'Demo map', 'demo.title': 'See a finished map', 'demo.d': 'This is the map of timnook73, who builds the project – an example of what to expect. You can create your own above in about a minute.', 'demo.go': 'Open demo map', 'faq.q5': 'Do I need an account or a login?', 'faq.a5': 'No. There is no sign-up. You just enter your stats.fm name (or upload your Spotify export) and get your map.', 'faq.q6': 'Does it work with Spotify, Apple Music or Last.fm?', 'faq.a6': 'Yes, via stats.fm: it connects to Spotify and Apple Music, and your map uses its public data. Without stats.fm you can upload the Spotify data export. Last.fm follows later.', 'faq.q7': 'Where is my map stored? Can I share it?', 'faq.a7': 'Finished maps stay in your browser only (under “Recently opened”). You can share them as an image or PDF poster. If you pass on a link with your name, the page recomputes the map when opened – that only works with a public stats.fm profile.', 'faq.q8': 'Why are genres or continents sometimes wrong?', 'faq.a8': 'Genres come from stats.fm and are grouped into continents automatically, which is not always perfect. In the map, open the details of an artist or song and use “Report a problem” to correct the continent and genre for your own map.', 'faq.q9': 'Can I keep my map up to date?', 'faq.a9': 'Yes. For stats.fm maps you can reload new streams, and Live mode keeps showing what you are playing right now.', 'faq.q10': 'Is this an app?', 'faq.a10': 'It is a web app. On your phone you can put it on the home screen via the browser menu (“Add to Home screen”, in Safari via “Share”).', 'faq.q11': 'Who is behind this? Is it official from stats.fm or Spotify?', 'faq.a11': 'No, it is an independent one-person project with no connection to stats.fm or Spotify. The data comes from the public interfaces of stats.fm.', 'faq.q12': 'What does “beta” mean and how do I give feedback?', 'faq.a12': 'The project is young: there may be bugs and things will change. Use “Feedback” below (or the menu inside the map) for the short survey. That helps the most.',
      'lang.switch': 'Deutsch'
    }
  };
  let LANG = 'de'; try { LANG = localStorage.getItem('kk-lang') || (/^de/i.test(navigator.language || '') ? 'de' : 'en'); } catch (e) { LANG = /^de/i.test(navigator.language || '') ? 'de' : 'en'; }
  const T = (k, v) => { let s = (I18N[LANG] && I18N[LANG][k]) || I18N.de[k] || k; if (v) for (const x in v) s = s.replace('{' + x + '}', v[x]); return s; };
  window.__KK_LANG__ = () => LANG;
  function applyI18n() {
    document.documentElement.lang = LANG;
    document.querySelectorAll('[data-i]').forEach(el => { el.textContent = T(el.dataset.i); });
    document.querySelectorAll('[data-ip]').forEach(el => { el.placeholder = T(el.dataset.ip); });
    document.title = LANG === 'de' ? 'Klangkarte – deine Musik als Landkarte' : 'Tunelands – your music as a map';
  }
  function setLang(l) { LANG = l; try { localStorage.setItem('kk-lang', l); } catch (e) { } applyI18n(); renderRecent(); footLinks(); }
  /* Feedback-/Spenden-Link der Fusszeile; bei { de, en } der zur Sprache passende */
  function footLinks() {
    const cfg = window.__KK_CFG__ || {}, pick = v => (v && typeof v === 'object') ? (v[LANG] || v.de || v.en || '') : (v || '');
    [['foot-fb', cfg.feedback], ['foot-donate', cfg.donate]].forEach(([id, v]) => { const url = pick(v); if (url && $(id)) { $(id).href = url; $(id).classList.remove('hidden'); } });
  }

  /* ---------- Cache (IndexedDB): fertige Karten schnell wieder oeffnen ---------- */
  const DBN = 'klangkarte', STORE = 'maps', CACHE_VER = 1;
  const idb = () => new Promise((res, rej) => { const r = indexedDB.open(DBN, 1); r.onupgradeneeded = () => r.result.createObjectStore(STORE); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
  const idbDo = (mode, fn) => idb().then(db => new Promise((res, rej) => { const tx = db.transaction(STORE, mode), st = tx.objectStore(STORE), rq = fn(st); tx.oncomplete = () => res(rq && rq.result); tx.onerror = () => rej(tx.error); }));
  const cacheKey = u => 'u:' + u.toLowerCase();
  async function cachePut(user, D, atlas) { try { await idbDo('readwrite', st => st.put({ v: CACHE_VER, user, D, blobs: atlas.blobs, at: Date.now(), n: D.artists.length }, cacheKey(user))); } catch (e) { console.warn('Cache:', e); } }
  async function cacheGet(user) { try { const r = await idbDo('readonly', st => st.get(cacheKey(user))); return r && r.v === CACHE_VER ? r : null; } catch (e) { return null; } }
  async function cacheList() { try { const keys = await idbDo('readonly', st => st.getAllKeys()), out = []; for (const k of keys || []) { const r = await idbDo('readonly', st => st.get(k)); if (r && r.v === CACHE_VER) out.push({ user: r.user, at: r.at, n: r.n }); } return out.sort((x, y) => y.at - x.at); } catch (e) { return []; } }
  async function cacheDel(user) { try { await idbDo('readwrite', st => st.delete(cacheKey(user))); } catch (e) { } }
  const fmtDate = t => new Date(t).toLocaleDateString(LANG === 'de' ? 'de-DE' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  async function renderRecent() {
    const box = $('recent'); if (!box) return; const list = await cacheList(); box.innerHTML = '';
    if (!list.length) { box.classList.add('hidden'); return; }
    box.classList.remove('hidden');
    const h = document.createElement('div'); h.className = 'rh'; h.textContent = T('recent.title'); box.appendChild(h);
    list.slice(0, 8).forEach(it => {
      const b = document.createElement('div'); b.className = 'chip';
      const open = document.createElement('button'); open.type = 'button'; open.className = 'o'; open.innerHTML = '<b></b><small></small>'; open.querySelector('b').textContent = it.user; open.querySelector('small').textContent = T('recent.saved', { d: fmtDate(it.at), n: fmtN(it.n) });
      open.onclick = () => openCached(it.user);
      const x = document.createElement('button'); x.type = 'button'; x.className = 'x'; x.setAttribute('aria-label', T('recent.remove')); x.textContent = '×'; x.onclick = async e => { e.stopPropagation(); await cacheDel(it.user); renderRecent(); };
      b.appendChild(open); b.appendChild(x); box.appendChild(b);
    });
  }
  async function openCached(user) {
    const r = await cacheGet(user); if (!r) { generate(user.split(' × ')[0], true, user.split(' × ')[1]); return; }
    $('landing').classList.add('away'); const at = { A: URL.createObjectURL(r.blobs.A), B: URL.createObjectURL(r.blobs.B), C: URL.createObjectURL(r.blobs.C) };
    try { const pp = user.split(' × '); history.replaceState(null, '', '#u=' + encodeURIComponent(pp[0]) + (pp[1] ? '&f=' + encodeURIComponent(pp[1]) : '')); } catch (e) { }
    await startViewer(r.D, at);
  }

  /* ---------- Ablauf ---------- */
  let worker = null, cancelled = false;
  const STEPS_API = ['profile', 'streams', 'compute', 'images'], STEPS_EXPORT = ['read', 'lookup', 'compute', 'images'];
  function showProgress(steps) { steps = steps || STEPS_API; $('landing').classList.add('away'); $('progress').classList.add('show'); $('perr').classList.add('hidden'); $('psteps').classList.remove('hidden'); document.querySelectorAll('#psteps li').forEach(li => li.classList.toggle('hidden', steps.indexOf(li.id.slice(3)) < 0)); steps.forEach(s => setStep(s, 'wait', '', 0)); }
  function setStep(id, state, text, frac) {
    const li = $('ps-' + id); li.dataset.state = state; li.querySelector('.sub').textContent = text || ''; li.querySelector('i').style.width = Math.round((frac || 0) * 100) + '%';
  }
  function showError(msg) { $('psteps').classList.add('hidden'); $('perr').classList.remove('hidden'); $('perr-msg').textContent = msg; if (worker) { worker.terminate(); worker = null; } }
  function backToStart() { if (worker) { worker.terminate(); worker = null; } cancelled = true; $('progress').classList.remove('show'); $('landing').classList.remove('away'); }
  function errText(e) {
    if (e && e.code === 'notfound') return T('err.notfound'); if (e && e.code === 'private') return T('err.private'); if (e && (e.code === 'network' || e.code === 'http' || e.name === 'TypeError')) return T('err.network');
    if (e && e.code === 'emptyexport') return T('err.export'); if (e && e.code === 'zip') return T('err.zip');
    if (e && /Keine Streams/.test(e.message || '')) return T('err.empty'); return T('err.generic', { m: (e && e.message) || String(e) });
  }
  function runWorker(raw, opt, rawFriend) {
    return new Promise((res, rej) => {
      worker = new Worker('worker.js'); worker.onmessage = ev => {
        const m = ev.data;
        if (m.t === 'p') { const sub = { model: 'p.compute.sub.model', similarity: 'p.compute.sub.similarity', cluster: 'p.compute.sub.cluster', layout: 'p.compute.sub.layout', export: 'p.compute.sub.export' }[m.k]; setStep('compute', 'run', sub ? T(sub) : '', clamp((m.f - .02) / .9, 0, 1)); }
        else if (m.t === 'done') { worker.terminate(); worker = null; res(m.D); } else if (m.t === 'err') { worker.terminate(); worker = null; rej(new Error(m.msg)); }
      };
      worker.onerror = e => { rej(new Error(e.message || 'Worker')); };
      worker.postMessage({ raw, rawFriend, opt });
    });
  }
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  const fmtN = n => new Intl.NumberFormat(LANG === 'de' ? 'de-DE' : 'en-US').format(n);

  const cleanName = s => (s || '').trim().replace(/^.*stats\.fm\/(?:user\/)?/i, '').replace(/[/?#].*$/, '').trim();
  async function generate(user, fresh, friend) {
    user = cleanName(user); friend = cleanName(friend);
    if (!user) { $('user').focus(); return; }
    const key = friend ? user + ' × ' + friend : user;
    if (!fresh) { const c = await cacheGet(key); if (c && Date.now() - c.at < 6 * 3600 * 1000) { cancelled = false; openCached(key); return; } }
    cancelled = false; showProgress();
    try {
      setStep('profile', 'run', '', .3);
      const cnt = [0, 0], tots = [0, 0], prog = i => (k, n, tot) => { if (cancelled) return; if (k === 'profile') setStep('profile', 'run', '', .5); else if (k === 'streams') { cnt[i] = n; tots[i] = tot || tots[i]; const sn = cnt[0] + cnt[1], st = tots[0] + tots[1]; setStep('profile', 'done', '', 1); setStep('streams', 'run', T('p.streams.n', { n: fmtN(sn) }), st ? clamp(sn / st, 0, 1) : .5); } };
      let raw, rawFr = null;
      if (friend) {
        const pa = KKP.statsfm.fetchAll(user, { onProgress: prog(0) }), pb = KKP.statsfm.fetchAll(friend, { onProgress: prog(1) });
        raw = await pa; try { rawFr = await pb; } catch (e) { e.friend = true; throw e; }
      } else raw = await KKP.statsfm.fetchAll(user, { onProgress: prog(0) });
      if (cancelled) return;
      setStep('profile', 'done', '', 1); setStep('streams', 'done', T('p.streams.n', { n: fmtN(raw.streams.length + (rawFr ? rawFr.streams.length : 0)) }), 1);
      /* Alben ohne Metadaten nachladen */
      const have = new Set(); raw.topTracks.forEach(it => (it.track.albums || []).forEach(a => { if (a.image) have.add(a.id); }));
      const miss = Array.from(new Set(raw.streams.map(s => s.albumId).filter(id => id != null && !have.has(id)))).slice(0, 600);
      const extra = miss.length ? await KKP.statsfm.albumsMeta(miss, { concurrency: 12 }) : {};
      if (cancelled) return;
      setStep('compute', 'run', T('p.compute.sub.model'), 0);
      const D = await runWorker(raw, { albumsExtra: extra, timezone: raw.profile.timezone }, rawFr);
      if (cancelled) return;
      D.profile = { id: raw.profile.id, image: raw.profile.image, name: raw.profile.displayName };
      setStep('compute', 'done', '', 1); setStep('images', 'run', '', 0);
      const at = await KKAtlas.build(D, (d, t) => setStep('images', 'run', T('p.images.n', { n: fmtN(d), m: fmtN(t) }), d / t));
      if (cancelled) return;
      setStep('images', 'done', T('p.images.n', { n: fmtN(at.total - at.failed), m: fmtN(at.total) }), 1);
      try { history.replaceState(null, '', '#u=' + encodeURIComponent(user) + (friend ? '&f=' + encodeURIComponent(friend) : '')); } catch (e) { }
      cachePut(key, D, at);
      await startViewer(D, at);
    } catch (e) { if (!cancelled) { console.error(e); showError(errText(e)); } }
  }


  /* ---------- Spotify-Datenexport ---------- */
  let spFiles = [];
  function spOpen() { $('spmodal').classList.add('show'); $('sp-err').classList.add('hidden'); }
  function spClose() { $('spmodal').classList.remove('show'); }
  function spSet(files) {
    spFiles = Array.from(files || []).filter(f => /\.(json|zip)$/i.test(f.name)); $('sp-go').disabled = !spFiles.length;
    $('sp-drop-t').textContent = spFiles.length ? T('sp.files', { n: spFiles.length }) + ': ' + spFiles.slice(0, 3).map(f => f.name).join(', ') + (spFiles.length > 3 ? ' …' : '') : T('sp.drop');
  }
  async function generateFromExport(files, label) {
    cancelled = false; spClose(); showProgress(STEPS_EXPORT); label = (label || '').trim() || T('sp.name.ph');
    try {
      setStep('read', 'run', '', .3);
      const texts = [];
      for (const f of files) {
        if (/\.zip$/i.test(f.name)) { let z; try { z = await KKP.spotify.readZip(await f.arrayBuffer()); } catch (e) { throw { code: 'zip' }; } z.forEach(x => texts.push(x)); }
        else texts.push({ name: f.name, text: await f.text() });
      }
      const p = KKP.spotify.parse(texts); if (p.entries.length < 30) throw { code: 'emptyexport' };
      setStep('read', 'done', T('p.streams.n', { n: fmtN(p.entries.length) }), 1); setStep('lookup', 'run', T('p.lookup.artists'), 0);
      const raw = await KKP.spotify.resolve(p.entries, { label, concurrency: 12, onProgress: (k, f) => { if (!cancelled) setStep('lookup', 'run', T(k === 'covers' ? 'p.lookup.covers' : 'p.lookup.artists'), k === 'covers' ? .85 + .15 * f : .85 * f); } });
      if (cancelled) return; setStep('lookup', 'done', '', 1); setStep('compute', 'run', T('p.compute.sub.model'), 0);
      const D = await runWorker(raw, { timezone: raw.profile.timezone }); if (cancelled) return;
      D.profile = { id: 'spotify-export', image: null, name: label }; setStep('compute', 'done', '', 1); setStep('images', 'run', '', 0);
      const at = await KKAtlas.build(D, (d, t) => setStep('images', 'run', T('p.images.n', { n: fmtN(d), m: fmtN(t) }), d / t)); if (cancelled) return;
      setStep('images', 'done', T('p.images.n', { n: fmtN(at.total - at.failed), m: fmtN(at.total) }), 1);
      try { history.replaceState(null, '', location.pathname); } catch (e) { }
      cachePut(label, D, at); await startViewer(D, at);
    } catch (e) { if (!cancelled) { console.error(e); showError(errText(e)); } }
  }

  /* ---------- Viewer starten ---------- */
  async function startViewer(D, atlas) {
    const [html, css] = await Promise.all([fetch('viewer.html').then(r => r.text()), fetch('viewer.css').then(r => r.text())]);
    const st = document.createElement('style'); st.id = 'viewer-css'; st.textContent = css; document.head.appendChild(st);
    document.querySelectorAll('[data-landing-css]').forEach(s => { s.disabled = true; });
    $('landing').remove(); $('progress').remove();
    const root = document.createElement('div'); root.id = 'viewer-root'; root.innerHTML = html.replace(/__AVATAR__/g, (D.profile && D.profile.image) || ''); document.body.appendChild(root);
    document.body.classList.add('in-viewer');
    window.__DATA__ = D; window.__ATLAS_URLS__ = { A: atlas.A, B: atlas.B, C: atlas.C }; window.__PRODUCT__ = true;
    const sc = document.createElement('script'); sc.src = 'viewer.js'; document.body.appendChild(sc);
    /* Zurueck-Taste (Browser, Handy) fuehrt zur Startseite; die Karte bleibt im Browser gespeichert */
    try { history.pushState({ kk: 'map' }, '', location.href); window.addEventListener('popstate', () => { location.replace(location.pathname); }); } catch (e) { }
  }

  /* ---------- Start ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    applyI18n(); renderRecent();
    const cfg = window.__KK_CFG__ || {};
    if (cfg.beta && $('betachip')) $('betachip').hidden = false;
    footLinks();
    if ('serviceWorker' in navigator && /^https?:/.test(location.protocol)) navigator.serviceWorker.register('sw.js').catch(() => { });
    /* dekorative Karten-Punkte im Hintergrund */
    try {
      const blobs = [[210, 240, 150, '#a58bff'], [500, 180, 120, '#ff9d7a'], [470, 400, 150, '#4fe0cf']]; let seed = 7; const r = () => (seed = (seed * 16807) % 2147483647) / 2147483647; const hs = ['', '', ''];
      for (let i = 0; i < 230; i++) { const k = i % 3, b = blobs[k], a = r() * 6.283, d = Math.sqrt(r()) * b[2], rad = 1 + r() * r() * 7, tw = r() < .22; hs[k] += '<circle' + (tw ? ' class="tw" style="animation-delay:-' + (r() * 5).toFixed(1) + 's;animation-duration:' + (3.5 + r() * 4).toFixed(1) + 's"' : '') + ' cx="' + (b[0] + Math.cos(a) * d).toFixed(1) + '" cy="' + (b[1] + Math.sin(a) * d).toFixed(1) + '" r="' + rad.toFixed(1) + '" fill="' + b[3] + '" fill-opacity="' + (.3 + r() * .5).toFixed(2) + '"/>'; }
      [1, 2, 3].forEach(n => { $('dots' + n).innerHTML = hs[n - 1]; });
    } catch (e) { }
    if (cfg.demo && $('demo-go')) $('demo-go').href = cfg.demo; else if (cfg.demo === '' && $('demo')) $('demo').remove();
    /* Einblenden beim Scrollen (nicht bei "weniger Bewegung") */
    try {
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
        [['.demo .dcard', 0], ['.sources h2', 0], ['.src', 1], ['.how h2', 0], ['.how li', 1], ['.faq h2', 0], ['.faq details', 1], ['footer', 0]].forEach(([sel, stag]) => {
          document.querySelectorAll(sel).forEach((el, i) => { el.classList.add('rv'); if (stag) el.style.setProperty('--d', Math.min(i % 4, 4)); io.observe(el); });
        });
      }
    } catch (e) { }
    $('lang').onclick = () => setLang(LANG === 'de' ? 'en' : 'de');
    $('gen').addEventListener('submit', e => { e.preventDefault(); generate($('user').value, false, $('cmp-field').classList.contains('hidden') ? '' : $('friend').value); });
    $('cmp-toggle').onclick = () => { const f = $('cmp-field'); f.classList.toggle('hidden'); if (!f.classList.contains('hidden')) $('friend').focus(); };
    if (/[?&]compare=1\b/.test(location.search)) { $('cmp-field').classList.remove('hidden'); try { history.replaceState(null, '', location.pathname); } catch (e) { } setTimeout(() => $('user').focus(), 400); }
    $('src-spotify').addEventListener('click', spOpen); $('sp-close').onclick = spClose; $('spmodal').addEventListener('click', e => { if (e.target.id === 'spmodal') spClose(); });
    $('sp-files').addEventListener('change', e => spSet(e.target.files)); $('sp-go').onclick = () => generateFromExport(spFiles, $('sp-name').value);
    const dz = $('sp-drop'); ['dragenter', 'dragover'].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.add('over'); })); ['dragleave', 'drop'].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.remove('over'); }));
    dz.addEventListener('drop', e => spSet(e.dataTransfer.files));
    $('perr-back').onclick = backToStart; $('pcancel').onclick = backToStart;
    document.querySelectorAll('.src[data-src]').forEach(el => el.addEventListener('click', () => { if (el.dataset.src === 'statsfm') $('user').focus(); }));
    const m = /[#&]u=([^&]+)/.exec(location.hash || ''), mf = /[#&]f=([^&]+)/.exec(location.hash || ''); if (m) { $('user').value = decodeURIComponent(m[1]); if (mf) { $('friend').value = decodeURIComponent(mf[1]); $('cmp-field').classList.remove('hidden'); } generate(decodeURIComponent(m[1]), false, mf ? decodeURIComponent(mf[1]) : ''); }
  });
})();
