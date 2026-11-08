(function (root) {
'use strict';
/* =====================================================================
   KLANGKARTE-PIPELINE (Browser-Worker und Node): stats.fm-Daten -> Karte
   Stufen: p02 Abruf · p03 Modell · p04 Aehnlichkeit · p05 Cluster · p06 Layout · p07 Benennung · p08 Export
   ===================================================================== */
const KKP = {};
KKP.version = '0.1';

/* ---------- kleine Helfer ---------- */
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function normal(rng) { const u = Math.max(1e-12, rng()), v = rng(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(6.283185307 * v); }
const clampN = (v, a, b) => v < a ? a : v > b ? b : v;
function argTop(row, k, skip) {                     // Indizes der k groessten positiven Werte einer Zeile (absteigend), ohne skip
  const idx = [], val = [];
  for (let j = 0; j < row.length; j++) {
    if (j === skip) continue; const v = row[j]; if (!(v > 0)) continue;
    if (idx.length === k && v <= val[k - 1]) continue;
    let p = idx.length < k ? idx.length : k - 1;
    while (p > 0 && val[p - 1] < v) { idx[p] = idx[p - 1]; val[p] = val[p - 1]; p--; }
    idx[p] = j; val[p] = v;
  }
  return idx;
}
function quantile(arr, q) { if (!arr.length) return 0; const a = Float64Array.from(arr).sort(); const p = (a.length - 1) * q, i = Math.floor(p), f = p - i; return i + 1 < a.length ? a[i] * (1 - f) + a[i + 1] * f : a[i]; }
const sleep = ms => new Promise(r => setTimeout(r, ms));
KKP.util = { mulberry32, normal, clampN, argTop, quantile, sleep };

/* ---------- p02: stats.fm-Abruf (oeffentliches API, CORS offen, kein Login) ---------- */
KKP.statsfm = (function () {
  const BASE = 'https://api.stats.fm/api/v1';
  class ApiError extends Error { constructor(code, msg) { super(msg); this.code = code; } }

  async function get(path, opt) {
    opt = opt || {}; const f = opt.fetch || globalThis.fetch.bind(globalThis);
    let last = null;
    for (let t = 0; t < 6; t++) {
      try {
        const res = await f(BASE + path, { headers: { Accept: 'application/json' } });
        if (res.status === 404) throw new ApiError('notfound', 'Nutzer nicht gefunden');
        if (res.status === 401 || res.status === 403) throw new ApiError('private', 'Daten sind privat');
        if (res.status === 429) { await KKP.util.sleep(1500 * (t + 1)); continue; }
        if (!res.ok) throw new ApiError('http', 'HTTP ' + res.status);
        return await res.json();
      } catch (e) {
        if (e instanceof ApiError && e.code !== 'http') throw e;
        last = e; await KKP.util.sleep(500 * (t + 1) ** 1.5);
      }
    }
    throw last || new ApiError('network', 'Netzwerkfehler');
  }

  /* Profil (customId oder interne ID) */
  async function profile(user, opt) { const d = await get('/users/' + encodeURIComponent(user), opt); return d.item; }

  /* Top-Listen (lifetime), seitenweise */
  async function top(userId, kind, opt) {
    opt = opt || {}; const LIM = 500; let off = 0; const out = [];
    for (; ;) {
      const d = await get('/users/' + userId + '/top/' + kind + '?range=lifetime&limit=' + LIM + '&offset=' + off, opt);
      out.push.apply(out, d.items); if (opt.onProgress) opt.onProgress(kind, out.length);
      if (d.items.length < LIM) break; off += LIM;
    }
    return out;
  }
  async function topGenres(userId, opt) { try { return (await get('/users/' + userId + '/top/genres?range=lifetime&limit=40', opt)).items; } catch (e) { return []; } }
  async function stats(userId, opt) { try { return (await get('/users/' + userId + '/streams/stats?range=lifetime', opt)).items; } catch (e) { return null; } }

  /* Alle Einzel-Streams: von neu nach alt in Fenstern zu 1000 (Offset geht nicht, daher "before") */
  async function streams(userId, opt) {
    opt = opt || {}; const LIM = 1000; const seen = new Map(); let before = Date.now() + 86400000;
    const ms = iso => Date.parse(iso);
    for (; ;) {
      const d = await get('/users/' + userId + '/streams?limit=' + LIM + '&before=' + before, opt);
      const items = d.items || []; let fresh = 0;
      for (const s of items) if (!seen.has(s.id)) { seen.set(s.id, s); fresh++; }
      if (opt.onProgress) opt.onProgress('streams', seen.size);
      if (!items.length || !fresh || items.length < LIM) break;
      before = Math.min(ms(items[items.length - 1].endTime) + 1, before - 1);
    }
    return Array.from(seen.values()).sort((a, b) => a.endTime < b.endTime ? -1 : a.endTime > b.endTime ? 1 : 0);
  }

  /* Schneller: Zeitfenster (120 Tage) parallel abfragen, jedes Fenster bei Bedarf seitenweise (after/before) */
  async function streamsParallel(userId, opt) {
    opt = opt || {}; const LIM = 1000, DAY = 86400000, WIN = 120 * DAY, CONC = opt.concurrency || 6;
    const end = Date.now() + DAY, start = Date.UTC(opt.sinceYear || 2012, 0, 1), wins = [];
    for (let t = end; t > start; t -= WIN) wins.push([Math.max(start, t - WIN), t]);
    const seen = new Map(); let qi = 0;
    const one = async ([a, b]) => {
      let before = b;
      for (; ;) {
        const d = await get('/users/' + userId + '/streams?limit=' + LIM + '&after=' + a + '&before=' + before, opt); const items = d.items || []; let fresh = 0;
        for (const s of items) if (!seen.has(s.id)) { seen.set(s.id, s); fresh++; }
        if (opt.onProgress) opt.onProgress('streams', seen.size);
        if (items.length < LIM || !fresh) break;
        before = Math.min(Date.parse(items[items.length - 1].endTime) + 1, before - 1);
      }
    };
    const worker = async () => { while (qi < wins.length) await one(wins[qi++]); };
    await Promise.all(Array.from({ length: CONC }, worker));
    return Array.from(seen.values()).sort((x, y) => x.endTime < y.endTime ? -1 : x.endTime > y.endTime ? 1 : 0);
  }

  /* Fehlende Album-Metadaten nachladen (Name, Cover, Jahr) */
  async function albumsMeta(ids, opt) {
    opt = opt || {}; const out = {}; const q = ids.slice(); let done = 0;
    const worker = async () => { while (q.length) { const id = q.shift(); try { const it = (await get('/albums/' + id, opt)).item; out[id] = { id, name: it.name, img: it.image, year: it.releaseDate, spotify: ((it.externalIds || {}).spotify || [null])[0] }; } catch (e) { } done++; if (opt.onProgress && done % 25 === 0) opt.onProgress('albums', done); } };
    await Promise.all(Array.from({ length: opt.concurrency || 10 }, worker));
    return out;
  }
  async function current(userId, opt) { try { return (await get('/users/' + userId + '/streams/current', opt)).item; } catch (e) { return null; } }

  /* Alles zusammen (parallel wo moeglich). onProgress(phase, count, total) */
  async function fetchAll(user, opt) {
    opt = Object.assign({}, opt || {}); const P = opt.onProgress || (() => { });
    P('profile', 0, 1); const prof = await profile(user, opt);
    if (prof.privacySettings && prof.privacySettings.streams === false) throw new ApiError('private', 'Streams sind privat');
    const st = await stats(prof.id, opt); const total = st ? st.count : 0;
    const o2 = Object.assign({}, opt, { onProgress: (k, n) => P(k, n, k === 'streams' ? total : 0) });
    const [topArtists, topTracks, topGen] = await Promise.all([top(prof.id, 'artists', o2), top(prof.id, 'tracks', o2), topGenres(prof.id, opt)]);
    let strm; try { strm = await streamsParallel(prof.id, o2); if (st && st.count && strm.length < st.count * .97) strm = await streams(prof.id, o2); } catch (e) { strm = await streams(prof.id, o2); }
    return { profile: prof, topArtists, topTracks, topGenres: topGen, streams: strm, stats: st };
  }
  return { get, profile, top, topGenres, stats, streams, streamsParallel, albumsMeta, current, fetchAll, ApiError, BASE };
})();

/* ---------- p03: Rohdaten -> einheitliches Modell (Port von prep.py) ---------- */
KKP.buildModel = function (raw, opt) {
  opt = opt || {};
  const prof = raw.profile, tz = opt.timezone || prof.timezone || 'UTC';
  const ALIAS = { alternativa: 'alternative', alternativ: 'alternative', alternatief: 'alternative', 'hiphop/rap': 'hip-hop/rap', 'hip hop/rap': 'hip-hop/rap', 'hip-hop / rap': 'hip-hop/rap', 'hip hop': 'hip-hop/rap', 'hip-hop': 'hip-hop/rap', hiphop: 'hip-hop/rap', rap: 'hip-hop/rap', 'drum and bass': "jungle/drum'n'bass", 'indie-pop': 'indie pop', electronica: 'electronic' };      // gleiche Tags, andere Schreibweise
  const firstSp = o => ((o && o.externalIds && o.externalIds.spotify) || [])[0] || null;

  /* ---- Metadaten ---- */
  const artists = new Map(), tracks = new Map(), albums = new Map();
  for (const it of raw.topArtists) {
    const a = it.artist;
    artists.set(a.id, { id: a.id, name: a.name, img: a.image || null, genres: Array.from(new Set((a.genres || []).map(g => ALIAS[g] || g))), followers: a.followers || 0, pop: a.spotifyPopularity || 0, spotify: firstSp(a), api_minutes: it.playedMs / 60000, api_streams: it.streams });
  }
  for (const it of raw.topTracks) {
    const t = it.track;
    tracks.set(t.id, { id: t.id, name: t.name, artist_ids: (t.artists || []).map(x => x.id), album_ids: (t.albums || []).map(x => x.id), dur: t.durationMs || 0, explicit: !!t.explicit, pop: t.spotifyPopularity || 0, spotify: firstSp(t), preview: t.spotifyPreview || t.appleMusicPreview || null });
    (t.albums || []).forEach(al => { if (!albums.has(al.id)) albums.set(al.id, { id: al.id, name: al.name, img: al.image || null }); });
    (t.artists || []).forEach(ar => { if (!artists.has(ar.id)) artists.set(ar.id, { id: ar.id, name: ar.name, img: ar.image || null, genres: [], followers: 0, pop: 0, spotify: null, api_minutes: 0, api_streams: 0 }); });
  }
  const streams = raw.streams;
  if (!streams.length) throw new Error('Keine Streams gefunden');
  // Streams ohne Artist-Zuordnung: Artists laut Track-Metadaten
  for (const s of streams) if (!s.artistIds || !s.artistIds.length) { const t = tracks.get(s.trackId); s.artistIds = t && t.artist_ids.length ? t.artist_ids.slice() : []; }
  // Artist-Liste der Tracks aus den Streams (Aggregation nutzt dieselben IDs)
  const stArt = new Map(); for (const s of streams) if (!stArt.has(s.trackId)) stArt.set(s.trackId, s.artistIds.slice());
  stArt.forEach((ids, tid) => { const t = tracks.get(tid); if (t && ids.length) { t.artist_ids = ids; ids.forEach(a => { if (!artists.has(a)) artists.set(a, { id: a, name: '?', img: null, genres: [], followers: 0, pop: 0, spotify: null, api_minutes: 0, api_streams: 0 }); }); } });

  /* ---- Zeit: lokale Tage/Stunden der Zeitzone (Sommerzeit-genau) ---- */
  let dtf; try { dtf = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric' }); } catch (e) { dtf = null; }
  const offCache = new Map();
  const offsetMs = ts => {                      // Versatz lokal - UTC fuer die UTC-Stunde von ts
    if (!dtf) return 0; const h = Math.floor(ts / 3600000); let o = offCache.get(h);
    if (o === undefined) { const p = {}; dtf.formatToParts(new Date(h * 3600000)).forEach(q => { p[q.type] = +q.value; }); o = Date.UTC(p.year, p.month - 1, p.day, p.hour) - h * 3600000; offCache.set(h, o); }
    return o;
  };
  const ts0 = Date.parse(streams[0].endTime), local0 = ts0 + offsetMs(ts0);
  const day0 = Math.floor(local0 / 86400000);       // Epochentag des ersten Streams (lokal)

  /* ---- Aggregation ---- */
  const mk = () => ({ min: 0, n: 0, first: Infinity, last: -Infinity, dy: new Map() });
  const A = new Map(), T = new Map(), B = new Map(), trAlb = new Map();
  const cmp = !!opt.compare;
  const upd = (m, key, mins, ts, di, u) => {
    let g = m.get(key); if (!g) { g = mk(); m.set(key, g); }
    g.min += mins; g.n++; if (ts < g.first) g.first = ts; if (ts > g.last) g.last = ts;
    const e = g.dy.get(di); if (e) { e[0] += mins; e[1]++; } else g.dy.set(di, [mins, 1]);
    if (cmp) {                                               // Vergleich: zusaetzlich je Nutzer (M = ich, F = Freund)
      if (!g.by) g.by = {}; const b = g.by[u] || (g.by[u] = { min: 0, n: 0, dy: new Map() });
      b.min += mins; b.n++; const e2 = b.dy.get(di); if (e2) { e2[0] += mins; e2[1]++; } else b.dy.set(di, [mins, 1]);
    }
  };
  const hour = new Array(24).fill(0), weekday = new Array(7).fill(0);
  const dayMin = new Map(), dayN = new Map(); const sessions = []; let cur = [], prevEnd = null;
  const per = {}; const perOf = u => per[u] || (per[u] = { hour: new Array(24).fill(0), weekday: new Array(7).fill(0), dayMin: new Map(), dayN: new Map(), streams: 0, minutes: 0, cur: [], prevEnd: null });
  for (const s of streams) {
    const u = s.u || 'M';
    const mins = s.playedMs / 60000, ts = Date.parse(s.endTime), local = ts + offsetMs(ts), day = Math.floor(local / 86400000), di = day - day0;
    const tid = s.trackId, known = s.artistIds.length > 0;           // Streams ohne Artist-Zuordnung zaehlen nur in die Tages-/Stundensummen
    if (known) {
      if (!tracks.has(tid)) tracks.set(tid, { id: tid, name: s.trackName || '?', artist_ids: s.artistIds.slice(), album_ids: s.albumId != null ? [s.albumId] : [], dur: 0, explicit: false, pop: 0, spotify: null, preview: null });
      upd(T, tid, mins, ts, di, u);
      if (s.albumId != null) { let m = trAlb.get(tid); if (!m) trAlb.set(tid, m = new Map()); m.set(s.albumId, (m.get(s.albumId) || 0) + 1); }
      for (const a of s.artistIds) upd(A, a, mins, ts, di, u);
      if (s.albumId != null) upd(B, s.albumId, mins, ts, di, u);
    }
    const hh = Math.floor(local / 3600000) % 24; hour[(hh + 24) % 24] += mins; weekday[(day + 3) % 7] += mins;
    dayMin.set(di, (dayMin.get(di) || 0) + mins); dayN.set(di, (dayN.get(di) || 0) + 1);
    if (cmp) { const P = perOf(u); P.hour[(hh + 24) % 24] += mins; P.weekday[(day + 3) % 7] += mins; P.dayMin.set(di, (P.dayMin.get(di) || 0) + mins); P.dayN.set(di, (P.dayN.get(di) || 0) + 1); P.streams++; P.minutes += mins; }
    const st = ts / 1000 - s.playedMs / 1000, P2 = cmp ? perOf(u) : null, pe = cmp ? P2.prevEnd : prevEnd;
    if (cmp) { if (pe !== null && st - pe > 600) { sessions.push(P2.cur); P2.cur = []; } P2.cur.push({ a: s.artistIds.length ? s.artistIds[0] : null, end: ts / 1000, ms: s.playedMs }); P2.prevEnd = ts / 1000; }
    else { if (prevEnd !== null && st - prevEnd > 600) { sessions.push(cur); cur = []; } cur.push({ a: s.artistIds.length ? s.artistIds[0] : null, end: ts / 1000, ms: s.playedMs }); prevEnd = ts / 1000; }
  }
  if (cmp) Object.keys(per).forEach(k => { if (per[k].cur.length) sessions.push(per[k].cur); }); else sessions.push(cur);
  const nd = Math.floor((Date.parse(streams[streams.length - 1].endTime) + offsetMs(Date.parse(streams[streams.length - 1].endTime))) / 86400000) - day0 + 1;

  /* ---- Album-Metadaten, die nicht in den Track-Alben stehen ---- */
  const missingAlbums = []; B.forEach((g, bid) => { const al = albums.get(bid); if (!al || !al.img) missingAlbums.push(bid); });

  /* ---- Primaere Tracks je Artist ---- */
  for (const [tid, t] of Array.from(tracks)) if (!t.artist_ids.length) tracks.delete(tid);
  const prim = new Map(), feat = new Map();
  tracks.forEach((t, tid) => { if (!T.has(tid)) return; const p = t.artist_ids[0]; (prim.get(p) || prim.set(p, []).get(p)).push(tid); t.artist_ids.slice(1).forEach(a => (feat.get(a) || feat.set(a, []).get(a)).push(tid)); });

  let totalMin = 0; T.forEach(g => { totalMin += g.min; });
  /* Rekorde */
  let bestDay = [0, 0]; dayMin.forEach((v, k) => { if (v > bestDay[1]) bestDay = [k, v]; });
  let longest = { minutes: 0, n: 0, date: 0 };
  sessions.forEach(ses => { if (!ses.length) return; const len = (ses[ses.length - 1].end - ses[0].end) / 60 + ses[0].ms / 60000; if (len > longest.minutes) longest = { minutes: len, n: ses.length, endTs: ses[0].end }; });
  return { per, compare: cmp, profile: prof, tz, artists, tracks, albums, A, T, B, trAlb, prim, feat, sessions, hour, weekday, dayMin, dayN, day0, nd, totalMin, missingAlbums, streamsCount: streams.length, firstTs: ts0, lastTs: Date.parse(streams[streams.length - 1].endTime), bestDay, longest, topGenres: raw.topGenres || [] };
};

/* ---------- p04: Aehnlichkeit zwischen Artists (Port von similarity.py + lang.py + Gewichte aus clusters2.py) ---------- */
KKP.lang = (function () {
  const SW = {
    de: 'ich du und nicht der die das ein eine mit mich dich wir ihr nur auch wie nie immer noch für von zu ist bin mein dein kein wenn dann aber oder schon heute nacht liebe herz leben welt zeit mir dir uns euch sie im am auf aus bei nach über unter vor ohne gegen meine deine alles nichts wieder jetzt hier dort wo warum weil ja nein bitte danke tag morgen sommer winter himmel meer stadt haus kind mädchen junge frau mann komm bleib lass geh wir\'s mal ganz sind wird sein',
    en: 'the you your my me i\'m im don\'t dont it\'s its can\'t cant with never always baby love like just girl boy tonight heart time life world feel got wanna gonna ain\'t about know why when where who how and for of to we are be been not yes',
    fr: 'les des du une est pas je tu elle nous vous dans pour sur avec mon ton sans toi moi cette mais où que qui comme tout très amour le la un et',
    es: 'el los las del que y en una por para con mi tu yo te amor corazón vida noche cómo qué todo nada siempre nunca más muy pero sin sobre cuando donde ya',
    it: 'il lo gli di che per con non mio mia amore sono sei è anche più come questo notte vita cuore',
    pt: 'não você eu meu minha amor coração com uma para mais muito tudo nada sempre nunca quando onde',
    nl: 'de het een van ik je niet en dat is ook maar voor met mijn jij hij zij wij nacht liefde',
    sv: 'och jag du inte är det som en ett på för med av har kan vi'
  };
  const cnt = {}; Object.values(SW).forEach(s => new Set(s.split(' ')).forEach(w => { cnt[w] = (cnt[w] || 0) + 1; }));
  const SWS = {}; Object.keys(SW).forEach(l => { SWS[l] = new Set(SW[l].split(' ').filter(w => cnt[w] === 1)); });
  const TAG_LANG = [['german', 'de'], ['neue deutsche welle', 'de'], ['schlager', 'de'], ['deutsch', 'de'], ['k-pop', 'ko'], ['korean', 'ko'], ['j-pop', 'ja'], ['j-rock', 'ja'], ['anime', 'ja'], ['city pop', 'ja'], ['visual kei', 'ja'], ['vocaloid', 'ja'], ['japanese', 'ja'], ['french', 'fr'], ['chanson', 'fr'], ['latin', 'es'], ['reggaeton', 'es'], ['spanish', 'es'], ['brazilian', 'pt'], ['mpb', 'pt'], ['sertanejo', 'pt'], ['italian', 'it'], ['russian', 'ru'], ['turkish', 'tr'], ['arab', 'ar']];
  const RX = { ja: /[぀-ヿ]/g, ko: /[가-힯]/g, ru: /[Ѐ-ӿ]/g, ar: /[؀-ۿ]/g, zh: /[一-鿿]/g, th: /[฀-๿]/g, he: /[֐-׿]/g, hi: /[ऀ-ॿ]/g };
  const WORD = /[a-zäöüßéèêàâçñáíóúìòùîôûëï']+/g;
  function guess(name, tags, titles) {
    for (const t of tags) { const tl = t.toLowerCase(); for (const [k, lg] of TAG_LANG) if (tl.includes(k)) return lg; }
    const text = [name].concat(titles).join(' ');
    for (const lg of Object.keys(RX)) { const h = (text.match(RX[lg]) || []).length; if (h >= 2) return lg === 'zh' && /[぀-ヿ]/.test(text) ? 'ja' : lg; }
    const sc = {};
    for (const ti of titles) {
      const low = ti.toLowerCase();
      if (/[äöüß]/.test(low)) sc.de = (sc.de || 0) + 1; if (/[ñ¿¡]/.test(low)) sc.es = (sc.es || 0) + 1;
      for (const w of low.match(WORD) || []) for (const lg in SWS) if (SWS[lg].has(w)) sc[lg] = (sc[lg] || 0) + 1;
    }
    const e = Object.entries(sc).sort((a, b) => b[1] - a[1]); if (!e.length) return null;
    const [b, bn] = e[0], sn = e[1] ? e[1][1] : 0;
    if (bn >= 2 && bn >= 1.6 * sn) return b;
    if (bn >= 1 && sn === 0 && titles.length <= 2) return b;
    return null;
  }
  return { guess };
})();

/* Grobe Oberbegriffe (z. B. Apples "Hip-Hop/Rap"): sie sagen fast nichts ueber die Szene, deshalb zaehlen sie nur schwach */
KKP.GENERIC_TAGS = new Set(['hip-hop/rap', 'pop', 'rock', 'alternative', 'dance', 'electronic', 'r&b/soul', 'soundtrack', 'singer/songwriter', 'indie', 'jazz', 'classical', 'country', 'latin', 'metal', 'folk', 'reggae', 'blues', 'house', 'punk', 'musicals', 'christmas', 'adult standards', 'funk', 'world', 'new age', 'easy listening', 'holiday', "children's music", 'spoken word']);

/* Sprache + nur grobes Genre -> genauerer Zusatz-Tag (z. B. Hip-Hop/Rap auf Deutsch = Deutschrap). Nur fuer Artists, die sonst keinen spezifischen Tag haben */
KKP.LANG_TAGS = {
  de: { 'hip-hop/rap': 'german hip hop', 'pop': 'german pop', 'alternative': 'german indie', 'indie': 'german indie' },
  fr: { 'hip-hop/rap': 'french hip hop', 'pop': 'french pop' },
  ja: { 'pop': 'j-pop', 'rock': 'j-rock' },
  ko: { 'pop': 'k-pop' },
  es: { 'hip-hop/rap': 'spanish hip hop', 'pop': 'latin pop' }
};

KKP.buildSimilarity = function (M, opt) {
  opt = opt || {};
  const GA = opt.genAware !== false;                                    // false = altes Verhalten (zum Vergleichen)
  const W_TAG = opt.wTag ?? .9, W_CO = opt.wCo ?? .2, W_COL = opt.wCol ?? .3, LANG_PEN = opt.langPenalty ?? .5, KNN = opt.knn ?? 24;
  const ids = Array.from(M.A.keys()).filter(a => M.artists.has(a)).sort((a, b) => M.A.get(b).min - M.A.get(a).min).slice(0, opt.maxArtists || 2600);
  const n = ids.length, idx = new Map(ids.map((a, i) => [a, i]));
  const mins = Float64Array.from(ids.map(a => M.A.get(a).min));

  /* Sprache je Artist (aus Tags, Schrift und Titeln) */
  const prim = M.prim, lang = ids.map(a => KKP.lang.guess(M.artists.get(a).name, M.artists.get(a).genres, (prim.get(a) || []).slice(0, 40).map(t => M.tracks.get(t).name)));

  /* 1. Genre-Tags: TF-IDF-Kosinus. Oberbegriffe = fest hinterlegt oder bei >= genShare aller Artists */
  const df0 = new Map(); ids.forEach(a => new Set(M.artists.get(a).genres).forEach(g => df0.set(g, (df0.get(g) || 0) + 1)));
  const isGen = g => KKP.GENERIC_TAGS.has(g) || (df0.get(g) || 0) / n >= (opt.genShare ?? .12);
  const LT = opt.langTags === false ? {} : KKP.LANG_TAGS;
  ids.forEach((a, i) => {                                               // tags2 = Genres + abgeleitete Sprach-Tags (Original bleibt unveraendert)
    const am = M.artists.get(a), gs = am.genres; am.tags2 = gs;
    const mp = LT[lang[i]]; if (!mp || !gs.length || !gs.every(isGen)) return;
    const add = gs.map(g => mp[g]).filter(Boolean); if (add.length) am.tags2 = Array.from(new Set(gs.concat(add)));
  });
  const df = new Map(); ids.forEach(a => new Set(M.artists.get(a).tags2).forEach(g => df.set(g, (df.get(g) || 0) + 1)));
  const tags = Array.from(df.keys()).sort(), tagIdx = new Map(tags.map((t, k) => [t, k]));
  const kind = ids.map(a => { const gs = M.artists.get(a).tags2; return !gs.length ? 0 : (GA && gs.every(isGen)) ? 1 : 2; });   // 0 ohne Tags, 1 nur Oberbegriffe, 2 mit spezifischen Tags
  const rowsT = ids.map((a, ii) => { const gs = Array.from(new Set(M.artists.get(a).tags2)); const v = gs.map(g => [tagIdx.get(g), (Math.log((n + 1) / (df.get(g) + 1)) + .3) * (GA && kind[ii] === 2 && isGen(g) ? (opt.genDamp ?? 1) : 1)]); const nr = Math.sqrt(v.reduce((s, x) => s + x[1] * x[1], 0)) || 1; return v.map(x => [x[0], x[1] / nr]); });
  const colT = tags.map(() => []); rowsT.forEach((r, i) => r.forEach(([t, w]) => colT[t].push([i, w])));
  const Stag = new Float32Array(n * n);
  colT.forEach(L => { for (let p = 0; p < L.length; p++) for (let q = p + 1; q < L.length; q++) { const v = L[p][1] * L[q][1]; Stag[L[p][0] * n + L[q][0]] += v; Stag[L[q][0] * n + L[p][0]] += v; } });
  const hasTags = kind.map(k => k > 0);

  /* 2. Co-Listening (Fenster 7 in Sessions) -> PPMI -> Kosinus 2. Ordnung */
  const WIN = 7, C = new Map(), rowSum = new Float64Array(n);
  for (const ses of M.sessions) {
    const seq = []; for (const s of ses) { const j = s.a != null ? idx.get(s.a) : undefined; if (j !== undefined) seq.push(j); }
    for (let p = 0; p < seq.length; p++) for (let q = p + 1; q < Math.min(seq.length, p + 1 + WIN); q++) {
      const i = seq[p], j = seq[q]; if (i === j) continue; const w = 1 / (q - p);
      C.set(i * n + j, (C.get(i * n + j) || 0) + w); C.set(j * n + i, (C.get(j * n + i) || 0) + w); rowSum[i] += w; rowSum[j] += w;
    }
  }
  let tot = 0; for (let i = 0; i < n; i++) tot += rowSum[i];
  const P = Array.from({ length: n }, () => []);
  C.forEach((c, key) => { if (c < 1.5) return; const i = Math.floor(key / n), j = key % n; const pmi = Math.log(c * tot / (rowSum[i] * rowSum[j])); if (pmi > 0) P[i].push([j, pmi]); });
  P.forEach(r => { const nr = Math.sqrt(r.reduce((s, x) => s + x[1] * x[1], 0)) || 1; r.forEach(x => { x[1] /= nr; }); });
  const colP = Array.from({ length: n }, () => []); P.forEach((r, i) => r.forEach(([k, w]) => colP[k].push([i, w])));
  const Sco = new Float32Array(n * n);
  colP.forEach(L => { for (let p = 0; p < L.length; p++) for (let q = p + 1; q < L.length; q++) { const v = L[p][1] * L[q][1]; Sco[L[p][0] * n + L[q][0]] += v; Sco[L[q][0] * n + L[p][0]] += v; } });
  const pos = []; for (let k = 0; k < Sco.length; k++) if (Sco[k] > 0) pos.push(Sco[k]);
  const qco = pos.length ? KKP.util.quantile(pos, .995) : 1;
  const coN = (i, j) => Math.min(1, Sco[i * n + j] / qco);

  /* 3. Collabs */
  const Scol = new Map();
  M.tracks.forEach(t => { const aa = t.artist_ids.map(x => idx.get(x)).filter(x => x !== undefined); for (const x of aa) for (const y of aa) if (x !== y) Scol.set(x * n + y, 1); });
  const colv = (i, j) => Scol.get(i * n + j) || 0;

  /* Kombination: Zeile fuer Zeile -> Top-KNN-Nachbarn. Symmetrie: max ueber die Gewichtung beider Seiten. k: 0 ohne Tags, 1 nur Oberbegriffe, 2 spezifische Tags */
  const comb = (k, i, j) => { const st = Stag[i * n + j], co = coN(i, j), cl = colv(i, j); return k === 0 ? .15 * st + .8 * co + .5 * cl : k === 1 && GA ? (opt.wGenTag ?? W_TAG) * st + (opt.wGenCo ?? W_CO) * co + (opt.wGenCol ?? W_COL) * cl : W_TAG * st + W_CO * co + W_COL * cl; };
  const val = (i, j) => {
    let v = Math.max(comb(kind[i], i, j), comb(kind[j], i, j));
    const li = lang[i], lj = lang[j]; if (li && lj && li !== lj) v *= LANG_PEN;
    return v;
  };
  const row = new Float32Array(n), nb = new Array(n);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) row[j] = j === i ? 0 : val(i, j);
    nb[i] = KKP.util.argTop(row, KNN, i).map(j => [j, row[j]]);
  }
  /* Isolierte Artists: schwache Co-Listening-Treffer (auch einmalige) als Nachbarn (isolate_fix) */
  const cnt3 = new Map();
  for (const ses of M.sessions) {
    const seq = []; for (const s of ses) { const j = s.a != null ? idx.get(s.a) : undefined; if (j !== undefined) seq.push(j); }
    for (let p = 0; p < seq.length; p++) for (let q = Math.max(0, p - 3); q < Math.min(seq.length, p + 4); q++) { if (q === p) continue; const i = seq[p], j = seq[q]; if (i === j) continue; const k = i * n + j; cnt3.set(k, (cnt3.get(k) || 0) + 1 / Math.abs(p - q)); }
  }
  const byI = new Map(); cnt3.forEach((c, key) => { const i = Math.floor(key / n), j = key % n; (byI.get(i) || byI.set(i, []).get(i)).push([j, c]); });
  let isolated = 0;
  for (let i = 0; i < n; i++) {
    if (nb[i].length && nb[i][0][1] > .02) continue;
    const l = byI.get(i); if (!l) continue; isolated++;
    l.forEach(([j, c]) => { const w = .05 + .03 * Math.min(c, 5); nb[i].push([j, w]); nb[j].push([i, w]); });
  }
  nb.forEach(l => l.sort((a, b) => b[1] - a[1]));
  return { ids, idx, n, mins, nb, tags, hasTags, kind, lang, isolated, rowsT, isGen, parts: (i, j) => [Stag[i * n + j], Sco[i * n + j], colv(i, j)], stag: (i, j) => Stag[i * n + j], sco: (i, j) => Sco[i * n + j], col: colv };
};

/* ---------- p05: Kontinente (Makro) und Szenen (Sub) per Louvain (Port von clusters.py) ---------- */
KKP.louvain = function (n, adj, resolution, rng) {
  // adj: Array<Array<[j,w]>> (ungerichtet, symmetrisch). Rueckgabe: Community-Label je Knoten (0..k-1)
  let g = { n, adj: adj.map(l => l.map(x => [x[0], x[1]])), self: new Float64Array(n) };
  let node2com = Int32Array.from({ length: n }, (_, i) => i);
  for (let level = 0; level < 12; level++) {
    const N = g.n, deg = new Float64Array(N); let m2 = 0;
    for (let i = 0; i < N; i++) { let d = 2 * g.self[i]; for (const [, w] of g.adj[i]) d += w; deg[i] = d; m2 += d; }
    if (m2 <= 0) break;
    const com = Int32Array.from({ length: N }, (_, i) => i), tot = Float64Array.from(deg);
    const order = Array.from({ length: N }, (_, i) => i);
    let moved = false, pass = 0, changed = true;
    while (changed && pass < 30) {
      changed = false; pass++;
      for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); const t = order[i]; order[i] = order[j]; order[j] = t; }
      for (const i of order) {
        const ci = com[i], nw = new Map();
        for (const [j, w] of g.adj[i]) { if (j === i) continue; nw.set(com[j], (nw.get(com[j]) || 0) + w); }
        tot[ci] -= deg[i];
        let best = ci, bestGain = (nw.get(ci) || 0) - resolution * tot[ci] * deg[i] / m2;
        nw.forEach((w, c) => { const gain = w - resolution * tot[c] * deg[i] / m2; if (gain > bestGain + 1e-12) { bestGain = gain; best = c; } });
        tot[best] += deg[i];
        if (best !== ci) { com[i] = best; changed = true; moved = true; }
      }
    }
    if (!moved) break;
    // Gemeinschaften renumerieren, Graph aggregieren
    const map = new Map(); let k = 0; for (let i = 0; i < N; i++) if (!map.has(com[i])) map.set(com[i], k++);
    for (let i = 0; i < n; i++) node2com[i] = map.get(com[node2com[i]]);
    const adj2 = Array.from({ length: k }, () => new Map()), self2 = new Float64Array(k);
    for (let i = 0; i < N; i++) {
      const ci = map.get(com[i]); self2[ci] += g.self[i];
      for (const [j, w] of g.adj[i]) { const cj = map.get(com[j]); if (ci === cj) self2[ci] += w / 2; else adj2[ci].set(cj, (adj2[ci].get(cj) || 0) + w); }
    }
    if (k === N) break;
    g = { n: k, adj: adj2.map(m => Array.from(m)), self: self2 };
  }
  return node2com;
};

KKP.buildClusters = function (Sm, opt) {
  opt = opt || {};
  const n = Sm.n, rng = KKP.util.mulberry32(opt.seed || 7), mins = Sm.mins;
  const resMacro = opt.resMacro ?? .9, resSub = opt.resSub ?? 1.25;
  const minMacro = opt.minMacro ?? Math.max(6, Math.min(14, Math.round(n / 140))), minSub = opt.minSub ?? Math.max(3, Math.min(6, Math.round(n / 330)));
  const sym = Array.from({ length: n }, () => new Map());      // symmetrische Nachbarschaft (max)
  Sm.nb.forEach((l, i) => l.forEach(([j, w]) => { if (w <= 0) return; if ((sym[i].get(j) || 0) < w) sym[i].set(j, w); if ((sym[j].get(i) || 0) < w) sym[j].set(i, w); }));
  const knn = (K, members) => {                                 // knn_graph: je Knoten die K staerksten Nachbarn (>0.02), ungerichtet vereinigt (max)
    const inSet = members ? new Set(members) : null, nodes = members || Array.from({ length: n }, (_, i) => i);
    const G = new Map(nodes.map(i => [i, new Map()]));
    for (const i of nodes) {
      let c = 0;
      for (const [j, w] of Sm.nb[i]) { if (w <= .02) continue; if (inSet && !inSet.has(j)) continue; const a = G.get(i), b = G.get(j); if (!b) continue; if ((a.get(j) || 0) < w) { a.set(j, w); b.set(i, Math.max(b.get(i) || 0, w)); } if (++c >= K) break; }
    }
    return G;
  };
  const toAdj = (G, nodes) => { const loc = new Map(nodes.map((v, k) => [v, k])); return nodes.map(v => Array.from(G.get(v)).filter(([j]) => loc.has(j)).map(([j, w]) => [loc.get(j), w])); };
  const aff = (mem, dm) => { let s = 0; const ds = new Set(dm); for (const i of mem) sym[i].forEach((w, j) => { if (ds.has(j)) s += w; }); return s / (mem.length * Math.sqrt(dm.length)); };
  const mergeSmall = (labels, members, minSize) => {
    const lab = labels.slice();
    for (; ;) {
      const cnt = new Map(); lab.forEach(c => cnt.set(c, (cnt.get(c) || 0) + 1));
      const small = Array.from(cnt).filter(([, s]) => s < minSize); if (!small.length) break;
      small.sort((a, b) => a[1] - b[1]); const c = small[0][0];
      const mem = []; lab.forEach((x, k) => { if (x === c) mem.push(members[k]); });
      let best = null, bs = -1;
      for (const d of cnt.keys()) { if (d === c) continue; const dm = []; lab.forEach((x, k) => { if (x === d) dm.push(members[k]); }); const sc = aff(mem, dm); if (sc > bs) { bs = sc; best = d; } }
      if (bs <= 0) { let bc = -1; for (const [d, s] of cnt) if (d !== c && s > bc) { bc = s; best = d; } }
      for (let k = 0; k < lab.length; k++) if (lab[k] === c) lab[k] = best;
      if (cnt.size === 1) break;
    }
    return lab;
  };
  const renumber = (labels, members) => {                       // nach Minuten absteigend nummerieren
    const sum = new Map(); labels.forEach((c, k) => sum.set(c, (sum.get(c) || 0) + mins[members[k]]));
    const order = Array.from(sum.keys()).sort((a, b) => sum.get(b) - sum.get(a)); const m = new Map(order.map((c, k) => [c, k]));
    return labels.map(c => m.get(c));
  };
  const all = Array.from({ length: n }, (_, i) => i);
  let macro = KKP.louvain(n, toAdj(knn(opt.knnMacro ?? 14), all), resMacro, rng);
  macro = Array.from(renumber(mergeSmall(Array.from(macro), all, minMacro), all));
  const nm = Math.max.apply(null, macro) + 1, sub = new Array(n).fill(0); let nextId = 0;
  for (let c = 0; c < nm; c++) {
    const mem = []; macro.forEach((x, i) => { if (x === c) mem.push(i); });
    if (mem.length < Math.max(12, 2 * minSub + 2)) { mem.forEach(i => { sub[i] = nextId; }); nextId++; continue; }
    const lab = KKP.louvain(mem.length, toAdj(knn(10, mem), mem), resSub, rng);
    const sl = renumber(mergeSmall(Array.from(lab), mem, minSub), mem);
    const k = Math.max.apply(null, sl) + 1;
    for (let q = 0; q < k; q++) { mem.forEach((i, p) => { if (sl[p] === q) sub[i] = nextId; }); nextId++; }
  }
  /* Korrekturen von Hand: { "Artist": "Referenz-Artist" } */
  if (opt.overrides) {
    const byName = new Map(); Sm.ids.forEach((a, i) => byName.set(String(opt.names[i]).toLowerCase(), i));
    Object.entries(opt.overrides).forEach(([nm_, ref]) => { const i = byName.get(nm_.toLowerCase()), j = byName.get(String(ref).toLowerCase()); if (i != null && j != null) { macro[i] = macro[j]; sub[i] = sub[j]; } });
  }
  return { macro: Int32Array.from(macro), sub: Int32Array.from(sub), sym, nm, ns: nextId };
};

/* ---------- p06: Geometrie (Port von layout.py): Einheiten, Orbit-Ringe, globales Layout ---------- */
KKP.jacobiEigen = function (A) {            // symmetrische Matrix (Array von Arrays) -> {vals (aufsteigend), vecs[j] = Eigenvektor j}
  const n = A.length, a = A.map(r => r.slice()), v = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => i === j ? 1 : 0));
  for (let sweep = 0; sweep < 60; sweep++) {
    let off = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) off += a[i][j] * a[i][j];
    if (off < 1e-18) break;
    for (let p = 0; p < n - 1; p++) for (let q = p + 1; q < n; q++) {
      if (Math.abs(a[p][q]) < 1e-14) continue;
      const th = (a[q][q] - a[p][p]) / (2 * a[p][q]), t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1)), c = 1 / Math.sqrt(t * t + 1), s = t * c;
      for (let k = 0; k < n; k++) { const akp = a[k][p], akq = a[k][q]; a[k][p] = c * akp - s * akq; a[k][q] = s * akp + c * akq; }
      for (let k = 0; k < n; k++) { const apk = a[p][k], aqk = a[q][k]; a[p][k] = c * apk - s * aqk; a[q][k] = s * apk + c * aqk; }
      for (let k = 0; k < n; k++) { const vkp = v[k][p], vkq = v[k][q]; v[k][p] = c * vkp - s * vkq; v[k][q] = s * vkp + c * vkq; }
    }
  }
  const order = Array.from({ length: n }, (_, i) => i).sort((x, y) => a[x][x] - a[y][y]);
  return { vals: order.map(i => a[i][i]), vecs: order.map(i => v.map(r => r[i])) };
};

