/* Web-Worker: rechnet die Karte, damit die Seite waehrenddessen bedienbar bleibt */
importScripts('pipeline.js');
onmessage = e => {
  const { raw, rawFriend, opt } = e.data;
  try {
    const o = Object.assign({}, opt, { onProgress: (k, f) => postMessage({ t: 'p', k, f }) });
    const D = rawFriend ? KKP.runCompare(raw, rawFriend, o) : KKP.run(raw, o);
    postMessage({ t: 'done', D });
  } catch (err) { postMessage({ t: 'err', msg: String(err && err.message || err) }); }
};
