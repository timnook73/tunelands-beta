/* Einstellungen der Beta (eine Stelle fuer alles, was sich vor dem Veroeffentlichen aendert).
   beta     : zeigt die "Beta"-Marke in Startseite und Karte.
   feedback : Link zum Feedback-Formular (Google Forms, Tally, ...). Ein Link fuer beide Sprachen oder { de: '...', en: '...' }:
              dann oeffnet die Karte das Formular in der gerade gewaehlten Sprache. Leer = der Knopf bleibt unsichtbar.
   donate   : Link zur Spendenseite (Ko-fi, Buy Me a Coffee, PayPal.me, ...), gleiche Schreibweisen. Leer = der Knopf bleibt unsichtbar.
   demo     : Link zur Demo-Karte auf der Startseite (Standard: deine Karte). Leer ('') = Bereich ausblenden.
   kofiDelay: Sichtzeit in Millisekunden, nach der der Ko-fi-Hinweis in der Karte erscheint (Standard 240000 = 4 Minuten, 0 = aus). Nur sichtbar, wenn donate gesetzt ist.
   betaDate : Datum des geplanten Beta-Starts (nur zur Anzeige, ISO-Format).
   social   : Links zu Instagram, TikTok und YouTube (Dialog "Folge Tunelands" im Menue). Ohne Angabe gelten die Standard-Profile.
   surveyDelay : Sichtzeit auf der Karte in Millisekunden, nach der einmalig der Umfrage-Hinweis erscheint (Standard 45000, 0 = aus). Der Link kommt aus "feedback" (deutsch/englisch je nach Sprache).
   reportMail : Adresse fuer "Fehler melden" (falscher Kontinent/Genre, falsche Vorschau). Standard tunelands@proton.me. Es wird nur eine vorbereitete Mail geoeffnet (Senden macht der Nutzer).
   reportUrl  : statt Mail ein Formular oeffnen (z. B. Google Forms); der Meldungstext liegt dann in der Zwischenablage.
   globalFix  : feste Korrekturen je Benutzername, z. B. { timnook73: { hideArtists: ['Madcon'] } } (stats.fm ordnet "In My Head" von Bedroom falsch Madcon zu). Wirkt nur auf die Karte dieses Benutzers.
   Nach einer Aenderung: bash build/rebuild.sh (Handy-App/eigene Karte) bzw. python produkt/build_product.py (Web-Seite), dann hochladen. */
window.__KK_CFG__ = { beta: true, social: { instagram: 'https://www.instagram.com/tunelands', tiktok: 'https://www.tiktok.com/@tunelands_maps', youtube: 'https://youtube.com/@tunelands-g3m' }, surveyDelay: 45000, globalFix: { timnook73: { hideArtists: ['Madcon'] } }, feedback: { de: 'https://forms.gle/NTLa8HdU3VVyVPB2A', en: 'https://forms.gle/PPHFLRUQ33v95NTx8' }, donate: '' /* Ko-fi: 'https://ko-fi.com/tunelands' erst eintragen, wenn stats.fm geantwortet hat */, demo: 'https://timnook73.github.io/Klangkarte-App/', betaDate: '2026-11-08' };