KKP.buildLayout = function (M, Sm, Cl, opt) {
  opt = opt || {};
  const n = Sm.n, ids = Sm.ids, macro = Cl.macro, sub = Cl.sub, rng = KKP.util.mulberry32(opt.seed || 11), progress = opt.onProgress || (() => { });
  const rR = m => 5 + 5.2 * Math.sqrt(m), rMoon = m => 2 + 3.6 * Math.sqrt(m);
  /* ---- Einheiten ---- */
  const credited = new Map(); M.tracks.forEach((t, tid) => { if (!M.T.has(tid)) return; t.artist_ids.forEach(a => (credited.get(a) || credited.set(a, []).get(a)).push(tid)); });
  const units = [];
  const orbit = (Rh, moons) => {
    if (!moons.length) return { pos: [], F: Rh, rings: [] };
    const rs = moons.map(t => rMoon(M.T.get(t).min)), gap = 3.4, out = [], rings = []; let remaining = moons.map((_, i) => i), inner = Rh + 5, ringNo = 0;
    while (remaining.length) {
      const r0 = rs[remaining[0]], rho = inner + r0 + gap, circ = 2 * Math.PI * rho, taken = [], takenSet = new Set(); let used = 0;
      for (const k of remaining) { const w = 2 * rs[k] + gap; if (used + w <= circ * .985 || !taken.length) { taken.push(k); takenSet.add(k); used += w; } }
      remaining = remaining.filter(k => !takenSet.has(k));
      let totalW = 0; taken.forEach(k => { totalW += 2 * rs[k] + gap; });
      const spacing = (circ - totalW) / taken.length; let ang = rng() * 2 * Math.PI;
      for (const k of taken) { const w = 2 * rs[k] + gap + spacing, aMid = ang + (w / 2) / rho; out.push([moons[k], rho * Math.cos(aMid), rho * Math.sin(aMid), rs[k], ringNo]); ang += w / rho; }
      rings.push(rho); let mx = 0; taken.forEach(k => { mx = Math.max(mx, rs[k]); }); inner = rho + mx + 3; ringNo++;
      if (ringNo > 60) break;
    }
    return { pos: out, F: inner, rings };
  };
  for (let i = 0; i < n; i++) {
    const a = ids[i], ct = credited.get(a) || [], pt = (M.prim.get(a) || []).slice().sort((x, y) => M.T.get(y).min - M.T.get(x).min);
    let kind = ct.length === 1 ? 'solo' : 'hub'; if (kind === 'solo' && pt.length !== 1) kind = 'hub';
    const m = M.A.get(a).min, R = rR(m), u = { i, aid: a, kind, m, R, moons: kind === 'hub' ? pt : [] };
    if (kind === 'hub') { const o = orbit(R, u.moons); u.moon_pos = o.pos; u.F = o.F; u.rings = o.rings; } else { u.moon_pos = []; u.F = R; u.rings = []; }
    units.push(u);
  }
  const F = Float64Array.from(units.map(u => u.F)), PAD = 9;
  const members = []; for (let c = 0; c <= Math.max.apply(null, macro); c++) members.push([]); macro.forEach((c, i) => members[c].push(i));
  const k = members.length;
  /* ---- Kontinente anordnen ---- */
  const link = Array.from({ length: k }, () => new Float64Array(k));
  Cl.sym.forEach((m, i) => m.forEach((w, j) => { if (macro[i] !== macro[j]) link[macro[i]][macro[j]] += w; }));
  let lmax = 1e-9; for (let c = 0; c < k; c++) for (let d = 0; d < k; d++) { if (c !== d) link[c][d] /= Math.sqrt(members[c].length * members[d].length); lmax = Math.max(lmax, link[c][d]); }
  for (let c = 0; c < k; c++) for (let d = 0; d < k; d++) link[c][d] /= lmax;
  const area = members.map(mem => mem.reduce((s, i) => s + Math.PI * F[i] * F[i], 0) * 1.62), crad = area.map(a => Math.sqrt(a / Math.PI));
  const L = link.map((r, c) => Array.from(r, (v, d) => c === d ? 0 : -v)); for (let c = 0; c < k; c++) L[c][c] = link[c].reduce((s, v) => s + v, 0);
  const eig = KKP.jacobiEigen(L);
  const fiedler = eig.vecs[Math.min(1, k - 1)], third = eig.vecs[Math.min(2, k - 1)];
  const sumRad = crad.reduce((s, v) => s + v, 0);
  let cp = members.map((_, c) => [fiedler[c], third[c]]), pm = 1e-9; cp.forEach(p => { pm = Math.max(pm, Math.abs(p[0]), Math.abs(p[1])); });
  cp = cp.map(p => [p[0] / pm * sumRad * .5 + KKP.util.normal(rng) * 20, p[1] / pm * sumRad * .5 + KKP.util.normal(rng) * 20]);
  for (let it = 0; it < 1500; it++) {
    const f = cp.map(() => [0, 0]);
    for (let i = 0; i < k; i++) for (let j = 0; j < k; j++) {
      if (i === j) continue; const dx = cp[i][0] - cp[j][0], dy = cp[i][1] - cp[j][1], dist = Math.hypot(dx, dy) + 1e-6, rest = crad[i] + crad[j] + 40;
      const att = link[i][j] * (dist - rest) / dist; f[i][0] -= att * dx * .05; f[i][1] -= att * dy * .05;
      const ov = Math.max(0, rest - dist); f[i][0] += ov / dist * dx * .5; f[i][1] += ov / dist * dy * .5;
    }
    const sc = 1 - it / 1600; for (let i = 0; i < k; i++) { f[i][0] -= cp[i][0] * .002; f[i][1] -= cp[i][1] * .002; cp[i][0] += f[i][0] * sc; cp[i][1] += f[i][1] * sc; }
  }
  /* ---- Einheiten platzieren ---- */
  const px = new Float64Array(n), py = new Float64Array(n);
  for (let c = 0; c < k; c++) for (const i of members[c]) { const ang = rng() * 2 * Math.PI, rr = crad[c] * Math.sqrt(rng()) * .9; px[i] = cp[c][0] + rr * Math.cos(ang); py[i] = cp[c][1] + rr * Math.sin(ang); }
  const ei = [], ej = [], ew = [];
  for (let i = 0; i < n; i++) { const top = Sm.nb[i].filter(x => x[1] > .03).slice(0, 12); for (const [j, w] of top) { ei.push(i); ej.push(j); ew.push(w); } }
  let wmax = 1e-9; ew.forEach(w => { wmax = Math.max(wmax, w); }); for (let q = 0; q < ew.length; q++) ew[q] /= wmax;
  const E = ei.length, degw = new Float64Array(n); for (let q = 0; q < E; q++) { degw[ei[q]] += ew[q]; degw[ej[q]] += ew[q]; }
  const mass = Float64Array.from(F, f => f + 4), isBig = Uint8Array.from(F, f => f > 55 ? 1 : 0);
  const big = [], small = []; for (let i = 0; i < n; i++) (isBig[i] ? big : small).push(i);
  let Fmax = 0, FsMax = 0; for (let i = 0; i < n; i++) { Fmax = Math.max(Fmax, F[i]); if (!isBig[i]) FsMax = Math.max(FsMax, F[i]); }
  const subMembers = []; for (let s_ = 0; s_ <= Math.max.apply(null, sub); s_++) subMembers.push([]); sub.forEach((s_, i) => subMembers[s_].push(i));
  const dX = new Float64Array(n), dY = new Float64Array(n), CELL = 90;
  const collide = (s, strength) => {
    dX.fill(0); dY.fill(0); const grid = new Map(); const key = (cx, cy) => (cx + 4096) * 8192 + (cy + 4096);
    for (let i = 0; i < n; i++) { const kk = key(Math.floor(px[i] / CELL), Math.floor(py[i] / CELL)); const l = grid.get(kk); if (l) l.push(i); else grid.set(kk, [i]); }
    let maxOv = 0;
    const pair = (i, j) => {
      let dx = px[j] - px[i], dy = py[j] - py[i], dist = Math.hypot(dx, dy);
      if (dist < 1e-6) { dx = KKP.util.normal(rng); dy = KKP.util.normal(rng); dist = Math.hypot(dx, dy); }
      const ov = (F[i] + F[j]) * s + PAD - dist; if (ov <= 0) return; if (ov > maxOv) maxOv = ov;
      const ux = dx / dist, uy = dy / dist, shI = mass[j] / (mass[i] + mass[j]), shJ = 1 - shI, st = strength;
      dX[i] -= ux * ov * shI * st; dY[i] -= uy * ov * shI * st; dX[j] += ux * ov * shJ * st; dY[j] += uy * ov * shJ * st;
    };
    const scan = (i, r, filt) => {
      const x0 = Math.floor((px[i] - r) / CELL), x1 = Math.floor((px[i] + r) / CELL), y0 = Math.floor((py[i] - r) / CELL), y1 = Math.floor((py[i] + r) / CELL);
      for (let cx = x0; cx <= x1; cx++) for (let cy = y0; cy <= y1; cy++) { const l = grid.get(key(cx, cy)); if (!l) continue; for (let q = 0; q < l.length; q++) { const j = l[q]; if (j !== i && filt(j)) pair(i, j); } }
    };
    for (const i of small) scan(i, (F[i] + FsMax) * s + PAD, j => !isBig[j] && j > i);
    for (const b of big) scan(b, (F[b] + Fmax) * s + PAD, j => !isBig[j] || j > b);
    for (let i = 0; i < n; i++) { px[i] += dX[i]; py[i] += dY[i]; }
    return maxOv;
  };
  const iters = opt.iters || 1800, growEnd = Math.floor(iters * .65), t0 = Date.now();
  for (let it = 0; it < iters; it++) {
    const prog = Math.min(1, it / growEnd); let s = .28 + .72 * prog; if (it >= growEnd) s = 1;
    if (it < growEnd + 200) {
      const kc = it < growEnd ? .05 : .02, stX = new Float64Array(n), stY = new Float64Array(n);
      for (let q = 0; q < E; q++) {
        const i = ei[q], j = ej[q], dx = px[j] - px[i], dy = py[j] - py[i], dist = Math.hypot(dx, dy) + 1e-6, rest = (F[i] + F[j]) * s + PAD, stretch = Math.max(dist - rest, 0), f = stretch * ew[q] * kc / dist;
        stX[i] += dx * f; stY[i] += dy * f; stX[j] -= dx * f; stY[j] -= dy * f;
      }
      for (let i = 0; i < n; i++) { const dmp = Math.max(1, degw[i] * kc / .7); stX[i] /= dmp; stY[i] /= dmp; }
      for (let c = 0; c < k; c++) {
        const mem = members[c]; let sw = 0, sx = 0, sy = 0;
        for (const i of mem) { const w = F[i] * F[i]; sw += w; sx += px[i] * w; sy += py[i] * w; }
        sx /= sw; sy /= sw;
        for (const i of mem) {
          const dx = px[i] - cp[c][0], dy = py[i] - cp[c][1], dd = Math.hypot(dx, dy) + 1e-6, lim = crad[c] * 1.02 - F[i] * .35, out = Math.max(dd - lim, 0);
          stX[i] -= dx / dd * out * .1; stY[i] -= dy / dd * out * .1; stX[i] += (sx - px[i]) * .004; stY[i] += (sy - py[i]) * .004;
        }
      }
      for (const sc of subMembers) {
        if (sc.length < 3) continue; let sw = 0, sx = 0, sy = 0; for (const i of sc) { const w = F[i] * F[i]; sw += w; sx += px[i] * w; sy += py[i] * w; } sx /= sw; sy /= sw;
        const g = it < growEnd ? .016 : .008; for (const i of sc) { stX[i] += (sx - px[i]) * g; stY[i] += (sy - py[i]) * g; }
      }
      const damp = 1 - .5 * prog;
      for (let i = 0; i < n; i++) { px[i] += (stX[i] - px[i] * .0012) * damp; py[i] += (stY[i] - py[i] * .0012) * damp; }
    }
    for (let r = 0; r < 3; r++) collide(s, 1);
    if (it % 100 === 0) progress('layout', it / iters);
  }
  for (let r = 0; r < 4000; r++) { if (collide(1, 1) < .4) break; }
  /* Schwerpunkt, Hauptachse waagerecht */
  let sw = 0, sx = 0, sy = 0; for (let i = 0; i < n; i++) { const w = F[i] * F[i]; sw += w; sx += px[i] * w; sy += py[i] * w; } sx /= sw; sy /= sw;
  for (let i = 0; i < n; i++) { px[i] -= sx; py[i] -= sy; }
  let cxx = 0, cxy = 0, cyy = 0; for (let i = 0; i < n; i++) { const w = F[i] * F[i]; cxx += w * px[i] * px[i]; cxy += w * px[i] * py[i]; cyy += w * py[i] * py[i]; } cxx /= sw; cxy /= sw; cyy /= sw;
  const ang = .5 * Math.atan2(2 * cxy, cxx - cyy), ca = Math.cos(-ang), sa = Math.sin(-ang);
  for (let i = 0; i < n; i++) { const x = px[i], y = py[i]; px[i] = ca * x - sa * y; py[i] = sa * x + ca * y; }
  const cos2 = (x, y) => [ca * x - sa * y, sa * x + ca * y], cpr = cp.map(p => { const q = cos2(p[0] - sx, p[1] - sy); return q; });
  return { units, px, py, F, cpos: cpr, crad, fiedler, link, ms: Date.now() - t0 };
};

