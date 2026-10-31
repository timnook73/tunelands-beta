# Klangkarte · Tunelands – frühe Beta

**Deine Musik als Landkarte.** Jeder Artist ein Planet, jeder Song ein Mond, ähnliche Musik liegt nebeneinander.
*(Englisch: Tunelands – your music as a map.)*

Das hier ist eine **frühe Demo** zum Ausprobieren und für Feedback, noch kein fertiges Produkt.

## Ausprobieren
Öffne die Seite und wähle eine Quelle:

- **stats.fm:** Gib deinen stats.fm-Profilnamen ein (das Profil muss öffentlich sein, Streams und Top-Listen sichtbar).
- **Spotify-Datenexport:** Lade deinen „Erweiterten Streaming-Verlauf“ (Extended streaming history, ZIP oder JSON) hoch. Den bekommst du auf spotify.com/account/privacy; die Lieferung kann laut Spotify bis zu 30 Tage dauern.

Die Karte ist nach ungefähr zwei bis drei Minuten fertig. Danach kannst du sie als Rangliste oder Spirale anzeigen, Zeiträume wählen (die Karte ordnet sich neu), Verbindungen zwischen Artists suchen, Kontinente verschieben und umfärben, als Bild oder PDF-Poster speichern und mit stats.fm neue Streams nachladen.

## Datenschutz in kurz
- Alles wird **in deinem Browser** berechnet. Es gibt keinen Server, der deine Daten bekommt oder speichert.
- Bei stats.fm-Profilen werden die öffentlichen Daten direkt von `api.stats.fm` geholt. Beim Spotify-Export bleiben die Dateien auf deinem Gerät; nur **Namen** von Artists/Alben werden bei stats.fm gesucht, um Genres und Cover zu finden.
- Cover-Bilder kommen direkt vom Content-Server von Spotify bzw. Apple. Details: `datenschutz.html`.

## Bekannte Einschränkungen
- Genre-Zuordnung und die automatischen Kontinent-Namen sind teils noch ungenau (z. B. „Alternative“, „Pop“).
- Spotify-Exporte enthalten keine Genres; sie werden über stats.fm ergänzt (bei ca. 5–10 % der Artists fehlen sie).
- Auf Handys mit wenig Arbeitsspeicher kann die Berechnung langsam sein. Am besten zuerst am Computer testen.
- Neue Streams nachladen funktioniert nur bei stats.fm-Karten und nur für Songs, die schon auf der Karte sind.

## Feedback
Gern als Issue in diesem Repository oder direkt an die Person, von der du den Link hast. Besonders hilfreich: Was hat nicht funktioniert? Welche Funktion fehlt? Was war unklar?

## Hinweise
Unabhängiges Projekt, nicht mit Spotify, Apple oder stats.fm verbunden. Impressum und Datenschutz: `impressum.html`, `datenschutz.html`.
Lizenz: noch offen (bis dahin: alle Rechte vorbehalten).
