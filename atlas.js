/* Atlas-Builder: laedt die Cover aus dem Netz (Spotify-CDN, CORS offen) und packt sie in Sprite-Atlanten wie die fertigen Karten (Kreis fuer Artists, Rundkachel fuer Alben) */
window.KKAtlas = (function () {
  /* Spotify-CDN: der Praefix (16 Hex-Zeichen) bestimmt die Groesse. Apple Music: {S}x{S}bb */
  function imgUrl(ref, kind, px) {
    if (!ref) return null;
    if (/^https?:/.test(ref)) return ref.replace(/\{S\}/g, px >= 300 ? '300' : '120');
    if (kind === 'a') return 'https://i.scdn.co/image/' + (px <= 160 ? 'ab6761610000f178' : px <= 320 ? 'ab67616100005174' : 'ab6761610000e5eb') + ref;
    return 'https://i.scdn.co/image/' + (px <= 64 ? 'ab67616d00004851' : px <= 300 ? 'ab67616d00001e02' : 'ab67616d0000b273') + ref;
  }
  function load(url) {
    return new Promise(res => {
      if (!url) return res(null);
      let tries = 0;
      const go = () => {
        const im = new Image(); im.crossOrigin = 'anonymous'; let done = false;
        const fin = v => { if (done) return; done = true; res(v); };
        im.onload = () => fin(im);
        im.onerror = () => { if (++tries < 2) setTimeout(go, 400); else fin(null); };
        setTimeout(() => { if (!done) { im.src = ''; if (++tries < 2) go(); else fin(null); } }, 15000);
        im.src = url;
      };
      go();
    });
  }
  function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function tilePath(g, x, y, s, shape) {
    g.beginPath();
    if (shape === 'c') g.arc(x + s / 2, y + s / 2, s / 2, 0, 6.2832);
    else { const r = s * .2; g.moveTo(x + r, y); g.arcTo(x + s, y, x + s, y + s, r); g.arcTo(x + s, y + s, x, y + s, r); g.arcTo(x, y + s, x, y, r); g.arcTo(x, y, x + s, y, r); g.closePath(); }
  }
  function drawTile(g, img, x, y, s, shape, label, seed) {
    g.save(); tilePath(g, x, y, s, shape); g.clip();
    if (img && img.naturalWidth) { const m = Math.min(img.naturalWidth, img.naturalHeight); g.imageSmoothingQuality = 'high'; g.drawImage(img, (img.naturalWidth - m) / 2, (img.naturalHeight - m) / 2, m, m, x, y, s, s); }
    else {   // Platzhalter: Verlauf + Anfangsbuchstabe
      const h = hash(String(seed)), r = 40 + (h & 63), gg = 40 + ((h >> 6) & 63), b = 60 + ((h >> 12) & 95);
      const gr = g.createLinearGradient(x, y, x, y + s); gr.addColorStop(0, 'rgb(' + r + ',' + gg + ',' + b + ')'); gr.addColorStop(1, 'rgb(' + (r * 1.5 | 0) + ',' + (gg * 1.4 | 0) + ',' + (b * 1.6 | 0) + ')');
      g.fillStyle = gr; g.fillRect(x, y, s, s); g.fillStyle = 'rgba(235,235,245,.92)'; g.font = '600 ' + (s * .5) + 'px system-ui,sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(((label || '?').trim()[0] || '?').toUpperCase(), x + s / 2, y + s / 2 + s * .03);
    }
    g.restore();
  }
  const toBlob = c => new Promise(res => c.toBlob(b => res(b), 'image/webp', .84));

  async function build(D, onProgress) {
    const n = D.artists.length, nb = D.albums.length, AT = D.atlas;
    const mk = k => { const c = document.createElement('canvas'); c.width = AT[k].size[0]; c.height = AT[k].size[1]; return [c, c.getContext('2d')]; };
    const [cA, gA] = mk('A'), [cB, gB] = mk('B'), [cC, gC] = mk('C');
    const pos = (k, i) => [(i % AT[k].cols) * AT[k].tile, Math.floor(i / AT[k].cols) * AT[k].tile];
    /* Auftraege: je Bild einmal laden, in alle benoetigten Kacheln zeichnen */
    const jobs = new Map();
    const add = (kind, idx, tier, tile) => {
      const key = kind + idx; let j = jobs.get(key);
      if (!j) { const o = kind === 'a' ? D.artists[idx] : D.albums[idx]; j = { kind, idx, o, px: 0, tiles: [] }; jobs.set(key, j); }
      j.px = Math.max(j.px, tier === 'C' ? 320 : tier === 'B' ? (kind === 'a' ? 160 : 300) : (kind === 'a' ? 160 : 64)); j.tiles.push([tier, tile]);
    };
    for (let i = 0; i < n; i++) add('a', i, 'A', i);
    for (let k = 0; k < nb; k++) add('b', k, 'A', n + k);
    D.plan.B.forEach(([kd, i], t) => add(kd, i, 'B', t));
    D.plan.C.forEach(([kd, i], t) => add(kd, i, 'C', t));
    const list = Array.from(jobs.values()).sort((a, b) => b.px - a.px);
    let done = 0, failed = 0; const total = list.length, G = { A: gA, B: gB, C: gC };
    let qi = 0;
    const worker = async () => {
      while (qi < list.length) {
        const j = list[qi++]; const url = imgUrl(j.o.u, j.kind, j.px);
        const im = await load(url); if (!im) failed++;
        for (const [tier, t] of j.tiles) {
          const [x, y] = pos(tier, t), s = AT[tier].tile; drawTile(G[tier], im, x, y, s, j.kind === 'a' ? 'c' : 'r', j.o.n, j.kind + j.idx);
        }
        done++; if (onProgress && (done % 20 === 0 || done === total)) onProgress(done, total);
      }
    };
    await Promise.all(Array.from({ length: 14 }, worker));
    const [bA, bB, bC] = await Promise.all([toBlob(cA), toBlob(cB), toBlob(cC)]);
    return { A: URL.createObjectURL(bA), B: URL.createObjectURL(bB), C: URL.createObjectURL(bC), blobs: { A: bA, B: bB, C: bC }, failed, total };
  }
  return { build, imgUrl };
})();