/* ---------- p07: Benennung (DE/EN) und Farben (OKLCH) ---------- */
KKP.naming = (function () {
  /* Tag -> [Deutsch, Englisch]; alles andere wird kapitalisiert */
  const TAGS = {
    'german indie': ['Deutsch-Indie', 'German Indie'], 'german indie pop': ['Deutsch-Indiepop', 'German Indie Pop'], 'neue deutsche welle': ['Neue Deutsche Welle', 'Neue Deutsche Welle'],
    'german pop': ['Deutschpop', 'German Pop'], 'german hip hop': ['Deutschrap', 'German Hip-Hop'], 'hip-hop/rap': ['Hip-Hop', 'Hip-Hop'], 'lo-fi': ['Lo-Fi', 'Lo-Fi'],
    'lo-fi beats': ['Lo-Fi Beats', 'Lo-Fi Beats'], 'lo-fi hip hop': ['Lo-Fi Hip-Hop', 'Lo-Fi Hip-Hop'], 'jazz beats': ['Jazz Beats', 'Jazz Beats'], 'darkwave': ['Darkwave', 'Darkwave'],
    'post-punk': ['Post-Punk', 'Post-Punk'], 'cold wave': ['Cold Wave', 'Cold Wave'], 'dream pop': ['Dream Pop', 'Dream Pop'], 'shoegaze': ['Shoegaze', 'Shoegaze'], 'slowcore': ['Slowcore', 'Slowcore'],
    'midwest emo': ['Midwest Emo', 'Midwest Emo'], 'indie rock': ['Indie-Rock', 'Indie Rock'], 'lo-fi indie': ['Lo-Fi Indie', 'Lo-Fi Indie'], 'indie pop': ['Indie-Pop', 'Indie Pop'],
    'bedroom pop': ['Bedroom Pop', 'Bedroom Pop'], 'singer/songwriter': ['Singer-Songwriter', 'Singer-Songwriter'], 'synthwave': ['Synthwave', 'Synthwave'], 'witch house': ['Witch House', 'Witch House'],
    'phonk': ['Phonk', 'Phonk'], 'drift phonk': ['Drift Phonk', 'Drift Phonk'], 'electroclash': ['Electroclash', 'Electroclash'], 'vaporwave': ['Vaporwave', 'Vaporwave'],
    'breakcore': ['Breakcore', 'Breakcore'], 'jungle': ['Jungle', 'Jungle'], 'speedcore': ['Speedcore', 'Speedcore'], 'breakbeat': ['Breakbeat', 'Breakbeat'],
    'hyperpop': ['Hyperpop', 'Hyperpop'], 'nightcore': ['Nightcore', 'Nightcore'], 'eurodance': ['Eurodance', 'Eurodance'], 'europop': ['Europop', 'Europop'],
    'hypertechno': ['Hypertechno', 'Hypertechno'], 'tekno': ['Tekno', 'Tekno'], 'techno': ['Techno', 'Techno'], 'edm': ['EDM', 'EDM'], 'dance': ['Dance', 'Dance'],
    'city pop': ['City Pop', 'City Pop'], 'j-pop': ['J-Pop', 'J-Pop'], 'j-rock': ['J-Rock', 'J-Rock'], 'anime': ['Anime', 'Anime'], 'soundtrack': ['Soundtrack', 'Soundtrack'],
    'emo rap': ['Emo-Rap', 'Emo Rap'], 'cloud rap': ['Cloud Rap', 'Cloud Rap'], 'horrorcore': ['Horrorcore', 'Horrorcore'], 'hardcore hip hop': ['Hardcore Hip-Hop', 'Hardcore Hip-Hop'],
    'r&b/soul': ['R&B & Soul', 'R&B & Soul'], 'r&b': ['R&B', 'R&B'], 'neo soul': ['Neo Soul', 'Neo Soul'], 'jazz': ['Jazz', 'Jazz'], 'adult standards': ['Swing & Standards', 'Swing & Standards'],
    'big band': ['Big Band', 'Big Band'], 'hard rock': ['Hard Rock', 'Hard Rock'], 'classic rock': ['Classic Rock', 'Classic Rock'], 'nu metal': ['Nu Metal', 'Nu Metal'],
    'alternative metal': ['Alternative Metal', 'Alternative Metal'], 'alternative rock': ['Alternative Rock', 'Alternative Rock'], 'glam rock': ['Glam Rock', 'Glam Rock'],
    'visual kei': ['Visual Kei', 'Visual Kei'], 'new wave': ['New Wave', 'New Wave'], 'madchester': ['Madchester', 'Madchester'], 'art pop': ['Art Pop', 'Art Pop'],
    'baroque pop': ['Baroque Pop', 'Baroque Pop'], 'indie folk': ['Indie Folk', 'Indie Folk'], 'folk pop': ['Folk Pop', 'Folk Pop'], 'folk': ['Folk', 'Folk'], 'synthpop': ['Synthpop', 'Synthpop'],
    'ambient': ['Ambient', 'Ambient'], 'dark ambient': ['Dark Ambient', 'Dark Ambient'], 'electronic': ['Elektronik', 'Electronic'], 'melodic rap': ['Melodic Rap', 'Melodic Rap'],
    'rage rap': ['Rage Rap', 'Rage Rap'], 'french indie pop': ['French Indie-Pop', 'French Indie Pop'], 'french pop': ['French Pop', 'French Pop'], 'french house': ['French House', 'French House'],
    'jangle pop': ['Jangle Pop', 'Jangle Pop'], 'dubstep': ['Dubstep', 'Dubstep'], 'downtempo': ['Downtempo', 'Downtempo'], 'rally house': ['Rally House', 'Rally House'],
    'german trap': ['German Trap', 'German Trap'], 'german hyperpop': ['German Hyperpop', 'German Hyperpop'], 'anime rap': ['Anime-Rap', 'Anime Rap'], 'pop': ['Pop', 'Pop'],
    'rock': ['Rock', 'Rock'], 'alternative': ['Alternative', 'Alternative'], 'indie': ['Indie', 'Indie'], 'disco': ['Disco', 'Disco'], 'musicals': ['Musical', 'Musical'],
    'christmas': ['Weihnachtliches', 'Christmas'], 'blues': ['Blues', 'Blues'], 'soul': ['Soul', 'Soul'], 'country': ['Country', 'Country'], 'reggae': ['Reggae', 'Reggae'], 'latin': ['Latin', 'Latin'],
    'k-pop': ['K-Pop', 'K-Pop'], 'metal': ['Metal', 'Metal'], 'punk': ['Punk', 'Punk'], 'house': ['House', 'House'], 'trap': ['Trap', 'Trap'], 'classical': ['Klassik', 'Classical'], 'schlager': ['Schlager', 'Schlager'],
    'afrobeats': ['Afrobeats', 'Afrobeats'], 'reggaeton': ['Reggaeton', 'Reggaeton'], 'funk': ['Funk', 'Funk'], 'gospel': ['Gospel', 'Gospel'], 'grunge': ['Grunge', 'Grunge'], 'ska': ['Ska', 'Ska']
  };
  Object.assign(TAGS, {
    'french hip hop': ['Französischer Rap', 'French Hip-Hop'], 'spanish hip hop': ['Spanischer Rap', 'Spanish Hip-Hop'], 'latin pop': ['Latin Pop', 'Latin Pop'],
    "jungle/drum'n'bass": ['Jungle & Drum’n’Bass', 'Jungle & Drum’n’Bass'], 'hip-hop': ['Hip-Hop', 'Hip-Hop'], 'rap': ['Rap', 'Rap']
  });
  const title = t => t.replace(/(^|[\s\-\/&.])([a-zäöü])/g, (m, p, c) => p + c.toUpperCase());
  const pretty = (tag, lang) => { const e = TAGS[tag]; return e ? e[lang === 'en' ? 1 : 0] : title(tag); };
  const related = (a, b) => a.includes(b) || b.includes(a);
  /* Oberbegriff -> Wortmuster seiner Unterarten: steht schon ein passender spezifischer Tag im Namen, entfaellt der Oberbegriff ("Lo-Fi Hip-Hop & Hip-Hop" -> "Lo-Fi Hip-Hop") */
  const ELEC = /electro|techno|house|trance|dubstep|drum|jungle|breakcore|hardstyle|ambient|synth|wave|idm|dance|edm|nightcore|hyperpop|tekno|phonk|eurodance|europop|breakbeat|speedcore|vapor|downtempo/;
  const FAMILY = {
    'hip-hop/rap': /hip.?hop|\brap\b|trap|drill|horrorcore|phonk|grime|boom bap|crunk|cloud rap/, 'pop': /\bpop\b|schlager|disco|europop|eurodance|synthpop|hyperpop|city pop/, 'rock': /rock|metal|punk|grunge|\bemo\b|hardcore|shoegaze|slowcore|britpop|madchester/,
    'alternative': /alternative|indie|shoegaze|post-punk|slowcore|dream pop|\bemo\b|new wave|darkwave|cold wave|goth|britpop|jangle|math rock|midwest|art pop|art rock|neue deutsche welle|madchester|lo-fi indie/, 'electronic': ELEC, 'dance': ELEC,
    'r&b/soul': /r&b|\bsoul\b|funk|motown/, 'singer/songwriter': /folk|singer|acoustic/, 'soundtrack': /soundtrack|\bscore\b|anime|game|musical|\bost\b/, 'jazz': /jazz|swing|big band|bebop|adult standards/, 'indie': /indie|shoegaze|dream pop|slowcore|jangle|bedroom/, 'folk': /folk/, 'metal': /metal/, 'punk': /punk/
  };
  const covered = (g, pick, m) => { const rx = FAMILY[g]; return !!rx && pick.some(p => p !== g && !FAMILY[p] && rx.test(p) && (m.get(p) || 0) >= .6 * (m.get(g) || 0)); };   // nur wenn der spezifische Tag fast alle Mitglieder des Oberbegriffs traegt

  /* Farbe: OKLCH -> sRGB-Hex */
  function oklch(L, C, h) {
    const a = C * Math.cos(h * Math.PI / 180), b = C * Math.sin(h * Math.PI / 180);
    const l_ = L + .3963377774 * a + .2158037573 * b, m_ = L - .1055613458 * a - .0638541728 * b, s_ = L - .0894841775 * a - 1.2914855480 * b;
    const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
    const r = 4.0767416621 * l - 3.3077115913 * m + .2309699292 * s, g = -1.2684380046 * l + 2.6097574011 * m - .3413193965 * s, bb = -.0041960863 * l - .7034186147 * m + 1.7076147010 * s;
    const gam = x => { x = Math.max(0, Math.min(1, x)); return x <= .0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - .055; };
    return '#' + [r, g, bb].map(v => Math.round(gam(v) * 255).toString(16).padStart(2, '0')).join('');
  }

  /* Gruppen (Regionen/Szenen) benennen: distinktive Tags nach Anteil x Seltenheit ueber die Gruppen */
  function nameGroups(groups, M, Sm, opt) {
    opt = opt || {}; const nGroups = groups.length, maxTags = opt.maxTags || 2, minFrac = opt.minFrac ?? .1, dfThr = opt.dfThr ?? .15;
    const tagsOf = i => { const a = M.artists.get(Sm.ids[i]); return a.tags2 || a.genres; };          // tags2: Genres + aus der Sprache abgeleitete Tags
    const fr = groups.map(mem => { const c = new Map(); mem.forEach(i => new Set(tagsOf(i)).forEach(g => c.set(g, (c.get(g) || 0) + 1))); const o = new Map(); c.forEach((v, g) => o.set(g, v / mem.length)); return o; });
    const df = new Map(); fr.forEach(m => m.forEach((f, g) => { if (f >= dfThr) df.set(g, (df.get(g) || 0) + 1); }));
    return fr.map((m, gi) => {
      /* Nur Tags, die mehrere Mitglieder tragen (bei >= 8 Artists mindestens 2); schwach verbreitete Tags verlieren an Gewicht, damit keine Ausreisser-Tags (ein einzelner "Manele"-Artist) den Namen bestimmen */
      const size = groups[gi].length, minCnt = size >= 8 ? 2 : 1, sup = f => Math.min(1, f / (opt.supFrac ?? .35)), sc = ([g, f]) => f * sup(f) * Math.log((nGroups + 1) / ((df.get(g) || 0) + 1));
      const cand = Array.from(m).filter(([, f]) => f >= minFrac && f * size >= minCnt - 1e-9).sort((a, b) => sc(b) - sc(a));
      const pick = []; for (const [g] of cand) { if (pick.some(p => related(p, g))) continue; pick.push(g); if (pick.length >= maxTags + 2) break; }
      return pick.filter(g => !covered(g, pick, m)).slice(0, maxTags);
    });
  }
  const joinNames = (arr, lang) => arr.length <= 1 ? (arr[0] || '') : arr.slice(0, -1).join(', ') + ' & ' + arr[arr.length - 1];
  return { TAGS, pretty, oklch, nameGroups, joinNames };
})();

/* ---------- p08: Export -> Datenstruktur der Karte (Port von export.py, ohne Bild-Atlas: Bilder lädt der Browser) ---------- */
KKP.buildData = function (M, Sm, Cl, Ly, opt) {
  opt = opt || {};
  const NM = KKP.naming, n = Sm.n, ids = Sm.ids, macro = Cl.macro, sub = Cl.sub, mins = Sm.mins, px = Ly.px, py = Ly.py, F = Ly.F, units = Ly.units;
  const A = M.A, T = M.T, B = M.B, artists = M.artists, tracks = M.tracks, albums = M.albums;
  const nreg = Math.max.apply(null, macro) + 1, nsub = Math.max.apply(null, sub) + 1, day = ts => Math.floor(ts / 86400000);
  const r1 = v => Math.round(v * 10) / 10, r2 = v => Math.round(v * 100) / 100;
  const byMin = mem => mem.slice().sort((a, b) => mins[b] - mins[a]);

  /* ---- Kontinente ---- */
  const regMem = Array.from({ length: nreg }, () => []); macro.forEach((c, i) => regMem[c].push(i));
  const regTags = NM.nameGroups(regMem, M, Sm, { maxTags: 3, minFrac: .12, dfThr: .15 });
  const centroid = mem => { let w = 0, x = 0, y = 0; mem.forEach(i => { const q = F[i] * F[i]; w += q; x += px[i] * q; y += py[i] * q; }); return [x / w, y / w]; };
  const reg = regMem.map((mem, c) => {
    const top = byMin(mem), anchor = artists.get(ids[top[0]]).name, tg = regTags[c];
    const name = tg.length ? NM.joinNames(tg.map(t => NM.pretty(t, 'de'))) : (opt.lang === 'en' ? 'Other sounds' : 'Weitere Klänge'), en = tg.length ? NM.joinNames(tg.map(t => NM.pretty(t, 'en'))) : 'Other sounds';
    const [cx, cy] = centroid(mem);
    return { id: c, name, en, sub: top.slice(0, 3).map(i => artists.get(ids[i]).name).join(' · '), anchor, cx: r1(cx), cy: r1(cy), rad: r1(Math.sqrt(mem.reduce((s, i) => s + F[i] * F[i], 0) / .62)), n: mem.length };
  });
  /* Gleiche Namen unterscheidbar machen: die zwei meistgehoerten Artists in Klammern (statt "Hip-Hop 2", "Hip-Hop 3") */
  const disambiguate = (list, keyOf) => {
    const cnt = new Map(); list.forEach(o => { const k = keyOf(o) + '|' + o.name; cnt.set(k, (cnt.get(k) || 0) + 1); });
    list.forEach(o => { if (cnt.get(keyOf(o) + '|' + o.name) > 1) { const t2 = o.sub.split(' · ').slice(0, 2).join(', '); o.name += ' (' + t2 + ')'; o.en += ' (' + t2 + ')'; } });
  };
  disambiguate(reg, () => 0);
  /* ---- Szenen ---- */
  const scMem = Array.from({ length: nsub }, () => []); sub.forEach((s, i) => scMem[s].push(i));
  const scTags = NM.nameGroups(scMem, M, Sm, { maxTags: 2, minFrac: .1, dfThr: .15 });
  const scenes = scMem.map((mem, s) => {
    const r = macro[mem[0]], tg = scTags[s];
    const nameDe = tg.length ? tg.map(t => NM.pretty(t, 'de')).join(' · ') : 'Weitere Klänge', nameEn = tg.length ? tg.map(t => NM.pretty(t, 'en')).join(' · ') : 'Other sounds';
    const [cx, cy] = centroid(mem);
    return { id: s, reg: r, name: nameDe, en: nameEn, sub: byMin(mem).slice(0, 3).map(i => artists.get(ids[i]).name).join(' · '), cx: r1(cx), cy: r1(cy), rad: r1(Math.sqrt(mem.reduce((q, i) => q + F[i] * F[i], 0) / .62)), n: mem.length };
  });
  disambiguate(scenes, o => o.reg);
  /* ---- Farben ---- */
  const order = Array.from({ length: nreg }, (_, c) => c).sort((a, b) => Ly.fiedler[a] - Ly.fiedler[b]);
  reg.forEach(r => { const pos = order.indexOf(r.id); r.hue = (12 + 318 * pos / Math.max(1, nreg - 1)) % 360; r.color = NM.oklch(.78, .13, r.hue); });
  const hv = reg.map(r => [Math.cos(r.hue * Math.PI / 180), Math.sin(r.hue * Math.PI / 180)]);
  const artCol = ids.map((_, i) => {
    const own = macro[i], cross = new Array(nreg).fill(0); let tot = 0;
    Sm.nb[i].slice(0, 14).forEach(([j, w]) => { if (w > .02) { cross[macro[j]] += w; tot += w; } });
    let vx = hv[own][0], vy = hv[own][1];
    if (tot > 0) cross.forEach((v, c) => { if (c !== own) { vx += v / tot * hv[c][0] * .85; vy += v / tot * hv[c][1] * .85; } });
    let h = (Math.atan2(vy, vx) * 180 / Math.PI + 360) % 360; const sc = sub[i];
    h = (h + (((sc * 37) % 19) - 9) + 360) % 360;
    return NM.oklch(.74 + .06 * (((sc * 53) % 7) / 6 - .5), .125 + .03 * (((sc * 29) % 5) / 4), h);
  });

  /* ---- Tracks / Alben ---- */
  const tidList = Array.from(T.keys()).sort((a, b) => T.get(b).min - T.get(a).min), tidx = new Map(tidList.map((t, k) => [t, k]));
  const albList = Array.from(B.keys()).sort((a, b) => B.get(b).min - B.get(a).min), aidx = new Map(albList.map((b, k) => [b, k]));
  const bestAlb = tid => { const m = M.trAlb.get(tid); if (!m) return undefined; let bb, bc = -1; m.forEach((c, b) => { if (c > bc) { bc = c; bb = b; } }); return bb; };
  const NB_TIER = opt.nTierB || 450, NC_TIER = opt.nTierC || 60;
  const topArt = Array.from({ length: Math.min(NB_TIER, n) }, (_, i) => i), topAlb = [], seen = new Set();
  for (const tid of tidList) { const b = bestAlb(tid); if (b !== undefined && !seen.has(b) && aidx.has(b)) { seen.add(b); topAlb.push(b); } if (topAlb.length >= NB_TIER) break; }
  const hiIndex = new Map(), hcIndex = new Map(); let bi = 0, ci = 0;
  topArt.forEach(i => { hiIndex.set('a' + i, bi++); if (i < NC_TIER) hcIndex.set('a' + i, ci++); });
  topAlb.forEach((b, r) => { hiIndex.set('b' + aidx.get(b), bi++); if (r < NC_TIER) hcIndex.set('b' + aidx.get(b), ci++); });
  const imgRef = url => { if (!url) return ''; if (url.includes('i.scdn.co/image/')) return url.split('/image/')[1].slice(16); if (url.includes('mzstatic.com')) return url.replace(/\/\d+x\d+bb\.(jpg|png)/, '/{S}x{S}bb.jpg'); return url; };
  const sparse = g => { const o = []; Array.from(g.dy.keys()).sort((a, b) => a - b).forEach(k => { const e = g.dy.get(k); o.push(k, r1(e[0]), e[1]); }); return o; };
  const tagList = Array.from(new Set(ids.flatMap(a => artists.get(a).genres))).sort(), tagIdx = new Map(tagList.map((t, k) => [t, k]));

  const art = ids.map((a, i) => {
    const u = units[i], ag = A.get(a), am = artists.get(a);
    const nb = Sm.nb[i].slice(0, 10).filter(x => x[1] > .04).slice(0, 8).map(([j, w]) => { const [st, co, cl] = Sm.parts(i, j); return [j, r2(w), r2(st), r2(co), cl ? 1 : 0]; });
    return { n: am.name, x: r1(px[i]), y: r1(py[i]), R: r1(u.R), F: r1(u.F), k: u.kind === 'hub' ? 0 : 1, r: macro[i], s: sub[i], m: r1(ag.min), st: ag.n, c: artCol[i], h: hiIndex.has('a' + i) ? hiIndex.get('a' + i) : -1, hc: hcIndex.has('a' + i) ? hcIndex.get('a' + i) : -1,
      g: am.genres.map(t => tagIdx.get(t)), sp: am.spotify || '', f: day(ag.first), l: day(ag.last), dy: sparse(ag),
      tr: (M.prim.get(a) || []).slice().sort((x, y) => T.get(y).min - T.get(x).min).map(t => tidx.get(t)), ft: (M.feat.get(a) || []).slice().sort((x, y) => T.get(y).min - T.get(x).min).map(t => tidx.get(t)),
      nb, u: imgRef(am.img), fo: am.followers, po: am.pop };
  });
  const trk = tidList.map(tid => {
    const t = tracks.get(tid), ag = T.get(tid), pa = Sm.idx.get(t.artist_ids[0]); const u = pa !== undefined ? units[pa] : null, b = bestAlb(tid);
    const rec = { n: t.name, a: t.artist_ids.map(x => Sm.idx.get(x)).filter(x => x !== undefined), al: b !== undefined && aidx.has(b) ? aidx.get(b) : -1, m: r1(ag.min), st: ag.n, f: day(ag.first), l: day(ag.last), dy: sparse(ag), sp: t.spotify || '', pv: t.preview || '', d: Math.round(t.dur / 1000), ex: t.explicit ? 1 : 0, p: pa === undefined ? -1 : pa };
    if (u && u.kind === 'solo') { rec.x = r1(px[pa]); rec.y = r1(py[pa]); rec.r = r1(u.R); rec.ring = -1; }
    return rec;
  });
  units.forEach(u => { if (u.kind !== 'hub') return; u.moon_pos.forEach(([t, dx, dy, r, ring]) => { const rec = trk[tidx.get(t)]; rec.x = r1(px[u.i] + dx); rec.y = r1(py[u.i] + dy); rec.r = r1(r); rec.ring = ring; }); });
  trk.forEach(rec => { if (rec.x === undefined) { const pa = rec.p >= 0 ? rec.p : 0; rec.x = r1(px[pa]); rec.y = r1(py[pa]); rec.r = 2; rec.ring = -1; } });
  // Tracks, deren primaerer Artist ausserhalb der Karte liegt (Begrenzung der Artist-Zahl), werden entfernt
  const keep = trk.map(t => t.p >= 0); const remap = new Map(); let kk = 0; keep.forEach((k, i) => { if (k) remap.set(i, kk++); });
  const trkF = trk.filter((_, i) => keep[i]);
  trkF.forEach(t => { t.t = t.al >= 0 ? n + t.al : 0; });
  art.forEach(a => { a.tr = a.tr.map(k => remap.get(k)).filter(k => k !== undefined); a.ft = a.ft.map(k => remap.get(k)).filter(k => k !== undefined); });

  const alb = albList.map((b, k) => {
    const ag = B.get(b), al = albums.get(b) || {}, extra = (opt.albumsExtra || {})[b] || {};
    const tl = []; trkF.forEach((t, q) => { if (t.al === k) tl.push(q); }); tl.sort((x, y) => trkF[y].m - trkF[x].m);
    const pa = tl.length ? trkF[tl[0]].p : -1;
    return { n: al.name || extra.name || '?', a: pa, m: r1(ag.min), st: ag.n, t: n + k, tr: tl, y: al.year || extra.year || 0, sp: al.spotify || extra.spotify || '', u: imgRef(al.img || extra.img), h: hiIndex.has('b' + k) ? hiIndex.get('b' + k) : -1, hc: hcIndex.has('b' + k) ? hcIndex.get('b' + k) : -1, f: day(ag.first), l: day(ag.last), dy: sparse(ag) };
  });
  const artAlb = Array.from({ length: n }, () => []); alb.forEach((a, k) => { if (a.a >= 0) artAlb[a.a].push(k); });
  art.forEach((a, i) => { a.al = artAlb[i].sort((x, y) => alb[y].m - alb[x].m); });

  /* ---- Kennzahlen je Kontinent / Szene ---- */
  const regMin = new Array(nreg).fill(0), scMin = new Array(nsub).fill(0); let totMin = 0;
  trkF.forEach(t => { regMin[macro[t.p]] += t.m; scMin[sub[t.p]] += t.m; totMin += t.m; });
  reg.forEach(r => { r.m = r1(regMin[r.id]); r.share = Math.round(regMin[r.id] / totMin * 1e4) / 1e4; r.top = byMin(regMem[r.id]).slice(0, 8); r.sc = scenes.filter(s => s.reg === r.id).map(s => s.id); const tt = []; trkF.forEach((t, k) => { if (tt.length < 8 && macro[t.p] === r.id) tt.push(k); }); r.tt = tt; });
  scenes.forEach(s => { s.m = r1(scMin[s.id]); });
  /* ---- Konstellations-Kanten ---- */
  const es = new Set(); art.forEach((a, i) => a.nb.slice(0, 2).forEach(([j, w]) => { if (w >= .12) es.add(Math.min(i, j) + ',' + Math.max(i, j)); }));
  const edges = Array.from(es).map(s => s.split(',').map(Number)).sort((a, b) => a[0] - b[0] || a[1] - b[1]);

  /* ---- HUD ---- */
  const nd = M.nd, dayMinArr = new Array(nd).fill(0), dayNArr = new Array(nd).fill(0);
  M.dayMin.forEach((v, k) => { dayMinArr[k] = r1(v); }); M.dayN.forEach((v, k) => { dayNArr[k] = v; });
  const prof = M.profile, iso = d => new Date((M.day0 + d) * 86400000).toISOString().slice(0, 10);
  const hud = { user: prof.customId || prof.displayName || String(prof.id), name: prof.displayName, bio: (prof.profile || {}).bio || '', streams: M.streamsCount, minutes: Math.round(M.totalMin), tracks: T.size, artists: n, albums: B.size,
    first: day(M.firstTs), last: day(M.lastTs), lastTs: M.lastTs, tz: M.tz, src: prof.id === 'spotify-export' ? 'spotify' : 'statsfm', months: [], month_min: [], month_n: [], day0: M.day0, nd, day_min: dayMinArr, day_n: dayNArr, hour: M.hour.map(Math.round), weekday: M.weekday.map(Math.round),
    best_day: [iso(M.bestDay[0]), Math.round(M.bestDay[1])], longest: { minutes: Math.round(M.longest.minutes), n: M.longest.n, date: new Date(M.longest.endTs * 1000).toISOString().slice(0, 10) },
    genres: M.topGenres.slice(0, 14).map(g => ({ n: NM.pretty((g.genre || {}).tag || '?', 'de'), m: Math.round(g.playedMs / 60000), st: g.streams })), generated: new Date().toISOString().slice(0, 10), tz: M.tz };
  if (!hud.genres.length) { const gm = new Map(); art.forEach(a => a.g.forEach(g => gm.set(g, (gm.get(g) || 0) + a.m))); hud.genres = Array.from(gm).sort((a, b) => b[1] - a[1]).slice(0, 14).map(([g, m]) => ({ n: NM.pretty(tagList[g], 'de'), m: Math.round(m), st: 0 })); }

  /* ---- Atlas-Plan (Bilder lädt der Browser und packt sie wie die fertigen Atlanten) ---- */
  const nbTot = alb.length, rowsA = Math.ceil((n + nbTot) / 100), lenB = bi, lenC = ci;
  const atlas = { A: { size: [4000, Math.max(1, rowsA) * 40], tile: 40, cols: 100 }, B: { size: [24 * 96, Math.max(1, Math.ceil(lenB / 24)) * 96], tile: 96, cols: 24 }, C: { size: [12 * 192, Math.max(1, Math.ceil(lenC / 12)) * 192], tile: 192, cols: 12 } };
  const plan = { B: topArt.map(i => ['a', i]).concat(topAlb.map(b => ['b', aidx.get(b)])), C: topArt.filter(i => i < NC_TIER).map(i => ['a', i]).concat(topAlb.slice(0, NC_TIER).map(b => ['b', aidx.get(b)])) };
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (let i = 0; i < n; i++) { x0 = Math.min(x0, px[i]); x1 = Math.max(x1, px[i]); y0 = Math.min(y0, py[i]); y1 = Math.max(y1, py[i]); }
  const D = { hud, regions: reg, scenes, artists: art, tracks: trkF, albums: alb, edges, tags: tagList, atlas, plan, bounds: [x0, y0, x1, y1], missingAlbums: M.missingAlbums };
  if (M.compare) KKP.addCompare(D, M, { ids, tidKeep: tidList.filter((_, i) => keep[i]), albList }, opt);
  return D;
};

/* ---------- p10: Spotify-Datenexport lesen und mit stats.fm-Metadaten (Genres, Cover) anreichern ---------- */
KKP.spotify = (function () {
  const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  const hash = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0) + 1000000000; };

  /* --- ZIP lesen (nur Deflate/Stored, ohne Bibliothek) --- */
  async function readZip(buf) {
    const dv = new DataView(buf), u8 = new Uint8Array(buf); let eocd = -1;
    for (let i = u8.length - 22; i >= Math.max(0, u8.length - 70000); i--) if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
    if (eocd < 0) throw new Error('Keine gültige ZIP-Datei');
    const n = dv.getUint16(eocd + 10, true); let p = dv.getUint32(eocd + 16, true); const out = [];
    for (let k = 0; k < n; k++) {
      if (dv.getUint32(p, true) !== 0x02014b50) break;
      const method = dv.getUint16(p + 10, true), csize = dv.getUint32(p + 20, true), nlen = dv.getUint16(p + 28, true), elen = dv.getUint16(p + 30, true), clen = dv.getUint16(p + 32, true), loff = dv.getUint32(p + 42, true);
      const name = new TextDecoder().decode(u8.subarray(p + 46, p + 46 + nlen)); p += 46 + nlen + elen + clen;
      if (!/\.json$/i.test(name) || !/stream/i.test(name) || /video|podcast/i.test(name)) continue;
      const ho = loff + 30 + dv.getUint16(loff + 26, true) + dv.getUint16(loff + 28, true), data = u8.subarray(ho, ho + csize);
      let bytes;
      if (method === 0) bytes = data; else if (method === 8) { const ds = new DecompressionStream('deflate-raw'), w = ds.writable.getWriter(); w.write(data); w.close(); bytes = new Uint8Array(await new Response(ds.readable).arrayBuffer()); } else continue;
      out.push({ name, text: new TextDecoder().decode(bytes) });
    }
    return out;
  }

  /* --- Verlauf lesen: erweiterter (ts, ms_played, master_metadata_*) und einfacher Export (endTime, msPlayed, artistName, trackName) --- */
  function parse(files) {
    const out = []; let skipped = 0, podcasts = 0;
    for (const f of files) {
      let arr; try { arr = JSON.parse(f.text); } catch (e) { continue; } if (!Array.isArray(arr)) continue;
      for (const it of arr) {
        let ts, ms, track, artist, album, uri;
        if (it.ts !== undefined) { ts = Date.parse(it.ts); ms = it.ms_played; track = it.master_metadata_track_name; artist = it.master_metadata_album_artist_name; album = it.master_metadata_album_album_name; uri = it.spotify_track_uri; }
        else if (it.endTime !== undefined) { ts = Date.parse(String(it.endTime).replace(' ', 'T') + (String(it.endTime).length <= 16 ? ':00Z' : 'Z')); ms = it.msPlayed; track = it.trackName; artist = it.artistName; album = null; uri = null; }
        else continue;
        if (!track || !artist) { podcasts++; continue; }
        if (!(ms >= 30000) || !isFinite(ts)) { skipped++; continue; }
        out.push({ ts, ms, track, artist, album: album || '', uri: uri ? String(uri).replace('spotify:track:', '') : '' });
      }
    }
    out.sort((a, b) => a.ts - b.ts);
    return { entries: out, skipped, podcasts };
  }

  /* --- Anreichern: Artists (Genres, Bild, Spotify-ID) und Cover ueber die stats.fm-Suche --- */
  async function resolve(entries, opt) {
    opt = opt || {}; const P = opt.onProgress || (() => { }), MAXA = opt.maxArtists || 1500, MAXB = opt.maxAlbums || 250;
    const A = new Map(), Tm = new Map(), Bm = new Map();
    for (const e of entries) {
      const ak = norm(e.artist); let a = A.get(ak); if (!a) A.set(ak, a = { key: ak, name: e.artist, ms: 0, n: 0 }); a.ms += e.ms; a.n++;
      const tk = e.uri || ak + '|' + norm(e.track); let t = Tm.get(tk); if (!t) Tm.set(tk, t = { key: tk, name: e.track, ak, album: e.album, uri: e.uri, ms: 0, n: 0 }); t.ms += e.ms; t.n++;
      if (e.album) { const bk = ak + '|' + norm(e.album); let b = Bm.get(bk); if (!b) Bm.set(bk, b = { key: bk, name: e.album, ak, ms: 0, n: 0 }); b.ms += e.ms; b.n++; }
    }
    const artistsTop = Array.from(A.values()).sort((x, y) => y.ms - x.ms).slice(0, MAXA), keep = new Set(artistsTop.map(a => a.key));
    const albumImg = new Map();                                                    // ak|album -> Bild (aus den Suchtreffern der Artists)
    let done = 0; const q = artistsTop.slice();
    const get = opt.get || KKP.statsfm.get;
    const worker = async () => {
      while (q.length) {
        const a = q.shift();
        try {
          const d = await get('/search?query=' + encodeURIComponent(a.name) + '&limit=6'); const it = d.items || {};
          const cands = (it.artists || []).filter(x => norm(x.name) === a.key); cands.sort((x, y) => (y.followers || 0) - (x.followers || 0));
          const m = cands[0] || (it.artists || []).find(x => norm(x.name).startsWith(a.key) || a.key.startsWith(norm(x.name)));
          if (m) { a.meta = m; }
          (it.albums || []).forEach(al => { const ar = (al.artists || [])[0]; if (ar && norm(ar.name) === a.key && al.image) albumImg.set(a.key + '|' + norm(al.name), { id: al.id, image: al.image, spotify: ((al.externalIds || {}).spotify || [])[0] || null }); });
        } catch (e) { if (e && e.code === 'private') throw e; }
        done++; if (done % 15 === 0) P('lookup', done / artistsTop.length);
      }
    };
    await Promise.all(Array.from({ length: opt.concurrency || 8 }, worker));
    /* Cover der wichtigsten Alben, die noch fehlen */
    const albTop = Array.from(Bm.values()).filter(b => keep.has(b.ak)).sort((x, y) => y.ms - x.ms).slice(0, MAXB).filter(b => !albumImg.has(b.key));
    done = 0; const q2 = albTop.slice();
    const worker2 = async () => {
      while (q2.length) {
        const b = q2.shift(); const an = (A.get(b.ak) || {}).name || '';
        try {
          const d = await get('/search?query=' + encodeURIComponent(b.name + ' ' + an) + '&limit=6'); const al = ((d.items || {}).albums || []).find(x => norm(x.name) === norm(b.name));
          if (al && al.image) albumImg.set(b.key, { id: al.id, image: al.image, spotify: ((al.externalIds || {}).spotify || [])[0] || null });
        } catch (e) { }
        done++; if (done % 15 === 0) P('covers', done / Math.max(1, albTop.length));
      }
    };
    await Promise.all(Array.from({ length: opt.concurrency || 8 }, worker2));

    /* --- raw im Format der stats.fm-Pipeline zusammenbauen --- */
    const aid = new Map(), artistObj = new Map(); let nextAid = 1;
    artistsTop.forEach(a => { const id = a.meta ? a.meta.id : hash('a:' + a.key); aid.set(a.key, id); artistObj.set(a.key, { id, name: (a.meta && a.meta.name) || a.name, image: a.meta ? a.meta.image : null, genres: a.meta ? (a.meta.genres || []) : [], followers: a.meta ? a.meta.followers : 0, spotifyPopularity: a.meta ? a.meta.spotifyPopularity : 0, externalIds: a.meta ? a.meta.externalIds : {} }); });
    const topArtists = artistsTop.map(a => ({ artist: artistObj.get(a.key), playedMs: a.ms, streams: a.n }));
    const albumId = new Map(), albumObj = new Map();
    const getAlbum = (ak, name) => {
      if (!name) return null; const bk = ak + '|' + norm(name); let id = albumId.get(bk);
      if (id === undefined) { const im = albumImg.get(bk); id = im ? im.id : hash('b:' + bk); albumId.set(bk, id); albumObj.set(id, { id, name, image: im ? im.image : null }); }
      return albumObj.get(id);
    };
    const trackObj = new Map(), topTracks = [];
    Array.from(Tm.values()).filter(t => keep.has(t.ak)).sort((x, y) => y.ms - x.ms).slice(0, opt.maxTracks || 6000).forEach(t => {
      const ao = artistObj.get(t.ak), al = getAlbum(t.ak, t.album), id = hash('t:' + t.key);
      trackObj.set(t.key, id);
      topTracks.push({ track: { id, name: t.name, artists: [{ id: ao.id, name: ao.name, image: ao.image }], albums: al ? [{ id: al.id, name: al.name, image: al.image }] : [], durationMs: 0, explicit: false, spotifyPopularity: 0, externalIds: { spotify: t.uri ? [t.uri] : [] } }, playedMs: t.ms, streams: t.n });
    });
    const streams = [];
    entries.forEach((e, i) => {
      const ak = norm(e.artist); if (!keep.has(ak)) return; const tk = e.uri || ak + '|' + norm(e.track); const tid = trackObj.get(tk); if (tid === undefined) return;
      const al = getAlbum(ak, e.album);
      streams.push({ id: 's' + i, endTime: new Date(e.ts).toISOString(), playedMs: e.ms, trackId: tid, albumId: al ? al.id : null, artistIds: [aid.get(ak)], trackName: e.track });
    });
    return { profile: { id: 'spotify-export', customId: opt.label || 'Spotify', displayName: opt.label || 'Spotify', image: null, timezone: opt.timezone || (typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC'), profile: { bio: 'Spotify-Datenexport' } }, topArtists, topTracks, topGenres: [], streams, stats: { resolved: artistsTop.filter(a => a.meta).length, total: artistsTop.length } };
  }
  return { parse, resolve, readZip };
})();

/* ---------- p11: Freundes-Vergleich: Daten je Nutzer + Kennzahlen ---------- */
KKP.addCompare = function (D, M, I, opt) {
  const r1 = v => Math.round(v * 10) / 10, per = M.per, nd = M.nd;
  const sparse = g => { const o = []; if (!g) return o; Array.from(g.dy.keys()).sort((a, b) => a - b).forEach(k => { const e = g.dy.get(k); o.push(k, r1(e[0]), e[1]); }); return o; };
  const fill = (o, g) => { const b = (g && g.by) || {}; ['M', 'F'].forEach(u => { const x = b[u]; o['dy' + u] = sparse(x); o['m' + u] = x ? r1(x.min) : 0; o['st' + u] = x ? x.n : 0; }); o.dyB = o.dy; o.mB = o.m; o.stB = o.st; };
  D.artists.forEach((a, i) => fill(a, M.A.get(I.ids[i])));
  D.tracks.forEach((t, k) => fill(t, M.T.get(I.tidKeep[k])));
  D.albums.forEach((b, k) => fill(b, M.B.get(I.albList[k])));
  const arr = (mp, n) => { const o = new Array(n).fill(0); mp.forEach((v, k) => { if (k < n) o[k] = r1(v); }); return o; };
  const H = D.hud, user = u => ({ streams: per[u] ? per[u].streams : 0, minutes: per[u] ? Math.round(per[u].minutes) : 0, hour: per[u] ? per[u].hour.map(Math.round) : new Array(24).fill(0), weekday: per[u] ? per[u].weekday.map(Math.round) : new Array(7).fill(0), day_min: per[u] ? arr(per[u].dayMin, nd) : new Array(nd).fill(0), day_n: per[u] ? arr(per[u].dayN, nd).map(Math.round) : new Array(nd).fill(0) });
  const U = { M: user('M'), F: user('F') };
  ['streams', 'minutes', 'hour', 'weekday', 'day_min', 'day_n'].forEach(k => { H[k + 'B'] = H[k]; H[k + 'M'] = U.M[k]; H[k + 'F'] = U.F[k]; });
  /* Kennzahlen */
  let dot = 0, na = 0, nb = 0, shared = 0, minShared = 0, tot = 0;
  D.artists.forEach(a => { dot += Math.sqrt(a.mM * a.mF); na += a.mM; nb += a.mF; tot += a.mM + a.mF; if (a.mM > 0 && a.mF > 0) { shared++; minShared += Math.min(a.mM, a.mF) * 2; } });
  const cosA = na && nb ? dot / Math.sqrt(na * nb) : 0;                 // Bhattacharyya-Koeffizient der Artist-Anteile
  const tg = u => { const v = new Map(); D.artists.forEach(a => { const w = a['m' + u]; if (w > 0) a.g.forEach(g => v.set(g, (v.get(g) || 0) + w / Math.max(1, a.g.length))); }); return v; };
  const tM = tg('M'), tF = tg('F'); let d2 = 0, n1 = 0, n2 = 0; tM.forEach((v, g) => { n1 += v * v; d2 += v * (tF.get(g) || 0); }); tF.forEach(v => { n2 += v * v; });
  const cosT = n1 && n2 ? d2 / Math.sqrt(n1 * n2) : 0;
  const reg = D.regions.map(r => { let m = 0, f = 0; D.artists.forEach(a => { if (a.r === r.id) { m += a.mM; f += a.mF; } }); return { id: r.id, m: Math.round(m), f: Math.round(f) }; });
  D.compare = { names: [opt.nameMe || H.user, opt.nameFriend || 'Friend'], images: opt.images || [null, null], score: Math.round(100 * (.5 * Math.sqrt(cosA) + .5 * cosT)), cosArtists: Math.round(cosA * 100), cosGenres: Math.round(cosT * 100), shared, sharedShare: tot ? Math.round(minShared / tot * 100) : 0, regions: reg };
};

/* ---------- p09: Gesamtablauf ---------- */
KKP.run = function (raw, opt) {
  opt = opt || {}; const P = opt.onProgress || (() => { });
  const t0 = Date.now(), log = [];
  const step = (name, frac, fn) => { P(name, frac); const t = Date.now(); const r = fn(); log.push([name, Date.now() - t]); return r; };
  const M = step('model', .02, () => KKP.buildModel(raw, opt));
  const Sm = step('similarity', .12, () => KKP.buildSimilarity(M, opt));
  const names = Sm.ids.map(a => M.artists.get(a).name);
  const Cl = step('cluster', .3, () => KKP.buildClusters(Sm, Object.assign({}, opt, { names })));
  const Ly = step('layout', .4, () => KKP.buildLayout(M, Sm, Cl, { seed: opt.seed, iters: opt.iters, onProgress: (k, f) => P('layout', .4 + .5 * f) }));
  const D = step('export', .92, () => KKP.buildData(M, Sm, Cl, Ly, opt));
  D.timing = log; D.totalMs = Date.now() - t0; P('done', 1);
  return D;
};
/* Vergleich zweier Nutzer: Streams beider Profile in ein Modell (IDs sind bei stats.fm global), Aggregation je Nutzer */
KKP.runCompare = function (rawMe, rawFr, opt) {
  opt = Object.assign({}, opt || {}, { compare: true });
  const dedupe = (a, b, key) => { const seen = new Set(a.map(key)); return a.concat(b.filter(x => !seen.has(key(x)))); };
  const streams = rawMe.streams.map(s => Object.assign({}, s, { u: 'M' })).concat(rawFr.streams.map(s => Object.assign({}, s, { u: 'F' }))).sort((a, b) => a.endTime < b.endTime ? -1 : a.endTime > b.endTime ? 1 : 0);
  const raw = { profile: rawMe.profile, topArtists: dedupe(rawMe.topArtists, rawFr.topArtists, x => x.artist.id), topTracks: dedupe(rawMe.topTracks, rawFr.topTracks, x => x.track.id), topGenres: rawMe.topGenres || [], streams };
  opt.nameMe = rawMe.profile.customId || rawMe.profile.displayName; opt.nameFriend = rawFr.profile.customId || rawFr.profile.displayName; opt.images = [rawMe.profile.image || null, rawFr.profile.image || null];
  return KKP.run(raw, opt);
};
if (typeof module !== 'undefined' && module.exports) module.exports = KKP; else root.KKP = KKP;

})(typeof self !== 'undefined' ? self : globalThis);
