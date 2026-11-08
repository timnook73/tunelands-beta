(function(){
'use strict';
/* =====================================================================
   Sprachen (Deutsch / Englisch): Woerterbuch deutscher Textstuecke -> Englisch.
   Die Oberflaeche ist deutsch geschrieben; fuer Englisch uebersetzt ein Beobachter jeden neu entstehenden Text im DOM
   (Textknoten + Attribute), JS-Texte laufen ueber T(). Erkennung: Einstellung > Browser-Sprache.
   ===================================================================== */
let LANG = 'de';
try { LANG = localStorage.getItem('kk-lang') || (window.__KK_LANG__ ? window.__KK_LANG__() : (/^de/i.test(navigator.language || '') ? 'de' : 'en')); } catch (e) { LANG = (window.__KK_LANG__ ? window.__KK_LANG__() : 'de'); }
if (LANG !== 'de' && LANG !== 'en') LANG = 'en';
const I18N_PAIRS = [
  /* --- Kopf, Suche, Ansicht --- */
  ['Klangkarte', 'Tunelands'], ['Interaktive Karte deiner Musik', 'Interactive map of your music'], ['Deine Musik wird kartiert …', 'Mapping your music …'],
  ['Ein-/Ausklappen', 'Expand / collapse'], ['Kopfkarte ein- oder ausklappen', 'Expand or collapse profile card'], ['Mehr über dein Hörverhalten', 'More about your listening'], ['Weniger anzeigen', 'Show less'],
  ['Artist, Song, Album oder Genre suchen …', 'Search artist, song, album or genre …'], ['Suche', 'Search'], ['Suche öffnen', 'Open search'], ['Suchen [/]', 'Search [/]'], ['Suchen', 'Search'],
  ['Ansicht', 'View'], ['Karte', 'Map'], ['Rangliste', 'Ranking'], ['Spirale', 'Spiral'], ['Reihen', 'Rows'], ['Objekte', 'Objects'], ['Artists', 'Artists'], ['Songs', 'Songs'], ['Zeigen', 'Show'], ['Alle', 'All'], ['Größe nach', 'Size by'], ['Hörzeit', 'Listening time'], ['Streams', 'Streams'],
  ['Menü', 'Menu'], ['Menü öffnen', 'Open menu'], ['Einstellungen', 'Settings'], ['Einstellungen öffnen', 'Open settings'], ['Optionen', 'Options'], ['Vollbild', 'Fullscreen'], ['Listen & Details', 'Lists & details'], ['Listen und Details', 'Lists and details'], ['Seitenleiste öffnen', 'Open sidebar'], ['Details und Listen', 'Details and lists'],
  ['Songs (Monde)', 'Songs (moons)'], ['Songs ein- oder ausblenden', 'Show or hide songs'], ['Verbindungslinien', 'Connection lines'], ['Verbindungen ein- oder ausblenden', 'Show or hide connections'], ['Artist-/Song-Namen', 'Artist / song names'], ['Namen ein- oder ausblenden', 'Show or hide names'],
  ['Kontinent-Namen', 'Continent names'], ['Kontinent-Namen ein- oder ausblenden', 'Show or hide continent names'], ['Zeitleiste', 'Timeline'], ['Zeitleiste ein- oder ausblenden', 'Show or hide timeline'], ['Zeitleiste ausblenden', 'Hide timeline'], ['Zeitleiste einblenden', 'Show timeline'],
  ['Übersicht (Minimap)', 'Overview (minimap)'], ['Übersicht ein- oder ausblenden', 'Show or hide overview'], ['Übersicht schließen', 'Close overview'], ['Übersicht', 'Overview'], ['Legende', 'Legend'], ['Legende ein- oder ausblenden', 'Show or hide legend'], ['Legende schließen', 'Close legend'],
  ['Verbindungs-Finder', 'Connection finder'], ['Nur Karte', 'Map only'], ['Nur die Karte anzeigen', 'Show only the map'], ['Oberfläche einblenden [H]', 'Show interface [H]'], ['Oberfläche wieder einblenden', 'Show interface again'], ['Geführte Tour', 'Guided tour'], ['Geführte Tour starten', 'Start guided tour'],
  ['Als Bild speichern', 'Save as image'], ['Ansicht als PNG speichern', 'Save view as PNG'], ['Als PDF exportieren', 'Export as PDF'], ['Hilfe', 'Help'], ['Abbrechen', 'Cancel'], ['Schließen', 'Close'], ['Übernehmen', 'Apply'],
  ['30-Sek.-Vorschau', '30-sec preview'], ['Zum Song', 'Go to song'], ['Vorschau schließen', 'Close preview'], ['Weiter', 'Resume'], ['▶ 30-Sek.-Vorschau', '▶ 30-sec preview'], ['⏸ Vorschau stoppen', '⏸ Stop preview'],
  ['Folge Tunelands', 'Follow Tunelands'], ['Neue Funktionen, Karten und Einblicke – und deine Meinung zählt.', 'New features, maps and insights – and your opinion counts.'], ['Zur Umfrage', 'Take the survey'], ['Kurze Umfrage', 'Quick survey'], ['Hilf mit, Tunelands besser zu machen', 'Help make Tunelands better'], ['Dauert etwa 3 Minuten. Antworten sind anonym, solange du keinen Namen eingibst.', 'Takes about 3 minutes. Answers are anonymous unless you enter a name.'], ['Später', 'Later'], ['Nicht mehr anzeigen', 'Don’t show again'], ['Umfrage schließen', 'Close survey'], ['Umfrage', 'Survey'],
  ['Presets', 'Presets'], ['Erscheinungsbild', 'Appearance'], ['Ein Preset bündelt alle Einstellungen und das Farbschema der Kontinente. Zum Teilen kopieren und beim anderen einfügen (die Lage der Kontinente gehört nicht dazu, dafür gibt es „Layout kopieren“).', 'A preset bundles all settings and the continent colour scheme. To share it, copy it and paste it on the other device (the continents’ positions are not included – use “Copy layout” for that).'],
  ['Standard', 'Default'], ['Die ursprüngliche Darstellung mit Farben nach Lage', 'The original look with colours by position'], ['Ruhig', 'Calm'], ['Wenige Namen, kaum Linien, Pastellfarben', 'Few names, hardly any lines, pastel colours'], ['Papier', 'Paper'], ['Helles Design mit Serifenschrift', 'Light theme with a serif font'], ['Neon', 'Neon'], ['Tiefschwarz mit starkem Leuchten und kräftigen Farben', 'Deep black with strong glow and vivid colours'], ['Ozean', 'Ocean'], ['Blaues Design mit runder Schrift', 'Blue theme with a rounded font'],
  ['Groß und lesbar', 'Large and readable'], ['Große Schrift und Kreise, Übersicht und Legende aus (für das Handy)', 'Large text and circles, overview and legend off (for phones)'], ['Nur die Großen', 'Only the big ones'], ['Die 50 größten Artists, viele Namen, keine Monde', 'The 50 biggest artists, many names, no moons'], ['Detailreich', 'Detailed'], ['Viele Namen, mehr Abstand, Songs als Monde', 'Many names, more spacing, songs as moons'],
  ['Anwenden', 'Apply'], ['Kopieren', 'Copy'], ['Löschen', 'Delete'], ['Aktuelle Einstellungen speichern …', 'Save current settings …'], ['Preset einfügen', 'Paste preset'], ['Alle kopieren', 'Copy all'], ['Preset angewendet', 'Preset applied'], ['Preset löschen', 'Delete preset'], ['Name für das Preset:', 'Name for the preset:'], ['Mein Preset', 'My preset'], ['Preset gespeichert', 'Preset saved'],
  ['Preset-Code (alles kopieren):', 'Preset code (copy everything):'], ['Preset-Code kopiert. Beim anderen unter „Preset einfügen“ einfügen.', 'Preset code copied. Paste it on the other device under “Paste preset”.'], ['Alle Presets kopiert. Beim anderen unter „Preset einfügen“ einfügen.', 'All presets copied. Paste them on the other device under “Paste preset”.'], ['Preset-Code einfügen:', 'Paste preset code:'], ['Das ist kein gültiger Preset-Code.', 'That is not a valid preset code.'], ['Preset eingefügt und angewendet', 'Preset pasted and applied'], ['Presets eingefügt', 'presets pasted'], ['Speichern nicht möglich (der Browser blockiert den Speicher)', 'Cannot save (the browser blocks storage)'],
  ['Layout kopieren', 'Copy layout'], ['Layout einfügen', 'Paste layout'], ['Layout-Code kopiert. Auf dem anderen Gerät unter „Layout einfügen“ einfügen.', 'Layout code copied. Paste it on the other device under “Paste layout”.'], ['Layout-Code (alles kopieren):', 'Layout code (copy everything):'], ['Layout-Code einfügen:', 'Paste layout code:'], ['Der Code passt nicht zu dieser Karte.', 'The code does not match this map.'],
  ['Fehler melden', 'Report a problem'], ['Falscher Kontinent oder falsches Genre', 'Wrong continent or genre'], ['Gehört nicht auf meine Karte (z. B. falscher Song zugeordnet)', 'Does not belong on my map (e.g. wrong song assigned)'], ['Etwas anderes', 'Something else'],
  ['Die Vorschau gehört nicht zu diesem Song', 'The preview does not belong to this song'], ['Diesen Song habe ich nie gehört (falsch zugeordnet)', 'I never listened to this song (wrongly assigned)'], ['Gehört in den Kontinent', 'Belongs in continent'], ['Genre-Vorschlag (optional)', 'Genre suggestion (optional)'], ['z. B. Bedroom Pop', 'e.g. Bedroom Pop'],
  ['Anmerkung (optional)', 'Note (optional)'], ['Meldung an Tunelands senden', 'Send report to Tunelands'], ['Öffnet eine vorbereitete E-Mail (und kopiert den Text). So kann der Fehler später für alle Karten behoben werden.', 'Opens a prepared email (and copies the text). That way the problem can be fixed for all maps later.'], ['Korrigieren', 'Fix it'],
  ['Bitte wählen …', 'Please choose …'], ['Bitte einen Kontinent wählen', 'Please choose a continent'], ['Korrigiert: nicht mehr auf der Karte', 'Fixed: no longer on the map'], ['Korrigiert: Vorschau entfernt', 'Fixed: preview removed'], ['Korrigiert: nicht auf der Karte.', 'Fixed: not on the map.'], ['Rückgängig', 'Undo'],
  ['Meldung kopiert und Formular geöffnet', 'Report copied and form opened'], ['Meldung vorbereitet und kopiert', 'Report prepared and copied'], ['Meldungen kopiert', 'Reports copied'], ['Meldungen (alles kopieren):', 'Reports (copy everything):'], ['Korrekturen', 'Corrections'],
  ['Fehler, die du über „Fehler melden“ in der Detailansicht eines Artists oder Songs korrigierst, gelten sofort auf dieser Karte und bleiben im Browser gespeichert. Hier kannst du sie zurücknehmen.', 'Problems you fix via “Report a problem” in an artist’s or song’s detail view apply to this map immediately and stay saved in your browser. You can undo them here.'],
  ['Noch keine Korrekturen.', 'No corrections yet.'], ['Artist ausgeblendet', 'Artist hidden'], ['Song ausgeblendet', 'Song hidden'], ['Vorschau entfernt', 'Preview removed'],
  ['Korrigiert:', 'Fixed:'],
  ['Das Standard-Preset von Tunelands', 'The Tunelands default preset'],
  ['Wald', 'Forest'], ['Dämmerung', 'Dusk'], ['Bordeaux', 'Bordeaux'], ['Glut', 'Ember'], ['Schiefer', 'Slate'], ['Himmel', 'Sky'], ['Rosé', 'Rosé'],
  ['Nur diesen Artist anzeigen', 'Show only this artist'], ['Nur diesen Song anzeigen', 'Show only this song'], ['Ausnahme aufheben', 'Remove exception'], ['Ausnahme · Artist', 'Exception · Artist'], ['Ausnahme · Song', 'Exception · Song'], ['Ausnahme: bleibt sichtbar, obwohl die Szene ausgeblendet ist.', 'Exception: stays visible although the scene is hidden.'], ['Ausnahme: bleibt sichtbar, obwohl der Kontinent ausgeblendet ist.', 'Exception: stays visible although the continent is hidden.'],
  ['Falscher Kontinent oder falsches Genre der Szene', 'Wrong continent or genre of the scene'], ['Falsches Genre', 'Wrong genre'], ['Kontinent beibehalten', 'Keep continent'], ['Eigenes Genre (mehrere mit Komma)', 'Your own genre (separate several with commas)'], ['z. B. Hip-House, Dance-Pop, Pop-Rap', 'e.g. Hip-House, Dance-Pop, Pop-Rap'],
  ['Bitte einen Kontinent wählen oder ein Genre eingeben', 'Please choose a continent or enter a genre'], ['Eigenes Genre', 'Own genre'], ['Eigenes Genre (Song)', 'Own genre (song)'], ['Szene umbenannt', 'Scene renamed'],
  ['Anordnung der Reihen', 'Row layout'], ['Waagerecht', 'Horizontal'], ['Senkrecht', 'Vertical'], ['Gilt für die Ansicht „Reihen“: Die Größten stehen zuerst, waagerecht Zeile für Zeile oder senkrecht Spalte für Spalte.', 'For the “Rows” view: the biggest come first, either row by row or column by column.'], ['Spalten', 'Columns'], ['Zeilen', 'Rows'], ['Anzahl pro Zeile (waagerecht). 0 = automatisch.', 'Items per row (horizontal). 0 = automatic.'], ['Anzahl pro Spalte (senkrecht). 0 = automatisch.', 'Items per column (vertical). 0 = automatic.'],
  ['Gefällt dir Tunelands?', 'Enjoying Tunelands?'],
  ['Unterstütze das Projekt mit einem Kaffee', 'Support the project with a coffee'],
  ['Tunelands ist kostenlos und wird von einer Person gebaut. Jeder Beitrag hilft bei Hosting und neuen Funktionen.', 'Tunelands is free and built by one person. Every contribution helps with hosting and new features.'],
  ['Auf Ko-fi unterstützen', 'Support on Ko-fi'],
  ['Hinweis schließen', 'Close notice'],
  ['Unterstützen', 'Support'],
  ['Vergleichsfarben', 'Comparison colors'], ['Nur einer / beide', 'Only one / both'], ['Verlauf statt Gruppen', 'Gradient instead of groups'], ['Beide ähnlich', 'Both similar'],
  ['Nur einer / beide: leuchtend = nur eine Person hat es gehört, blass = beide.', 'Only one / both: vivid = only one person listened, pale = both.'],
  ['Farben', 'Colors'], ['auf der Karte (Färbung „Wer hört mehr“)', 'on the map (coloring “Who listens more”)'],
  ['Leuchtend = nur eine Person hat den Artist gehört. Blass = beide haben ihn gehört, der Ton zeigt, wer mehr gehört hat.', 'Vivid = only one person listened to the artist. Pale = both did, the tint shows who listened more.'],
  /* --- Zeitleiste --- */
  ['Zeitraum', 'Period'], ['Gesamte Zeit', 'All time'], ['Entwicklung', 'Growth'], ['Entwicklung abspielen', 'Play growth over time'], ['Pause', 'Pause'], ['Alles', 'All'], ['Letzter Tag', 'Last day'], ['7 Tage', '7 days'], ['30 Tage', '30 days'], ['90 Tage', '90 days'],
  ['Zeitraum nach Datum', 'Period by date'], ['Von', 'From'], ['Bis', 'To'], ['Datum eingeben', 'Enter a date'], ['Achse herauszoomen', 'Zoom timeline out'], ['Achse hineinzoomen (auch Mausrad oder Pinch auf der Achse)', 'Zoom timeline in (also mouse wheel or pinch on the axis)'], ['Achse nach links', 'Move timeline left'], ['Achse nach rechts', 'Move timeline right'],
  ['⟲ Karte dynamisch', '⟲ Dynamic map'], ['▣ Karte fest', '▣ Fixed map'], ['Karte ordnet sich nach dem gewählten Zeitraum neu an', 'The map rearranges itself for the chosen period'], ['Bitte beide Daten wählen', 'Please choose both dates'],
  ['Nur Karte – mit H oder dem Auge-Symbol zurück', 'Map only – press H or the eye icon to return'],
  /* --- Detailseiten --- */
  ['Details', 'Details'], ['Bestenlisten', 'Top lists'], ['Regionen', 'Regions'], ['Verbindung', 'Connection'], ['Alle Bestenlisten', 'All top lists'], ['▶ Geführte Tour', '▶ Guided tour'],
  ['Willkommen auf deiner Klangkarte', 'Welcome to your Tunelands map'], ['Klicke einen Artist, Song oder Kontinent an – oder nutze die Suche oben.', 'Click an artist, song or continent – or use the search above.'], ['Meistgehörte Artists', 'Most played artists'], ['Meistgehörte Songs', 'Most played songs'],
  ['Hörzeit', 'Listening time'], ['gesamt', 'total'], ['im Zeitraum', 'in period'], ['Anteil', 'Share'], ['deiner Hörzeit', 'of your listening time'], ['Verlauf', 'History'], ['Minuten pro Monat', 'Minutes per month'], ['Streams pro Monat', 'Streams per month'],
  ['Erster Stream', 'First stream'], ['· Zuletzt', '· Last'], ['Stärkster Monat:', 'Strongest month:'], ['Gehörte Songs', 'Songs played'], ['Als Feature', 'As featured artist'], ['Alben', 'Albums'], ['Liegt nah bei', 'Sits close to'], ['Tippe „?“ für den Grund', 'Tap “?” for the reason'],
  ['In Spotify öffnen ↗', 'Open in Spotify ↗'], ['In Spotify ↗', 'In Spotify ↗'], ['▶ In Spotify anhören ↗', '▶ Listen in Spotify ↗'], ['Auf Karte zeigen', 'Show on map'], ['Verbindung finden …', 'Find connection …'], ['Keine Songs in diesem Zeitraum.', 'No songs in this period.'],
  ['▶ 30-Sek.-Vorschau', '▶ 30-second preview'], ['⏸ Vorschau stoppen', '⏸ Stop preview'], ['Vorschau nicht verfügbar (offline?)', 'Preview not available (offline?)'], ['Vorschau konnte nicht gestartet werden', 'Preview could not be started'], ['Rang', 'Rank'], ['Länge', 'Length'], ['pro Stream gehört', 'of each stream heard'], ['· im Schnitt', '· on average'], ['Anteil am Artist:', 'Share of the artist:'], ['Mehr vom Album', 'More from the album'],
  ['Kontinent', 'Continent'], ['Szene', 'Scene'], ['Szenen', 'Scenes'], ['Top-Artists', 'Top artists'], ['Top-Songs', 'Top songs'], ['Mehr anzeigen', 'Show more'], ['Kontinente', 'Continents'], ['Song', 'Song'], ['Album', 'Album'], ['Artist', 'Artist'], ['Szene ·', 'Scene ·'], ['Nichts gefunden.', 'Nothing found.'],
  ['Deine Musik, gruppiert nach Klang-Verwandtschaft. Ähnliche Kontinente liegen auf der Karte nebeneinander.', 'Your music, grouped by sound. Similar continents sit next to each other on the map.'],
  /* --- HUD --- */
  ['Stunden', 'Hours'], ['Tage', 'Days'], ['Tageszeit', 'Time of day'], ['(Minuten je Stunde)', '(minutes per hour)'], ['0 Uhr', '12 am'], ['Wochentage', 'Weekdays'], ['Rekorde', 'Records'], ['Stärkste Stunde:', 'Strongest hour:'], ['Längster Tag:', 'Longest day:'], ['mit', 'with'], ['Längste Session:', 'Longest session:'], ['Top-Genres laut stats.fm', 'Top genres according to stats.fm'], ['Spotify · via stats.fm', 'Spotify · via stats.fm'],
  /* --- Verbindungs-Finder --- */
  ['Wie hängen zwei Artists oder Songs zusammen? Ich suche die kürzeste Kette über deine Karte und erkläre jeden Schritt.', 'How are two artists or songs connected? I look for the shortest chain across your map and explain every step.'],
  ['Nach', 'To'], ['Artist oder Song suchen …', 'Search artist or song …'], ['Auswahl entfernen', 'Remove selection'], ['Von und Nach tauschen', 'Swap from and to'], ['Tauschen', 'Swap'], ['🎲 Zufällige Verbindung', '🎲 Random connection'], ['Zurücksetzen', 'Reset'],
  ['Schritt', 'step'], ['Schritte', 'steps'], ['Beide gehören zum selben Artist.', 'Both belong to the same artist.'], ['Auf der Karte zeigen', 'Show on the map'], ['Details öffnen', 'Open details'], ['Details ↗', 'Details ↗'], ['Direkt verbunden', 'Directly linked'], ['Feature', 'Feature'], ['Genre', 'Genre'], ['Hörverhalten', 'Listening'], ['Brücke', 'Bridge'],
  ['Zusammen auf', 'Together on'], ['Gemeinsame Tags:', 'Shared tags:'], ['Gleiche Szene:', 'Same scene:'], ['Gleicher Kontinent:', 'Same continent:'], ['Verbindet', 'Connects'], ['Feature von', 'Featuring on'], ['Song von', 'Song by'], ['Keine passende Zufallsverbindung gefunden – nochmal versuchen', 'No suitable random connection found – try again'],
  ['In der Songs-Ansicht ist die Route nicht sichtbar – wechsle zu „Karte“', 'The route is not visible in songs view – switch to “Map”'], ['In der Songs-Ansicht nicht sichtbar', 'Not visible in songs view'], ['Zwischen', 'Between'],
  /* --- Tour --- */
  ['Willkommen · Tour', 'Welcome · tour'], ['Deine Musik als Landkarte', 'Your music as a map'], ['‹ Zurück', '‹ Back'], ['Weiter ›', 'Next ›'], ['▶ Weiter', '▶ Resume'], ['❚❚ Pause', '❚❚ Pause'], ['Beenden', 'End'], ['Tour beendet – jetzt kannst du selbst erkunden.', 'Tour finished – now explore on your own.'],
  /* --- Einstellungen --- */
  ['Alles wird in deinem Browser gespeichert.', 'Everything is stored in your browser.'], ['Darstellung', 'View mode'], ['Reihen und Spirale ordnen nach Größe, ohne Genre-Nähe.', 'Rows and spiral sort by size, without genre proximity.'], ['Objekte (Reihen/Spirale)', 'Objects (rows / spiral)'], ['Die Kreise wachsen und schrumpfen animiert.', 'The circles grow and shrink with an animation.'],
  ['Zeitraum-Modus', 'Period mode'], ['Dynamisch', 'Dynamic'], ['Fest', 'Fixed'], ['Dynamisch: Die Karte ordnet sich neu an und zeigt nur, was im Zeitraum gehört wurde. Fest: Alle Plätze bleiben, nur die Größe ändert sich.', 'Dynamic: the map rearranges itself and only shows what was played in the period. Fixed: all places stay, only the sizes change.'],
  ['Kamera folgt der Karte', 'Camera follows the map'], ['Passt den Ausschnitt an, wenn sich die Karte stark verändert.', 'Adjusts the view when the map changes a lot.'], ['Animationstempo', 'Animation speed'], ['Langsam', 'Slow'], ['Normal', 'Normal'], ['Schnell', 'Fast'],
  ['Leistung', 'Performance'], ['Qualität', 'Quality'], ['Minimal', 'Minimal'], ['Ausgewogen', 'Balanced'], ['Maximal', 'Maximum'], ['Minimal: niedrige Auflösung, kein Nebel, wenige Namen (schwache Geräte). Maximal: volle Bildschirm-Auflösung, scharfer Nebel in hoher Auflösung, mehr Namen. Bei Rucklern auf Minimal stellen.', 'Minimal: low resolution, no haze, few names (weak devices). Maximum: full screen resolution, sharp haze, more names. If it stutters, choose Minimal.'],
  ['Filter', 'Filter'], ['Nur die größten zeigen', 'Show only the biggest'], ['Gilt für Artists (Karte, Reihen, Spirale) bzw. für Songs in der Songs-Ansicht.', 'Applies to artists (map, rows, spiral) or to songs in songs view.'], ['… oder genaue Anzahl', '… or exact number'], ['0 = alle', '0 = all'], ['Anzahl eingeben', 'Enter a number'],
  ['Mindest-Hörzeit (Minuten)', 'Minimum listening time (minutes)'], ['Blendet alles unter dieser Zeit aus (im gewählten Zeitraum).', 'Hides everything below this time (within the chosen period).'], ['Mindest-Streams', 'Minimum streams'], ['Blendet alles mit weniger Streams aus.', 'Hides everything with fewer streams.'], ['(Zahl eingeben)', '(enter a number)'],
  ['Größen und Abstand', 'Sizes and spacing'], ['Größenskala', 'Size scale'], ['Gestaucht', 'Compressed'], ['Verstärkt', 'Amplified'], ['Gestaucht: Kleine Objekte werden größer, große weniger dominant.', 'Compressed: small objects get bigger, big ones less dominant.'], ['Songs und Monde', 'Songs and moons'], ['Abstand der Objekte', 'Spacing of objects'], ['Zieht die Karte auseinander (mehr Freiraum).', 'Pulls the map apart (more space).'], ['Monde: Größe in der Bahn', 'Moons: size in orbit'], ['Kleiner = mehr Luft zwischen den Songs.', 'Smaller = more air between songs.'],
  ['Beschriftung', 'Labels'], ['Artist- und Song-Namen', 'Artist and song names'], ['Dichte der Namen', 'Density of names'], ['Mehr = mehr Namen gleichzeitig.', 'More = more names at once.'], ['Größe der Kontinent-Namen', 'Size of continent names'], ['Szenen-Namen', 'Scene names'], ['Schriftart', 'Font'], ['Standard', 'Default'], ['Rund', 'Rounded'], ['Schriftgröße', 'Font size'],
  ['Farben und Linien', 'Colors and lines'], ['Färbung', 'Coloring'], ['Entdeckung', 'Discovery'], ['Hörzeit: kalt nach warm. Entdeckung: von alt nach neu.', 'Listening time: cold to warm. Discovery: old to new.'], ['Songs als Monde', 'Songs as moons'], ['Orbit-Ringe', 'Orbit rings'], ['Stärke der Linien', 'Line strength'], ['Leuchten und Nebel', 'Glow and haze'],
  ['Design', 'Theme'], ['Mitternacht', 'Midnight'], ['Tiefschwarz', 'Deep black'], ['Papier', 'Paper'], ['Ozean', 'Ocean'], ['Sterne im Hintergrund', 'Stars in the background'], ['Anzeige', 'Display'], ['Lässt sich auch verschieben und mit dem x schließen.', 'Can also be moved and closed with the x.'], ['Alle Einstellungen zurücksetzen', 'Reset all settings'], ['Einstellungen zurückgesetzt', 'Settings reset'], ['Sprache', 'Language'],
  /* --- Hilfe --- */
  ['So funktioniert die Karte', 'How the map works'], ['Jede Fläche ist ein Genre-Kontinent, ähnliche Musik liegt nebeneinander. Je länger du etwas gehört hast, desto größer wird es. Zoom hinein, um Szenen, Artists und ihre einzelnen Songs zu sehen.', 'Every area is a genre continent, similar music sits side by side. The longer you listened to something, the bigger it gets. Zoom in to see scenes, artists and their individual songs.'],
  ['Verschieben', 'Pan'], ['Ziehen oder Pfeiltasten', 'Drag or arrow keys'], ['Zoomen', 'Zoom'], ['Mausrad, Pinch,', 'Mouse wheel, pinch,'], ['Auswählen', 'Select'], ['Klick auf Artist, Song oder Kontinent', 'Click an artist, song or continent'], ['Heranzoomen', 'Zoom in'], ['Doppelklick', 'Double-click'], ['oder', 'or'], ['Strg', 'Ctrl'],
  ['Unten Bereich aufziehen: die Karte ordnet sich dynamisch neu an', 'Drag a range at the bottom: the map rearranges itself dynamically'], ['wechselt Karte, Rangliste, Spirale', 'switches map, ranking, spiral'], ['Songs / Linien', 'Songs / lines'], ['Namen', 'Names'], ['Übersicht ein/aus', 'Overview on/off'], ['Tour', 'Tour'], ['– alle Kontinente nacheinander', '– all continents one after another'],
  ['Kreis = Artist', 'Circle = artist'], ['Kachel = Song (Cover)', 'Tile = song (cover)'], ['Monde = Songs des Artists', 'Moons = songs of the artist'], ['Größe = Hörzeit (oder Streams)', 'Size = listening time (or streams)'], ["Los geht's", "Let's go"],
  /* --- PDF-Dialog --- */
  ['Die ganze Karte als eine riesige Seite: Formen und Schrift sind Vektoren und bleiben in jeder Zoomstufe scharf, Cover sind eingebettet, Artists und Songs führen per Klick zu Spotify, Kontinente findest du in der Gliederung. Es wird der aktuell gewählte Zeitraum mit allen Filtern exportiert, ohne ausgeblendete Elemente.', 'The whole map as one huge page: shapes and text are vectors and stay sharp at any zoom level, covers are embedded, artists and songs link to Spotify, continents are in the outline. The currently chosen period with all filters is exported, without hidden items.'],
  ['Hintergrund', 'Background'], ['Dunkel', 'Dark'], ['Hell (Druck)', 'Light (print)'], ['Cover', 'Covers'], ['Hochauflösend (lädt Bilder)', 'High resolution (loads images)'], ['PDF erstellen', 'Create PDF'],
  /* --- Sonstiges --- */
  ['Zur Startseite', 'Back to home'], ['Feedback geben', 'Give feedback'], ['Projekt unterstützen', 'Support the project'], ['Neue Streams laden', 'Load new streams'], ['Ansicht gespeichert', 'View saved'], ['Vollbild ist hier nicht verfügbar', 'Fullscreen is not available here'], ['Ansicht: Karte', 'View: map'], ['Ansicht: Rangliste in Reihen', 'View: ranking in rows'], ['Ansicht: Spirale', 'View: spiral'], ['Weitere Klänge', 'Other sounds'], ['Kontinente anpassen', 'Adjust continents'], ['Kontinente verschieben', 'Move continents'], ['Lage zurücksetzen', 'Reset positions'], ['Farbschema', 'Color scheme'], ['Original', 'Original'], ['Nach Lage', 'By position'], ['Pastell', 'Pastel'], ['Kräftig', 'Vivid'], ['Farbe und Lage', 'Color and position'], ['Geändert', 'Changed'], ['Farbe ändern', 'Change color'], ['Farben …', 'Colors …'], ['Kontinent verschoben', 'Continent moved'], ['Kontinente getauscht', 'Continents swapped'], ['Karte neu geordnet', 'Map rearranged'], ['Aufräumen', 'Tidy up'], ['Räume auf …', 'Tidying up …'], ['Ziehen: Kontinent', 'Drag: continent'], ['Ziehen: Artist', 'Drag: artist'], ['Zum Kontinent zurückholen', 'Bring back to its continent'], ['Artist zurückgeholt', 'Artist brought back'], ['Ziehe einen Artist an eine neue Stelle', 'Drag an artist to a new place'], ['Einzelne Artists verschieben: ziehe einen Artist an eine neue Stelle, die Nachbarn weichen aus.', 'Move single artists: drag an artist to a new place, its neighbors make room.'], ['Gespeicherte Positionen einer älteren Version wurden verworfen, die Farben bleiben erhalten.', 'Saved positions from an older version were discarded, your colors are kept.'], ['Speichern ist in dieser Ansicht nicht möglich', 'Saving is not possible in this view'], ['Nicht gespeichert', 'Not saved'], ['Magnet', 'Magnet'], ['(Zusammenhalt)', '(cohesion)'], ['Aus', 'Off'], ['Mittel', 'Medium'], ['Stark', 'Strong'], ['Layout und Farben', 'Layout and colors'], ['Klassisch', 'Classic'], ['Neu', 'New'], ['Klassisch: Anordnung und Farben vom 21.10. – Neu: verbesserte Genre-Zuordnung (21 Kontinente).', 'Classic: layout and colors from 21 Oct – New: improved genre assignment (21 continents).'], ['Kontinente verschieben: ziehe einen Kontinent an eine neue Stelle – die anderen weichen aus und rücken nach.', 'Move continents: drag a continent to a new place – the others make room and move in.'],['Ordne neu …', 'Rearranging …'], ['Positionen zurückgesetzt', 'Positions reset'], ['Ziehe einen Kontinent, um ihn zu verschieben', 'Drag a continent to move it'], ['Kontinente verschieben: ziehe einen Kontinent an eine neue Stelle.', 'Move continents: drag a continent to a new place.'], ['Vergleich', 'Comparison'], ['Wer', 'Who'], ['Beide', 'Both'], ['Wer hört mehr', 'Who listens more'], ['Musik-Übereinstimmung', 'Music match'], ['Gleiche Artists', 'Shared artists'], ['von euch beiden gehört', 'played by both of you'], ['Geteilte Hörzeit', 'Shared listening time'], ['in gemeinsamen Artists', 'in shared artists'], ['Genre-Nähe', 'Genre similarity'], ['Anteil an der jeweiligen Hörzeit', 'Share of each person’s listening time'], ['Gemeinsame Favoriten', 'Shared favorites'], ['Live-Modus', 'Live mode'], ['Live-Modus an', 'Live mode on'], ['Live-Modus aus', 'Live mode off'], ['Gerade läuft nichts', 'Nothing is playing right now'], ['Keine Verbindung zu stats.fm', 'No connection to stats.fm'], ['Neu auf deiner Karte', 'New on your map'], ['Kamera folgt', 'Camera follows'], ['Live · stats.fm', 'Live · stats.fm'], ['und', 'and'], ['Artist · Rang', 'Artist · Rank'], ['An', 'On'], ['Deutschpop', 'German pop'], ['Deutschrap', 'German rap'], ['Elektronik', 'Electronic'], ['Deutsch-Indie', 'German indie'], ['NDW · Indie', 'NDW · Indie'], ['Easy Listening', 'Easy Listening'],
  ['Größe = Hörzeit · Farbe = Genre-Kontinent · kleine Quadrate rund um einen Artist = seine Songs · Nähe = ähnliche Musik · Mit Zoom entdeckst du jeden Song', 'Size = listening time · color = genre continent · small squares around an artist = their songs · proximity = similar music · zoom in to discover every song'],
  ['Hintergrund & Farbflächen', 'Background & color fields'], ['Kontinent- und Szenennamen', 'Continent and scene names'], ['Artists & Namen', 'Artists & names'], ['Titel & Legende', 'Title & legend'], ['Layout wird abgeschlossen …', 'Finishing layout …'], ['Karte wird gezeichnet …', 'Drawing the map …'], ['Beschriftungen werden gesetzt …', 'Placing labels …'], ['Cover werden eingebettet …', 'Embedding covers …'], ['Hochauflösende Cover …', 'High-resolution covers …'], ['Sonderzeichen …', 'Special characters …'], ['PDF wird geschrieben …', 'Writing PDF …'], ['Fertig', 'Done'], ['Keine sichtbaren Objekte', 'No visible objects'],
  /* --- Ausblenden, Einstellungen-Suche --- */
  ['ausgeblendet', 'hidden'], ['Alle zeigen', 'Show all'], ['Alles wieder einblenden', 'Show everything again'], ['Wieder einblenden', 'Show again'], ['Ausblenden', 'Hide'],
  ['Nimmt Kontinente, Szenen, Artists oder Songs von der Karte, auch aus Bild und PDF. Ranglisten und Summen bleiben gleich. Das wird nicht gespeichert: Nach dem Neuladen ist wieder alles da.', 'Takes continents, scenes, artists or songs off the map, including image and PDF export. Rankings and totals stay the same. This is not saved: after reloading, everything is back.'],
  ['Kontinent, Szene, Artist oder Song suchen …', 'Search continent, scene, artist or song …'], ['Zum Ausblenden suchen', 'Search to hide'], ['Noch nichts ausgeblendet.', 'Nothing hidden yet.'],
  ['Kontinent ausblenden', 'Hide continent'], ['Szene ausblenden', 'Hide scene'], ['Artist ausblenden', 'Hide artist'], ['Song ausblenden', 'Hide song'],
  ['Kontinent wieder einblenden', 'Show continent again'], ['Szene wieder einblenden', 'Show scene again'], ['Artist wieder einblenden', 'Show artist again'], ['Song wieder einblenden', 'Show song again'],
  ['Ausgeblendet: nicht auf der Karte und nicht im Export.', 'Hidden: not on the map and not in the export.'], ['Ausgeblendet über den Kontinent.', 'Hidden via its continent.'], ['Ausgeblendet über die Szene.', 'Hidden via its scene.'], ['Ausgeblendet über den Artist.', 'Hidden via its artist.'], ['Ausgeblendet über den Song.', 'Hidden via its song.'],
  ['Ausgeblendet: nicht auf der Karte', 'Hidden: not on the map'], ['Beim Verschieben der Kontinente ist alles sichtbar.', 'While moving continents, everything is visible.'], ['Einstellungen suchen …', 'Search settings …'],
  /* --- Verschieben: Szenen, Artist-Auswahl --- */
  ['Auswahl aufheben', 'Clear selection'], ['Ziehe eine Szene, um sie zu verschieben', 'Drag a scene to move it'],
  ['Szenen verschieben: ziehe eine Szene (Unter-Genre) an eine neue Stelle – sie gehört weiter zu ihrem Kontinent, die Nachbarn weichen aus.', 'Moving scenes: drag a scene (sub-genre) to a new spot – it stays part of its continent, the neighbours make way.'],
  ['Artists verschieben: ziehe einen Artist an eine neue Stelle. Mehrere auswählen: Umschalt+Klick oder Umschalt+Rahmen aufziehen, dann gemeinsam ziehen.', 'Moving artists: drag an artist to a new spot. To pick several, Shift+click or Shift+drag a frame, then drag them together.'],
  ['Artists verschieben: tippe Artists an, um sie auszuwählen, und ziehe sie dann gemeinsam.', 'Moving artists: tap artists to select them, then drag them together.'],
];
const EN = new Map(I18N_PAIRS);
/* Muster fuer Texte mit Zahlen (nur Englisch): [Regex, Ersatz oder Funktion] */
const I18N_PAT = [
  [/^Alle ([\d.,]+) anzeigen$/, 'Show all $1'], [/^Artist-Nähe (\d+) %$/, 'Artist similarity $1 %'], [/^Nur (.+)$/, 'Only $1'], [/^Beide, (.+) mehr$/, 'Both, $1 more'], [/^Blau = (.+) hört mehr, Orange = (.+) hört mehr, hell = beide ähnlich viel\.$/, 'Blue = $1 listens more, orange = $2 listens more, light = both about equally.'], [/^von ([\d.,]+) Songs$/, 'of $1 songs'], [/^von ([\d.,]+) Alben$/, 'of $1 albums'], [/^(im Zeitraum )?von ([\d.,]+)$/, (m, z, n) => 'of ' + n + (z ? ' in period' : '')], [/^(.*) \(Zahl eingeben\)$/, (m, a) => trText(a) + ' (enter a number)'], [/^Nähe (\d+) %$/, 'Similarity $1 %'], [/^([\d.,]+) Tagen$/, '$1 days'], [/^([\d.,]+) Songs$/, '$1 songs'], [/^(.*) · ([\d.,]+) Artists$/, '$1 · $2 artists'], [/^([\d.,]+) Artists$/, '$1 artists'],
 [/^Song #(\d+) ·/, 'Song #$1 ·'], [/^(.*) % deiner Hörzeit · ([\d.,]+) Artists$/, '$1 % of your listening time · $2 artists'],
  [/^Daten: stats\.fm \((.*)\)\.$/, 'Data: stats.fm ($1).'], [/^Seit (\S+) ’(\d\d)$/, 'Since $1 ’$2'], [/^(\d+) Uhr: (.*)$/, '$1:00: $2'], [/^\((\d+) Songs, (.*)\)$/, '($1 songs, $2)'], [/^ \((\d+) Songs, (.*)\)$/, ' ($1 songs, $2)'], [/^(\d+)–(\d+) Uhr$/, '$1:00–$2:00'],
  [/^Kontinent (\d+) von (\d+)$/, 'Continent $1 of $2'], [/^von „(.*)“ zu „(.*)“$/, 'from “$1” to “$2”'], [/^Route (\d+) · (\d+) Schritte?$/, (m, a, b) => 'Route ' + a + ' · ' + b + (b === '1' ? ' step' : ' steps')],
  [/^An ([\d.,]+) Tagen$/, 'On $1 days'], [/^hörst du beide \((\d+) % der Tage des selteneren\)(.*)$/, (m, p, rest) => 'you listen to both (' + p + ' % of the days of the rarer one)' + rest.replace(', am häufigsten im ', ', most often in ')], [/^, am häufigsten im (.*)$/, ', most often in $1'],
  [/^und (\d+) weiteren Songs?$/, (m, n) => 'and ' + n + ' more song' + (n === '1' ? '' : 's')], [/^Gleiche Szene:$/, 'Same scene:'], [/^(.*) \(([\d.,]+) min\)$/, '$1 ($2 min)'],
  [/^Gibt es keine Kette.*$/, 'There is no chain.'], [/^gibt es keine Kette über die Karten-Nachbarschaften\. Sie liegen in verschiedenen Ecken deiner Musik\.$/, ' there is no chain through the map neighbourhoods. They lie in different corners of your music.'],
  [/^Nach (\d+) Tag/, 'After $1 day'],
  [/^(\d+) Artists und ([\d.,]+) Songs, gruppiert nach Klang-Verwandtschaft: (\d+) Kontinente\. Je größer ein Kreis, desto länger hast du ihn gehört\. Gleich fliegen wir zu jedem Kontinent, beginnend mit dem größten\.$/, '$1 artists and $2 songs, grouped by sound: $3 continents. The bigger a circle, the longer you listened to it. We will now fly to every continent, starting with the biggest.'],
  [/^deiner Hörzeit · ([\d.,]+) Artists\. Allen voran$/, 'of your listening time · $1 artists. Led by'], [/^\. Meistgehört: „$/, '. Most played: “'], [/^“ von$/, '” by'], [/^Meistgehört: „$/, 'Most played: “'],
  [/^([\d.,]+) Std\.$/, '$1 h'], [/^([\d.,]+) Std\. · ([\d.,]+) Streams$/, '$1 h · $2 streams'], [/^(\d+) ausgeblendet$/, '$1 hidden']
];
/* Einzelne Woerter in Zeilen mit Zahlen */
const I18N_WORDS = [[/\bStd\./g, 'h'], [/\bgestreamt\b/g, 'streamed'], [/\bTage\b/g, 'days'], [/\bStunden\b/g, 'hours']];

function trText(s) {
  if (LANG !== 'en') return s;
  const t = s.trim(); if (!t) return s;
  let r = EN.get(t);
  if (r === undefined) {
    for (let i = 0; i < I18N_PAT.length; i++) { const p = I18N_PAT[i]; if (p[0].test(t)) { r = t.replace(p[0], p[1]); break; } }
    if (r === undefined && /\d/.test(t)) { let q = t; for (const [rx, rep] of I18N_WORDS) q = q.replace(rx, rep); if (q !== t) r = q; }
    if (r === undefined) return s;
  }
  const lead = s.match(/^\s*/)[0], trail = s.match(/\s*$/)[0];
  return lead + r + trail;
}
/* T(): JS-Text mit Platzhaltern {name} */
function T(s, v) {
  let r = LANG === 'en' ? (EN.get(s) !== undefined ? EN.get(s) : s) : s;
  if (v) for (const k in v) r = r.split('{' + k + '}').join(v[k]);
  return r;
}
/* DOM-Uebersetzung (Textknoten + Attribute), Originaltexte bleiben zum Zurueckschalten erhalten */
const I18N_ATTR = ['title', 'aria-label', 'placeholder', 'data-tip', 'alt'];
const I18N_ORIG = new WeakMap(), I18N_ORIG_ATTR = new WeakMap();
function trTextNode(n) {
  const cur = n.nodeValue; let o = I18N_ORIG.get(n);
  if (o === undefined || (cur !== o && cur !== trText(o))) o = cur;         // vom Code neu gesetzter Text = neues Original
  I18N_ORIG.set(n, o);
  const nv = LANG === 'en' ? trText(o) : o; if (nv !== cur) n.nodeValue = nv;
}
function trElementAttrs(el) {
  for (const a of I18N_ATTR) {
    if (!el.hasAttribute || !el.hasAttribute(a)) continue;
    let m = I18N_ORIG_ATTR.get(el); if (!m) { m = {}; I18N_ORIG_ATTR.set(el, m); }
    const cur = el.getAttribute(a); let o = m[a];
    if (o === undefined || (cur !== o && cur !== trText(o))) o = cur;       // vom Code neu gesetzt
    m[a] = o; const nv = LANG === 'en' ? trText(o) : o; if (nv !== cur) el.setAttribute(a, nv);
  }
}
function trTree(root) {
  if (!root) return;
  if (root.nodeType === 3) { trTextNode(root); return; }
  if (root.nodeType !== 1) return;
  if (root.tagName === 'SCRIPT' || root.tagName === 'STYLE') return;
  trElementAttrs(root);
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, null);
  let n = w.nextNode();
  while (n) { if (n.nodeType === 3) trTextNode(n); else if (n.tagName !== 'SCRIPT' && n.tagName !== 'STYLE') trElementAttrs(n); n = w.nextNode(); }
}
let I18N_OBS = null;
function i18nStart() {
  if (I18N_OBS) return;
  I18N_OBS = new MutationObserver(muts => {
    if (LANG !== 'en') return;
    for (const m of muts) {
      if (m.type === 'childList') m.addedNodes.forEach(n => trTree(n));
      else if (m.type === 'attributes') trElementAttrs(m.target);
      else if (m.type === 'characterData') trTextNode(m.target);
    }
  });
  I18N_OBS.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: I18N_ATTR, characterData: true });
}

/* Sprache wechseln (Texte im DOM, Zahlen-/Datumsformate, Namen der Kontinente) */
function setNumberFormats() { const loc = LANG === 'en' ? 'en-US' : 'de-DE'; NF = new Intl.NumberFormat(loc); NF1 = new Intl.NumberFormat(loc, { minimumFractionDigits: 1, maximumFractionDigits: 1 }); NF2 = new Intl.NumberFormat(loc, { minimumFractionDigits: 0, maximumFractionDigits: 1 }); }
function setLocaleArrays() {
  const mn = LANG === 'en' ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] : ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
  const wd = LANG === 'en' ? ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] : ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  MN.splice(0, 12, ...mn); WDN.splice(0, 7, ...wd);
}
function relines() { regs.forEach(r => { r.lines = wrapName(r.name.toUpperCase(), 17); }); scs.forEach(s => { s.lines = wrapName(s.name, 20); }); }
function setLanguage(l) {
  if (l === LANG || (l !== 'de' && l !== 'en')) return;
  LANG = l; try { localStorage.setItem('kk-lang', l); } catch (e) { }
  document.documentElement.lang = l; setNumberFormats(); setLocaleArrays(); relines();
  trTree(document.body);
  if (typeof renderHud === 'function') { renderHud(); renderPresets(); onRangeChange(); renderDrawer(); }
  glowDirty = true; mmDirty = true; textW.clear(); if (typeof drawTimeline === 'function') drawTimeline(); requestDraw();
}

/* =====================================================================
   KLANGKARTE – Kern: Daten, Zustand, Kamera, Rendering (Canvas 2D, Semantic Zoom)
   Layout-Berechnung: 02_layout.js · Oberfläche: 03_ui.js / 04_settings.js · Start: 05_main.js
   ===================================================================== */
const IS_ART = !!window.__ARTIFACT__;   // im Artefakt sind externe Bilder/Audio gesperrt, Dateien speichert die Downloads-Faehigkeit des Viewers
/* Datei speichern: normal per Download-Link, im Artefakt ueber die Faehigkeit "downloads" (der Viewer fragt nach). true = gespeichert */
async function saveFile(blob, name) {
  if (IS_ART) {
    let dl = null; try { dl = window.claude && window.claude.use ? await window.claude.use('downloads') : null; } catch (e) { }
    if (!dl) { toast('Speichern ist in dieser Ansicht nicht möglich'); return false; }
    try { await dl.save({ filename: name, data: blob }); return true; } catch (e) { if (!e || e.code !== 'declined') toast('Speichern nicht möglich: ' + ((e && (e.message || e.code)) || 'unbekannt')); return false; }
  }
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 20000); return true;
}
/* Eigenstaendige Datei: zwei Kartenstaende ("classic" = Standard, "neu" = verbesserte Genre-Zuordnung); Wahl per Einstellung (localStorage oder #map=neu) */
const MAPS = window.__MAPS__ || null;
let MAPV = '';
if (MAPS) { try { MAPV = (/[#&]map=(\w+)/.exec(location.hash) || [])[1] || localStorage.getItem('kk-map') || ''; } catch (e) { } if (!MAPS[MAPV]) MAPV = MAPS.classic ? 'classic' : Object.keys(MAPS)[0]; }
const D = MAPS ? MAPS[MAPV] : window.__DATA__;
const CMP = D.compare || null;      // Freundes-Vergleich (zwei Profile in einer Karte)
const art = D.artists, trk = D.tracks, alb = D.albums, regs = D.regions, scs = D.scenes, HUD = D.hud;
const NA = art.length, NT = trk.length, NB = alb.length;
/* Zeitmodell: Tagesindex ab HUD.day0 (Epochentag des ersten Tages); Monate werden daraus abgeleitet */
let ND = HUD.nd; const D0 = HUD.day0;
const dayDate = d => new Date((D0 + d) * 86400000);
const MON = []; let NM = 0, DAY2M = new Int16Array(ND);
function buildMonths() {                      // Monate aus den Tagen ableiten (laeuft auch nach dem Nachladen neuer Tage)
  MON.length = 0; let d = 0;
  while (d < ND) { const dt = dayDate(d), y = dt.getUTCFullYear(), m = dt.getUTCMonth(); const e = Math.min(ND, Math.ceil(Date.UTC(y, m + 1, 1) / 86400000 - D0)) - 1; MON.push({ y, m, s: d, e, min: 0, n: 0 }); d = e + 1; }
  NM = MON.length; DAY2M = new Int16Array(ND);
  MON.forEach((mo, i) => { for (let d2 = mo.s; d2 <= mo.e; d2++) { DAY2M[d2] = i; mo.min += HUD.day_min[d2]; mo.n += HUD.day_n[d2]; } });
}
buildMonths();
const $ = id => document.getElementById(id);
let NF, NF1, NF2;
const MN = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
const FONTS = {
  sans: '"Segoe UI Variable Display","Segoe UI Variable Text","Segoe UI",system-ui,-apple-system,"Helvetica Neue",Arial,sans-serif',
  serif: 'Georgia,"Iowan Old Style","Palatino Linotype",Palatino,"Times New Roman",serif',
  mono: 'ui-monospace,"Cascadia Mono","SF Mono",Consolas,Menlo,monospace',
  round: '"Trebuchet MS","Segoe UI Rounded","Nunito","Avenir Next",Verdana,sans-serif'
};
let FONT = FONTS.sans;
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = n => NF.format(Math.round(n));
const monthLabel = i => MN[MON[i].m] + ' ' + MON[i].y;
const fmtDate = d => fmtDay(D0 + d);
const WDN = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'], wdOf = d => (D0 + d + 3) % 7;
const fmtDay = d => { const t = new Date(d * 86400000); return LANG === 'en' ? t.getUTCDate() + ' ' + MN[t.getUTCMonth()] + ' ' + t.getUTCFullYear() : String(t.getUTCDate()).padStart(2, '0') + '.' + String(t.getUTCMonth() + 1).padStart(2, '0') + '.' + t.getUTCFullYear(); };
setNumberFormats(); setLocaleArrays();
function fmtMin(m) { return m >= 100 ? fmt(m) + ' min' : NF2.format(m) + ' min'; }
function fmtHours(m) { return m >= 120 ? NF1.format(m / 60) + (LANG === 'en' ? ' h' : ' Std.') : ''; }
function fmtDur(m) { const h = fmtHours(m); return fmtMin(m) + (h ? ' · ' + h : ''); }
const norm = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const hex2rgb = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const rgb2hex = c => '#' + c.map(v => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')).join('');
const rgba = (rgb, a) => 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + a + ')';
function lighten(rgb, k) { return [Math.round(rgb[0] + (255 - rgb[0]) * k), Math.round(rgb[1] + (255 - rgb[1]) * k), Math.round(rgb[2] + (255 - rgb[2]) * k)]; }
function darken(rgb, k) { return [Math.round(rgb[0] * (1 - k)), Math.round(rgb[1] * (1 - k)), Math.round(rgb[2] * (1 - k))]; }
function ramp(stops, t) {
  t = clamp(t, 0, 1) * (stops.length - 1); const i = Math.min(stops.length - 2, Math.floor(t)), f = t - i;
  return [0, 1, 2].map(c => stops[i][c] + (stops[i + 1][c] - stops[i][c]) * f);
}

/* ---------- Einstellungen / Zustand ---------- */
const S = {
  theme: 'night', font: 'round', fontScale: 1, labelDensity: 1.2,
  regionLabels: true, regionSize: .5, sceneLabels: true,
  stars: true, glowAmt: 1.6,
  view: 'map',            // map | rows | spiral
  objs: 'artists',        // artists | songs   (nur Rangliste/Spirale)
  metric: 'min',          // min | str
  timeMode: 'dynamic',    // dynamic | fixed
  sizeCurve: 'sqrt',      // soft | sqrt | strong
  artScale: 1.1, songScale: 1.55, spread: .95, moonScale: 1,
  colorMode: 'region',    // region | heat | new
  cmpMode: 'excl', cmpMe: '#5698ff', cmpFr: '#ff9650',      // Freundes-Vergleich: excl = leuchtend nur einer / blass beide, ramp = Verlauf; Farben von "ich" und Freund
  linkAmt: 1.1, rings: true, followCam: true, animSpeed: .6,
  perf: 'balanced',
  rowDir: 'h', gridCols: 0, gridRows: 0,     // Reihen-Ansicht: Richtung (h Reihen / v Spalten), Spalten, Zeilen (0 = automatisch)
  topN: 0, minMin: 0, minStr: 0,      // Filter: nur Top-N, Mindest-Hoerzeit (min), Mindest-Streams
  who: 'B'                            // Vergleich: B = beide, M = ich, F = Freund
};
const PERF = {
  min: { dpr: 1, glow: 0, stars: false, lab: .45, snap: 1, q: 'low', glowRes: 1000, name: 'Minimal' },
  balanced: { dpr: 1.5, glow: 1, stars: true, lab: 1, snap: 15, q: 'low', glowRes: 1700, name: 'Ausgewogen' },
  max: { dpr: 2.5, glow: 1, stars: true, lab: 1.6, snap: 45, q: 'high', glowRes: 3200, name: 'Maximal' }
};
const PF = () => PERF[S.perf] || PERF.balanced;
const show = { songs: true, links: true, labels: true };
const UI = { minimap: false, legend: false, mmPos: null, timeline: true, clean: false };
const THEMES = {
  night: { name: 'Mitternacht', ui: 'dark', base: '#070910', bg: ['#0f1424', '#080a14', '#04050a'], dust: '190,205,255', glowMode: 'lighter', glowK: 1, halo: 'rgba(5,7,13,.88)', haloS: 'rgba(4,6,12,.82)', text: '#d9deee', textB: '#f3f5fb', sub: 'rgba(222,227,242,.92)', hl: '#ffffff', tint: 'light' },
  black: { name: 'Tiefschwarz', ui: 'dark', base: '#000000', bg: ['#050507', '#020203', '#000000'], dust: '210,215,255', glowMode: 'lighter', glowK: .8, halo: 'rgba(0,0,0,.92)', haloS: 'rgba(0,0,0,.88)', text: '#dde1ee', textB: '#ffffff', sub: 'rgba(222,227,242,.92)', hl: '#ffffff', tint: 'light' },
  paper: { name: 'Papier', ui: 'light', base: '#efe8d8', bg: ['#f8f3e9', '#efe8d8', '#e3dac4'], dust: null, glowMode: 'source-over', glowK: .5, halo: 'rgba(248,243,233,.92)', haloS: 'rgba(248,243,233,.9)', text: '#2a3042', textB: '#0e1220', sub: 'rgba(40,46,64,.92)', hl: '#111522', tint: 'dark' },
  ocean: { name: 'Ozean', ui: 'dark', base: '#062030', bg: ['#0e3a4f', '#08283a', '#041823'], dust: '160,230,255', glowMode: 'lighter', glowK: 1, halo: 'rgba(3,18,28,.88)', haloS: 'rgba(3,16,26,.84)', text: '#d6ecf5', textB: '#f1fbff', sub: 'rgba(214,236,245,.92)', hl: '#ffffff', tint: 'light' },
  forest: { name: 'Wald', ui: 'dark', base: '#07120d', bg: ['#102a1e', '#09160f', '#040a07'], dust: '170,255,200', glowMode: 'lighter', glowK: 1, halo: 'rgba(4,12,8,.88)', haloS: 'rgba(4,12,8,.82)', text: '#d9deee', textB: '#f3f5fb', sub: 'rgba(222,227,242,.92)', hl: '#ffffff', tint: 'light' },
  dusk: { name: 'Dämmerung', ui: 'dark', base: '#0d0a1c', bg: ['#2a1a4a', '#140e2a', '#080614'], dust: '215,190,255', glowMode: 'lighter', glowK: 1, halo: 'rgba(8,5,20,.88)', haloS: 'rgba(8,5,20,.82)', text: '#d9deee', textB: '#f3f5fb', sub: 'rgba(222,227,242,.92)', hl: '#ffffff', tint: 'light' },
  wine: { name: 'Bordeaux', ui: 'dark', base: '#14070b', bg: ['#3a1220', '#1c0911', '#0a0307'], dust: '255,200,210', glowMode: 'lighter', glowK: 1, halo: 'rgba(12,3,6,.88)', haloS: 'rgba(12,3,6,.82)', text: '#d9deee', textB: '#f3f5fb', sub: 'rgba(222,227,242,.92)', hl: '#ffffff', tint: 'light' },
  ember: { name: 'Glut', ui: 'dark', base: '#120b06', bg: ['#33200f', '#1a1008', '#090502'], dust: '255,220,170', glowMode: 'lighter', glowK: 1, halo: 'rgba(10,6,2,.88)', haloS: 'rgba(10,6,2,.82)', text: '#d9deee', textB: '#f3f5fb', sub: 'rgba(222,227,242,.92)', hl: '#ffffff', tint: 'light' },
  slate: { name: 'Schiefer', ui: 'dark', base: '#0e1114', bg: ['#232a33', '#14181d', '#07090b'], dust: '200,210,225', glowMode: 'lighter', glowK: 1, halo: 'rgba(7,9,11,.88)', haloS: 'rgba(7,9,11,.82)', text: '#d9deee', textB: '#f3f5fb', sub: 'rgba(222,227,242,.92)', hl: '#ffffff', tint: 'light' },
  sky: { name: 'Himmel', ui: 'light', base: '#e3eef8', bg: ['#f2f8fd', '#e3eef8', '#cfe0ee'], dust: null, glowMode: 'source-over', glowK: .5, halo: 'rgba(242,248,253,.92)', haloS: 'rgba(242,248,253,.9)', text: '#2a3042', textB: '#0e1220', sub: 'rgba(40,46,64,.92)', hl: '#111522', tint: 'dark' },
  rose: { name: 'Rosé', ui: 'light', base: '#f6e6e8', bg: ['#fdf3f4', '#f6e6e8', '#ebd2d6'], dust: null, glowMode: 'source-over', glowK: .5, halo: 'rgba(253,243,244,.92)', haloS: 'rgba(253,243,244,.9)', text: '#2a3042', textB: '#0e1220', sub: 'rgba(40,46,64,.92)', hl: '#111522', tint: 'dark' }
};
let TH = THEMES.night;
const tint = (rgb, k) => TH.tint === 'light' ? lighten(rgb, k) : darken(rgb, k * 1.05);
const SHORT = { 'Edwin Rosen': 'NDW · Indie', 'Andreas Bourani': 'Deutschpop', 'Lyno Nine8': 'Deutschrap', 'Zate': 'Rap', 'XXXTENTACION': 'Emo-Rap', 'Lofi Girl': 'Easy Listening', 'MXP': 'Dance', 'Nujabes': 'Jazz Beats', 'sign crushes motorist': 'Slowcore', 'Anri': 'City Pop', 'TV Girl': 'Pop', 'Radiohead': 'Rock', 'Tame Impala': 'Indie-Rock', 'The Neighbourhood': 'Alternative', 'Clairo': 'Bedroom Pop', 'inverted mind': 'R&B', 'Pastel Ghost': 'Witch House', 'Videoclub': 'French Pop', 'hkmori': 'Breakcore', 'Joost': 'Eurodance', 'C418': 'Elektronik' };
let PATH = 'map';          // Darstellungspfad: map | artists | songs

/* ---------- Daten aufbereiten ---------- */
let K_STR = HUD.minutes / Math.max(1, HUD.streams);
const nameGetter = o => { o.de = o.name; Object.defineProperty(o, 'name', { get() { return LANG === 'en' && o.en ? o.en : o.de; }, set(v) { o.de = v; }, enumerable: true, configurable: true }); };
regs.forEach(nameGetter); scs.forEach(nameGetter);
/* Gleich benannte Szenen ("Hip-Hop", "Hip-Hop 2", "Hip-Hop 3" ...) unterscheidbar machen: die zwei meistgehoerten Artists in Klammern (aeltere Karten-Staende tragen noch Nummern) */
(function nameScenesApart() {
  const num = n => (n || '').replace(/ \d+$/, ''), by = new Map();
  scs.forEach(s => { const k = s.reg + '|' + num(s.de); (by.get(k) || by.set(k, []).get(k)).push(s); });
  by.forEach(list => { if (list.length < 2) return; list.forEach(s => { const t2 = (s.sub || '').split(' · ').slice(0, 2).join(', '); if (!t2) return; const en = s.en ? (EN.has(num(s.en)) ? EN.get(num(s.en)) : num(s.en)) : null; s.de = num(s.de) + ' (' + t2 + ')'; if (en != null) s.en = en + ' (' + t2 + ')'; }); });
})();
regs.forEach(r => { r.rgb = hex2rgb(r.color); r.light = lighten(r.rgb, .35); r.cm = r.m; r.members = []; r.shortDe = SHORT[r.anchor] || r.de.split(/[ ,&]/)[0]; Object.defineProperty(r, 'short', { get() { return LANG === 'en' ? (r.short_en || T(r.shortDe)) : r.shortDe; }, enumerable: true, configurable: true }); r.bcx = r.cx; r.bcy = r.cy; r.brad = r.rad; r.tcx = r.cx; r.tcy = r.cy; r.trad = r.rad; r.act = r.n; });
scs.forEach(s => { s.rgb = hex2rgb(regs[s.reg].color); s.light = lighten(s.rgb, .4); s.cm = s.m; s.members = []; s.bcx = s.cx; s.bcy = s.cy; s.brad = s.rad; s.tcx = s.cx; s.tcy = s.cy; s.trad = s.rad; s.act = s.n; });
art.forEach((a, i) => {
  a.i = i; a.rgb = hex2rgb(a.c); a.c0 = a.c; a.rgb0 = a.rgb; a.cm = a.m; a.cs = a.st; a.sc = 1; a.tsc = 1; a.rank = i + 1; a.reg = regs[a.r]; a.scn = scs[a.s]; a.nbs = a.nb;
  a.bx = a.x; a.by = a.y; a.bR = a.R; a.bF = a.F; a.tx = a.x; a.ty = a.y; a.tR = a.R; a.tF = a.F; a.lv = a.m; a.rv = a.m; a.r2 = 0;
  regs[a.r].members.push(i); scs[a.s].members.push(i);
});
trk.forEach((t, k) => {
  t.i = k; t.rank = k + 1; t.cm = t.m; t.cs = t.st; t.sc = 1; t.tsc = 1; t.art = art[t.p]; t.rgb = t.art.rgb; t.c = t.art.c;
  t.bx = t.x; t.by = t.y; t.br = t.r; t.tx = t.x; t.ty = t.y; t.tr = t.r; t.lv = t.m; t.rv = t.m; t.r2 = 0;
});
alb.forEach((b, k) => { b.i = k; b.rank = k + 1; b.cm = b.m; b.cs = b.st; });
// Ringe (Orbitbahnen) je Hub aus den vorberechneten Mond-Positionen
art.forEach(a => {
  if (a.k === 0 && a.tr.length) {
    const acc = {};
    a.tr.forEach(t => { const m = trk[t]; if (m.ring >= 0) { const d = Math.hypot(m.x - a.x, m.y - a.y); (acc[m.ring] = acc[m.ring] || []).push(d); } });
    a.bRings = Object.keys(acc).map(k => acc[k].reduce((s, v) => s + v, 0) / acc[k].length);
  } else a.bRings = [];
  a.tRings = a.bRings;
});
const tagName = i => D.tags[i];
const edgeGroups = regs.map(() => []);
D.edges.forEach(e => edgeGroups[art[e[0]].r].push(e));
// Farbskalen fuer die alternativen Faerbungen
const HEAT = [[75, 108, 183], [96, 198, 196], [243, 226, 110], [255, 148, 72], [255, 77, 109]];
const NEWC = [[150, 110, 255], [90, 170, 255], [80, 225, 190], [200, 240, 110]];
const maxArtM = art[0].m, minF = Math.min.apply(null, art.map(a => a.f)), maxF = Math.max.apply(null, art.map(a => a.f));
function RS(a, k) { const c = a._rs || (a._rs = {}); return c[k] || (c[k] = rgba(a.rgb, k / 100)); }      // gecachter Strich-String
function recolor() {
  const mode = S.colorMode;
  art.forEach(a => {
    a._rs = null;
    if (mode === 'region') { a.c = a.c0; a.rgb = a.rgb0; }
    else if (mode === 'who' && CMP) { const rgb = whoRGB(a).map(Math.round); a.rgb = rgb; a.c = rgb2hex(rgb); }
    else {
      const rgb = mode === 'heat' ? ramp(HEAT, Math.log(1 + a.m) / Math.log(1 + maxArtM)) : ramp(NEWC, (a.f - minF) / Math.max(1, maxF - minF));
      a.rgb = rgb.map(Math.round); a.c = rgb2hex(rgb);
    }
  });
  trk.forEach(t => { t.rgb = t.art.rgb; t.c = t.art.c; });
  glowDirty = true; mmDirty = true; requestDraw();
}

/* ---------- Zeitraum ---------- */
let rA = 0, rB = ND - 1;
const isFull = () => rA === 0 && rB === ND - 1;
let _rs = 0;
function sumRange(dy) { let m = 0; _rs = 0; for (let k = 0; k < dy.length; k += 3) { const d = dy[k]; if (d > rB) break; if (d >= rA) { m += dy[k + 1]; _rs += dy[k + 2]; } } return m; }
let rangeMinutes = HUD.minutes, rangeStreams = HUD.streams;
function assignValues() {
  const str = S.metric === 'str';
  const KB = CMP ? HUD.minutesB / Math.max(1, HUD.streamsB) : K_STR;        // Basisgroessen (lv) beim Vergleich immer aus der gemeinsamen Summe
  for (let i = 0; i < NA; i++) { const a = art[i]; a.lv = str ? (CMP ? a.stB : a.st) * KB : (CMP ? a.mB : a.m); a.rv = str ? a.cs * K_STR : a.cm; }
  for (let k = 0; k < NT; k++) { const t = trk[k]; t.lv = str ? (CMP ? t.stB : t.st) * KB : (CMP ? t.mB : t.m); t.rv = str ? t.cs * K_STR : t.cm; }
}
function recompute() {
  const full = isFull();
  regs.forEach(r => r.cm = 0); scs.forEach(s => s.cm = 0);
  for (let k = 0; k < NT; k++) {
    const t = trk[k];
    if (full) { t.cm = t.m; t.cs = t.st; } else { t.cm = sumRange(t.dy); t.cs = _rs; }
    const pa = art[t.p]; regs[pa.r].cm += t.cm; scs[pa.s].cm += t.cm;
  }
  for (let i = 0; i < NA; i++) { const a = art[i]; if (full) { a.cm = a.m; a.cs = a.st; } else { a.cm = sumRange(a.dy); a.cs = _rs; } }
  for (let k = 0; k < NB; k++) { const b = alb[k]; if (full) { b.cm = b.m; b.cs = b.st; } else { b.cm = sumRange(b.dy); b.cs = _rs; } }
  rangeMinutes = 0; rangeStreams = 0;
  for (let i = rA; i <= rB; i++) { rangeMinutes += HUD.day_min[i]; rangeStreams += HUD.day_n[i]; }
  assignValues();
  glowDirty = true; mmDirty = true;
}
const fmtMetric = (cm, cs) => S.metric === 'str' ? fmt(cs) + ' Streams' : fmtMin(cm);

/* ---------- Atlas / Bilder ---------- */
const AT = D.atlas;
const imgA = new Image(), imgB = new Image(), imgC = new Image();
let miniA = null, atlasReady = false;
const AU = window.__ATLAS_URLS__;      // Produkt-Modus: Atlanten wurden im Browser aus den Cover-Bildern gebaut (fertige Object-URLs)
const urlA = AU ? AU.A : blobUrl(window.__ATLAS_A__), urlB = AU ? AU.B : blobUrl(window.__ATLAS_B__), urlC = AU ? AU.C : blobUrl(window.__ATLAS_C__);
function blobUrl(b64) {
  const bin = atob(b64), u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  return URL.createObjectURL(new Blob([u8], { type: 'image/webp' }));
}
document.documentElement.style.setProperty('--atlasA', 'url(' + urlA + ')');
document.documentElement.style.setProperty('--atlasB', 'url(' + urlB + ')');
document.documentElement.style.setProperty('--atlasC', 'url(' + urlC + ')');
const TA = AT.A.tile, CA = AT.A.cols, TB = AT.B.tile, CB = AT.B.cols, TC = AT.C.tile, CC = AT.C.cols;
function loadAtlas() {
  return new Promise(res => {
    let n = 0; const done = () => { if (++n === 3) res(); };
    imgA.onload = () => {
      miniA = document.createElement('canvas'); miniA.width = Math.ceil(imgA.width / 2); miniA.height = Math.ceil(imgA.height / 2);
      const c = miniA.getContext('2d'); c.imageSmoothingQuality = 'high'; c.drawImage(imgA, 0, 0, miniA.width, miniA.height); done();
    };
    imgB.onload = done; imgC.onload = done;
    imgA.src = urlA; imgB.src = urlB; imgC.src = urlC;
  });
}
/* Hi-Res-Nachladen aus dem Netz (nur wenn gross dargestellt, nicht im Artefakt) */
const hiCache = new Map(); let hiInflight = 0;
function hiUrl(kind, o) {
  const u = o.u; if (!u) return null;
  if (kind === 'a') return u.startsWith('http') ? u : 'https://i.scdn.co/image/ab67616100005174' + u;
  return u.startsWith('http') ? u.replace(/\{S\}/g, '400') : 'https://i.scdn.co/image/ab67616d00001e02' + u;
}
function hiImage(kind, o) {
  if (IS_ART) return null;
  const key = kind + o.i; const c = hiCache.get(key);
  if (c) return c.ok ? c.img : null;
  if (hiInflight >= 6) return null;
  const url = hiUrl(kind, o); if (!url) { hiCache.set(key, { ok: false }); return null; }
  const img = new Image(); const rec = { ok: false, img }; hiCache.set(key, rec); hiInflight++;
  img.onload = () => { rec.ok = true; hiInflight--; requestDraw(); };
  img.onerror = () => { hiInflight--; };
  img.src = url; return null;
}
const tileA = t => [(t % CA) * TA, ((t / CA) | 0) * TA];
const tileB = h => [(h % CB) * TB, ((h / CB) | 0) * TB];
const tileC = h => [(h % CC) * TC, ((h / CC) | 0) * TC];
function thumbStyle(t, size) {
  const [x, y] = tileA(t), s = size / TA;
  return 'width:' + size + 'px;height:' + size + 'px;background:var(--atlasA) -' + (x * s) + 'px -' + (y * s) + 'px/' + (AT.A.size[0] * s) + 'px ' + (AT.A.size[1] * s) + 'px no-repeat';
}
function thumbHiStyle(h, size) {
  const [x, y] = tileB(h), s = size / TB;
  return 'width:' + size + 'px;height:' + size + 'px;background:var(--atlasB) -' + (x * s) + 'px -' + (y * s) + 'px/' + (AT.B.size[0] * s) + 'px ' + (AT.B.size[1] * s) + 'px no-repeat';
}
function thumbCStyle(h, size) {
  const [x, y] = tileC(h), s = size / TC;
  return 'width:' + size + 'px;height:' + size + 'px;background:var(--atlasC) -' + (x * s) + 'px -' + (y * s) + 'px/' + (AT.C.size[0] * s) + 'px ' + (AT.C.size[1] * s) + 'px no-repeat';
}
const thumbA = (a, size) => '<span class="th c" style="' + thumbStyle(a.i, size) + '"></span>';
const thumbT = (t, size) => '<span class="th" style="' + thumbStyle(t.t, size) + '"></span>';

/* ---------- Canvas / Kamera ---------- */
const cv = $('map'), ctx = cv.getContext('2d', { alpha: false });
let W = 0, H = 0, DPR = 1;
const cam = { x: 0, y: 0, z: 0.15 };
let zMin = 0.08, zMax = 9, fly = null, raf = 0, glowDirty = true, inertia = null;
const LB = D.bounds.slice();            // aktuelle Layout-Grenzen [x0,y0,x1,y1]
function availBox() {
  const dw = document.body.classList.contains('drawer-open') && window.innerWidth > 900 ? (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--drawer-w')) + 28) : 0;
  const off = document.body.classList.contains('tl-off'), clean = document.body.classList.contains('clean');
  const top = clean ? 20 : (window.innerWidth > 900 ? 76 : 70), bottom = clean ? 20 : off ? (window.innerWidth > 900 ? 40 : 64) : (window.innerWidth > 900 ? 130 : 120);
  return { x0: 0, x1: W - dw, y0: top, y1: H - bottom, w: W - dw, h: H - bottom - top, dw };
}
function fitZoom(w, h, pad) { return Math.min(w / (Math.max(200, LB[2] - LB[0]) * pad), h / (Math.max(200, LB[3] - LB[1]) * pad)); }
/* Grenzen der Kamera: man kann hoechstens auf die halbe "Alles sehen"-Groesse herauszoomen und die Mitte der Ansicht nur wenig ueber die Karte hinaus schieben */
function updateZMin() { if (!W) return; const b = availBox(); zMin = Math.max(1e-4, fitZoom(b.w, b.h, 1.12) * .5); if (cam.z < zMin) cam.z = zMin; }
function clampCam() {
  const bw = Math.max(200, LB[2] - LB[0]), bh = Math.max(200, LB[3] - LB[1]);
  cam.x = clamp(cam.x, LB[0] - bw * .3, LB[2] + bw * .3); cam.y = clamp(cam.y, LB[1] - bh * .3, LB[3] + bh * .3);
}
function fitAll(animate) {
  updateZMin(); const b = availBox(), z = fitZoom(b.w, b.h, 1.12);
  const cx = (LB[0] + LB[2]) / 2, cy = (LB[1] + LB[3]) / 2;
  goto_(cx + (W / 2 - (b.x0 + b.x1) / 2) / z, cy + (H / 2 - (b.y0 + b.y1) / 2) / z, z, animate ? 1100 : 0);
}
function goto_(cx, cy, z, dur, bump) {
  z = clamp(z, zMin, zMax);
  if (!dur) { cam.x = cx; cam.y = cy; cam.z = z; fly = null; requestDraw(); return; }
  fly = { x0: cam.x, y0: cam.y, z0: cam.z, x1: cx, y1: cy, z1: z, t0: performance.now(), dur, bump };
  requestDraw();
}
function focusOn(x, y, r, pad, dur) {
  const b = availBox();
  const z = clamp(Math.min(b.w, b.h) / (2 * r * (pad || 1.35)), zMin, zMax);
  const ccx = (b.x0 + b.x1) / 2, ccy = (b.y0 + b.y1) / 2;
  goto_(x + (W / 2 - ccx) / z, y + (H / 2 - ccy) / z, z, dur == null ? 1000 : dur);
}
function stepFly(now) {
  if (!fly) return false;
  const t = clamp((now - fly.t0) / fly.dur, 0, 1);
  const e = t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const dist = Math.hypot(fly.x1 - fly.x0, fly.y1 - fly.y0) * Math.min(fly.z0, fly.z1) / Math.min(W, H);
  const bump = fly.bump != null ? fly.bump : clamp(dist * 0.55, 0, 1.3);
  const lz = lerp(Math.log(fly.z0), Math.log(fly.z1), e) - bump * Math.sin(Math.PI * t);
  cam.z = clamp(Math.exp(lz), zMin * 0.5, zMax);
  cam.x = lerp(fly.x0, fly.x1, e); cam.y = lerp(fly.y0, fly.y1, e);
  if (t >= 1) { cam.x = fly.x1; cam.y = fly.y1; cam.z = fly.z1; fly = null; return false; }
  return true;
}
function zoomAt(sx, sy, factor) {
  const nz = clamp(cam.z * factor, zMin, zMax); if (nz === cam.z) return;
  const wx = (sx - W / 2) / cam.z + cam.x, wy = (sy - H / 2) / cam.z + cam.y;
  cam.z = nz; cam.x = wx - (sx - W / 2) / nz; cam.y = wy - (sy - H / 2) / nz; fly = null; markInteract(); requestDraw();
}
function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, PF().dpr);
  W = window.innerWidth; H = window.innerHeight;
  cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR); snapValid = false; lastFullMs = 0;
  updateZMin(); requestDraw();
}

/* ---------- Glow-Feld (Nebel) ---------- */
let GX0 = 0, GY0 = 0, GSC = 5.5;
const glow = document.createElement('canvas'), gctx = glow.getContext('2d');
function setGlowBounds() {
  const pad = 700, w = LB[2] - LB[0] + 2 * pad, h = LB[3] - LB[1] + 2 * pad;
  GX0 = LB[0] - pad; GY0 = LB[1] - pad; GSC = Math.max(5.5, Math.max(w, h) / PF().glowRes);
  glow.width = Math.ceil(w / GSC); glow.height = Math.ceil(h / GSC);
}
setGlowBounds();
function buildGlow() {
  glowDirty = false;
  const g = gctx; g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, glow.width, glow.height);
  g.globalCompositeOperation = TH.glowMode === 'lighter' ? 'lighter' : 'source-over';
  const K = S.glowAmt * TH.glowK;
  if (K <= 0.01) { mmDirty = true; return; }
  if (PATH === 'map' && S.colorMode === 'region') {
    regs.forEach(r => {
      if (r.act === 0 || r.rad < 12) return;
      const x = (r.cx - GX0) / GSC, y = (r.cy - GY0) / GSC, rad = r.rad * 1.18 / GSC;
      const gr = g.createRadialGradient(x, y, 0, x, y, rad);
      gr.addColorStop(0, rgba(r.rgb, .17 * K)); gr.addColorStop(.55, rgba(r.rgb, .08 * K)); gr.addColorStop(1, rgba(r.rgb, 0));
      g.fillStyle = gr; g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
    });
  }
  const blob = (px, py, rr, rgb, w) => {
    const x = (px - GX0) / GSC, y = (py - GY0) / GSC, rad = rr / GSC;
    const gr = g.createRadialGradient(x, y, 0, x, y, rad);
    gr.addColorStop(0, rgba(rgb, w)); gr.addColorStop(1, rgba(rgb, 0));
    g.fillStyle = gr; g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  };
  if (PATH === 'songs') {
    for (let k = 0; k < NT; k++) { const t = trk[k]; if (t.sc < .05) continue; blob(t.x, t.y, t.r * 3.2 + 12, t.rgb, (0.08 + 0.2 * Math.min(1, t.r / 90)) * Math.sqrt(t.sc) * K); }
  } else {
    for (let i = 0; i < NA; i++) {
      const a = art[i]; if (a.sc < .05) continue;
      const rr = PATH === 'map' ? a.F * 1.25 + 14 : a.R * 2.4 + 12;
      blob(a.x, a.y, rr, a.rgb, (0.10 + 0.22 * Math.min(1, a.R / 140)) * Math.sqrt(a.sc) * K);
    }
  }
  mmDirty = true;
}

/* ---------- Staub / Sterne ---------- */
let dust = null, dustFor = null, dustPat = null;
function makeDust() {
  dust = document.createElement('canvas'); dust.width = dust.height = 900; dustFor = TH.dust; dustPat = null;
  if (!TH.dust) return;
  const c = dust.getContext('2d'); let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 190; i++) {
    const r = .4 + rnd() * 1.1; c.fillStyle = 'rgba(' + TH.dust + ',' + (.06 + rnd() * .28) + ')';
    c.beginPath(); c.arc(rnd() * 900, rnd() * 900, r, 0, 6.283); c.fill();
  }
}

/* ---------- Auswahl / Fokus ---------- */
let sel = null;            // {t:'a'|'k'|'b'|'r'|'s', i}
let hover = null;          // {t:'a'|'k', i}
let hl = null;             // Hervorhebung aus der Seitenleiste {t:'k', i}
let LINKV = null;          // Verbindungs-Finder: hervorgehobene Route { nodes: [Artist-Indizes], trks: [Song-Indizes der Endpunkte] }
const focus = { on: false, arts: new Set(), trks: new Set(), regs: null, scene: -1 };
function computeFocus() {
  focus.on = false; focus.arts.clear(); focus.trks.clear(); focus.regs = null; focus.scene = -1;
  if (!sel && !LINKV) return;
  focus.on = true;
  if (LINKV) { LINKV.nodes.forEach(i => focus.arts.add(i)); LINKV.trks.forEach(k => { focus.trks.add(k); trk[k].a.forEach(x => focus.arts.add(x)); }); }
  if (!sel) return;
  if (hideIs(sel.t, sel.i)) { if (!LINKV) focus.on = false; return; }      // ausgeblendetes Element: nichts hervorheben
  if (sel.t === 'a') {
    const a = art[sel.i]; focus.arts.add(a.i); a.tr.forEach(t => focus.trks.add(t)); a.ft.forEach(t => { focus.trks.add(t); focus.arts.add(trk[t].p); });
    a.nb.forEach(n => focus.arts.add(n[0]));
  } else if (sel.t === 'k') {
    const t = trk[sel.i]; focus.trks.add(t.i); t.a.forEach(x => focus.arts.add(x)); focus.arts.add(t.p);
    if (t.al >= 0) alb[t.al].tr.forEach(x => { focus.trks.add(x); focus.arts.add(trk[x].p); });
  } else if (sel.t === 'b') {
    const b = alb[sel.i]; b.tr.forEach(x => { focus.trks.add(x); focus.arts.add(trk[x].p); });
  } else if (sel.t === 'r') focus.regs = sel.i;
  else if (sel.t === 's') focus.scene = sel.i;
}
const inFocusA = a => !focus.on || focus.arts.has(a.i) || (focus.regs != null && a.r === focus.regs) || (focus.scene >= 0 && a.s === focus.scene);
const inFocusT = t => !focus.on || focus.trks.has(t.i) || (focus.regs != null && art[t.p].r === focus.regs) || (focus.scene >= 0 && art[t.p].s === focus.scene);

/* ---------- Raster fuer Treffererkennung ---------- */
const CELL = 180;
let grid = new Map(), tgrid = new Map();
const cellKey = (cx, cy) => cx * 100003 + cy;
function rebuildGrid() {
  grid = new Map(); tgrid = new Map();
  const ins = (m, id, x, y, r) => {
    const x0 = Math.floor((x - r) / CELL), x1 = Math.floor((x + r) / CELL), y0 = Math.floor((y - r) / CELL), y1 = Math.floor((y + r) / CELL);
    for (let cx = x0; cx <= x1; cx++) for (let cy = y0; cy <= y1; cy++) { const k = cellKey(cx, cy); let l = m.get(k); if (!l) m.set(k, l = []); l.push(id); }
  };
  if (PATH === 'songs') { for (let k = 0; k < NT; k++) { const t = trk[k]; if (t.sc > .02) ins(tgrid, k, t.x, t.y, t.r + 6); } }
  else for (let i = 0; i < NA; i++) { const a = art[i]; if (a.sc > .02) ins(grid, i, a.x, a.y, (PATH === 'map' ? a.F : a.R) + 6); }
}
const PICK_MIN = 7;     // Mindest-Trefferradius in Pixeln
function pick(sx, sy) {
  const z = cam.z, wx = (sx - W / 2) / z + cam.x, wy = (sy - H / 2) / z + cam.y;
  const key = cellKey(Math.floor(wx / CELL), Math.floor(wy / CELL));
  if (PATH === 'songs') {
    const cand = tgrid.get(key); if (!cand) return null;
    let best = null, bd = 1e9;
    for (let n = 0; n < cand.length; n++) {
      const t = trk[cand[n]]; const rr = Math.max(t.r * t.sc * z, PICK_MIN) / z;
      const dx = Math.abs(wx - t.x), dy = Math.abs(wy - t.y);
      if (dx <= rr && dy <= rr) { const d = Math.hypot(dx, dy) / rr; if (d < bd) { bd = d; best = { t: 'k', i: t.i }; } }
    }
    return best;
  }
  const cand = grid.get(key);
  if (!cand) return null;
  let best = null, bd = 1e9;
  for (let n = 0; n < cand.length; n++) {
    const a = art[cand[n]];
    const dx = wx - a.x, dy = wy - a.y;
    if (dx * dx + dy * dy > (a.F + 12 / z) * (a.F + 12 / z)) continue;
    if (PATH === 'map' && a.k === 1) {
      const t = trk[a.tr[0]]; const rr = Math.max(a.R * a.sc * z * .88, PICK_MIN) / z;
      if (Math.abs(dx) <= rr && Math.abs(dy) <= rr) { const d = Math.hypot(dx, dy) / rr; if (d < bd) { bd = d; best = { t: 'k', i: t.i }; } }
      continue;
    }
    if (PATH === 'map' && show.songs && a.F * z > 9) {
      for (let m = 0; m < a.tr.length; m++) {
        const t = trk[a.tr[m]]; if (t.sc < .05) continue; const rr = Math.max(t.r * t.sc * z, PICK_MIN * .8) / z;
        const ex = wx - t.x, ey = wy - t.y; const d = Math.hypot(ex, ey);
        if (d <= rr) { const q = d / rr - 1; if (q < bd) { bd = q; best = { t: 'k', i: t.i }; } }
      }
    }
    if (a.sc < .05) continue;
    const rr = Math.max(a.R * a.sc * z, PICK_MIN) / z; const d = Math.hypot(dx, dy);
    if (d <= rr) { const q = d / rr - .4; if (q < bd) { bd = q; best = { t: 'a', i: a.i }; } }
  }
  return best;
}

/* ---------- Zeichnen ---------- */
const labelRects = [];   // Treffer fuer Regionen-/Szenen-Beschriftungen
let frameStats = { drawn: 0 };
const textW = new Map();
function measure(txt, font) {
  const key = font + '|' + txt; let w = textW.get(key);
  if (w == null) { ctx.font = font; w = ctx.measureText(txt).width; if (textW.size > 4000) textW.clear(); textW.set(key, w); }
  return w;
}
function roundRectPath(x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function drawArtistImg(a, sx, sy, rs) {
  const d = rs * 2;
  if (rs > 90 && hiTier(a, 'a', sx, sy, rs)) return;
  if (rs > 46 && a.hc >= 0) { const [tx, ty] = tileC(a.hc); ctx.drawImage(imgC, tx, ty, TC, TC, sx - rs, sy - rs, d, d); return; }
  if (rs > 22 && a.h >= 0) { const [tx, ty] = tileB(a.h); ctx.drawImage(imgB, tx, ty, TB, TB, sx - rs, sy - rs, d, d); return; }
  const [tx, ty] = tileA(a.i);
  if (d <= 24 && miniA) ctx.drawImage(miniA, tx / 2, ty / 2, TA / 2, TA / 2, sx - rs, sy - rs, d, d);
  else ctx.drawImage(imgA, tx, ty, TA, TA, sx - rs, sy - rs, d, d);
}
function hiTier(o, kind, sx, sy, rs, square) {
  const im = hiImage(kind, o); if (!im) return false;
  ctx.save();
  if (square) roundRectPath(sx - rs, sy - rs, rs * 2, rs * 2, rs * .2); else { ctx.beginPath(); ctx.arc(sx, sy, rs, 0, 6.2832); }
  ctx.clip(); ctx.drawImage(im, sx - rs, sy - rs, rs * 2, rs * 2); ctx.restore(); return true;
}
function drawCoverImg(t, sx, sy, half) {
  const d = half * 2;
  const al = t.al >= 0 ? alb[t.al] : null;
  if (half > 90 && al && hiTier(al, 'b', sx, sy, half, true)) return;
  if (half > 46 && al && al.hc >= 0) { const [tx, ty] = tileC(al.hc); ctx.drawImage(imgC, tx, ty, TC, TC, sx - half, sy - half, d, d); return; }
  if (half > 22 && al && al.h >= 0) { const [tx, ty] = tileB(al.h); ctx.drawImage(imgB, tx, ty, TB, TB, sx - half, sy - half, d, d); return; }
  const [tx, ty] = tileA(t.t);
  if (d <= 24 && miniA) ctx.drawImage(miniA, tx / 2, ty / 2, TA / 2, TA / 2, sx - half, sy - half, d, d);
  else ctx.drawImage(imgA, tx, ty, TA, TA, sx - half, sy - half, d, d);
}

const labels = [];
/* Nur fuer Videoaufnahmen: window.__HIDE(text) -> true blendet diesen Namen aus (nicht gesetzt = nichts wird versteckt) */
const hidden = txt => !!(window.__HIDE && txt && window.__HIDE(String(txt)));
function addLabel(x, y, text, sub, fs, pri, rgb, anchor, bold) { if (hidden(text)) return; labels.push({ x, y, text, sub, fs: fs * S.fontScale, pri, rgb, anchor, bold }); }

function draw() {
  if (!atlasReady) return;
  if (glowDirty) buildGlow();
  if (dustFor !== TH.dust || !dust) makeDust();
  const z = cam.z, ox = W / 2 - cam.x * z, oy = H / 2 - cam.y * z;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = TH.base; ctx.fillRect(0, 0, W, H);
  const bg = ctx.createRadialGradient(W / 2, H * .42, 0, W / 2, H * .42, Math.max(W, H) * .75);
  bg.addColorStop(0, TH.bg[0]); bg.addColorStop(.6, TH.bg[1]); bg.addColorStop(1, TH.bg[2]);
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  if (S.stars && PF().stars && TH.dust) {
    if (!dustPat) dustPat = ctx.createPattern(dust, 'repeat');
    ctx.save(); ctx.translate(ox * .12, oy * .12); ctx.fillStyle = dustPat; ctx.globalAlpha = .9; ctx.fillRect(-ox * .12, -oy * .12, W, H); ctx.restore();
  }
  // Nebel
  if (S.glowAmt > .01 && PF().glow) {
    ctx.save(); ctx.globalCompositeOperation = TH.glowMode === 'lighter' ? 'lighter' : 'source-over';
    ctx.globalAlpha = clamp(1.15 - z * .45, .42, 1.1);
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = PF().q;
    const gx = GX0 * z + ox, gy = GY0 * z + oy, gw = glow.width * GSC * z, gh = glow.height * GSC * z;
    const vx0 = Math.max(0, gx), vy0 = Math.max(0, gy), vx1 = Math.min(W, gx + gw), vy1 = Math.min(H, gy + gh);
    if (vx1 > vx0 && vy1 > vy0) { const kk = glow.width / gw; ctx.drawImage(glow, (vx0 - gx) * kk, (vy0 - gy) * kk, (vx1 - vx0) * kk, (vy1 - vy0) * kk, vx0, vy0, vx1 - vx0, vy1 - vy0); }
    ctx.restore();
  }
  labelRects.length = 0; labels.length = 0;
  if (PATH === 'map' && show.links && S.linkAmt > .01) drawEdges(z, ox, oy);
  ctx.imageSmoothingEnabled = true;
  if (PATH === 'map') drawUnitsMap(z, ox, oy);
  else if (PATH === 'artists') drawUnitsArtists(z, ox, oy);
  else drawSongs(z, ox, oy);
  ctx.globalAlpha = 1;
  drawFocusOverlay(z, ox, oy);
  placed.length = 0;
  if (show.labels) { if (PATH === 'map') drawTerritoryNames(z, ox, oy); drawLabels(z, ox, oy); }
  drawMiniViewport();
}

/* Messung der Zeichenstufen (nur fuer die Entwicklung): window.__km.prof(n) */
function profileDraw(n) {
  const out = {}, z = cam.z, ox = W / 2 - cam.x * z, oy = H / 2 - cam.y * z;
  const T = (k, f) => { const t = performance.now(); for (let i = 0; i < n; i++) f(); out[k] = +((performance.now() - t) / n).toFixed(2); };
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  T('bg', () => { ctx.fillStyle = TH.base; ctx.fillRect(0, 0, W, H); const bg = ctx.createRadialGradient(W / 2, H * .42, 0, W / 2, H * .42, Math.max(W, H) * .75); bg.addColorStop(0, TH.bg[0]); bg.addColorStop(1, TH.bg[2]); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H); });
  T('dust', () => { if (!dustPat) dustPat = ctx.createPattern(dust, 'repeat'); ctx.save(); ctx.translate(ox * .12, oy * .12); ctx.fillStyle = dustPat; ctx.fillRect(-ox * .12, -oy * .12, W, H); ctx.restore(); });
  T('glow', () => { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.imageSmoothingQuality = 'high'; ctx.drawImage(glow, GX0 * z + ox, GY0 * z + oy, glow.width * GSC * z, glow.height * GSC * z); ctx.restore(); });
  T('edges', () => drawEdges(z, ox, oy));
  T('units', () => { labels.length = 0; drawUnitsMap(z, ox, oy); });
  T('overlay', () => drawFocusOverlay(z, ox, oy));
  T('names', () => { placed.length = 0; drawTerritoryNames(z, ox, oy); });
  T('labels', () => { placed.length = 0; drawLabels(z, ox, oy); });
  out.nLabels = labels.length; out.drawn = frameStats.drawn; out.W = W; out.H = H; out.DPR = DPR; out.z = +z.toFixed(3);
  return out;
}
/* ----- Karte: Artists, Einzel-Songs, Monde ----- */
function drawUnitsMap(z, ox, oy) {
  const vw = W, vh = H; let drawn = 0;
  const dimA = focus.on ? .16 : 1, dens = S.labelDensity;
  for (let i = 0; i < NA; i++) {
    const a = art[i];
    const fr = a.F * z, sx = a.x * z + ox, sy = a.y * z + oy;
    if (sx + fr < -20 || sx - fr > vw + 20 || sy + fr < -20 || sy - fr > vh + 20) continue;
    if (fr < .5) continue;
    const fa = inFocusA(a);
    ctx.globalAlpha = fa ? 1 : dimA;
    const s = a.sc;
    if (a.k === 1) {
      /* --- Einzel-Song-Kachel --- */
      const t = trk[a.tr[0]], half = a.R * Math.max(s, t.sc) * z * .88;
      if (half < .7) continue;
      drawn++;
      if (half < 2.4) { ctx.fillStyle = a.c; ctx.fillRect(sx - half, sy - half, half * 2, half * 2); continue; }
      drawCoverImg(t, sx, sy, half);
      if (half > 5) { ctx.lineWidth = Math.min(2, .9 + half * .02); ctx.strokeStyle = RS(a, fa ? 85 : 40); roundRectPath(sx - half, sy - half, half * 2, half * 2, half * .2); ctx.stroke(); }
      if (show.labels && half > 6.5 / dens && fa) addLabel(sx, sy + half + 4, t.n, a.n, clamp(10 + half * .06, 10.5, 15), a.cm * 1.0, a.rgb, 'below', false);
      continue;
    }
    const rs = a.R * s * z;
    drawn++;
    if (S.rings && show.songs && fr > 70 && fa && a.tRings.length && a.tF > 0) {
      const rk = a.F / a.tF;
      ctx.lineWidth = 1; ctx.strokeStyle = rgba(a.rgb, TH.tint === 'light' ? .13 : .22);
      for (let r = 0; r < a.tRings.length; r++) { ctx.beginPath(); ctx.arc(sx, sy, a.tRings[r] * rk * z, 0, 6.2832); ctx.stroke(); }
    }
    if (show.songs && fr > 9 && a.tr.length) {
      for (let m = 0; m < a.tr.length; m++) {
        const t = trk[a.tr[m]];
        const mr = t.r * t.sc * z; if (mr < .55) continue;
        const mx = t.x * z + ox, my = t.y * z + oy;
        if (mx + mr < 0 || mx - mr > vw || my + mr < 0 || my - mr > vh) continue;
        const ft = inFocusT(t);
        ctx.globalAlpha = ft ? 1 : dimA * (fa ? 1.2 : 1);
        const md = mr * S.moonScale;
        if (md < 2.1) { ctx.fillStyle = a.c; ctx.fillRect(mx - md, my - md, md * 2, md * 2); continue; }
        drawCoverImg(t, mx, my, md);
        if (md > 7) { ctx.lineWidth = 1; ctx.strokeStyle = RS(a, ft ? 70 : 30); roundRectPath(mx - md, my - md, md * 2, md * 2, md * .2); ctx.stroke(); }
        if (show.labels && ft && mr > 5 && (mr > 14 / dens || (t.rk <= 40 && mr > 5.5 && t.cm > 0) || (focus.on && focus.trks.has(t.i) && mr > 8) || hover && hover.t === 'k' && hover.i === t.i)) {
          addLabel(mx + md + 5, my, t.n, fmtMetric(t.cm, t.cs), clamp(10 + mr * .08, 10.5, 14), (focus.on && focus.trks.has(t.i) ? 1e7 : 0) + (t.rk <= 40 ? 2e6 : 0) + t.cm, a.rgb, 'right', t.rk <= 40);
        }
      }
      ctx.globalAlpha = fa ? 1 : dimA;
    }
    if (rs < 1.1) { if (rs > .3) { ctx.fillStyle = a.c; ctx.fillRect(sx - 1, sy - 1, 2, 2); } continue; }
    if (rs < 3.3) { ctx.fillStyle = a.c; ctx.beginPath(); ctx.arc(sx, sy, rs, 0, 6.2832); ctx.fill(); continue; }
    drawArtistImg(a, sx, sy, rs);
    ctx.lineWidth = clamp(rs * .07, 1.2, 4); ctx.strokeStyle = RS(a, fa ? 95 : 40);
    ctx.beginPath(); ctx.arc(sx, sy, rs + ctx.lineWidth * .5, 0, 6.2832); ctx.stroke();
    if (show.labels && fa && rs > 8 / dens) addLabel(sx, sy + rs + 5, a.n, rs > 34 ? fmtMetric(a.cm, a.cs) : null, clamp(10.5 + rs * .075, 11, 19), a.cm + (sel && sel.t === 'a' && sel.i === i ? 1e9 : 0), a.rgb, 'below', true);
  }
  frameStats.drawn = drawn;
}

/* ----- Rangliste/Spirale: Artists als Kreise ----- */
function drawUnitsArtists(z, ox, oy) {
  const dimA = focus.on ? .16 : 1, dens = S.labelDensity; let drawn = 0;
  for (let i = 0; i < NA; i++) {
    const a = art[i]; const rs = a.R * a.sc * z; if (rs < .5) continue;
    const sx = a.x * z + ox, sy = a.y * z + oy;
    if (sx + rs < -20 || sx - rs > W + 20 || sy + rs < -20 || sy - rs > H + 20) continue;
    const fa = inFocusA(a); ctx.globalAlpha = fa ? 1 : dimA; drawn++;
    if (rs < 1.1) { ctx.fillStyle = a.c; ctx.fillRect(sx - 1, sy - 1, 2, 2); continue; }
    if (rs < 3.3) { ctx.fillStyle = a.c; ctx.beginPath(); ctx.arc(sx, sy, rs, 0, 6.2832); ctx.fill(); continue; }
    drawArtistImg(a, sx, sy, rs);
    ctx.lineWidth = clamp(rs * .07, 1.2, 4); ctx.strokeStyle = RS(a, fa ? 95 : 40);
    ctx.beginPath(); ctx.arc(sx, sy, rs + ctx.lineWidth * .5, 0, 6.2832); ctx.stroke();
    if (show.labels && fa && rs > 9 / dens) addLabel(sx, sy + rs + 5, (a.r2 ? a.r2 + '. ' : '') + a.n, rs > 30 ? fmtMetric(a.cm, a.cs) : null, clamp(10.5 + rs * .07, 11, 18), a.rv + (sel && sel.t === 'a' && sel.i === i ? 1e9 : 0), a.rgb, 'below', true);
  }
  frameStats.drawn = drawn;
}

/* ----- Rangliste/Spirale: Songs als Kacheln ----- */
function drawSongs(z, ox, oy) {
  const dimA = focus.on ? .16 : 1, dens = S.labelDensity; let drawn = 0;
  for (let k = 0; k < NT; k++) {
    const t = trk[k]; const mr = t.r * t.sc * z; if (mr < .55) continue;
    const sx = t.x * z + ox, sy = t.y * z + oy;
    if (sx + mr < -20 || sx - mr > W + 20 || sy + mr < -20 || sy - mr > H + 20) continue;
    const ft = inFocusT(t); ctx.globalAlpha = ft ? 1 : dimA; drawn++;
    const md = mr * S.moonScale;
    if (md < 2.1) { ctx.fillStyle = t.c; ctx.fillRect(sx - md, sy - md, md * 2, md * 2); continue; }
    drawCoverImg(t, sx, sy, md);
    if (md > 6) { ctx.lineWidth = Math.min(2, .9 + md * .02); ctx.strokeStyle = rgba(t.rgb, ft ? .8 : .35); roundRectPath(sx - md, sy - md, md * 2, md * 2, md * .2); ctx.stroke(); }
    if (show.labels && ft && mr > 9 / dens) addLabel(sx, sy + md + 4, (t.r2 ? t.r2 + '. ' : '') + t.n, t.art.n + ' · ' + fmtMetric(t.cm, t.cs), clamp(10 + mr * .06, 10.5, 16), t.rv + (focus.on && focus.trks.has(t.i) ? 1e7 : 0), t.rgb, 'below', mr > 30);
  }
  frameStats.drawn = drawn;
}

/* ----- Regionen-/Szenen-Namen als Karten-Beschriftung ----- */
function wrapName(name, maxLen) {
  const words = name.split(' '); const lines = []; let cur = '';
  words.forEach(w => { if ((cur + ' ' + w).trim().length > maxLen && cur) { lines.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); });
  if (cur) lines.push(cur); return lines;
}
regs.forEach(r => { r.lines = wrapName(r.name.toUpperCase(), 17); });
scs.forEach(s => { s.lines = wrapName(s.name, 20); });
function drawTerritoryNames(z, ox, oy) {
  ctx.save(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  const ls = 'letterSpacing' in ctx;
  const hit = (x0, y0, x1, y1) => { for (let j = 0; j < placed.length; j++) { const p = placed[j]; if (x0 < p[2] && x1 > p[0] && y0 < p[3] && y1 > p[1]) return true; } return false; };
  const vs = clamp(Math.min(W, H) / 820, .42, 1.15);      // kleine Bildschirme: Schwellen skalieren
  if (S.regionLabels) {
    const order = regs.slice().sort((a, b) => b.rad - a.rad);
    for (let k = 0; k < order.length; k++) {
      const r = order[k]; if (r.act === 0 || r.rad < 10 || hidden(r.name)) continue;
      const px = r.rad * z; const al = smooth(34 * vs, 90 * vs, px) * (1 - smooth(150 * vs, 330 * vs, px)); if (al < .02) continue;
      const sx = r.cx * z + ox, sy = r.cy * z + oy; if (sx < -600 || sx > W + 600 || sy < -400 || sy > H + 400) continue;
      const dim = focus.on && focus.regs !== r.id && !(focus.arts.size && [...focus.arts].some(i => art[i].r === r.id)) ? .3 : 1;
      const fs0 = clamp(px * .105 * S.regionSize, 10, 34 * S.regionSize) * S.fontScale, cap = px * 1.5;
      const w0 = Math.max.apply(null, r.lines.map(l => l.length)) * fs0 * .64;
      const cands = r.short ? (w0 > cap * 1.4 ? [[r.short]] : [r.lines, [r.short]]) : [r.lines];       // zu eng oder Kollision -> Kurzname
      let P = null;
      for (let c = 0; c < cands.length && !P; c++) {
        const lines = cands[c]; let fs = fs0, widest = Math.max.apply(null, lines.map(l => l.length)) * fs * .64;
        if (widest > cap) fs = Math.max(9.5, fs * cap / widest);
        ctx.font = '700 ' + fs + 'px ' + FONT; if (ls) ctx.letterSpacing = (fs * .12) + 'px';
        const lh = fs * 1.08, h0 = -(lines.length - 1) / 2 * lh;
        let bw = 0; lines.forEach(l => { bw = Math.max(bw, ctx.measureText(l).width); });
        const showSub = fs >= 14 && lines === r.lines, sfs = clamp(fs * .4, 9.5, 14);
        const hh = lh * lines.length + (showSub ? sfs * 1.5 : 0);
        const rc = [sx - bw / 2 - 6, sy + h0 - fs * .6, sx + bw / 2 + 6, sy + h0 - fs * .6 + hh + 8];
        if (!hit(rc[0], rc[1], rc[2], rc[3])) P = { lines, fs, lh, h0, bw, showSub, sfs, hh, rc };
      }
      if (!P) continue;
      const { lines, fs, lh, h0, bw, showSub, sfs, hh } = P; placed.push(P.rc);
      ctx.font = '700 ' + fs + 'px ' + FONT; if (ls) ctx.letterSpacing = (fs * .12) + 'px';
      ctx.globalAlpha = al * .95 * dim;
      ctx.lineWidth = Math.max(3, fs * .16); ctx.strokeStyle = TH.haloS;
      lines.forEach((ln, j) => ctx.strokeText(ln, sx, sy + h0 + j * lh));
      ctx.fillStyle = rgba(tint(r.rgb, .22), 1);
      lines.forEach((ln, j) => ctx.fillText(ln, sx, sy + h0 + j * lh));
      if (showSub) {
        ctx.font = '500 ' + sfs + 'px ' + FONT; if (ls) ctx.letterSpacing = '0.03em';
        const sub = NF1.format((isFull() ? r.share : (rangeMinutes ? r.cm / rangeMinutes : 0)) * 100) + ' % ' + T('deiner Hörzeit') + ' · ' + r.act + ' Artists';
        const yy = sy + h0 + lines.length * lh - lh * .1 + sfs * .6;
        ctx.lineWidth = 3; ctx.strokeStyle = TH.haloS; ctx.strokeText(sub, sx, yy); ctx.fillStyle = TH.sub; ctx.fillText(sub, sx, yy);
      }
      labelRects.push({ t: 'r', i: r.id, x: sx - bw / 2, y: sy + h0 - fs / 2, w: bw, h: hh, prio: 2 });
    }
  }
  if (S.sceneLabels) {
    const sorder = scs.slice().sort((a, b) => b.cm - a.cm);
    for (let k = 0; k < sorder.length; k++) {
      const s = sorder[k]; if (s.n < 6 || s.act < 3 || hidden(s.name)) continue;
      const px = s.rad * z; const al = smooth(70 * vs, 140 * vs, px) * (1 - smooth(380 * vs, 800 * vs, px)); if (al < .02) continue;
      const sx = s.cx * z + ox, sy = s.cy * z + oy; if (sx < -300 || sx > W + 300 || sy < -200 || sy > H + 200) continue;
      const dim = focus.on && !(focus.scene === s.id || focus.regs === s.reg) ? .25 : 1;
      const fs = clamp(px * .085, 10, 22) * S.fontScale;
      const font = '600 ' + fs + 'px ' + FONT; ctx.font = font; if (ls) ctx.letterSpacing = (fs * .05) + 'px';
      let bw = 0; s.lines.forEach(l => { bw = Math.max(bw, ctx.measureText(l).width); });
      const lh = fs * 1.12, h0 = -(s.lines.length - 1) / 2 * lh, hh = lh * s.lines.length;
      const x0 = sx - bw / 2 - 4, y0 = sy + h0 - fs * .6, x1 = sx + bw / 2 + 4, y1 = y0 + hh + 4;
      if (hit(x0, y0, x1, y1)) continue;
      placed.push([x0, y0, x1, y1]);
      ctx.globalAlpha = al * dim; ctx.lineWidth = Math.max(3, fs * .18); ctx.strokeStyle = TH.haloS;
      s.lines.forEach((ln, j) => ctx.strokeText(ln, sx, sy + h0 + j * lh));
      ctx.fillStyle = rgba(tint(s.rgb, .4), 1); s.lines.forEach((ln, j) => ctx.fillText(ln, sx, sy + h0 + j * lh));
      labelRects.push({ t: 's', i: s.id, x: x0, y: y0, w: x1 - x0, h: hh, prio: 1 });
    }
  }
  ctx.restore();
}

function drawEdges(z, ox, oy) {
  const al = (z < .09 ? .10 : z < .5 ? .13 : .13 * (1 - smooth(.5, 2.4, z))) * (focus.on ? .35 : 1) * S.linkAmt * (TH.tint === 'dark' ? 1.7 : 1);
  if (al < .01) return;
  ctx.save(); ctx.lineWidth = (z < .3 ? .6 : .8) * (S.linkAmt > 1.2 ? 1.4 : 1);
  for (let r = 0; r < regs.length; r++) {
    const g = edgeGroups[r]; if (!g.length) continue;
    ctx.strokeStyle = rgba(tint(regs[r].rgb, .35), Math.min(.6, al)); ctx.beginPath();
    for (let n = 0; n < g.length; n++) {
      const A_ = art[g[n][0]], B_ = art[g[n][1]]; if (A_.sc < .05 || B_.sc < .05) continue;
      const x1 = A_.x * z + ox, y1 = A_.y * z + oy, x2 = B_.x * z + ox, y2 = B_.y * z + oy;
      if ((x1 < -10 && x2 < -10) || (x1 > W + 10 && x2 > W + 10) || (y1 < -10 && y2 < -10) || (y1 > H + 10 && y2 > H + 10)) continue;
      const mx = (x1 + x2) / 2 + (y2 - y1) * .08, my = (y1 + y2) / 2 - (x2 - x1) * .08;
      ctx.moveTo(x1, y1); ctx.quadraticCurveTo(mx, my, x2, y2);
    }
    ctx.stroke();
  }
  ctx.restore();
}

/* ----- Auswahl-Overlay: Verbindungen, Ringe, Hover ----- */
let pulse = 0;
function drawFocusOverlay(z, ox, oy) {
  ctx.save();
  if (LINKV) drawLinkOverlay(z, ox, oy);
  if (LIVE.on && LIVE.cur) drawLiveOverlay(z, ox, oy);
  if (RC.edit && (RC.sel.size || RC.band)) drawEditSel(z, ox, oy);
  const ring = (x, y, r, rgb, w) => { ctx.lineWidth = w; ctx.strokeStyle = rgba(rgb, .95); ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.stroke(); };
  const HLC = TH.hl, HLRGB = TH.tint === 'light' ? [255, 255, 255] : [16, 20, 34];
  if (sel && sel.t === 'a' && PATH !== 'songs') {
    const a = art[sel.i], sx = a.x * z + ox, sy = a.y * z + oy;
    if (PATH === 'map') {
      a.nb.forEach(n => {
        const b = art[n[0]]; if (b.sc < .05) return; const bx = b.x * z + ox, by = b.y * z + oy;
        const mx = (sx + bx) / 2 + (by - sy) * .12, my = (sy + by) / 2 - (bx - sx) * .12;
        const g = ctx.createLinearGradient(sx, sy, bx, by); g.addColorStop(0, rgba(a.rgb, .65)); g.addColorStop(1, rgba(b.rgb, .65));
        ctx.lineWidth = 1 + n[1] * 2.5; ctx.strokeStyle = g; ctx.setLineDash([4, 5]); ctx.beginPath(); ctx.moveTo(sx, sy); ctx.quadraticCurveTo(mx, my, bx, by); ctx.stroke(); ctx.setLineDash([]);
        const rb = Math.max(b.R * b.sc * z, 3.5) + 3; ctx.lineWidth = 1.4; ctx.strokeStyle = rgba(b.rgb, .7); ctx.beginPath(); ctx.arc(bx, by, rb, 0, 6.2832); ctx.stroke();
        if (show.labels && b.k === 0) addLabel(bx, by + rb + 4, b.n, null, 11, 5e8, b.rgb, 'below', false);
        else if (show.labels) addLabel(bx, by + rb + 4, trk[b.tr[0]] ? trk[b.tr[0]].n : b.n, b.n, 11, 5e8, b.rgb, 'below', false);
      });
      a.ft.forEach(k => {
        const t = trk[k]; if (t.sc < .05) return; const tx = t.x * z + ox, ty = t.y * z + oy;
        ctx.lineWidth = 1; ctx.strokeStyle = rgba(a.rgb, .4); ctx.setLineDash([2, 4]); ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(tx, ty); ctx.stroke(); ctx.setLineDash([]);
        const mr = Math.max(t.r * z, 3) + 2; ctx.lineWidth = 1.5; ctx.strokeStyle = rgba(a.rgb, .8); roundRectPath(tx - mr, ty - mr, mr * 2, mr * 2, mr * .25); ctx.stroke();
        if (show.labels) addLabel(tx + mr + 4, ty, t.n, 'Feature · ' + t.art.n, 11, 4e8, a.rgb, 'right', false);
      });
    }
    const rs = Math.max(PATH === 'map' && a.k === 1 ? a.R * .88 * z : a.R * a.sc * z, 5);
    pulse = (performance.now() % 2200) / 2200;
    ctx.globalAlpha = 1 - pulse; ring(sx, sy, rs + 6 + pulse * 22, a.rgb, 2); ctx.globalAlpha = 1;
    ring(sx, sy, rs + 5, TH.tint === 'light' ? [255, 255, 255] : [20, 24, 38], 1.6);
  } else if (sel && sel.t === 'k' && PATH !== 'artists') {
    const t = trk[sel.i], tx = t.x * z + ox, ty = t.y * z + oy, mr = Math.max(t.r * t.sc * z, 5);
    if (PATH === 'map') t.a.forEach(id => {
      const b = art[id]; if (b.i === t.p && b.k === 1 || b.sc < .05) return; const bx = b.x * z + ox, by = b.y * z + oy;
      ctx.lineWidth = 1.2; ctx.strokeStyle = rgba(b.rgb, .6); ctx.setLineDash([4, 5]); ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(bx, by); ctx.stroke(); ctx.setLineDash([]);
      const rb = Math.max(b.R * b.sc * z, 4) + 3; ctx.lineWidth = 1.6; ctx.strokeStyle = rgba(b.rgb, .9); ctx.beginPath(); ctx.arc(bx, by, rb, 0, 6.2832); ctx.stroke();
      if (show.labels) addLabel(bx, by + rb + 4, b.n, null, 12, 5e8, b.rgb, 'below', true);
    });
    pulse = (performance.now() % 2200) / 2200;
    ctx.globalAlpha = 1 - pulse; ctx.lineWidth = 2; ctx.strokeStyle = rgba(t.rgb, 1); roundRectPath(tx - mr - 6 - pulse * 20, ty - mr - 6 - pulse * 20, (mr + 6 + pulse * 20) * 2, (mr + 6 + pulse * 20) * 2, mr * .4 + 8); ctx.stroke(); ctx.globalAlpha = 1;
    ctx.lineWidth = 1.8; ctx.strokeStyle = HLC; roundRectPath(tx - mr - 4, ty - mr - 4, (mr + 4) * 2, (mr + 4) * 2, mr * .3 + 4); ctx.stroke();
  }
  [hover, hl].forEach(h => {
    if (!h) return;
    if (h.t === 'a' && PATH !== 'songs') {
      const a = art[h.i]; if (a.sc < .05) return; const sx = a.x * z + ox, sy = a.y * z + oy;
      if (PATH === 'map' && a.k === 1) { const hf = Math.max(a.R * .88 * z, 5) + 3; ctx.lineWidth = 2; ctx.strokeStyle = HLC; roundRectPath(sx - hf, sy - hf, hf * 2, hf * 2, hf * .25); ctx.stroke(); }
      else ring(sx, sy, Math.max(a.R * a.sc * z, 4) + 4, TH.tint === 'light' ? [255, 255, 255] : [20, 24, 38], 2);
    } else if (h.t === 'k' && PATH !== 'artists') {
      const t = trk[h.i]; if (t.sc < .05) return; const tx = t.x * z + ox, ty = t.y * z + oy, mr = Math.max(t.r * t.sc * z, 4) + 3;
      ctx.lineWidth = 2; ctx.strokeStyle = HLC; roundRectPath(tx - mr, ty - mr, mr * 2, mr * 2, mr * .3); ctx.stroke();
      if (show.labels && !(focus.on && focus.trks.has(t.i))) addLabel(tx + mr + 5, ty, t.n, t.art.n + ' · ' + fmtMetric(t.cm, t.cs), 12.5, 9e8, t.rgb, 'right', true);
    }
  });
  ctx.restore();
  if (sel && (sel.t === 'a' || sel.t === 'k')) requestDraw();     // Puls-Animation
}

/* ----- Beschriftungen mit Kollisionsvermeidung ----- */
const placed = [];
function drawLabels(z, ox, oy) {
  if (!labels.length) return;
  labels.sort((a, b) => b.pri - a.pri);
  const maxN = Math.round(clamp(260 * S.labelDensity * PF().lab, 50, 900)); let n = 0;
  ctx.save(); ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  const ls = 'letterSpacing' in ctx; if (ls) ctx.letterSpacing = '0px';
  for (let i = 0; i < labels.length && n < maxN; i++) {
    const L = labels[i];
    const f1 = (L.bold ? '650 ' : '500 ') + L.fs + 'px ' + FONT, f2 = '450 ' + Math.max(9.5, L.fs * .82) + 'px ' + FONT;
    const w1 = measure(L.text, f1), w2 = L.sub ? measure(L.sub, f2) : 0, w = Math.max(w1, w2);
    const h = L.fs * 1.25 + (L.sub ? L.fs * 1.0 : 0);
    let x0, y0;
    if (L.anchor === 'below') { x0 = L.x - w / 2; y0 = L.y; } else { x0 = L.x; y0 = L.y - h / 2; }
    if (x0 + w < 0 || x0 > W || y0 + h < 0 || y0 > H) continue;
    let hit = false;
    for (let j = 0; j < placed.length; j++) { const p = placed[j]; if (x0 < p[2] && x0 + w > p[0] && y0 < p[3] && y0 + h > p[1]) { hit = true; break; } }
    if (hit) continue;
    placed.push([x0 - 2, y0 - 1, x0 + w + 2, y0 + h + 1]); n++;
    ctx.textAlign = L.anchor === 'below' ? 'center' : 'left';
    const tx = L.x; const ty = y0 + L.fs * .62;
    ctx.font = f1; ctx.lineWidth = 3.4; ctx.strokeStyle = TH.halo; ctx.strokeText(L.text, tx, ty);
    ctx.fillStyle = L.bold ? TH.textB : TH.text; ctx.fillText(L.text, tx, ty);
    if (L.sub) {
      ctx.font = f2; const y2 = ty + L.fs * 1.0; ctx.lineWidth = 3; ctx.strokeStyle = TH.halo; ctx.strokeText(L.sub, tx, y2);
      ctx.fillStyle = rgba(tint(L.rgb, .25), .95); ctx.fillText(L.sub, tx, y2);
    }
  }
  ctx.restore();
}

/* ---------- Minimap: Nebel der Kontinente + Sichtfenster ---------- */
const mm = $('mm'), mctx = mm.getContext('2d');
let frameN = 0;
let mmDirty = true, mmW = 0, mmH = 0, mmScale = 1, mmOx = 0, mmOy = 0;
function mmResize() {
  const r = mm.getBoundingClientRect(); const d = Math.min(window.devicePixelRatio || 1, 2);
  if (!r.width || !r.height) { mmW = 0; mmH = 0; return; }
  mm.width = Math.round(r.width * d); mm.height = Math.round(r.height * d); mmW = r.width; mmH = r.height; mmDirty = true;
  mmFit();
}
function mmFit() {
  if (!mmW) return;
  const pw = Math.max(400, LB[2] - LB[0]) + 600, ph = Math.max(400, LB[3] - LB[1]) + 600;
  mmScale = Math.min((mmW - 16) / pw, (mmH - 38) / ph); mmOx = mmW / 2 - ((LB[0] + LB[2]) / 2) * mmScale; mmOy = (mmH + 22) / 2 - ((LB[1] + LB[3]) / 2) * mmScale;
}
let mmBase = null;
function drawMiniBase() {
  if (!mmW || !mm.width) { mmDirty = false; return; }
  mmFit();
  const d = Math.min(window.devicePixelRatio || 1, 2);
  if (!mmBase) mmBase = document.createElement('canvas'); mmBase.width = mm.width; mmBase.height = mm.height;
  const c = mmBase.getContext('2d'); c.setTransform(d, 0, 0, d, 0, 0); c.clearRect(0, 0, mmW, mmH);
  c.globalAlpha = 1; c.imageSmoothingEnabled = true;
  c.drawImage(glow, GX0 * mmScale + mmOx, GY0 * mmScale + mmOy, glow.width * GSC * mmScale, glow.height * GSC * mmScale);
  if (PATH === 'map') {
    c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = '700 8.5px ' + FONT; c.lineJoin = 'round'; c.lineWidth = 2.6; c.strokeStyle = TH.haloS;
    const used = [];
    regs.slice().sort((a, b) => b.rad - a.rad).forEach(r => {
      if (r.act < 8 || r.rad * mmScale < (mmW < 200 ? 13 : 9)) return;
      const x = r.cx * mmScale + mmOx, y = r.cy * mmScale + mmOy, w = c.measureText(r.short).width, h = 10;
      for (const u of used) if (x - w / 2 < u[2] && x + w / 2 > u[0] && y - h / 2 < u[3] && y + h / 2 > u[1]) return;
      used.push([x - w / 2, y - h / 2, x + w / 2, y + h / 2]);
      c.strokeText(r.short, x, y); c.fillStyle = rgba(tint(r.rgb, .3), 1); c.fillText(r.short, x, y);
    });
  }
  mmDirty = false;
}
function drawMiniViewport() {
  frameN++;
  if (!UI.minimap) return;
  if (!mmW || !mm.width) { if (frameN % 20 === 0) mmResize(); if (!mmW || !mm.width) return; }      // Selbstheilung: Groesse wurde beim Start noch nicht gemessen
  if (mmDirty) drawMiniBase();
  if (!mmBase || !mmBase.width) return;
  const d = Math.min(window.devicePixelRatio || 1, 2);
  mctx.setTransform(1, 0, 0, 1, 0, 0); mctx.clearRect(0, 0, mm.width, mm.height); mctx.drawImage(mmBase, 0, 0);
  mctx.setTransform(d, 0, 0, d, 0, 0);
  const x0 = (cam.x - W / 2 / cam.z) * mmScale + mmOx, y0 = (cam.y - H / 2 / cam.z) * mmScale + mmOy, w = W / cam.z * mmScale, h = H / cam.z * mmScale;
  mctx.lineWidth = 1.6; mctx.strokeStyle = TH.tint === 'light' ? 'rgba(255,255,255,.95)' : 'rgba(30,36,60,.9)'; mctx.fillStyle = TH.tint === 'light' ? 'rgba(255,255,255,.10)' : 'rgba(30,36,60,.08)';
  mctx.beginPath(); mctx.rect(x0, y0, w, h); mctx.fill(); mctx.stroke();
  mctx.lineWidth = 1; mctx.strokeStyle = TH.tint === 'light' ? 'rgba(20,24,40,.9)' : 'rgba(255,255,255,.9)'; mctx.beginPath(); mctx.rect(x0 + 1.6, y0 + 1.6, Math.max(0, w - 3.2), Math.max(0, h - 3.2)); mctx.stroke();
}
function mmToWorld(ev) {
  const r = mm.getBoundingClientRect(); return [(ev.clientX - r.left - mmOx) / mmScale, (ev.clientY - r.top - mmOy) / mmScale];
}

/* ---------- Animationsschleife ---------- */
function requestDraw() { if (!raf) raf = requestAnimationFrame(frame); }
/* Waehrend einer Kamerabewegung wird (wenn das volle Zeichnen langsam ist) das letzte Bild skaliert/verschoben;
   danach folgt ein scharfes Neuzeichnen. Das haelt Zoomen und Schieben auf schwacher Hardware fluessig. */
let lastFullMs = 0, lastInteract = 0, snap = null, snapValid = false, renderCam = { x: 0, y: 0, z: 1 }, settleT = 0;
function markInteract() { lastInteract = performance.now(); }
function fastDraw() {
  if (!snapValid) {
    if (!snap) snap = document.createElement('canvas');
    if (snap.width !== cv.width || snap.height !== cv.height) { snap.width = cv.width; snap.height = cv.height; }
    snap.getContext('2d').drawImage(cv, 0, 0); snapValid = true;
  }
  const z = cam.z, s = z / renderCam.z;
  const x0 = -W / 2 * s + (renderCam.x - cam.x) * z + W / 2, y0 = -H / 2 * s + (renderCam.y - cam.y) * z + H / 2;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = TH.base; ctx.fillRect(0, 0, W, H);
  ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'low';
  ctx.drawImage(snap, 0, 0, snap.width, snap.height, x0, y0, W * s, H * s);
  drawMiniViewport();
}
let lastT = 0;
function frame(now) {
  raf = 0;
  let more = false;
  const dt = Math.min(64, Math.max(1, now - (lastT || now - 16))); lastT = now;
  if (fly) { more = stepFly(now) || more; markInteract(); }
  if (inertia) {
    cam.x -= inertia.vx * dt / cam.z; cam.y -= inertia.vy * dt / cam.z; const f = Math.pow(.0016, dt / 1000);
    markInteract(); inertia.vx *= f; inertia.vy *= f; if (Math.hypot(inertia.vx, inertia.vy) < .005) inertia = null; else more = true;
  }
  clampCam();
  if (typeof stepAnim === 'function' && stepAnim(dt, now)) more = true;
  const camOnly = now - lastInteract < 170 && lastFullMs > PF().snap && atlasReady && !animOn && !solver && !(typeof glowDirty !== 'undefined' && glowDirty) && snapValid !== null;
  if (camOnly) {
    try { fastDraw(); } catch (err) { snapValid = false; }
    clearTimeout(settleT); settleT = setTimeout(requestDraw, 180);
  } else {
    const t0 = performance.now();
    try { draw(); renderCam = { x: cam.x, y: cam.y, z: cam.z }; snapValid = false; } catch (err) { if (!frame.err) { frame.err = 1; console.error('Zeichenfehler:', err); } }
    lastFullMs = lastFullMs * .5 + (performance.now() - t0) * .5;
  }
  if (more || (sel && (sel.t === 'a' || sel.t === 'k'))) requestDraw();
  if (typeof onCamera === 'function') onCamera();
}

/* =====================================================================
   KLANGKARTE – Layout-Engine
   Größen (Hörzeit/Streams), Orbit-Ringe, Kollisionsauflösung für die dynamische Zeitkarte,
   Rangliste (Reihen) und Spirale, sowie die Animation zwischen allen Zuständen.
   ===================================================================== */
const CURVES = { soft: { e: .38, k: Math.pow(40, .12) }, sqrt: { e: .5, k: 1 }, strong: { e: .62, k: Math.pow(40, -.12) } };
const sizeHub = v => v <= 0 ? 0 : S.artScale * (5 + 5.2 * CURVES[S.sizeCurve].k * Math.pow(v, CURVES[S.sizeCurve].e));
const sizeMoon = v => v <= 0 ? 0 : S.songScale * (2 + 3.6 * CURVES[S.sizeCurve].k * Math.pow(v, CURVES[S.sizeCurve].e));
const sizeTile = v => v <= 0 ? 0 : S.songScale * .88 * (5 + 5.2 * CURVES[S.sizeCurve].k * Math.pow(v, CURVES[S.sizeCurve].e));
const filtersOn = () => S.topN > 0 || S.minMin > 0 || S.minStr > 0 || (HID.n > 0 && !HID.off);          // Ausblenden zaehlt wie ein Filter: die uebrigen Artists ruecken zusammen, die Karte bleibt ohne Luecken
const passA = a => !isHidA(a) && (!S.topN || PATH === 'songs' || a.rk <= S.topN) && a.cm >= S.minMin && a.cs >= S.minStr;
const passT = t => !isHidT(t) && (!S.topN || PATH !== 'songs' || t.rk <= S.topN) && t.cm >= S.minMin && t.cs >= S.minStr;
const PADE = 8;     // Mindestabstand zwischen zwei Einheiten bei der Neuberechnung

function hash01(a, b) { let h = (Math.imul(a + 7, 374761393) + Math.imul(b + 13, 668265263)) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }

/* Monde auf konzentrischen Orbit-Ringen (gleiche Regeln wie in der Vorberechnung) */
function ringPack(Rhub, rs, seed) {
  const n = rs.length, pos = new Array(n), rings = [], gap = 3.4;
  let inner = Rhub + 5, remaining = [], ringNo = 0;
  for (let i = 0; i < n; i++) remaining.push(i);
  while (remaining.length && ringNo < 60) {
    const r0 = rs[remaining[0]], rho = inner + r0 + gap, circ = 2 * Math.PI * rho;
    const taken = [], rest = []; let used = 0;
    for (let q = 0; q < remaining.length; q++) { const k = remaining[q], w = 2 * rs[k] + gap; if (used + w <= circ * .985 || !taken.length) { taken.push(k); used += w; } else rest.push(k); }
    remaining = rest;
    const spacing = (circ - used) / taken.length; let ang = hash01(seed, ringNo) * 2 * Math.PI, maxr = 0;
    for (let q = 0; q < taken.length; q++) { const k = taken[q], w = 2 * rs[k] + gap + spacing, am = ang + (w / 2) / rho; pos[k] = [rho * Math.cos(am), rho * Math.sin(am)]; ang += w / rho; if (rs[k] > maxr) maxr = rs[k]; }
    rings.push(rho); inner = rho + maxr + 3.0; ringNo++;
  }
  return { pos, rings, F: n ? inner : Rhub };
}

/* Kollisionen auflösen: Einheiten bleiben nahe an ihrem Anker (a.ax/a.ay), überlappen aber nicht.
   Der Löser läuft in kleinen Zeitscheiben (step), damit die Oberfläche nie einfriert. Schnelles Raster mit
   Typed Arrays; jedes Paar wird nur in einer Zelle geprüft. */
function makeSolver(cfg) {
  const items = cfg.items, n = items.length, pull = cfg.pull, attract = cfg.attract || 0, grav = cfg.grav || 0, iters = cfg.iters;
  const fs = items.map(a => a.tF).sort((p, q) => p - q), medF = fs[n >> 1] || 20;
  const C = clamp(Math.round(medF * 3), 48, 110), h = PADE / 2 + 1;
  let head = new Int32Array(1024), nodeItem = new Int32Array(n * 4 + 16), nodeNext = new Int32Array(n * 4 + 16);
  const x0a = new Int32Array(n), y0a = new Int32Array(n), x1a = new Int32Array(n), y1a = new Int32Array(n), buf = new Int32Array(n + 1);
  let it = 0, f = 0, phase = 0;      // 0 = Hauptphase (mit Kraeften), 1 = Endreinigung (nur trennen)
  const pass = k => {
    let minx = 1e12, miny = 1e12, maxx = -1e12, maxy = -1e12;
    for (let q = 0; q < n; q++) { const a = items[q], r = a.tF + h; if (a.tx - r < minx) minx = a.tx - r; if (a.ty - r < miny) miny = a.ty - r; if (a.tx + r > maxx) maxx = a.tx + r; if (a.ty + r > maxy) maxy = a.ty + r; }
    const gw = Math.floor((maxx - minx) / C) + 2, gh = Math.floor((maxy - miny) / C) + 2, cells = gw * gh;
    if (head.length < cells) head = new Int32Array(cells * 2);
    head.fill(-1, 0, cells);
    let cnt = 0;
    for (let q = 0; q < n; q++) {
      const a = items[q], r = a.tF + h;
      const x0 = Math.floor((a.tx - r - minx) / C), x1 = Math.floor((a.tx + r - minx) / C), y0 = Math.floor((a.ty - r - miny) / C), y1 = Math.floor((a.ty + r - miny) / C);
      x0a[q] = x0; y0a[q] = y0; x1a[q] = x1; y1a[q] = y1; cnt += (x1 - x0 + 1) * (y1 - y0 + 1);
    }
    if (nodeItem.length < cnt) { nodeItem = new Int32Array(cnt * 2); nodeNext = new Int32Array(cnt * 2); }
    let m = 0;
    for (let q = 0; q < n; q++) for (let cy = y0a[q]; cy <= y1a[q]; cy++) for (let cx = x0a[q]; cx <= x1a[q]; cx++) { const c = cy * gw + cx; nodeItem[m] = q; nodeNext[m] = head[c]; head[c] = m++; }
    let maxOv = 0;
    for (let c = 0; c < cells; c++) {
      let node = head[c]; if (node < 0) continue;
      let bn = 0; while (node >= 0) { buf[bn++] = nodeItem[node]; node = nodeNext[node]; }
      if (bn < 2) continue;
      const ccx = c % gw, ccy = (c / gw) | 0;
      for (let u = 0; u < bn; u++) {
        const A = items[buf[u]];
        for (let v = u + 1; v < bn; v++) {
          const B = items[buf[v]];
          const need = A.tF + B.tF + PADE, dx = B.tx - A.tx, dy = B.ty - A.ty, d2 = dx * dx + dy * dy;
          if (d2 >= need * need) continue;
          const left = Math.max(A.tx - A.tF - h, B.tx - B.tF - h), top = Math.max(A.ty - A.tF - h, B.ty - B.tF - h);
          if (Math.floor((left - minx) / C) !== ccx || Math.floor((top - miny) / C) !== ccy) continue;
          let d = Math.sqrt(d2), ux, uy;
          if (d < 1e-3) { const an = hash01(buf[u], buf[v]) * 6.283; ux = Math.cos(an); uy = Math.sin(an); d = 0; } else { ux = dx / d; uy = dy / d; }
          const ov = need - d; if (ov > maxOv) maxOv = ov;
          const sa = (B.tF + 4) / (A.tF + B.tF + 8);             // schwere Einheiten bewegen sich weniger
          A.tx -= ux * ov * sa * k; A.ty -= uy * ov * sa * k; B.tx += ux * ov * (1 - sa) * k; B.ty += uy * ov * (1 - sa) * k;
        }
      }
    }
    return maxOv;
  };
  const forces = () => {
    let gx = 0, gy = 0;
    if (grav > 0) { let gw = 0; for (let q = 0; q < n; q++) { const a = items[q], w = a.tF * a.tF + 1; gx += a.tx * w; gy += a.ty * w; gw += w; } gx /= gw; gy /= gw; }
    for (let q = 0; q < n; q++) {
      const a = items[q];
      a.tx += (a.ax - a.tx) * pull; a.ty += (a.ay - a.ty) * pull;
      if (attract > 0 && a.nbl && a.nbl.length) {
        let sx = 0, sy = 0, sw = 0;
        for (let u = 0; u < a.nbl.length; u++) { const b = items[a.nbl[u][0]], w = a.nbl[u][1]; sx += b.tx * w; sy += b.ty * w; sw += w; }
        a.tx += (sx / sw - a.tx) * attract; a.ty += (sy / sw - a.ty) * attract;
      }
      if (grav > 0) { a.tx += (gx - a.tx) * grav; a.ty += (gy - a.ty) * grav; }
    }
  };
  return {
    /* Fuehrt Schritte aus, bis ms Millisekunden vergangen sind. true = fertig. */
    step(ms) {
      if (n < 2) return true;
      const t0 = performance.now();
      do {
        if (phase === 0) {
          if (it >= iters) { phase = 1; continue; }
          forces(); const ov = pass(.85); it++;
          if (!attract && ov < .35 && it > 4) phase = 1;
        } else {
          const ov = pass(1.15); f++;
          if (ov < .4 || f >= 400) return true;
        }
      } while (performance.now() - t0 < ms);
      return false;
    }
  };
}
let solver = null;

/* ---------- Karte (semantisches Layout, optional zeitabhängig) ---------- */
function layoutMap() {
  const ed = RC.edit, dyn = S.timeMode === 'dynamic', full = isFull(), useRange = dyn || full || ed, whoAll = !CMP || S.who === 'B';
  const baked = ed || S.metric === 'min' && S.sizeCurve === 'sqrt' && S.artScale === 1 && S.songScale === 1 && (full || !dyn) && !filtersOn() && whoAll;
  const act = [];
  let sNew = 0, sBase = 0;
  for (let i = 0; i < NA; i++) {
    const a = art[i], val = useRange ? a.rv : a.lv;
    const active = ed || (((full && whoAll) || !dyn || a.rv > 0) && passA(a) && (a.k !== 1 || passT(trk[a.tr[0]])));
    a.tsc = !active ? 0 : (useRange ? 1 : Math.sqrt(clamp(a.rv / Math.max(1e-9, a.lv), 0, 1)));
    if (baked) {
      a.tR = a.bR; a.tF = a.bF; a.tRings = a.bRings;
      for (let m = 0; m < a.tr.length; m++) { const t = trk[a.tr[m]]; t.tr = t.br; t.ox = t.bx - a.bx; t.oy = t.by - a.by; t.tsc = a.tsc && !isHidT(t) ? (useRange ? 1 : Math.sqrt(clamp(t.rv / Math.max(1e-9, t.lv), 0, 1))) : 0; }
    } else if (!active) {
      a.tR = sizeHub(a.lv); a.tF = a.tR; a.tRings = [];
      for (let m = 0; m < a.tr.length; m++) { const t = trk[a.tr[m]]; t.tsc = 0; t.ox = 0; t.oy = 0; t.tr = sizeMoon(t.lv); }
    } else if (a.k === 1) {
      a.tR = sizeHub(val); a.tF = a.tR; a.tRings = [];
    } else {
      a.tR = sizeHub(val);
      const list = [];
      for (let m = 0; m < a.tr.length; m++) { const t = trk[a.tr[m]], tv = useRange ? t.rv : t.lv; if (tv > 0 && passT(t)) list.push([t, sizeMoon(tv), tv]); else { t.tsc = 0; t.ox = 0; t.oy = 0; } }
      list.sort((p, q) => q[2] - p[2]);
      const rp = ringPack(a.tR, list.map(x => x[1]), a.i);
      for (let j = 0; j < list.length; j++) { const t = list[j][0]; t.tr = list[j][1]; t.ox = rp.pos[j][0]; t.oy = rp.pos[j][1]; t.tsc = useRange ? 1 : Math.sqrt(clamp(t.rv / Math.max(1e-9, t.lv), 0, 1)); }
      a.tF = Math.max(a.tR, rp.F); a.tRings = rp.rings;
    }
    if (a.tsc > 0) { act.push(a); sNew += a.tF * a.tF; sBase += a.bF * a.bF; }
  }
  let sc = 1, ccx = 0, ccy = 0;
  if (!baked && act.length) {       // Anker so skalieren, dass die aktiven Objekte etwa mit der Zieldichte gepackt sind (wenige Objekte -> enger)
    let w = 0, sx = 0, sy = 0;
    act.forEach(a => { const ww = a.tF * a.tF; w += ww; sx += a.bx * ww; sy += a.by * ww; }); ccx = sx / w; ccy = sy / w;
    let r2 = 0; act.forEach(a => { r2 += a.tF * a.tF * ((a.bx - ccx) * (a.bx - ccx) + (a.by - ccy) * (a.by - ccy)); });
    const rms = Math.sqrt(r2 / w) || 1, need = Math.sqrt(w / .46) / Math.SQRT2;
    sc = clamp(need / rms, .06, 1.6);
  }
  const spread = ed ? 1 : S.spread;
  for (let i = 0; i < NA; i++) { const a = art[i]; a.ax = ccx + (a.bx - ccx) * sc * spread; a.ay = ccy + (a.by - ccy) * sc * spread; a.tx = a.ax; a.ty = a.ay; }
  const partial = !ed && ((dyn && !full) || filtersOn());
  let cfg = null;
  if (partial || !baked || spread < 1) {
    if (partial) {
      const idxOf = new Map(); act.forEach((a, q) => idxOf.set(a.i, q));
      act.forEach(a => { a.nbl = []; for (let u = 0; u < a.nb.length; u++) { const q = idxOf.get(a.nb[u][0]); if (q != null) a.nbl.push([q, a.nb[u][1] + .05]); } });
      const f = clamp(900 / act.length, .4, 1);
      cfg = { items: act, iters: act.length > 900 ? 40 : 90, pull: .02, attract: .13 * f, grav: .02 * f };
    } else cfg = { items: act, iters: baked ? 24 : 36, pull: .07, attract: 0, grav: 0 };
  }
  syncMoons();
  return cfg;
}
/* Monde (und Einzel-Song-Kacheln) folgen ihrem Artist */
function syncMoons() {
  for (let i = 0; i < NA; i++) {
    const a = art[i];
    if (a.k === 1) { const t = trk[a.tr[0]]; t.tx = a.tx; t.ty = a.ty; t.tr = a.tR * .88; t.tsc = a.tsc; t.ox = 0; t.oy = 0; }
    else for (let m = 0; m < a.tr.length; m++) { const t = trk[a.tr[m]]; t.tx = a.tx + t.ox; t.ty = a.ty + t.oy; }
  }
}

/* ---------- Rangliste (Reihen) und Spirale ---------- */
function rowsLayout(items) {
  const gap = 8, n = items.length, vert = S.rowDir === 'v', C = S.gridCols | 0, R = S.gridRows | 0;
  if (C || R) {                                                   // festes Raster: waagerecht zaehlt die Spaltenzahl, senkrecht die Zeilenzahl (die andere nur bei Auto)
    const per = Math.max(1, vert ? (R || Math.ceil(n / C)) : (C || Math.ceil(n / R))), lines = Math.ceil(n / per);
    const nc = vert ? lines : per, nr = vert ? per : lines, w = new Float64Array(nc), h = new Float64Array(nr);
    items.forEach((it, i) => { const d = 2 * it.r + gap, dh = 2 * it.r * 1.26 + gap, ln = Math.floor(i / per), ps = i % per, c = vert ? ln : ps, r = vert ? ps : ln; it.gc = c; it.gr = r; if (d > w[c]) w[c] = d; if (dh > h[r]) h[r] = dh; });          // Zeilen etwas hoeher: Platz fuer Rang und Namen unter dem Kreis
    const xo = new Float64Array(nc + 1), yo = new Float64Array(nr + 1);
    for (let c = 0; c < nc; c++) xo[c + 1] = xo[c] + w[c]; for (let r = 0; r < nr; r++) yo[r + 1] = yo[r] + h[r];
    items.forEach(it => { it.x = xo[it.gc] + w[it.gc] / 2 - xo[nc] / 2; it.y = yo[it.gr] + h[it.gr] / 2 - yo[nr] / 2; });
    return;
  }
  let area = 0; items.forEach(it => { const d = 2 * it.r + gap; area += d * d; });
  const Wt = Math.max(2 * items[0].r + gap, Math.sqrt(area * 1.9));
  let x = 0, y = 0, rowH = 0, row = [];
  const flush = () => { const cy = y + rowH / 2; row.forEach(it => it.y = cy); y += rowH; row = []; x = 0; rowH = 0; };
  items.forEach(it => { const d = 2 * it.r + gap; if (x + d > Wt && row.length) flush(); if (!row.length) rowH = d; it.x = x + d / 2; x += d; row.push(it); });
  flush();
  items.forEach(it => { it.x -= Wt / 2; it.y -= y / 2; if (vert) { const t = it.x; it.x = it.y; it.y = t; } });          // senkrecht: dieselbe Anordnung gedreht (Spalte fuer Spalte)
}
function spiralLayout(items) {
  const B = 4096, outer = new Float64Array(B), gap = 8, TWO = 2 * Math.PI;
  let theta = 0;
  const bins = (c, span) => { let b0 = Math.floor((c - span) / TWO * B + .5), b1 = Math.floor((c + span) / TWO * B - .5); if (b1 < b0) b0 = b1 = Math.floor(c / TWO * B); return [b0, b1]; };
  items.forEach((it, idx) => {
    const r = it.r + gap / 2;
    if (idx === 0) { it.x = 0; it.y = 0; outer.fill(r); theta = 0; return; }
    let rho = r * 2, span = Math.asin(Math.min(1, r / Math.max(rho, r * 1.01)));
    for (let k = 0; k < 5; k++) {
      const c = theta + span, [b0, b1] = bins(c, span); let need = 0;
      for (let b = b0; b <= b1; b++) { const v = outer[((b % B) + B) % B]; if (v > need) need = v; }
      rho = need + r * 1.04 + 1; span = Math.asin(Math.min(1, r / rho));
    }
    const c = theta + span, [b0, b1] = bins(c, span);
    it.x = rho * Math.cos(c); it.y = rho * Math.sin(c);
    for (let b = b0; b <= b1; b++) { const bi = ((b % B) + B) % B; if (rho + r > outer[bi]) outer[bi] = rho + r; }
    theta = c + span;
  });
}
function layoutRank() {
  const songs = S.objs === 'songs', items = [];
  if (songs) {
    for (let k = 0; k < NT; k++) { const t = trk[k]; t.r2 = 0; if (t.rv > 0 && passT(t)) items.push({ o: t, v: t.rv, r: sizeTile(t.rv) }); else t.tsc = 0; }
    for (let i = 0; i < NA; i++) art[i].tsc = 0;
  } else {
    for (let i = 0; i < NA; i++) { const a = art[i]; a.r2 = 0; if (a.rv > 0 && passA(a)) items.push({ o: a, v: a.rv, r: sizeHub(a.rv) }); else a.tsc = 0; }
    for (let k = 0; k < NT; k++) trk[k].tsc = 0;
  }
  if (!items.length) return;
  items.sort((p, q) => q.v - p.v || q.o.m - p.o.m);
  items.forEach((it, i) => { it.o.r2 = i + 1; });
  if (S.view === 'rows') rowsLayout(items); else spiralLayout(items);
  const sp = S.spread;
  items.forEach(it => {
    const o = it.o; o.tsc = 1;
    if (songs) { o.tx = it.x * sp; o.ty = it.y * sp; o.tr = it.r; }
    else { o.tx = it.x * sp; o.ty = it.y * sp; o.tR = it.r; o.tF = it.r; o.tRings = []; }
  });
}

/* ---------- Grenzen, Regionen-Geometrie ---------- */
function computeBounds() {
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9, any = false;
  if (PATH === 'songs') { for (let k = 0; k < NT; k++) { const t = trk[k]; if (t.tsc > 0) { any = true; x0 = Math.min(x0, t.tx - t.tr); x1 = Math.max(x1, t.tx + t.tr); y0 = Math.min(y0, t.ty - t.tr); y1 = Math.max(y1, t.ty + t.tr); } } }
  else for (let i = 0; i < NA; i++) { const a = art[i]; if (a.tsc > 0) { any = true; const f = PATH === 'map' ? a.tF : a.tR; x0 = Math.min(x0, a.tx - f); x1 = Math.max(x1, a.tx + f); y0 = Math.min(y0, a.ty - f); y1 = Math.max(y1, a.ty + f); } }
  return any ? [x0, y0, x1, y1] : D.bounds.slice();
}
/* Mittelpunkt einer Gruppe (Kontinent, Szene), unempfindlich gegen Ausreisser: gewichteter Schwerpunkt, danach dreimal nur die Mitglieder
   innerhalb des 1,7-fachen gewichteten Median-Abstands. pts: [[x, y, Gewicht], ...] */
function robustCenter(pts) {
  let cx = 0, cy = 0, w = 0; pts.forEach(p => { cx += p[0] * p[2]; cy += p[1] * p[2]; w += p[2]; });
  if (!w) return null; cx /= w; cy /= w;
  if (pts.length < 8) return [cx, cy];
  for (let pass = 0; pass < 3; pass++) {
    const d = pts.map(p => [Math.hypot(p[0] - cx, p[1] - cy), p[2]]).sort((a, b) => a[0] - b[0]);
    let tot = 0; d.forEach(q => { tot += q[1]; }); let acc = 0, med = d[d.length - 1][0];
    for (const q of d) { acc += q[1]; if (acc >= tot * .6) { med = q[0]; break; } }
    const T = Math.max(150, med * 1.7); let sx = 0, sy = 0, sw = 0;
    pts.forEach(p => { if (Math.hypot(p[0] - cx, p[1] - cy) <= T) { sx += p[0] * p[2]; sy += p[1] * p[2]; sw += p[2]; } });
    if (!sw) break; cx = sx / sw; cy = sy / sw;
  }
  return [cx, cy];
}
function updateRegionGeom() {
  const geo = g => {
    let w = 0, n = 0; const pts = [];
    for (let q = 0; q < g.members.length; q++) { const a = art[g.members[q]]; if (a.tsc > .5) { const ww = a.tF * a.tF; w += ww; pts.push([a.tx, a.ty, ww]); n++; } }
    g.act = n; if (n && w) { const c = robustCenter(pts); g.tcx = c[0]; g.tcy = c[1]; g.trad = Math.sqrt(w / .62); } else g.trad = 0;
  };
  regs.forEach(geo); scs.forEach(geo);
}

/* ---------- Animation ---------- */
let animOn = false, lastGlowT = 0, layoutTimer = 0, layoutPending = null;
function snapAll() {
  for (let i = 0; i < NA; i++) { const a = art[i]; a.x = a.tx; a.y = a.ty; a.R = a.tR; a.F = a.tF; a.sc = a.tsc; }
  for (let k = 0; k < NT; k++) { const t = trk[k]; t.x = t.tx; t.y = t.ty; t.r = t.tr; t.sc = t.tsc; }
  regs.forEach(g => { g.cx = g.tcx; g.cy = g.tcy; g.rad = g.trad; }); scs.forEach(g => { g.cx = g.tcx; g.cy = g.tcy; g.rad = g.trad; });
}
function settleLayout() { animOn = false; glowDirty = true; mmDirty = true; rebuildGrid(); }
function stepAnim(dt, now) {
  if (!animOn && !solver) return false;
  const k = 1 - Math.exp(-dt / (130 / S.animSpeed));
  let moving = false;
  if (solver) { if (solver.step(7)) { solver = null; finishSolve(); } else { syncMoons(); updateRegionGeom(); } moving = true; }
  for (let i = 0; i < NA; i++) {
    const a = art[i];
    if (a.tsc === 0 && a.sc < .015) { a.sc = 0; a.x = a.tx; a.y = a.ty; a.R = a.tR; a.F = a.tF; continue; }
    if (a.sc < .02 && a.tsc > .5) { a.x = a.tx; a.y = a.ty; a.R = a.tR; a.F = a.tF; }
    const dx = a.tx - a.x, dy = a.ty - a.y, dR = a.tR - a.R, dF = a.tF - a.F, ds = a.tsc - a.sc;
    if (Math.abs(dx) < .3 && Math.abs(dy) < .3 && Math.abs(dR) < .3 && Math.abs(dF) < .3 && Math.abs(ds) < .004) { a.x = a.tx; a.y = a.ty; a.R = a.tR; a.F = a.tF; a.sc = a.tsc; continue; }
    a.x += dx * k; a.y += dy * k; a.R += dR * k; a.F += dF * k; a.sc += ds * k; moving = true;
  }
  for (let q = 0; q < NT; q++) {
    const t = trk[q];
    if (t.tsc === 0 && t.sc < .015) { t.sc = 0; t.x = t.tx; t.y = t.ty; t.r = t.tr; continue; }
    if (t.sc < .02 && t.tsc > .5) { t.x = t.tx; t.y = t.ty; t.r = t.tr; }
    const dx = t.tx - t.x, dy = t.ty - t.y, dr = t.tr - t.r, ds = t.tsc - t.sc;
    if (Math.abs(dx) < .3 && Math.abs(dy) < .3 && Math.abs(dr) < .3 && Math.abs(ds) < .004) { t.x = t.tx; t.y = t.ty; t.r = t.tr; t.sc = t.tsc; continue; }
    t.x += dx * k; t.y += dy * k; t.r += dr * k; t.sc += ds * k; moving = true;
  }
  const gk = k * .9;
  const gs = g => { const dx = g.tcx - g.cx, dy = g.tcy - g.cy, dr = g.trad - g.rad; if (Math.abs(dx) + Math.abs(dy) + Math.abs(dr) < .5) { g.cx = g.tcx; g.cy = g.tcy; g.rad = g.trad; return; } g.cx += dx * gk; g.cy += dy * gk; g.rad += dr * gk; moving = true; };
  regs.forEach(gs); scs.forEach(gs);
  if (moving) { if (now - lastGlowT > 110) { lastGlowT = now; glowDirty = true; rebuildGrid(); } }
  else settleLayout();
  return moving;
}
function boundsChanged(a, b) {
  const wa = a[2] - a[0], ha = a[3] - a[1], wb = b[2] - b[0], hb = b[3] - b[1];
  return Math.abs(wb / wa - 1) > .14 || Math.abs(hb / ha - 1) > .14 || Math.abs((b[0] + b[2]) / 2 - (a[0] + a[2]) / 2) > .12 * wa || Math.abs((b[1] + b[3]) / 2 - (a[1] + a[3]) / 2) > .12 * ha;
}
/* Neues Ziel-Layout berechnen und animiert ansteuern */
function setBounds(nb) { for (let q = 0; q < 4; q++) LB[q] = nb[q]; setGlowBounds(); mmFit(); updateZMin(); mmDirty = true; glowDirty = true; }
let solveFit = null;
function applyLayout(opts) {
  opts = opts || {};
  const prev = PATH;
  solver = null;
  PATH = S.view === 'map' ? 'map' : (S.objs === 'songs' ? 'songs' : 'artists');
  const cfg = PATH === 'map' ? layoutMap() : (layoutRank(), null);
  if (cfg) {
    solver = makeSolver(cfg);
    if (opts.instant) { while (!solver.step(1e9)); solver = null; syncMoons(); }
  }
  updateRegionGeom();
  const old = LB.slice(), nb = computeBounds();
  setBounds(nb);
  if (opts.instant) { snapAll(); settleLayout(); } else { animOn = true; glowDirty = true; mmDirty = true; }
  const refit = opts.fit === 'force' || prev !== PATH || (opts.fit !== false && S.followCam && boundsChanged(old, nb));
  if (refit) fitAll(!opts.instant);
  solveFit = { opts, nb: nb.slice() };
  requestDraw();
}
function finishSolve() {
  syncMoons(); updateRegionGeom();
  const nb = computeBounds(), old = solveFit ? solveFit.nb : LB.slice();
  setBounds(nb);
  if (S.followCam && !(solveFit && solveFit.opts.fit === false) && boundsChanged(old, nb)) fitAll(true);
  solveFit = null;
}
function scheduleLayout(delay, opts) {
  layoutPending = Object.assign(layoutPending || {}, opts || {});
  clearTimeout(layoutTimer);
  layoutTimer = setTimeout(() => { const o = layoutPending; layoutPending = null; applyLayout(o); }, delay == null ? 40 : delay);
}

/* =====================================================================
   KLANGKARTE – Oberfläche: HUD, Seitenleiste, Suche, Zeitleiste, Tour
   ===================================================================== */
const HOME_Q = ' ';
let artOrder = [], trkOrder = [], albOrder = [], regOrder = [];
function rankings() {
  const str = S.metric === 'str';
  artOrder = Array.from({ length: NA }, (_, i) => i).sort((a, b) => str ? art[b].cs - art[a].cs || art[b].cm - art[a].cm : art[b].cm - art[a].cm);
  trkOrder = Array.from({ length: NT }, (_, i) => i).sort((a, b) => str ? trk[b].cs - trk[a].cs || trk[b].cm - trk[a].cm : trk[b].cm - trk[a].cm);
  albOrder = Array.from({ length: NB }, (_, i) => i).sort((a, b) => str ? alb[b].cs - alb[a].cs || alb[b].cm - alb[a].cm : alb[b].cm - alb[a].cm);
  regOrder = regs.map(r => r.id).sort((a, b) => regs[b].cm - regs[a].cm);
  artOrder.forEach((i, r) => art[i].rk = r + 1); trkOrder.forEach((i, r) => trk[i].rk = r + 1); albOrder.forEach((i, r) => alb[i].rk = r + 1);
}
const totalRange = () => isFull() ? HUD.minutes : Math.max(1, rangeMinutes);
function rangeText() {
  if (isFull()) return T('Gesamte Zeit');
  const ma = DAY2M[rA], mb = DAY2M[rB];
  if (MON[ma].s === rA && MON[mb].e === rB) return ma === mb ? monthLabel(ma) : monthLabel(ma) + ' – ' + monthLabel(mb);
  return rA === rB ? WDN[wdOf(rA)] + ' ' + fmtDate(rA) : fmtDate(rA) + ' – ' + fmtDate(rB);
}

/* ---------- Mini-Balkendiagramm (Monate) ---------- */
function monthArr(dy, str) { const arr = new Array(NM).fill(0); for (let k = 0; k < dy.length; k += 3) arr[DAY2M[dy[k]]] += str ? dy[k + 2] : dy[k + 1]; return arr; }
function sparkHTML(dy, rgb) {
  const arr = monthArr(dy, S.metric === 'str');
  let s = 0; while (s < NM - 1 && arr[s] === 0) s++; s = Math.max(0, Math.min(s - 1, NM - 10));
  let mx = 0.0001; for (let i = s; i < NM; i++) mx = Math.max(mx, arr[i]);
  let bars = '';
  for (let i = s; i < NM; i++) {
    const inr = MON[i].e >= rA && MON[i].s <= rB; const h = arr[i] > 0 ? Math.max(6, Math.sqrt(arr[i] / mx) * 100) : 2;
    bars += '<i class="' + (inr ? 'in' : '') + '" style="height:' + h + '%" title="' + monthLabel(i) + ': ' + (S.metric === 'str' ? fmt(arr[i]) + ' Streams' : fmtMin(arr[i])) + '"></i>';
  }
  return '<div class="spark" style="--c:' + rgb + '">' + bars + '</div><div class="spark-l"><span>' + monthLabel(s) + '</span><span>' + monthLabel(NM - 1) + '</span></div>';
}
function peakMonth(dy) {
  const m = monthArr(dy, false), n = monthArr(dy, true); let b = -1, v = 0;
  for (let i = 0; i < NM; i++) if (m[i] > v) { v = m[i]; b = i; }
  return b >= 0 ? monthLabel(b) + ' (' + fmtMin(v) + ' · ' + fmt(n[b]) + ' Streams)' : '–';
}
const spotifyUrl = (kind, id, q) => id ? 'https://open.spotify.com/' + kind + '/' + id : 'https://open.spotify.com/search/' + encodeURIComponent(q);

/* ---------- Seitenleiste ---------- */
let drawerTab = 'detail', topMode = 'artists', topLimit = 60, songLimit = 40;
const body = document.body, dbody = $('dbody');
function openDrawer(tab) { body.classList.add('drawer-open'); if (tab) setTab(tab, true); }
function closeDrawer() { body.classList.remove('drawer-open'); }
function setTab(t, silent) {
  drawerTab = t; document.querySelectorAll('#drawer .tab').forEach(b => b.classList.toggle('on', b.dataset.tab === t));
  if (!silent) body.classList.add('drawer-open'); renderDrawer();
  /* aktiven Reiter in der (seitlich scrollbaren) Leiste sichtbar halten, z. B. „Optionen“ am rechten Rand */
  const on = document.querySelector('#drawer .tab.on'), tb = on && on.parentElement;
  if (tb && tb.scrollWidth > tb.clientWidth) { const r = on.getBoundingClientRect(), q = tb.getBoundingClientRect(); if (r.right > q.right) tb.scrollLeft += r.right - q.right + 8; else if (r.left < q.left) tb.scrollLeft -= q.left - r.left + 8; }
}
function renderDrawer() {
  const st = dbody.scrollTop;
  if (drawerTab === 'detail') dbody.innerHTML = detailHTML(); else if (drawerTab === 'top') dbody.innerHTML = topHTML(); else if (drawerTab === 'settings') dbody.innerHTML = settingsHTML(); else if (drawerTab === 'cmp') dbody.innerHTML = cmpHTML(); else if (drawerTab === 'link') { dbody.innerHTML = linkHTML(); } else dbody.innerHTML = regionsHTML();
  if (drawerTab === 'settings') settingsFold();
  dbody.scrollTop = st;
  if (drawerTab === 'detail' && sel) {
    if (sel.t === 'a') upgradeHero('a', art[sel.i]); else if (sel.t === 'k') { const al = alb[trk[sel.i].al]; if (al) upgradeHero('b', al); } else if (sel.t === 'b') upgradeHero('b', alb[sel.i]);
  }
}
function upgradeHero(kind, o) {
  if (IS_ART) return;
  const url = hiUrl(kind, o); const el = $('hero-pic'); if (!url || !el) return;
  const im = new Image(); im.onload = () => { if (el.isConnected) { el.style.background = 'url(' + url + ') center/cover'; } }; im.src = url;
}
const rangeBadge = () => isFull() ? '' : '<div class="rangebadge">⏱ ' + rangeText() + '</div>';
function kpi(label, val, small) { return '<div class="kpi"><span>' + label + '</span><b>' + val + '</b>' + (small ? '<small>' + small + '</small>' : '') + '</div>'; }

const mainVal = o => S.metric === 'str' ? fmt(o.cs) + '×' : fmtMin(o.cm);
const subVal = o => S.metric === 'str' ? fmtMin(o.cm) : fmt(o.cs) + '× gestreamt';
const barVal = o => S.metric === 'str' ? o.cs : o.cm;
function trackRow(t, maxCm, idx, opt) {
  opt = opt || {};
  const bar = maxCm > 0 ? Math.max(2, barVal(t) / maxCm * 100) : 0;
  const sub = opt.artist ? esc(t.a.map(i => art[i].n).join(', ')) : (t.al >= 0 ? esc(alb[t.al].n) : '');
  return '<div class="row img" data-go="k' + t.i + '" data-hl="k' + t.i + '" style="--c:' + t.c + '"><div>' + thumbT(t, 36) + '</div><div class="rt"><div class="nm">' + esc(t.n) + '</div><div class="sb">' + sub + '</div><div class="bar"><i style="width:' + bar + '%"></i></div></div><div class="mn">' + mainVal(t) + '<small>' + subVal(t) + '</small></div></div>';
}
function artistRow(a, maxCm, i) {
  const bar = maxCm > 0 ? Math.max(2, barVal(a) / maxCm * 100) : 0;
  return '<div class="row img" data-go="a' + a.i + '" data-hl="a' + a.i + '" style="--c:' + a.c + '"><div>' + thumbA(a, 36) + '</div><div class="rt"><div class="nm">' + esc(a.n) + '</div><div class="sb">' + esc(a.reg.name) + '</div><div class="bar"><i style="width:' + bar + '%"></i></div></div><div class="mn">' + mainVal(a) + '<small>' + subVal(a) + '</small></div></div>';
}
function albumRowHTML(b, maxCm) {
  const bar = maxCm > 0 ? Math.max(2, barVal(b) / maxCm * 100) : 0; const ar = b.a >= 0 ? art[b.a] : null;
  return '<div class="row img" data-go="b' + b.i + '" style="--c:' + (ar ? ar.c : '#8fb6ff') + '"><div><span class="th" style="' + thumbStyle(b.t, 36) + '"></span></div><div class="rt"><div class="nm">' + esc(b.n) + '</div><div class="sb">' + (ar ? esc(ar.n) : '') + '</div><div class="bar"><i style="width:' + bar + '%"></i></div></div><div class="mn">' + mainVal(b) + '<small>' + subVal(b) + '</small></div></div>';
}

function detailHTML() {
  if (!sel) return homeHTML();
  if (sel.t === 'a') return artistHTML(art[sel.i]);
  if (sel.t === 'k') return trackHTML(trk[sel.i]);
  if (sel.t === 'b') return albumHTML(alb[sel.i]);
  if (sel.t === 'r') return regionHTML(regs[sel.i]);
  if (sel.t === 's') return sceneHTML(scs[sel.i]);
  return '';
}
function homeHTML() {
  const ta = artOrder.slice(0, 5).map(i => artistRow(art[i], barVal(art[artOrder[0]]))).join('');
  const tt = trkOrder.slice(0, 5).map(i => trackRow(trk[i], barVal(trk[trkOrder[0]]), 0, { artist: true })).join('');
  return rangeBadge() + '<div class="hero"><div><h2>Willkommen auf deiner Klangkarte</h2><div class="sub">Klicke einen Artist, Song oder Kontinent an – oder nutze die Suche oben.</div></div></div>'
    + '<div class="sect"><h3>Meistgehörte Artists</h3>' + ta + '</div><div class="sect"><h3>Meistgehörte Songs</h3>' + tt + '</div>'
    + '<div class="btns"><button class="btn" data-act="tab-top">Alle Bestenlisten</button><button class="btn" data-act="tour">▶ Geführte Tour</button></div>';
}
function artistHTML(a) {
  const col = a.c;
  let h = rangeBadge();
  const pic = a.hc >= 0 ? thumbCStyle(a.hc, 84) : a.h >= 0 ? thumbHiStyle(a.h, 84) : thumbStyle(a.i, 84);
  h += '<div class="hero" style="--c:' + col + '"><div class="pic" id="hero-pic" style="' + pic + '"></div><div><h2>' + esc(a.n) + '</h2><div class="sub">Artist · Rang <b>#' + a.rk + '</b>' + (isFull() ? '' : ' im Zeitraum') + ' von ' + NA + '</div></div></div>';
  h += hideNote('a', a.i);
  h += '<div class="chips"><span class="chip reg" style="--c:' + regs[a.r].color + '" data-go="r' + a.r + '">' + esc(regs[a.r].name) + '</span><span class="chip reg" style="--c:' + regs[a.r].color + '" data-go="s' + a.s + '">' + esc(scs[a.s].name) + '</span>' + (a.gx ? a.gx : a.g.slice(0, 6).map(tagName)).map(g => '<span class="chip">' + esc(g) + '</span>').join('') + '</div>';
  h += '<div class="kpis">' + kpi('Hörzeit', fmtMin(a.cm), fmtHours(a.cm)) + kpi('Streams', fmt(a.cs), isFull() ? 'gesamt' : 'im Zeitraum') + kpi('Anteil', NF1.format(a.cm / totalRange() * 100) + ' %', 'deiner Hörzeit') + '</div>';
  h += '<div class="sect"><h3>Verlauf <em>' + (S.metric === 'str' ? 'Streams' : 'Minuten') + ' pro Monat</em></h3>' + sparkHTML(a.dy, col) + '<div class="rec" style="margin-top:8px">Erster Stream <b>' + fmtDay(a.f) + '</b> · Zuletzt <b>' + fmtDay(a.l) + '</b><br>Stärkster Monat: <b>' + peakMonth(a.dy) + '</b></div></div>';
  // Songs
  const trs = a.tr.map(k => trk[k]).filter(t => isFull() || t.cm > 0).sort((x, y) => y.cm - x.cm);
  if (trs.length) {
    const mx = barVal(trs[0]), shown = trs.slice(0, songLimit);
    h += '<div class="sect"><h3>Gehörte Songs <em>' + trs.length + '</em></h3>' + shown.map(t => trackRow(t, mx, 0)).join('') + (trs.length > songLimit ? '<div class="btns"><button class="btn" data-act="more-songs">Alle ' + trs.length + ' anzeigen</button></div>' : '') + '</div>';
  } else if (a.k === 0 && !a.ft.length) h += '<div class="sect"><h3>Songs</h3><div class="muted">Keine Songs in diesem Zeitraum.</div></div>';
  const fts = a.ft.map(k => trk[k]).filter(t => isFull() || t.cm > 0).sort((x, y) => y.cm - x.cm);
  if (fts.length) h += '<div class="sect"><h3>Als Feature <em>' + fts.length + '</em></h3>' + fts.slice(0, 20).map(t => trackRow(t, fts[0].cm, 0, { artist: true })).join('') + '</div>';
  const als = a.al.map(k => alb[k]).filter(b => isFull() || b.cm > 0).sort((x, y) => y.cm - x.cm).slice(0, 9);
  if (als.length) h += '<div class="sect"><h3>Alben</h3><div class="alb-grid">' + als.map(b => '<div class="alb" data-go="b' + b.i + '"><span class="th" style="' + thumbStyle(b.t, 100) + ';display:block;border-radius:9px"></span><b>' + esc(b.n) + '</b><span>' + fmtMin(b.cm) + '</span></div>').join('') + '</div></div>';
  if (a.nb.length) h += '<div class="sect"><h3>Liegt nah bei <em>Tippe „?“ für den Grund</em></h3><div class="nb-grid">' + a.nb.map(n => { const b = art[n[0]]; return '<div class="nb" data-go="a' + b.i + '">' + thumbA(b, 46) + '<span>' + esc(b.n) + '</span><i class="why" data-why="' + a.i + '-' + b.i + '" title="Warum liegt ' + esc(b.n) + ' hier?">?</i></div>'; }).join('') + '</div></div>';
  h += '<div class="btns"><a class="btn pri" target="_blank" rel="noopener" href="' + spotifyUrl('artist', a.sp, a.n) + '">In Spotify öffnen ↗</a><button class="btn" data-act="center">Auf Karte zeigen</button><button class="btn" data-act="lk-from">Verbindung finden …</button><button class="btn" data-act="art-home">Zum Kontinent zurückholen</button>' + hideBtn('a', a.i) + fixBtn('a', a.i) + '</div>';
  return h;
}
function artistLinks(t) { return t.a.map(i => '<a href="#" data-go="a' + i + '" style="color:' + art[i].c + '">' + esc(art[i].n) + '</a>').join(', '); }
let audio = null, audioId = -1;
function trackHTML(t) {
  const col = t.c, al = t.al >= 0 ? alb[t.al] : null;
  let h = rangeBadge();
  h += '<div class="hero" style="--c:' + col + '"><div class="pic sq" id="hero-pic" style="' + (al && al.hc >= 0 ? thumbCStyle(al.hc, 84) : al && al.h >= 0 ? thumbHiStyle(al.h, 84) : thumbStyle(t.t, 84)) + '"></div><div><h2>' + esc(t.n) + '</h2><div class="sub">Song von ' + artistLinks(t) + (t.ex ? ' · <span class="chip" style="padding:0 6px">E</span>' : '') + '</div></div></div>';
  h += hideNote('k', t.i);
  if (al) h += '<div class="chips"><span class="chip reg" style="--c:' + col + '" data-go="b' + al.i + '">💿 ' + esc(al.n) + '</span><span class="chip reg" style="--c:' + regs[t.art.r].color + '" data-go="r' + t.art.r + '">' + esc(regs[t.art.r].name) + '</span></div>';
  if (t.gx) h += '<div class="chips">' + t.gx.map(g => '<span class="chip">' + esc(g) + '</span>').join('') + '</div>';
  const avg = t.d && t.st ? Math.min(100, t.m * 60 / t.st / t.d * 100) : 0;
  h += '<div class="kpis">' + kpi('Hörzeit', fmtMin(t.cm), fmtHours(t.cm)) + kpi('Streams', fmt(t.cs), isFull() ? 'gesamt' : 'im Zeitraum') + kpi('Rang', '#' + t.rk, 'von ' + NT + ' Songs') + '</div>';
  h += '<div class="btns" style="margin-top:12px">' + (t.pv && !IS_ART ? '<button class="btn pri" data-act="play-prev" id="pv-btn">' + (audioId === t.i ? '⏸ Vorschau stoppen' : '▶ 30-Sek.-Vorschau') + '</button>' : '') + '<a class="btn' + (IS_ART || !t.pv ? ' pri' : '') + '" target="_blank" rel="noopener" href="' + spotifyUrl('track', t.sp, t.n + ' ' + t.art.n) + '">' + (IS_ART ? '▶ In Spotify anhören ↗' : 'In Spotify ↗') + '</a><button class="btn" data-act="center">Auf Karte zeigen</button><button class="btn" data-act="lk-from">Verbindung finden …</button>' + hideBtn('k', t.i) + fixBtn('k', t.i) + '</div>';
  h += '<div class="sect"><h3>Verlauf <em>' + (S.metric === 'str' ? 'Streams' : 'Minuten') + ' pro Monat</em></h3>' + sparkHTML(t.dy, col) + '<div class="rec" style="margin-top:8px">Erster Stream <b>' + fmtDay(t.f) + '</b> · Zuletzt <b>' + fmtDay(t.l) + '</b><br>Länge <b>' + Math.floor(t.d / 60) + ':' + String(t.d % 60).padStart(2, '0') + '</b>' + (avg ? ' · im Schnitt <b>' + Math.round(avg) + ' %</b> pro Stream gehört' : '') + '<br>Anteil am Artist: <b>' + NF1.format(t.m / Math.max(1, t.art.m) * 100) + ' %</b></div></div>';
  if (al && al.tr.length > 1) {
    const sib = al.tr.map(k => trk[k]).sort((x, y) => y.cm - x.cm).slice(0, 12);
    h += '<div class="sect"><h3>Mehr vom Album <em>' + esc(al.n) + '</em></h3>' + sib.filter(x => x.i !== t.i).map(x => trackRow(x, sib[0].cm, 0)).join('') + '</div>';
  }
  return h;
}
function albumHTML(b) {
  const ar = b.a >= 0 ? art[b.a] : null, col = ar ? ar.c : '#8fb6ff';
  const year = b.y ? new Date(b.y).getUTCFullYear() : null;
  let h = rangeBadge();
  h += '<div class="hero" style="--c:' + col + '"><div class="pic sq" id="hero-pic" style="' + thumbStyle(b.t, 84) + '"></div><div><h2>' + esc(b.n) + '</h2><div class="sub">Album' + (year ? ' · ' + year : '') + (ar ? ' · <a href="#" data-go="a' + ar.i + '" style="color:' + col + '">' + esc(ar.n) + '</a>' : '') + '</div></div></div>';
  h += '<div class="kpis">' + kpi('Hörzeit', fmtMin(b.cm), fmtHours(b.cm)) + kpi('Streams', fmt(b.cs), isFull() ? 'gesamt' : 'im Zeitraum') + kpi('Rang', '#' + b.rk, 'von ' + NB + ' Alben') + '</div>';
  h += '<div class="sect"><h3>Verlauf <em>' + (S.metric === 'str' ? 'Streams' : 'Minuten') + ' pro Monat</em></h3>' + sparkHTML(b.dy, col) + '</div>';
  const tl = b.tr.map(k => trk[k]).filter(t => isFull() || t.cm > 0).sort((x, y) => y.cm - x.cm);
  h += '<div class="sect"><h3>Gehörte Songs <em>' + tl.length + '</em></h3>' + tl.map(t => trackRow(t, tl[0] ? tl[0].cm : 1, 0)).join('') + '</div>';
  h += '<div class="btns"><a class="btn pri" target="_blank" rel="noopener" href="' + spotifyUrl('album', b.sp, b.n + ' ' + (ar ? ar.n : '')) + '">In Spotify öffnen ↗</a><button class="btn" data-act="center">Auf Karte zeigen</button></div>';
  return h;
}
function regionHTML(r) {
  const mem = r.members.map(i => art[i]).sort((x, y) => y.cm - x.cm);
  const ta = mem.filter(a => isFull() || a.cm > 0).slice(0, 8);
  const tracksIn = []; for (let k = 0; k < NT; k++) if (art[trk[k].p].r === r.id && (isFull() || trk[k].cm > 0)) tracksIn.push(trk[k]); tracksIn.sort((x, y) => y.cm - x.cm);
  const share = isFull() ? r.share : r.cm / totalRange();
  let h = rangeBadge();
  h += '<div class="hero" style="--c:' + r.color + '"><div><div class="kicker" style="font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;color:' + r.color + ';font-weight:650">Kontinent</div><h2>' + esc(r.name) + '</h2><div class="sub">' + esc(r.sub) + '</div></div></div>';
  h += hideNote('r', r.id);
  h += '<div class="rc-detail"><label class="rc-row"><input type="color" value="' + r.color + '" data-rc="' + r.id + '"><span>Farbe ändern</span></label><button class="btn" data-rcp="edit">Kontinente verschieben</button>' + hideBtn('r', r.id) + '</div>';
  h += '<div class="kpis">' + kpi('Anteil', NF1.format(share * 100) + ' %', 'deiner Hörzeit') + kpi('Hörzeit', fmtMin(r.cm), fmtHours(r.cm)) + kpi('Artists', fmt(r.n), tracksIn.length + ' Songs') + '</div>';
  const sc = r.sc.map(id => scs[id]).filter(s => s.n >= 3).sort((x, y) => y.cm - x.cm);
  if (sc.length) h += '<div class="sect"><h3>Szenen <em>' + sc.length + '</em></h3>' + sc.map(s => '<div class="row" data-go="s' + s.id + '" style="--c:' + r.color + '"><div class="rk">' + s.n + '</div><div class="rt"><div class="nm">' + esc(s.name) + '</div><div class="sb">' + esc(s.sub) + '</div><div class="bar"><i style="width:' + Math.max(2, s.cm / Math.max(1, sc[0].cm) * 100) + '%"></i></div></div><div class="mn">' + fmtMin(s.cm) + '</div></div>').join('') + '</div>';
  h += '<div class="sect"><h3>Top-Artists</h3>' + ta.map(a => artistRow(a, ta[0] ? ta[0].cm : 1, 0)).join('') + '</div>';
  h += '<div class="sect"><h3>Top-Songs</h3>' + tracksIn.slice(0, 8).map(t => trackRow(t, tracksIn[0] ? tracksIn[0].cm : 1, 0, { artist: true })).join('') + '</div>';
  return h;
}
function sceneHTML(s) {
  const r = regs[s.reg];
  const mem = []; for (let i = 0; i < NA; i++) if (art[i].s === s.id) mem.push(art[i]);
  mem.sort((x, y) => y.cm - x.cm); const ta = mem.filter(a => isFull() || a.cm > 0).slice(0, 12);
  const tr = []; for (let k = 0; k < NT; k++) if (art[trk[k].p].s === s.id && (isFull() || trk[k].cm > 0)) tr.push(trk[k]); tr.sort((x, y) => y.cm - x.cm);
  let h = rangeBadge();
  h += '<div class="hero" style="--c:' + r.color + '"><div><div class="kicker" style="font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;color:' + r.color + ';font-weight:650">Szene · <a href="#" data-go="r' + r.id + '" style="color:' + r.color + '">' + esc(r.name) + '</a></div><h2>' + esc(s.name) + '</h2><div class="sub">' + esc(s.sub) + '</div></div></div>';
  h += hideNote('s', s.id);
  { const hb = hideBtn('s', s.id); h += '<div class="btns" style="margin:12px 0 2px">' + hb + fixBtn('s', s.id) + '</div>'; }
  h += '<div class="kpis">' + kpi('Anteil', NF1.format(s.cm / totalRange() * 100) + ' %', 'deiner Hörzeit') + kpi('Hörzeit', fmtMin(s.cm), fmtHours(s.cm)) + kpi('Artists', fmt(s.n), tr.length + ' Songs') + '</div>';
  h += '<div class="sect"><h3>Artists</h3>' + ta.map(a => artistRow(a, ta[0] ? ta[0].cm : 1, 0)).join('') + '</div>';
  h += '<div class="sect"><h3>Top-Songs</h3>' + tr.slice(0, 8).map(t => trackRow(t, tr[0] ? tr[0].cm : 1, 0, { artist: true })).join('') + '</div>';
  return h;
}
function topHTML() {
  const seg = '<div class="seg">' + [['artists', 'Artists'], ['tracks', 'Songs'], ['albums', 'Alben'], ['regions', 'Kontinente']].map(([k, l]) => '<button class="' + (topMode === k ? 'on' : '') + '" data-act="top-' + k + '">' + l + '</button>').join('') + '</div>';
  let rows = '';
  if (topMode === 'artists') { const mx = barVal(art[artOrder[0]]); rows = artOrder.slice(0, topLimit).filter(i => art[i].cm > 0).map((i, n) => rankRow(n + 1, artistRow(art[i], mx))).join(''); }
  else if (topMode === 'tracks') { const mx = barVal(trk[trkOrder[0]]); rows = trkOrder.slice(0, topLimit).filter(i => trk[i].cm > 0).map((i, n) => rankRow(n + 1, trackRow(trk[i], mx, 0, { artist: true }))).join(''); }
  else if (topMode === 'albums') { const mx = barVal(alb[albOrder[0]]); rows = albOrder.slice(0, topLimit).filter(i => alb[i].cm > 0).map((i, n) => rankRow(n + 1, albumRowHTML(alb[i], mx))).join(''); }
  else rows = regionsHTML(true);
  const more = topMode !== 'regions' && topLimit < (topMode === 'artists' ? NA : topMode === 'tracks' ? NT : NB) ? '<div class="btns"><button class="btn" data-act="more-top">Mehr anzeigen</button></div>' : '';
  return rangeBadge() + seg + rows + more;
}
function rankRow(n, html) { return html.replace('class="row img"', 'class="row img" data-n="' + n + '"').replace('<div>', '<div style="position:relative"><span style="position:absolute;left:-26px;top:9px;font-size:10.5px;color:var(--dim);width:22px;text-align:right">' + n + '</span>'); }
function regionsHTML(inner) {
  const tot = totalRange();
  const rows = regOrder.map(id => { const r = regs[id]; const sh = r.cm / tot;
    return '<div class="row" data-go="r' + r.id + '" style="--c:' + r.color + '"><div class="rk"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:' + r.color + '"></span></div><div class="rt"><div class="nm">' + esc(r.name) + '</div><div class="sb">' + esc(r.sub) + ' · ' + r.n + ' Artists</div><div class="bar"><i style="width:' + Math.max(1.5, sh / (regs[regOrder[0]].cm / tot) * 100) + '%"></i></div></div><div class="mn">' + NF1.format(sh * 100) + ' %<small>' + fmtMin(r.cm) + '</small></div></div>'; }).join('');
  return (inner ? '' : rangeBadge() + '<div class="muted" style="margin-bottom:10px;line-height:1.5">Deine Musik, gruppiert nach Klang-Verwandtschaft. Ähnliche Kontinente liegen auf der Karte nebeneinander.</div>') + rows;
}

/* ---------- Auswahl ---------- */
function selectItem(t, i, opt) {
  opt = opt || {};
  LINKV = null; sel = { t, i }; computeFocus(); drawerTab = 'detail'; document.querySelectorAll('#drawer .tab').forEach(b => b.classList.toggle('on', b.dataset.tab === 'detail'));
  songLimit = 40; body.classList.add('drawer-open'); renderDrawer(); dbody.scrollTop = 0;
  if (opt.fly !== false) flyToSel();
  requestDraw();
}
function clearSel() { sel = null; hl = null; computeFocus(); if (drawerTab === 'detail') renderDrawer(); requestDraw(); }
function flyToSel() {
  if (!sel) return;
  if (hideIs(sel.t, sel.i)) { toast('Ausgeblendet: nicht auf der Karte'); return; }
  const b = availBox();
  if (sel.t === 'a') {
    const a = art[sel.i];
    if (PATH === 'songs') { const t = trk[a.tr[0]]; if (t) focusOn(t.tx, t.ty, Math.max(t.tr, 8), 4); }
    else if (PATH === 'map') { if (a.k === 1) focusOn(a.tx, a.ty, Math.max(a.tR, 8), 3.4); else focusOn(a.tx, a.ty, Math.max(a.tF, 30), 1.45); }
    else focusOn(a.tx, a.ty, Math.max(a.tR, 8), 4);
  } else if (sel.t === 'k') {
    const t = trk[sel.i], a = t.art;
    if (PATH === 'songs') focusOn(t.tx, t.ty, Math.max(t.tr, 8), 4);
    else if (PATH === 'artists') focusOn(a.tx, a.ty, Math.max(a.tR, 8), 4);
    else if (a.k === 1) focusOn(a.tx, a.ty, Math.max(a.tR, 8), 3.4);
    else { const zA = Math.min(b.w, b.h) / (2 * Math.max(a.tF, 30) * 1.45); const z = clamp(Math.max(zA, Math.min(zMax, 46 / Math.max(t.tr, 2))), zMin, zMax); const ccx = (b.x0 + b.x1) / 2, ccy = (b.y0 + b.y1) / 2; goto_(t.tx + (W / 2 - ccx) / z, t.ty + (H / 2 - ccy) / z, z, 1000); }
  } else if (sel.t === 'b') {
    const bb = alb[sel.i]; let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9, n = 0;
    bb.tr.forEach(k => {
      const t = trk[k], q = PATH === 'artists' ? t.art : t;
      if (q.tsc > 0) { n++; x0 = Math.min(x0, q.tx); x1 = Math.max(x1, q.tx); y0 = Math.min(y0, q.ty); y1 = Math.max(y1, q.ty); }
    });
    if (n) focusOn((x0 + x1) / 2, (y0 + y1) / 2, Math.max((x1 - x0), (y1 - y0), 60) / 2, 1.6);
  }
  else if (sel.t === 'r' && PATH === 'map') { const r = regs[sel.i]; if (r.act) focusOn(r.tcx, r.tcy, Math.max(r.trad, 60), 1.1); }
  else if (sel.t === 's' && PATH === 'map') { const s = scs[sel.i]; if (s.act) focusOn(s.tcx, s.tcy, Math.max(s.trad, 40), 1.15); }
}
function parseGo(s) { return { t: s[0], i: +s.slice(1) }; }

/* ---------- Vorschau (Audio) ---------- */
/* Die 30-Sekunden-Vorschau laeuft zu Ende, auch wenn man auf der Karte weiterstoebert oder Einstellungen aendert; ein kleiner Player unten rechts zeigt sie an (Pause, Schliessen, Antippen = zum Song). */
function pvSync() {
  const m = $('pv-mini'), t = audioId >= 0 ? trk[audioId] : null; if (!m) return;
  m.classList.toggle('hidden', !t); document.body.classList.toggle('pv-on', !!t);
  if (t) { $('pm-cover').innerHTML = thumbT(t, 44); $('pm-t').textContent = t.n; $('pm-a').textContent = t.a.map(i => art[i].n).join(', '); }
  $('pm-play').textContent = audio && audio.paused ? '▶' : '⏸'; $('pm-play').setAttribute('aria-label', T(audio && audio.paused ? 'Weiter' : 'Pause'));
  const b = $('pv-btn'); if (b && sel && sel.t === 'k') b.textContent = audioId === sel.i ? T('⏸ Vorschau stoppen') : T('▶ 30-Sek.-Vorschau');
}
function stopPreview() { if (audio) { audio.onended = audio.onerror = audio.ontimeupdate = null; audio.pause(); audio = null; } audioId = -1; $('pm-bar').style.width = '0'; pvSync(); }
function togglePreview(t) {
  if (audioId === t.i) { stopPreview(); return; }
  stopPreview(); const au = new Audio(t.pv); audio = au; audioId = t.i; au.volume = .85;
  au.onended = () => { if (audio === au) stopPreview(); };
  au.onerror = () => { if (audio === au) { stopPreview(); toast('Vorschau nicht verfügbar (offline?)'); } };
  au.ontimeupdate = () => { if (audio === au && au.duration) $('pm-bar').style.width = (au.currentTime / au.duration * 100) + '%'; };
  au.play().then(() => { if (audio === au) pvSync(); }).catch(() => { if (audio === au) { stopPreview(); toast('Vorschau konnte nicht gestartet werden'); } });
  pvSync();
}
$('pm-play').onclick = () => { if (!audio) return; if (audio.paused) audio.play().catch(() => { }); else audio.pause(); pvSync(); };
$('pm-x').onclick = stopPreview;
$('pm-txt').onclick = () => { if (audioId >= 0) selectItem('k', audioId); };

/* ---------- Toast / Tooltip ---------- */
let toastT = 0;
function toast(msg) { const t = $('toast'); t.textContent = T(msg); t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2600); }
const tip = $('tip');
function showTip(h, x, y) {
  if (!h) { tip.style.display = 'none'; return; }
  let html;
  if (h.t === 'a') { const a = art[h.i]; html = '<b style="color:' + lighten(a.rgb, .3).reduce((s, v, k) => s + (k ? ',' : 'rgb(') + v, '') + ')">' + esc(a.n) + '</b><div class="m"><span class="n">#' + a.rk + '</span> · ' + esc(a.reg.name) + '</div><div class="n">' + fmtDur(a.cm) + ' · ' + fmt(a.cs) + ' Streams</div>'; }
  else { const t = trk[h.i]; html = '<b>' + esc(t.n) + '</b><div class="m">' + esc(t.a.map(i => art[i].n).join(', ')) + (t.al >= 0 ? ' · ' + esc(alb[t.al].n) : '') + '</div><div class="n">Song #' + t.rk + ' · ' + fmtDur(t.cm) + ' · ' + fmt(t.cs) + '×</div>'; }
  tip.innerHTML = html; tip.style.display = 'block';
  const r = tip.getBoundingClientRect(); let tx = x + 16, ty = y + 18; if (tx + r.width > W - 8) tx = x - r.width - 14; if (ty + r.height > H - 8) ty = y - r.height - 12;
  tip.style.left = tx + 'px'; tip.style.top = ty + 'px';
}

/* ---------- HUD ---------- */
function renderHud() {
  $('hud-user').textContent = HUD.user; $('hud-bio').textContent = HUD.bio || 'Spotify · via stats.fm';
  const full = isFull();
  const mins = full ? HUD.minutes : rangeMinutes, strs = full ? HUD.streams : rangeStreams;
  let nTr = NT, nAr = NA, nAl = NB;
  if (!full) { nTr = 0; nAr = 0; nAl = 0; for (let k = 0; k < NT; k++) if (trk[k].cm > 0) nTr++; for (let i = 0; i < NA; i++) if (art[i].cm > 0) nAr++; for (let k = 0; k < NB; k++) if (alb[k].cm > 0) nAl++; }
  $('hud-stats').innerHTML = [['Streams', fmt(strs)], ['Stunden', fmt(mins / 60)], ['Tage', NF1.format(mins / 1440)], ['Songs', fmt(nTr)], ['Artists', fmt(nAr)], ['Alben', fmt(nAl)]].map(([l, v]) => '<div class="stat"><b>' + v + '</b><span>' + l + '</span></div>').join('');
  $('hud-period').innerHTML = full ? '<span>' + fmtDay(HUD.first) + ' – ' + fmtDay(HUD.last) + '</span><span>' + fmt(mins) + ' min</span>' : '<span>⏱ ' + rangeText() + '</span><span>' + fmt(mins) + ' min</span>';
  // Mehr
  const hmax = Math.max(...HUD.hour), wmax = Math.max(...HUD.weekday), WD = WDN;
  const peakH = HUD.hour.indexOf(hmax);
  const gmax = HUD.genres[0].m;
  $('hud-more').innerHTML = '<h4>Tageszeit <em style="font-style:normal;color:var(--dim)">(Minuten je Stunde)</em></h4><div class="mini-bars">' + HUD.hour.map((v, h) => '<i style="height:' + Math.max(3, v / hmax * 100) + '%" title="' + h + ' Uhr: ' + fmt(v) + ' min"></i>').join('') + '</div><div class="mini-bars-l"><span>0 Uhr</span><span>12</span><span>23</span></div>'
    + '<h4>Wochentage</h4><div class="mini-bars">' + HUD.weekday.map((v, d) => '<i style="height:' + Math.max(3, v / wmax * 100) + '%" title="' + WD[d] + ': ' + fmt(v) + ' min"></i>').join('') + '</div><div class="mini-bars-l">' + WD.map(d => '<span>' + d + '</span>').join('') + '</div>'
    + '<h4>Rekorde</h4><div class="rec">Stärkste Stunde: <b>' + peakH + '–' + (peakH + 1) + ' Uhr</b><br>Längster Tag: <b>' + fmtDay(Math.floor(Date.parse(HUD.best_day[0] + 'T00:00:00Z') / 86400000)) + '</b> mit <b>' + NF1.format(HUD.best_day[1] / 60) + ' Std.</b><br>Längste Session: <b>' + NF1.format(HUD.longest.minutes / 60) + ' Std.</b> (' + HUD.longest.n + ' Songs, ' + fmtDay(Math.floor(Date.parse(HUD.longest.date + 'T00:00:00Z') / 86400000)) + ')</div>'
    + '<h4>Top-Genres laut stats.fm</h4>' + HUD.genres.slice(0, 8).map(g => '<div class="genre-row"><span>' + esc(g.n) + '</span><div class="bar"><i style="width:' + g.m / gmax * 100 + '%"></i></div><span>' + fmt(g.m / 60) + ' h</span></div>').join('')
    + '<div class="rec" style="margin-top:10px;color:var(--dim)">Daten: stats.fm (' + HUD.generated.split('-').reverse().join('.') + ').</div>';
}

/* ---------- Suche ---------- */
const sidx = [];
art.forEach(a => sidx.push({ t: 'a', i: a.i, key: norm(a.n), m: a.m }));
trk.forEach(t => sidx.push({ t: 'k', i: t.i, key: norm(t.n + ' ' + t.a.map(i => art[i].n).join(' ')), m: t.m }));
alb.forEach(b => sidx.push({ t: 'b', i: b.i, key: norm(b.n + ' ' + (b.a >= 0 ? art[b.a].n : '')), m: b.m }));
regs.forEach(r => sidx.push({ t: 'r', i: r.id, key: norm(r.name + ' ' + r.sub), m: r.m * 5 }));
scs.forEach(s => { if (s.n >= 6) sidx.push({ t: 's', i: s.id, key: norm(s.name + ' ' + s.sub), m: s.m * 2 }); });
let resSel = 0, resList = [];
function search(q, only, caps, maxN) {
  q = norm(q).trim(); if (!q) return [];
  const toks = q.split(/\s+/); const out = [];
  for (let n = 0; n < sidx.length; n++) {
    const e = sidx[n]; if (only && only.indexOf(e.t) < 0) continue; let ok = true, sc = 0;
    for (let k = 0; k < toks.length; k++) { const p = e.key.indexOf(toks[k]); if (p < 0) { ok = false; break; } sc += p === 0 ? 3 : e.key[p - 1] === ' ' ? 2 : 1; }
    if (!ok) continue;
    out.push({ e, s: sc / toks.length + Math.log10(e.m + 1) * .45 + (e.t === 'a' ? .3 : 0) });
  }
  out.sort((a, b) => b.s - a.s);
  // Mischung: von jedem Typ die besten
  caps = caps || { a: 5, k: 5, b: 3, r: 2, s: 2 }; maxN = maxN || 14; const cnt = {}, res = [];
  for (const o of out) { const c = cnt[o.e.t] || 0; if (c < (caps[o.e.t] || 0)) { cnt[o.e.t] = c + 1; res.push(o.e); } if (res.length >= maxN) break; }
  return res;
}
function renderResults() {
  const box = $('results'); const q = $('q').value;
  if (!q.trim()) { box.classList.remove('show'); return; }
  resList = search(q); resSel = 0;
  if (!resList.length) { box.innerHTML = '<div class="res-empty">Nichts gefunden.</div>'; box.classList.add('show'); return; }
  const TL = { a: 'Artist', k: 'Song', b: 'Album', r: 'Kontinent', s: 'Szene' };
  box.innerHTML = resList.map((e, n) => {
    let th = '', nm = '', sb = '';
    if (e.t === 'a') { const a = art[e.i]; th = '<span class="th" style="' + thumbStyle(a.i, 34) + '"></span>'; nm = a.n; sb = fmtMin(a.m) + ' · ' + a.reg.name; }
    else if (e.t === 'k') { const t = trk[e.i]; th = '<span class="th sq" style="' + thumbStyle(t.t, 34) + '"></span>'; nm = t.n; sb = t.a.map(i => art[i].n).join(', ') + ' · ' + fmtMin(t.m); }
    else if (e.t === 'b') { const b = alb[e.i]; th = '<span class="th sq" style="' + thumbStyle(b.t, 34) + '"></span>'; nm = b.n; sb = (b.a >= 0 ? art[b.a].n + ' · ' : '') + fmtMin(b.m); }
    else if (e.t === 'r') { const r = regs[e.i]; th = '<span class="th" style="background:radial-gradient(circle,' + r.color + ',transparent 70%)"></span>'; nm = r.name; sb = r.n + ' Artists · ' + NF1.format(r.share * 100) + ' %'; }
    else { const s = scs[e.i]; th = '<span class="th" style="background:radial-gradient(circle,' + s.rgb.join(',').replace(/^/, 'rgb(').concat(')') + ',transparent 70%)"></span>'; nm = s.name; sb = s.n + ' Artists · ' + regs[s.reg].name; }
    return '<div class="res' + (n === 0 ? ' on' : '') + '" data-n="' + n + '"><div style="width:34px;height:34px;border-radius:' + (e.t === 'k' || e.t === 'b' ? '7px' : '50%') + ';overflow:hidden">' + th + '</div><div style="min-width:0"><div class="nm">' + esc(nm) + '</div><div class="sb">' + esc(sb) + '</div></div><div class="tp">' + TL[e.t] + (hideIs(e.t, e.i) ? '<span class="hid-tag">ausgeblendet</span>' : '') + '</div></div>';
  }).join('');
  box.classList.add('show');
}
function chooseResult(n) { const e = resList[n]; if (!e) return; $('results').classList.remove('show'); $('q').blur(); document.body.classList.remove('search-open'); selectItem(e.t, e.i); }

/* ---------- Zeitleiste (Monate, Wochen oder Tage; zoombar) ---------- */
const tlc = $('tlc'), tctx = tlc.getContext('2d');
let tlW = 0, tlH = 0, tlDrag = null, tlHover = -1;
const tv = { a: 0, b: ND - 1 };          // sichtbarer Ausschnitt (Tage)
let tlB = [], tlGran = 'm';
new ResizeObserver(() => tlResize()).observe($('tl'));      // Breite aendert sich z. B. beim Oeffnen der Seitenleiste -> neu kalibrieren
function setTimelineVisible(on) {
  UI.timeline = on; document.body.classList.toggle('tl-off', !on); $('tl-open').classList.toggle('hidden', on || UI.clean);
  if (on) tlResize();
  saveSettings(); syncSettingsUI(true); requestDraw();
}
function setClean(on) {
  UI.clean = on; document.body.classList.toggle('clean', on); $('tl-open').classList.toggle('hidden', UI.timeline || on);
  if (on) toast('Nur Karte – mit H oder dem Auge-Symbol zurück'); else { tlResize(); mmResize(); }
  syncSettingsUI(true); resize(); requestDraw();
}
function tlResize() { const r = tlc.getBoundingClientRect(); const d = Math.min(window.devicePixelRatio || 1, 2); tlc.width = Math.round(r.width * d); tlc.height = Math.round(r.height * d); tlW = r.width; tlH = r.height; computeBuckets(); drawTimeline(); }
const COARSE = window.matchMedia && matchMedia('(pointer:coarse)').matches;
function tlColors() {
  return TH.ui === 'light'
    ? { off0: 'rgba(70,80,110,.42)', off1: 'rgba(70,80,110,.18)', on0: '#8a63d8', on1: '#4a78df', txt: '#5a6280', tick: 'rgba(0,0,0,.25)', hov: 'rgba(0,0,0,.08)', shade: 'rgba(255,255,255,.62)', edge: 'rgba(110,70,200,.9)', grip: '#1d2236', gripT: '#fff', tipbg: 'rgba(255,252,246,.96)', tiptx: '#1a2030' }
    : { off0: 'rgba(140,150,180,.45)', off1: 'rgba(110,120,150,.25)', on0: '#c4a1ff', on1: '#7ea6ff', txt: '#8c94ab', tick: 'rgba(255,255,255,.25)', hov: 'rgba(255,255,255,.12)', shade: 'rgba(0,0,0,.38)', edge: 'rgba(196,161,255,.9)', grip: '#fff', gripT: '#101424', tipbg: 'rgba(8,10,18,.92)', tiptx: '#eaedf6' };
}
const ppd = () => tlW / (tv.b - tv.a + 1);
function computeBuckets() {
  if (!tlW) return;
  const len = tv.b - tv.a + 1, p = tlW / len; tlB = [];
  tlGran = p >= 5 ? 'd' : p >= 1.35 ? 'w' : 'm';
  if (tlGran === 'd') for (let d = tv.a; d <= tv.b; d++) tlB.push({ s: d, e: d });
  else if (tlGran === 'w') { let d = tv.a - ((D0 + tv.a + 3) % 7); while (d <= tv.b) { tlB.push({ s: Math.max(0, d), e: Math.min(ND - 1, d + 6) }); d += 7; } }
  else for (let i = DAY2M[tv.a]; i <= DAY2M[tv.b]; i++) tlB.push({ s: MON[i].s, e: MON[i].e });
  for (const b of tlB) { let mn = 0, n = 0; for (let d = b.s; d <= b.e; d++) { mn += HUD.day_min[d]; n += HUD.day_n[d]; } b.min = mn; b.n = n; }
}
const dayAt = x => clamp(tv.a + Math.floor(x / ppd()), 0, ND - 1);
const bucketOf = d => { for (let i = 0; i < tlB.length; i++) if (tlB[i].s <= d && d <= tlB[i].e) return tlB[i]; d = clamp(d, 0, ND - 1); return { s: d, e: d, min: HUD.day_min[d], n: HUD.day_n[d] }; };
function tlLabel(d) {
  const b = bucketOf(d), v = S.metric === 'str' ? fmt(b.n) + ' Streams' : fmt(b.min / 60) + ' Std.';
  if (tlGran === 'd') return WDN[wdOf(d)] + ' ' + fmtDate(d) + ' · ' + v;
  if (tlGran === 'w') return fmtDate(b.s).slice(0, 5) + '. – ' + fmtDate(b.e) + ' · ' + v;
  return monthLabel(DAY2M[d]) + ' · ' + v;
}
function drawTimeline() {
  if (!tlW || !tlB.length) return; const d = Math.min(window.devicePixelRatio || 1, 2), K = tlColors();
  const c = tctx; c.setTransform(d, 0, 0, d, 0, 0); c.clearRect(0, 0, tlW, tlH);
  const p = ppd(), base = tlH - 18, top = COARSE ? 12 : 6, str = S.metric === 'str';
  let mx = 1e-9; for (const b of tlB) mx = Math.max(mx, str ? b.n : b.min);
  c.font = '600 10.5px ' + FONT; c.textBaseline = 'alphabetic'; c.textAlign = 'left';
  for (const b of tlB) {
    const x = (b.s - tv.a) * p, w = (b.e - b.s + 1) * p; if (x + w < 0 || x > tlW) continue;
    const v = str ? b.n : b.min, inr = b.e >= rA && b.s <= rB;
    const h = v > 0 ? Math.max(2.5, Math.sqrt(v / mx) * (base - top)) : 1;
    const g = c.createLinearGradient(0, base - h, 0, base);
    if (inr) { g.addColorStop(0, K.on0); g.addColorStop(1, K.on1); } else { g.addColorStop(0, K.off0); g.addColorStop(1, K.off1); }
    c.fillStyle = g; const gap = w > 5 ? 1 : 0; c.fillRect(x + gap / 2, base - h, Math.max(1, w - gap), h);
  }
  // Beschriftung: Jahre, bei Wochen/Tagen auch Monate bzw. Tage
  let lastLab = -99;
  for (let dd = Math.max(tv.a, 0); dd <= tv.b; dd++) {
    const dt = dayDate(dd), day = dt.getUTCDate(), mo = dt.getUTCMonth(), x = (dd - tv.a) * p;
    if (day === 1 && mo === 0 || dd === tv.a && false) { c.fillStyle = K.tick; c.fillRect(x, base + 2, 1, 5); c.fillStyle = K.txt; c.fillText(String(dt.getUTCFullYear()), x + 3, tlH - 4); lastLab = x + 34; }
    else if (day === 1 && tlGran !== 'm' && x > lastLab) { c.fillStyle = K.tick; c.fillRect(x, base + 2, 1, 4); c.fillStyle = K.txt; c.fillText(MN[mo], x + 3, tlH - 4); lastLab = x + 26; }
    else if (tlGran === 'd' && (wdOf(dd) === 0 || p > 16) && x > lastLab && x + 14 < tlW) { c.fillStyle = K.txt; c.font = '500 9.5px ' + FONT; c.fillText(String(day), x + 1, tlH - 4); c.font = '600 10.5px ' + FONT; lastLab = x + 16; }
  }
  if (tv.a === 0 || tlGran === 'm') { /* Jahreszahl am linken Rand, falls kein Jahreswechsel sichtbar */
    const y0 = dayDate(tv.a).getUTCFullYear(); const found = (() => { for (let dd = tv.a; dd <= tv.b; dd++) { const t = dayDate(dd); if (t.getUTCDate() === 1 && t.getUTCMonth() === 0) return true; } return false; })();
    if (!found) { c.fillStyle = K.txt; c.fillText(String(y0), 3, tlH - 4); }
  }
  const xa = (rA - tv.a) * p, xb = (rB + 1 - tv.a) * p;
  if (!isFull()) {
    const x0 = clamp(xa, 0, tlW), x1 = clamp(xb, 0, tlW);
    c.fillStyle = K.shade; c.fillRect(0, top, x0, base - top); c.fillRect(x1, top, tlW - x1, base - top);
    c.strokeStyle = K.edge; c.lineWidth = 1.6; c.strokeRect(xa + .8, top + .8, xb - xa - 1.6, base - top - 1.6);
    const gy = top + (base - top) / 2;
    [xa, xb].forEach((x, q) => {
      if (x < -20 || x > tlW + 20) return;
      if (COARSE) {
        c.fillStyle = K.grip; c.beginPath(); c.arc(x, gy, 13, 0, 6.2832); c.fill();
        c.strokeStyle = K.gripT; c.lineWidth = 2; c.beginPath(); c.moveTo(x - 3 + q * 6, gy - 5); c.lineTo(x - 6 + q * 12, gy); c.lineTo(x - 3 + q * 6, gy + 5); c.stroke();
      } else { c.fillStyle = K.grip; c.fillRect(x - 2, gy - 10, 4, 20); }
    });
  }
  if (tlHover >= 0 && !COARSE) {
    const b = bucketOf(tlHover); c.fillStyle = K.hov; c.fillRect((b.s - tv.a) * p, top, (b.e - b.s + 1) * p, base - top);
    c.font = '600 11px ' + FONT; const lab = tlLabel(tlHover);
    const tw = c.measureText(lab).width + 14; let lx = (tlHover - tv.a) * p - tw / 2; lx = clamp(lx, 2, tlW - tw - 2);
    c.fillStyle = K.tipbg; c.fillRect(lx, 0, tw, 18); c.fillStyle = K.tiptx; c.textAlign = 'left'; c.fillText(lab, lx + 7, 13);
  }
}
/* Ausschnitt der Achse: zoomen / verschieben / auf Bereich zeigen */
function setView(a, b) {
  let len = clamp(Math.round(b - a + 1), Math.min(10, ND), ND); a = Math.round(a);
  a = clamp(a, 0, ND - len); tv.a = a; tv.b = a + len - 1; if (tlHover < tv.a || tlHover > tv.b) tlHover = -1; computeBuckets(); drawTimeline();
}
function zoomView(f, centerDay) {
  const len = tv.b - tv.a + 1, c = centerDay == null ? (tv.a + tv.b) / 2 : centerDay, nl = clamp(len * f, Math.min(10, ND), ND);
  const fr = (c - tv.a) / len; setView(c - fr * nl, c - fr * nl + nl - 1);
}
function ensureVisible() {
  const len = tv.b - tv.a + 1;
  if (rA >= tv.a && rB <= tv.b) return;
  const need = rB - rA + 1; const nl = Math.min(ND, Math.max(len, need * 1.3));
  const mid = (rA + rB) / 2; setView(mid - nl / 2, mid + nl / 2 - 1);
}
function setRange(a, b, opts) {
  opts = opts || {};
  a = clamp(Math.round(a), 0, ND - 1); b = clamp(Math.round(b), 0, ND - 1); if (a > b) [a, b] = [b, a];
  if (a === rA && b === rB && !opts.force) return;
  rA = a; rB = b; recompute(); rankings(); if (!opts.noView) ensureVisible(); onRangeChange(); scheduleLayout(30); if (!opts.keepPlay) stopPlay();
}
function onRangeChange() {
  drawTimeline(); renderHud(); renderPresets();
  $('rng').firstChild.textContent = rangeText(); $('tl-open-l').textContent = rangeText();
  let act = 0, ns = 0; for (let i = rA; i <= rB; i++) { act += HUD.day_min[i]; ns += HUD.day_n[i]; }
  $('rng-sub').textContent = fmt(act / 60) + ' Std. · ' + fmt(ns) + ' Streams';
  renderDrawer(); requestDraw();
}
const tlSlop = e => e.pointerType === 'touch' ? 28 : 10;
const tlPtrs = new Map(); let tlPinch = null;
tlc.addEventListener('pointerdown', e => {
  const r = tlc.getBoundingClientRect(), x = e.clientX - r.left, p = ppd(); try { tlc.setPointerCapture(e.pointerId); } catch (_) { } e.preventDefault();
  tlPtrs.set(e.pointerId, x);
  if (tlPtrs.size === 2) { const v = [...tlPtrs.values()]; tlPinch = { d: Math.abs(v[0] - v[1]) || 1, len: tv.b - tv.a + 1, mid: tv.a + ((v[0] + v[1]) / 2) / p }; tlDrag = null; return; }
  const xa = (rA - tv.a) * p, xb = (rB + 1 - tv.a) * p, sl = tlSlop(e);
  const dA = Math.abs(x - xa), dB = Math.abs(x - xb), d = dayAt(x);
  if (!isFull() && Math.min(dA, dB) < sl) tlDrag = { m: dA <= dB ? 'a' : 'b' };
  else if (!isFull() && x > xa && x < xb) tlDrag = { m: 'inside', off: d - rA, len: rB - rA, x0: x, a: bucketOf(d), moved: false };
  else tlDrag = { m: 'new', a: bucketOf(d), moved: false, x0: x };
});
tlc.addEventListener('pointermove', e => {
  const r = tlc.getBoundingClientRect(), x = e.clientX - r.left, d = dayAt(x), p = ppd();
  if (tlPtrs.has(e.pointerId)) tlPtrs.set(e.pointerId, x);
  if (tlPinch && tlPtrs.size >= 2) { const v = [...tlPtrs.values()], nd = Math.abs(v[0] - v[1]) || 1; const nl = clamp(tlPinch.len * tlPinch.d / nd, Math.min(10, ND), ND); const fr = ((v[0] + v[1]) / 2) / tlW; setView(tlPinch.mid - fr * nl, tlPinch.mid - fr * nl + nl - 1); return; }
  if (!tlDrag) { if (e.pointerType === 'mouse') { const h = d; if (!tlHover || bucketOf(tlHover).s !== bucketOf(h).s || tlHover < 0) { tlHover = h; drawTimeline(); } const near = !isFull() && (Math.abs(x - (rA - tv.a) * p) < 10 || Math.abs(x - (rB + 1 - tv.a) * p) < 10); tlc.style.cursor = near ? 'ew-resize' : (!isFull() && x > (rA - tv.a) * p && x < (rB + 1 - tv.a) * p) ? 'grab' : 'crosshair'; } return; }
  tlHover = d; const bk = bucketOf(d);
  if (tlDrag.m === 'a') setRange(bk.s, rB, { force: true, noView: true }); else if (tlDrag.m === 'b') setRange(rA, bk.e, { force: true, noView: true });
  else if (tlDrag.m === 'inside') {
    if (!tlDrag.moved && Math.abs(x - tlDrag.x0) > 7) tlDrag.moved = true;      // erst bei echter Bewegung verschieben, sonst zaehlt es als Klick
    if (tlDrag.moved) { let a = bucketOf(d - tlDrag.off).s; a = clamp(a, 0, ND - 1 - tlDrag.len); setRange(a, a + tlDrag.len, { force: true, noView: true }); }
  } else { if (bk.s !== tlDrag.a.s || Math.abs(x - tlDrag.x0) > 8) tlDrag.moved = true; if (tlDrag.moved) setRange(Math.min(tlDrag.a.s, bk.s), Math.max(tlDrag.a.e, bk.e), { force: true, noView: true }); }
});
tlc.addEventListener('pointerup', e => {
  tlPtrs.delete(e.pointerId); if (tlPtrs.size < 2) tlPinch = null;
  if (tlDrag && (tlDrag.m === 'new' || tlDrag.m === 'inside') && !tlDrag.moved) setRange(tlDrag.a.s, tlDrag.a.e, { force: true, noView: true });
  tlDrag = null; if (e.pointerType !== 'mouse') { tlHover = -1; drawTimeline(); }
});
tlc.addEventListener('pointercancel', e => { tlPtrs.delete(e.pointerId); tlPinch = null; tlDrag = null; });
tlc.addEventListener('pointerleave', () => { if (!tlDrag) { tlHover = -1; drawTimeline(); } });
tlc.addEventListener('dblclick', () => { setView(0, ND - 1); setRange(0, ND - 1); });
tlc.addEventListener('wheel', e => {
  e.preventDefault(); const r = tlc.getBoundingClientRect(), x = e.clientX - r.left;
  if (e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) { const sh = (e.deltaX || e.deltaY) / ppd(); setView(tv.a + sh, tv.b + sh); }
  else zoomView(Math.exp(e.deltaY * .0018), tv.a + x / ppd());
}, { passive: false });
/* Presets, Achsen-Knoepfe, Datumsauswahl */
function presets() {
  const last = ND - 1, ly = dayDate(last).getUTCFullYear();
  const y0 = Math.max(0, Math.ceil(Date.UTC(ly, 0, 1) / 86400000 - D0));
  const mxm = Math.max.apply(null, MON.map(m => m.min));
  let fi = MON.findIndex((m, i) => m.min > mxm * .2 && MON[i].e >= y0); if (fi < 0) fi = 0;
  const fm = MON[fi];
  return [[T('Alles'), 0, last], [String(ly), y0, last], [T('Seit') + ' ' + MN[fm.m] + ' ’' + String(fm.y).slice(2), fm.s, last], [T('90 Tage'), Math.max(0, last - 89), last], [T('30 Tage'), Math.max(0, last - 29), last], [T('7 Tage'), Math.max(0, last - 6), last], [T('Letzter Tag'), last, last]];
}
let PRE = [];
function renderPresets() {
  PRE = presets();
  const seen = new Set(); const items = PRE.filter(p => { const k = p[1] + '-' + p[2]; if (seen.has(k)) return false; seen.add(k); return true; });
  $('presets').innerHTML = items.map(p => '<button class="pchip' + (p[1] === rA && p[2] === rB ? ' on' : '') + '" data-a="' + p[1] + '" data-b="' + p[2] + '">' + p[0] + '</button>').join('')
    + '<button class="pchip tog' + (S.timeMode === 'dynamic' ? ' on' : '') + '" data-act="timemode" title="Karte ordnet sich nach dem gewählten Zeitraum neu an">' + (S.timeMode === 'dynamic' ? '⟲ Karte dynamisch' : '▣ Karte fest') + '</button>'
    + '<span class="tlbtns"><button class="pchip ico" data-tl="out" title="Achse herauszoomen" aria-label="Achse herauszoomen">−</button><button class="pchip ico" data-tl="in" title="Achse hineinzoomen (auch Mausrad oder Pinch auf der Achse)" aria-label="Achse hineinzoomen">+</button><button class="pchip ico" data-tl="left" title="Achse nach links" aria-label="Achse nach links">‹</button><button class="pchip ico" data-tl="right" title="Achse nach rechts" aria-label="Achse nach rechts">›</button><button class="pchip ico" data-tl="cal" title="Datum eingeben" aria-label="Datum eingeben">📅</button></span>';
}
$('presets').addEventListener('click', e => {
  const b = e.target.closest('.pchip'); if (!b) return;
  if (b.dataset.act === 'timemode') { setSetting('timeMode', S.timeMode === 'dynamic' ? 'fixed' : 'dynamic'); return; }
  if (b.dataset.tl) { const t = b.dataset.tl, len = tv.b - tv.a + 1;
    if (t === 'in') zoomView(.5); else if (t === 'out') zoomView(2); else if (t === 'left') setView(tv.a - len * .4, tv.b - len * .4); else if (t === 'right') setView(tv.a + len * .4, tv.b + len * .4); else if (t === 'cal') toggleDatePop();
    return; }
  setRange(+b.dataset.a, +b.dataset.b, { force: true });
});
function toggleDatePop(force) {
  const pop = $('datepop'); const on = force != null ? force : pop.classList.contains('hidden');
  pop.classList.toggle('hidden', !on); if (!on) return;
  const iso = d => dayDate(d).toISOString().slice(0, 10);
  $('d-from').min = $('d-to').min = iso(0); $('d-from').max = $('d-to').max = iso(ND - 1); $('d-from').value = iso(rA); $('d-to').value = iso(rB);
}
$('d-apply').onclick = () => {
  const toD = v => Math.round(Date.parse(v + 'T00:00:00Z') / 86400000 - D0);
  const a = toD($('d-from').value), b = toD($('d-to').value); if (isNaN(a) || isNaN(b)) { toast('Bitte beide Daten wählen'); return; }
  setRange(a, b, { force: true }); toggleDatePop(false);
};
$('d-close').onclick = () => toggleDatePop(false);
/* Abspielen: Karte waechst Monat fuer Monat */
let playT = 0, playing = false;
function stopPlay() { playing = false; clearTimeout(playT); $('play').innerHTML = '<svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor"><path d="M2 1l9 5-9 5z"/></svg><span>Entwicklung</span>'; }
function startPlay() {
  if (playing) { stopPlay(); return; }
  playing = true; $('play').innerHTML = '<svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor"><path d="M2 1h3v10H2zM7 1h3v10H7z"/></svg><span>Pause</span>';
  setView(0, ND - 1);
  let b = Math.max(0, MON.findIndex(m => m.min > 0));
  rA = -1; // erzwingt Neuberechnung
  const tot = Math.max.apply(null, MON.map(m => m.min));
  const step = () => {
    if (!playing) return;
    setRange(0, MON[b].e, { force: true, keepPlay: true, noView: true });
    const dur = clamp(160 + Math.sqrt(MON[b].min / tot) * 700, 170, 900);
    b++; if (b >= NM) { stopPlay(); return; }
    playT = setTimeout(step, dur);
  };
  step();
}
$('play').addEventListener('click', startPlay);

/* ---------- Tour ---------- */
const tour = { on: false, i: 0, t: 0, paused: false, steps: [] };
function tourStart() {
  if (tour.on) { tourEnd(); return; }
  tour.on = true; tour.paused = false; tour.i = 0; clearSel(); closeDrawer(); stopPlay();
  if (S.view !== 'map') { S.view = 'map'; if (typeof syncSettingsUI === 'function') syncSettingsUI(); applyLayout({ fit: false }); }
  tour.steps = [{ t: 'o' }].concat(regOrder.filter(id => regs[id].act > 0 && !hideIs('r', id)).map(id => ({ t: 'r', id })));
  $('t-tour').classList.add('on'); tourGo(0);
}
function tourEnd() { tour.on = false; clearTimeout(tour.t); $('caption').classList.remove('show'); $('t-tour').classList.remove('on'); }
function tourGo(i) {
  if (!tour.on) return; clearTimeout(tour.t);
  tour.i = clamp(i, 0, tour.steps.length - 1); const st = tour.steps[tour.i]; const cap = $('caption');
  let html;
  if (st.t === 'o') {
    sel = null; computeFocus(); fitAll(true);
    html = '<div class="k">Willkommen · Tour</div><h2>Deine Musik als Landkarte</h2><p>' + fmt(HUD.artists) + ' Artists und ' + fmt(HUD.tracks) + ' Songs, gruppiert nach Klang-Verwandtschaft: ' + (tour.steps.length - 1) + ' Kontinente. Je größer ein Kreis, desto länger hast du ihn gehört. Gleich fliegen wir zu jedem Kontinent, beginnend mit dem größten.</p>';
  } else {
    const r = regs[st.id]; sel = { t: 'r', i: r.id }; computeFocus(); focusOn(r.tcx, r.tcy, Math.max(r.trad, 60), 1.05, 1500);
    const tt = []; for (let k = 0; k < NT && tt.length < 2; k++) if (art[trk[k].p].r === r.id && !isHidT(trk[k])) tt.push(trk[k]);
    html = '<div class="k" style="color:' + r.color + '">Kontinent ' + tour.i + ' von ' + (tour.steps.length - 1) + '</div><h2 style="color:' + r.color + '">' + esc(r.name) + '</h2><p><b style="color:#fff">' + NF1.format(r.share * 100) + ' %</b> deiner Hörzeit · ' + r.n + ' Artists. Allen voran <b style="color:#fff">' + r.top.filter(i => !isHidA(art[i])).concat(r.members.filter(i => !isHidA(art[i]) && r.top.indexOf(i) < 0).sort((x, y) => art[y].cm - art[x].cm)).slice(0, 3).map(i => esc(art[i].n)).join('</b>, <b style="color:#fff">') + '</b>.' + (tt.length ? ' Meistgehört: „' + esc(tt[0].n) + '“ von ' + esc(tt[0].art.n) + ' (' + fmtMin(tt[0].m) + ').' : '') + '</p>';
  }
  html += '<div class="tb"><button class="btn" data-tour="prev">‹ Zurück</button><button class="btn" data-tour="pause">' + (tour.paused ? '▶ Weiter' : '❚❚ Pause') + '</button><button class="btn" data-tour="next">Weiter ›</button><span class="sp"></span><button class="btn" data-tour="end">Beenden</button></div>';
  cap.innerHTML = html; cap.classList.add('show'); requestDraw();
  if (!tour.paused) tour.t = setTimeout(() => { if (tour.i >= tour.steps.length - 1) { tourEnd(); clearSel(); fitAll(true); toast('Tour beendet – jetzt kannst du selbst erkunden.'); } else tourGo(tour.i + 1); }, st.t === 'o' ? 5200 : 6800);
}
$('caption').addEventListener('click', e => {
  const b = e.target.closest('[data-tour]'); if (!b) return; const a = b.dataset.tour;
  if (a === 'prev') tourGo(tour.i - 1); else if (a === 'next') tourGo(tour.i + 1); else if (a === 'end') { tourEnd(); clearSel(); fitAll(true); }
  else if (a === 'pause') { tour.paused = !tour.paused; tourGo(tour.i); }
});

/* ---------- Verbindungs-Finder: kuerzeste Kette zwischen zwei Artists/Songs + Begruendung je Schritt ---------- */
const LK = { a: null, b: null, routes: [], ri: 0, msg: '' };
let GR = null;

/* Graph: Nachbarschaften der Karte + gemeinsame Songs (Feature-Kanten). Kante = { sim, feat } */
function graph() {
  if (GR) return GR;
  GR = art.map(() => new Map());
  const put = (i, j, sim, feat) => {
    if (i === j) return;
    [[i, j], [j, i]].forEach(([p, q]) => {
      let e = GR[p].get(q); if (!e) { e = { sim: 0, feat: false }; GR[p].set(q, e); }
      if (sim > e.sim) e.sim = sim; if (feat) e.feat = true;
    });
  };
  art.forEach(a => a.nb.forEach(n => put(a.i, n[0], n[1], false)));
  trk.forEach(t => { if (t.a.length > 1) for (let x = 0; x < t.a.length; x++) for (let y = x + 1; y < t.a.length; y++) put(t.a[x], t.a[y], 0, true); });
  return GR;
}
const edgeCost = e => e.feat ? .85 : 1 + 1.4 * (1 - Math.min(1, e.sim));
let POP = null;     // Beliebtheit 0..1 (bekannte Zwischenstationen erklaeren eine Kette besser als Nischen-Artists)
const popOf = v => { if (!POP) { const mx = Math.log(1 + art[0].m); POP = art.map(a => Math.log(1 + a.m) / mx); } return POP[v]; };
const epArts = ep => ep.t === 'a' ? [ep.i] : trk[ep.i].a.slice();

/* Dijkstra (Mehrfach-Start/Ziel, optionale Strafen fuer Zwischenknoten -> Alternativrouten) */
function dijkstra(src, dst, pen) {
  const G = graph(), n = art.length, dist = new Float64Array(n).fill(Infinity), prev = new Int32Array(n).fill(-1), done = new Uint8Array(n), dstSet = new Set(dst);
  src.forEach(s => { dist[s] = 0; });
  for (; ;) {
    let u = -1, best = Infinity;
    for (let i = 0; i < n; i++) if (!done[i] && dist[i] < best) { best = dist[i]; u = i; }
    if (u < 0) return null;
    if (dstSet.has(u)) { const p = [u]; while (prev[p[0]] >= 0) p.unshift(prev[p[0]]); return { nodes: p, cost: dist[u] }; }
    done[u] = 1;
    G[u].forEach((e, v) => {
      if (done[v]) return; let c = edgeCost(e) * (1 + .3 * (1 - popOf(v))); if (pen && pen.has(v)) c *= pen.get(v);
      if (dist[u] + c < dist[v]) { dist[v] = dist[u] + c; prev[v] = u; }
    });
  }
}
function findRoutes(A, B) {
  const src = epArts(A), dst = epArts(B), pen = new Map(), seen = new Set(), out = [];
  for (let k = 0; k < 4; k++) {
    const r = dijkstra(src, dst, pen); if (!r) break;
    const key = r.nodes.join('>');
    if (!seen.has(key)) { if (out.length && r.nodes.length > out[0].nodes.length + 2) break; seen.add(key); out.push(r); }
    if (r.nodes.length <= 2) break;
    r.nodes.slice(1, -1).forEach(v => pen.set(v, (pen.get(v) || 1) * 4));
  }
  return out;
}

/* Begruendung einer Kante i-j */
function hopInfo(i, j) {
  const a = art[i], b = art[j], e = graph()[i].get(j) || { sim: 0, feat: false };
  const info = { i, j, sim: e.sim, feats: [], tags: [], days: 0, bestMonth: -1, sameScene: a.s === b.s, sameReg: a.r === b.r, dayA: a.dy.length / 3, dayB: b.dy.length / 3 };
  const seen = new Set();
  a.tr.concat(a.ft).forEach(k => { const t = trk[k]; if (t.a.length > 1 && t.a.indexOf(j) >= 0 && !seen.has(k)) { seen.add(k); info.feats.push(k); } });
  info.feats.sort((x, y) => trk[y].m - trk[x].m);
  const sb = new Set(b.g); info.tags = a.g.filter(g => sb.has(g)).slice(0, 5);
  const da = a.dy, db = b.dy, mc = new Map(); let p = 0, q = 0;
  while (p < da.length && q < db.length) {
    if (da[p] < db[q]) p += 3; else if (da[p] > db[q]) q += 3;
    else { info.days++; const mi = DAY2M[da[p]]; mc.set(mi, (mc.get(mi) || 0) + 1); p += 3; q += 3; }
  }
  let bm = -1, bv = 0; mc.forEach((v, k) => { if (v > bv) { bv = v; bm = k; } }); info.bestMonth = bm;
  return info;
}
function hopLines(h) {
  const a = art[h.i], b = art[h.j], L = [];
  if (h.feats.length) {
    const t = trk[h.feats[0]], more = h.feats.length - 1;
    L.push('<span class="k">Feature</span>Zusammen auf <b>„' + esc(t.n) + '“</b>' + (more ? ' und ' + more + ' weiteren Song' + (more > 1 ? 's' : '') : ''));
  }
  if (h.tags.length) L.push('<span class="k">Genre</span>Gemeinsame Tags: ' + h.tags.map(g => '<span class="chip">' + esc(tagName(g)) + '</span>').join(' '));
  if (h.days >= 3) {
    const share = Math.round(h.days / Math.max(1, Math.min(h.dayA, h.dayB)) * 100);
    L.push('<span class="k">Hörverhalten</span>An <b>' + fmt(h.days) + ' Tagen</b> hörst du beide (' + share + ' % der Tage des selteneren)' + (h.bestMonth >= 0 ? ', am häufigsten im ' + monthLabel(h.bestMonth) : ''));
  }
  if (h.sameScene) L.push('<span class="k">Szene</span>Gleiche Szene: <b>' + esc(scs[a.s].name) + '</b>');
  else if (h.sameReg) L.push('<span class="k">Kontinent</span>Gleicher Kontinent: <b>' + esc(regs[a.r].name) + '</b>');
  else L.push('<span class="k">Brücke</span>Verbindet <b>' + esc(regs[a.r].name) + '</b> mit <b>' + esc(regs[b.r].name) + '</b>');
  return L;
}
const simPct = h => h.feats.length && h.sim < .2 ? 'Direkt verbunden' : 'Nähe ' + Math.round(Math.min(1, h.sim) * 100) + ' %';
function whyHTML(i, j) {
  const h = hopInfo(i, j);
  return '<div class="why-box" style="--c:' + art[i].c + '"><div class="why-h"><b>' + esc(art[i].n) + '</b> ↔ <b>' + esc(art[j].n) + '</b><em>' + simPct(h) + '</em></div>'
    + hopLines(h).map(l => '<div class="why-l">' + l + '</div>').join('') + '</div>';
}
function whyToggle(el) {
  const grid = el.closest('.nb-grid'); if (!grid) return;
  const key = el.dataset.why, old = grid.parentNode.querySelector('.why-box');
  const same = old && old.dataset.k === key; if (old) old.remove();
  grid.querySelectorAll('.nb.why-on').forEach(n => n.classList.remove('why-on'));
  if (same) return;
  const [i, j] = key.split('-').map(Number);
  grid.insertAdjacentHTML('afterend', whyHTML(i, j).replace('class="why-box"', 'class="why-box" data-k="' + key + '"'));
  el.closest('.nb').classList.add('why-on');
}

/* ---------- Anzeige ---------- */
const epName = ep => ep.t === 'a' ? art[ep.i].n : trk[ep.i].n + ' – ' + trk[ep.i].a.map(i => art[i].n).join(', ');
function lkSlot(slot) {
  const ep = LK[slot], lbl = slot === 'a' ? 'Von' : 'Nach';
  if (ep) {
    const o = ep.t === 'a' ? art[ep.i] : trk[ep.i], sub = ep.t === 'a' ? 'Artist · ' + esc(art[ep.i].reg.name) : 'Song · ' + esc(trk[ep.i].a.map(i => art[i].n).join(', '));
    return '<div class="lk-slot set"><span class="lbl">' + lbl + '</span>' + (ep.t === 'a' ? thumbA(o, 34) : thumbT(o, 34)) + '<div class="nm">' + esc(o.n) + '<small>' + sub + '</small></div><button class="x" data-act="lk-clear-' + slot + '" aria-label="Auswahl entfernen">×</button></div>';
  }
  return '<div class="lk-slot"><span class="lbl">' + lbl + '</span><input id="lk-q-' + slot + '" data-lkq="' + slot + '" placeholder="Artist oder Song suchen …" autocomplete="off" spellcheck="false"></div><div class="lk-sug" id="lk-sug-' + slot + '"></div>';
}
function linkHTML() {
  let h = '<div class="hero"><div><h2>Verbindungs-Finder</h2><div class="sub">Wie hängen zwei Artists oder Songs zusammen? Ich suche die kürzeste Kette über deine Karte und erkläre jeden Schritt.</div></div></div>';
  h += '<div class="lk-slots">' + lkSlot('a') + '<button class="lk-swap" data-act="lk-swap" aria-label="Tauschen" title="Von und Nach tauschen">⇅</button>' + lkSlot('b') + '</div>';
  h += '<div class="btns"><button class="btn" data-act="lk-rand">🎲 Zufällige Verbindung</button>' + (LINKV ? '<button class="btn" data-act="lk-reset">Zurücksetzen</button>' : '') + '</div>';
  h += '<div id="lk-out">' + lkResultHTML() + '</div>';
  return h;
}
function lkResultHTML() {
  if (LK.msg) return '<div class="lk-msg">' + LK.msg + '</div>';
  if (!LK.routes.length) return '';
  const R = LK.routes[LK.ri], nodes = R.nodes, steps = nodes.length - 1, A = LK.a, B = LK.b;
  let h = '<div class="lk-sum"><div class="big">' + steps + '</div><div><b>' + (steps === 1 ? 'Schritt' : 'Schritte') + '</b><span>' + (steps === 0 ? 'Beide gehören zum selben Artist.' : 'von „' + esc(epName(A)) + '“ zu „' + esc(epName(B)) + '“') + '</span></div></div>';
  if (LK.routes.length > 1) h += '<div class="lk-alt">' + LK.routes.map((r, k) => '<button class="pchip' + (k === LK.ri ? ' on' : '') + '" data-act="lk-route-' + k + '">Route ' + (k + 1) + ' · ' + (r.nodes.length - 1) + (r.nodes.length === 2 ? ' Schritt' : ' Schritte') + '</button>').join('') + '</div>';
  h += '<div class="btns"><button class="btn pri" data-act="lk-fit">Auf der Karte zeigen</button></div>';
  h += '<div class="lk-chain">';
  const endRow = (ep, art0) => {
    if (ep.t !== 'k') return '';
    const t = trk[ep.i];
    return '<div class="row img lk-end" data-lkgo="k' + t.i + '" style="--c:' + t.c + '"><div class="lk-n">♪</div><div><div>' + thumbT(t, 36) + '</div></div><div class="rt"><div class="nm">' + esc(t.n) + '</div><div class="sb">Song von ' + esc(t.a.map(i => art[i].n).join(', ')) + '</div></div><div class="mn">' + fmtMin(t.m) + '</div></div>'
      + '<div class="lk-hop lite" style="--c:' + t.c + '"><div class="lines"><div class="why-l"><span class="k">Song</span>' + (t.a.length > 1 && t.a.indexOf(art0) !== t.p ? 'Feature von ' : 'Song von ') + '<b>' + esc(art[art0].n) + '</b></div></div></div>';
  };
  h += endRow(A, nodes[0]);
  nodes.forEach((i, k) => {
    const a = art[i];
    h += '<div class="row img lk-node" data-lkgo="a' + i + '" data-hl="a' + i + '" style="--c:' + a.c + '"><div class="lk-n">' + (k + 1) + '</div><div>' + thumbA(a, 36) + '</div><div class="rt"><div class="nm">' + esc(a.n) + '</div><div class="sb">' + esc(a.reg.name) + ' · ' + esc(a.scn.name) + '</div></div><div class="mn"><button class="mini" data-go="a' + i + '" title="Details öffnen">Details ↗</button></div></div>';
    if (k < nodes.length - 1) {
      const hi = hopInfo(i, nodes[k + 1]);
      h += '<div class="lk-hop" style="--c:' + a.c + '"><div class="sim">' + simPct(hi) + '</div><div class="lines">' + hopLines(hi).map(l => '<div class="why-l">' + l + '</div>').join('') + '</div></div>';
    }
  });
  const lastEp = B; if (lastEp.t === 'k') { const t = trk[lastEp.i], an = nodes[nodes.length - 1]; h += '<div class="lk-hop lite" style="--c:' + t.c + '"><div class="lines"><div class="why-l"><span class="k">Song</span>' + (t.a.length > 1 && an !== t.p ? 'Feature von ' : 'Song von ') + '<b>' + esc(art[an].n) + '</b></div></div></div>'
    + '<div class="row img lk-end" data-lkgo="k' + t.i + '" style="--c:' + t.c + '"><div class="lk-n">♪</div><div><div>' + thumbT(t, 36) + '</div></div><div class="rt"><div class="nm">' + esc(t.n) + '</div><div class="sb">Song von ' + esc(t.a.map(i => art[i].n).join(', ')) + '</div></div><div class="mn">' + fmtMin(t.m) + '</div></div>'; }
  h += '</div>';
  return h;
}

/* ---------- Steuerung ---------- */
function lkRender(keepFocus) { if (drawerTab === 'link') { const st = dbody.scrollTop; dbody.innerHTML = linkHTML(); dbody.scrollTop = st; if (!keepFocus) { const f = $('lk-q-a') || $('lk-q-b'); if (f && !COARSE) f.focus(); } } }
function lkSet(slot, ep) {
  LK[slot] = ep; LK.msg = ''; LK.routes = []; LK.ri = 0; LINKV = null; computeFocus();
  if (LK.a && LK.b) lkRun(); else { lkRender(); requestDraw(); }
}
function lkRun() {
  const A = LK.a, B = LK.b; LK.msg = ''; LK.routes = [];
  const R = findRoutes(A, B);
  if (!R.length) {
    LK.msg = 'Zwischen <b>' + esc(epName(A)) + '</b> und <b>' + esc(epName(B)) + '</b> gibt es keine Kette über die Karten-Nachbarschaften. Sie liegen in verschiedenen Ecken deiner Musik.';
    LINKV = null; computeFocus(); lkRender(true); requestDraw(); return;
  }
  LK.routes = R; LK.ri = 0; lkApply(); lkRender(true); lkFit(true);
}
function lkApply() {
  const R = LK.routes[LK.ri]; if (!R) { LINKV = null; computeFocus(); return; }
  LINKV = { nodes: R.nodes.slice(), trks: [LK.a, LK.b].filter(e => e.t === 'k').map(e => e.i) };
  sel = null; hl = null; computeFocus(); requestDraw();
}
function lkFit(fly) {
  if (!LINKV) return;
  if (PATH === 'songs') { toast('In der Songs-Ansicht ist die Route nicht sichtbar – wechsle zu „Karte“'); return; }
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  LINKV.nodes.forEach(i => { const a = art[i], f = PATH === 'map' ? Math.max(a.tF, 20) : Math.max(a.tR, 8); x0 = Math.min(x0, a.tx - f); x1 = Math.max(x1, a.tx + f); y0 = Math.min(y0, a.ty - f); y1 = Math.max(y1, a.ty + f); });
  focusOn((x0 + x1) / 2, (y0 + y1) / 2, Math.max(x1 - x0, y1 - y0, 80) / 2, 1.18, fly ? 1100 : 700);
}
function lkClearView() { LINKV = null; computeFocus(); if (drawerTab === 'link') lkRender(true); requestDraw(); }
function lkReset() { LK.a = LK.b = null; LK.routes = []; LK.msg = ''; LINKV = null; computeFocus(); lkRender(); requestDraw(); }
function lkRand() {
  const top = art.filter(a => a.m > 0).sort((x, y) => y.m - x.m).slice(0, 320);
  for (let k = 0; k < 40; k++) {
    const a = top[Math.floor(Math.random() * top.length)], b = top[Math.floor(Math.random() * top.length)];
    if (a === b || a.r === b.r) continue;
    const r = dijkstra([a.i], [b.i]); if (r && r.nodes.length >= 4) { LK.a = { t: 'a', i: a.i }; LK.b = { t: 'a', i: b.i }; lkRun(); return; }
  }
  toast('Keine passende Zufallsverbindung gefunden – nochmal versuchen');
}
function openLinkFrom(ep) {
  LK.a = ep; LK.b = null; LK.routes = []; LK.msg = ''; LINKV = null; computeFocus();
  openDrawer('link'); const f = $('lk-q-b'); if (f && !COARSE) f.focus();
}
function lkAct(a, el) {
  if (a === 'lk-from') { if (sel && (sel.t === 'a' || sel.t === 'k')) openLinkFrom({ t: sel.t, i: sel.i }); }
  else if (a === 'lk-clear-a') lkSet('a', null);
  else if (a === 'lk-clear-b') lkSet('b', null);
  else if (a === 'lk-swap') { const t = LK.a; LK.a = LK.b; LK.b = t; LK.routes = []; LINKV = null; computeFocus(); if (LK.a && LK.b) lkRun(); else lkRender(); }
  else if (a === 'lk-rand') lkRand();
  else if (a === 'lk-reset') lkReset();
  else if (a === 'lk-fit') lkFit(true);
  else if (a.startsWith('lk-route-')) { LK.ri = +a.slice(9); lkApply(); lkRender(true); lkFit(true); }
  else if (a === 'lk-pick') { lkSet(el.dataset.slot, { t: el.dataset.t, i: +el.dataset.i }); }
}
function lkSuggest(slot, q) {
  const box = $('lk-sug-' + slot); if (!box) return;
  const res = search(q).filter(e => e.t === 'a' || e.t === 'k').slice(0, 7);
  box.innerHTML = res.length ? res.map(e => {
    const o = e.t === 'a' ? art[e.i] : trk[e.i], sb = e.t === 'a' ? 'Artist · ' + art[e.i].reg.name : 'Song · ' + trk[e.i].a.map(i => art[i].n).join(', ');
    return '<div class="lk-s" data-act="lk-pick" data-slot="' + slot + '" data-t="' + e.t + '" data-i="' + e.i + '">' + (e.t === 'a' ? thumbA(o, 30) : thumbT(o, 30)) + '<div><div class="nm">' + esc(o.n) + '</div><div class="sb">' + esc(sb) + '</div></div></div>';
  }).join('') : (q.trim() ? '<div class="lk-s none">Nichts gefunden.</div>' : '');
}
dbody.addEventListener('input', e => { const t = e.target; if (t.dataset && t.dataset.lkq) lkSuggest(t.dataset.lkq, t.value); });
dbody.addEventListener('keydown', e => {
  const t = e.target; if (!t.dataset || !t.dataset.lkq || e.key !== 'Enter') return;
  const f = $('lk-sug-' + t.dataset.lkq).querySelector('[data-act="lk-pick"]'); if (f) { e.preventDefault(); lkAct('lk-pick', f); }
});
dbody.addEventListener('click', e => {
  const why = e.target.closest('[data-why]'); if (why) { e.preventDefault(); e.stopPropagation(); whyToggle(why); return; }
  const lg = e.target.closest('[data-lkgo]');
  if (lg && !e.target.closest('[data-go]')) {
    const g = parseGo(lg.dataset.lkgo);
    if (g.t === 'a') { const a = art[g.i]; if (PATH === 'songs') toast('In der Songs-Ansicht nicht sichtbar'); else focusOn(a.tx, a.ty, PATH === 'map' ? Math.max(a.tF, 30) : Math.max(a.tR, 8), 1.45); }
    else { const t = trk[g.i]; if (PATH === 'songs') focusOn(t.tx, t.ty, Math.max(t.tr, 8), 4); else { const a = t.art; focusOn(a.tx, a.ty, PATH === 'map' ? Math.max(a.tF, 30) : Math.max(a.tR, 8), 1.45); } }
    return;
  }
  const act = e.target.closest('[data-act]'); if (act && act.dataset.act.startsWith('lk-')) { e.preventDefault(); e.stopPropagation(); lkAct(act.dataset.act, act); }
}, true);

/* ---------- Karten-Overlay ---------- */
function drawLinkOverlay(z, ox, oy) {
  if (!LINKV || PATH === 'songs') return;
  const P = LINKV.nodes.map(i => art[i]); const now = performance.now();
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const pos = a => [a.x * z + ox, a.y * z + oy];
  for (let q = 0; q + 1 < P.length; q++) {
    const a = P[q], b = P[q + 1], [x1, y1] = pos(a), [x2, y2] = pos(b);
    const mx = (x1 + x2) / 2 + (y2 - y1) * .1, my = (y1 + y2) / 2 - (x2 - x1) * .1;
    const g = ctx.createLinearGradient(x1, y1, x2, y2); g.addColorStop(0, rgba(a.rgb, 1)); g.addColorStop(1, rgba(b.rgb, 1));
    ctx.strokeStyle = g; ctx.setLineDash([]);
    ctx.globalAlpha = .2; ctx.lineWidth = 11; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.quadraticCurveTo(mx, my, x2, y2); ctx.stroke();
    ctx.globalAlpha = .95; ctx.lineWidth = 3.4; ctx.setLineDash([12, 8]); ctx.lineDashOffset = -now / 45; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.quadraticCurveTo(mx, my, x2, y2); ctx.stroke();
    ctx.setLineDash([]);
  }
  ctx.globalAlpha = 1;
  const light = TH.tint === 'light';
  P.forEach((a, q) => {
    const [sx, sy] = pos(a), rs = Math.max(PATH === 'map' && a.k === 1 ? a.R * .88 * z : a.R * Math.max(a.sc, .2) * z, 5) + 4;
    ctx.lineWidth = 2.8; ctx.strokeStyle = rgba(a.rgb, 1); ctx.beginPath(); ctx.arc(sx, sy, rs, 0, 6.2832); ctx.stroke();
    ctx.lineWidth = 1.4; ctx.strokeStyle = light ? 'rgba(255,255,255,.95)' : 'rgba(16,20,34,.95)'; ctx.beginPath(); ctx.arc(sx, sy, rs + 2.4, 0, 6.2832); ctx.stroke();
    const bx = sx + rs * .72, by = sy - rs * .72;
    ctx.fillStyle = rgba(a.rgb, 1); ctx.beginPath(); ctx.arc(bx, by, 10, 0, 6.2832); ctx.fill();
    ctx.lineWidth = 1.6; ctx.strokeStyle = light ? '#fff' : 'rgba(16,20,34,.95)'; ctx.stroke();
    ctx.fillStyle = (a.rgb[0] * .3 + a.rgb[1] * .6 + a.rgb[2] * .1) > 150 ? '#10131f' : '#fff'; ctx.font = '700 11px ' + FONT; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(q + 1), bx, by + .5);
    if (show.labels) addLabel(sx, sy + rs + 5, a.n, null, 12.5, 9.5e8, a.rgb, 'below', true);
  });
  LINKV.trks.forEach(k => {
    const t = trk[k]; if (t.sc < .02 && PATH !== 'map') return; const tx = t.x * z + ox, ty = t.y * z + oy, mr = Math.max(t.r * z, 3.5) + 3;
    ctx.lineWidth = 2; ctx.strokeStyle = rgba(t.rgb, 1); roundRectPath(tx - mr, ty - mr, mr * 2, mr * 2, mr * .3); ctx.stroke();
    if (show.labels) addLabel(tx + mr + 4, ty, t.n, null, 11.5, 9e8, t.rgb, 'right', true);
  });
  ctx.restore();
  requestDraw();
}

/* ---------- PDF-Export: Vektorkarte (Formen und Schrift bleiben in jeder Zoomstufe scharf) + eingebettete Cover ---------- */
const PDFX = { busy: false, cache: new Map() };
(function () {
  const mkW = spec => { const w = new Array(95).fill(556); spec.forEach(([chars, v]) => { for (const ch of chars) w[ch.charCodeAt(0) - 32] = v; }); return w; };
  /* Helvetica / Helvetica-Bold (Standard-14-Schrift, in jedem PDF-Betrachter vorhanden): Breiten in 1/1000 em, ASCII 32..126 */
  const HW = mkW([[' !,./:;I[\\]ft', 278], ['ijl', 222], ["'", 191], ['"', 355], ['()-r`', 333], ['*', 389], ['^', 469], ['Jckvxyzs', 500], ['+<=>~', 584], ['FTZ', 611], ['ABEKPSVXY&', 667], ['CDHNRUw', 722], ['GOQ', 778], ['Mm', 833], ['%', 889], ['W', 944], ['@', 1015], ['{}', 334], ['|', 260]]);
  const HB = mkW([[' ,./I\\ijl', 278], ['!():;-[]`ft', 333], ["'", 238], ['"', 474], ['*r{}', 389], ['+<=>^~', 584], ['?bdghnopquLFTZ', 611], ['EPSVXY', 667], ['ABCDHKNRU&', 722], ['GOQw', 778], ['M', 833], ['%m', 889], ['W', 944], ['@', 975], ['|', 280], ['z', 500]]);
  const WIN = { '€': 128, '‚': 130, 'ƒ': 131, '„': 132, '…': 133, '†': 134, '‡': 135, 'ˆ': 136, '‰': 137, 'Š': 138, '‹': 139, 'Œ': 140, 'Ž': 142, '‘': 145, '’': 146, '“': 147, '”': 148, '•': 149, '–': 150, '—': 151, '˜': 152, '™': 153, 'š': 154, '›': 155, 'œ': 156, 'ž': 158, 'Ÿ': 159 };
  /* Text in WinAnsi-Bytes (als String) umsetzen; null = enthaelt Zeichen, die Helvetica nicht kennt (-> Bild-Fallback) */
  function enc(s) {
    let o = '';
    for (const ch of String(s)) {
      const c = ch.codePointAt(0);
      if ((c >= 32 && c < 127) || (c >= 160 && c <= 255)) o += ch;
      else if (WIN[ch]) o += String.fromCharCode(WIN[ch]);
      else if (/\s/.test(ch)) o += ' ';
      else if (c < 32 || (c >= 0x200B && c <= 0x200F) || c === 0xFEFF || (c >= 0x300 && c <= 0x36F)) continue;
      else { const d = ch.normalize('NFD')[0]; if (d !== ch && d.charCodeAt(0) < 127) o += d; else return null; }
    }
    return o.replace(/ +/g, ' ').trim();
  }
  const latW = {};
  function tw(b, bold) {
    const T = bold ? HB : HW; let w = 0;
    for (let i = 0; i < b.length; i++) {
      const c = b.charCodeAt(i);
      if (c >= 32 && c < 127) w += T[c - 32];
      else if (c === 223) w += 611;
      else { const k = (bold ? 'b' : 'r') + c; if (latW[k] == null) { const d = String.fromCharCode(c).normalize('NFD')[0]; const dc = d.charCodeAt(0); latW[k] = dc >= 32 && dc < 127 ? T[dc - 32] : 556; } w += latW[k]; }
    }
    return w / 1000;
  }
  const esc = b => b.replace(/[\\()]/g, '\\$&');
  const hex16 = s => { let o = 'FEFF'; for (let i = 0; i < s.length; i++) o += s.charCodeAt(i).toString(16).padStart(4, '0'); return '<' + o.toUpperCase() + '>'; };
  const f3 = v => { const r = Math.round(v * 1000) / 1000; return String(r); };
  const f2 = v => String(Math.round(v * 100) / 100);
  const KAPPA = .5523;
  const circ = (x, y, r) => { const k = r * KAPPA; return f2(x + r) + ' ' + f2(y) + ' m ' + f2(x + r) + ' ' + f2(y + k) + ' ' + f2(x + k) + ' ' + f2(y + r) + ' ' + f2(x) + ' ' + f2(y + r) + ' c ' + f2(x - k) + ' ' + f2(y + r) + ' ' + f2(x - r) + ' ' + f2(y + k) + ' ' + f2(x - r) + ' ' + f2(y) + ' c ' + f2(x - r) + ' ' + f2(y - k) + ' ' + f2(x - k) + ' ' + f2(y - r) + ' ' + f2(x) + ' ' + f2(y - r) + ' c ' + f2(x + k) + ' ' + f2(y - r) + ' ' + f2(x + r) + ' ' + f2(y - k) + ' ' + f2(x + r) + ' ' + f2(y) + ' c h '; };
  const rrect = (x, y, w, h, r) => { const k = r * (1 - KAPPA); const x1 = x + w, y1 = y + h;
    return f2(x + r) + ' ' + f2(y) + ' m ' + f2(x1 - r) + ' ' + f2(y) + ' l ' + f2(x1 - k) + ' ' + f2(y) + ' ' + f2(x1) + ' ' + f2(y + k) + ' ' + f2(x1) + ' ' + f2(y + r) + ' c ' + f2(x1) + ' ' + f2(y1 - r) + ' l ' + f2(x1) + ' ' + f2(y1 - k) + ' ' + f2(x1 - k) + ' ' + f2(y1) + ' ' + f2(x1 - r) + ' ' + f2(y1) + ' c ' + f2(x + r) + ' ' + f2(y1) + ' l ' + f2(x + k) + ' ' + f2(y1) + ' ' + f2(x) + ' ' + f2(y1 - k) + ' ' + f2(x) + ' ' + f2(y1 - r) + ' c ' + f2(x) + ' ' + f2(y + r) + ' l ' + f2(x) + ' ' + f2(y + k) + ' ' + f2(x + k) + ' ' + f2(y) + ' ' + f2(x + r) + ' ' + f2(y) + ' c h '; };

  async function deflate(u8) {
    if (typeof CompressionStream === 'undefined') return null;
    try { const cs = new CompressionStream('deflate'); const w = cs.writable.getWriter(); w.write(u8); w.close(); return new Uint8Array(await new Response(cs.readable).arrayBuffer()); } catch (e) { return null; }
  }
  const s2u = s => { const u = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i) & 255; return u; };

  /* ---- minimaler PDF-Schreiber ---- */
  class Writer {
    constructor() { this.parts = []; this.len = 0; this.offs = []; this.n = 0; this.str('%PDF-1.7\n%\xE2\xE3\xCF\xD3\n'); }
    push(u) { this.parts.push(u); this.len += u.length; }
    str(s) { this.push(s2u(s)); }
    alloc() { return ++this.n; }
    obj(id, dict, stream) {
      this.offs[id] = this.len;
      if (stream) { this.str(id + ' 0 obj\n<< ' + dict + ' /Length ' + stream.length + ' >>\nstream\n'); this.push(stream); this.str('\nendstream\nendobj\n'); }
      else this.str(id + ' 0 obj\n' + dict + '\nendobj\n');
    }
    finish(rootId, infoId) {
      const x = this.len; let t = 'xref\n0 ' + (this.n + 1) + '\n0000000000 65535 f \n';
      for (let i = 1; i <= this.n; i++) t += String(this.offs[i] || 0).padStart(10, '0') + ' 00000 n \n';
      t += 'trailer\n<< /Size ' + (this.n + 1) + ' /Root ' + rootId + ' 0 R /Info ' + infoId + ' 0 R >>\nstartxref\n' + x + '\n%%EOF\n';
      this.str(t); return new Blob(this.parts, { type: 'application/pdf' });
    }
  }

  const waitFrames = () => new Promise(r => setTimeout(r, 0));
  async function settled() { const t0 = performance.now(); while ((animOn || solver) && performance.now() - t0 < 6000) await new Promise(r => setTimeout(r, 120)); }
  const toJpeg = cv => new Promise(res => cv.toBlob(b => b ? b.arrayBuffer().then(ab => res(new Uint8Array(ab))) : res(null), 'image/jpeg', .9));
  function loadImg(url) { return new Promise(res => { const im = new Image(); im.crossOrigin = 'anonymous'; im.onload = () => res(im); im.onerror = () => res(null); im.src = url; setTimeout(() => res(null), 12000); }); }

  /* ---- Hauptfunktion ---- */
  async function build(opt, prog) {
    const dark = opt.theme !== 'light';
    prog(T('Layout wird abgeschlossen …'), .01); await settled();
    const PCOL = { bg: dark ? [7, 9, 16] : [247, 241, 227], text: dark ? [234, 237, 247] : [26, 32, 51], sub: dark ? [160, 168, 190] : [90, 98, 120], halo: dark ? [7, 9, 16] : [247, 241, 227] };
    const tintC = (rgb, k) => dark ? lighten(rgb, k) : darken(rgb, Math.min(.72, k * 1.8 + .25));       // hell: Texte deutlich abdunkeln (Kontrast auf Papier)
    const mode = PATH;                                // map | artists | songs
    const hubs = [], solos = [], moons = [], tiles = [];
    if (mode === 'songs') { for (let k = 0; k < NT; k++) { const t = trk[k]; if (t.tsc > .02) tiles.push(t); } }
    else for (let i = 0; i < NA; i++) {
      const a = art[i]; if (!(a.tsc > .02)) continue;
      if (mode === 'map' && a.k === 1) solos.push(a); else hubs.push(a);
      if (mode === 'map' && a.k === 0) for (let m = 0; m < a.tr.length; m++) { const t = trk[a.tr[m]]; if (t.tsc > .02) moons.push(t); }
    }
    // Ausdehnung
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    const ext = (x, y, r) => { x0 = Math.min(x0, x - r); x1 = Math.max(x1, x + r); y0 = Math.min(y0, y - r); y1 = Math.max(y1, y + r); };
    hubs.concat(solos).forEach(a => ext(a.tx, a.ty, mode === 'map' ? a.tF : a.tR * a.tsc)); tiles.forEach(t => ext(t.tx, t.ty, t.tr * t.tsc));
    regs.forEach(r => { if (mode === 'map' && r.act) ext(r.tcx, r.tcy, r.trad * .9); });
    if (x0 > x1) throw new Error(T('Keine sichtbaren Objekte'));
    const MG = Math.max(60, (x1 - x0) * .025), MT = Math.max(150, (y1 - y0) * .05), MB = Math.max(110, (y1 - y0) * .035);
    x0 -= MG; x1 += MG; y0 -= MT; y1 += MB;
    const SC = Math.min(14400 / (x1 - x0), 14400 / (y1 - y0), 6);
    const PW = (x1 - x0) * SC, PH = (y1 - y0) * SC;
    const X = x => (x - x0) * SC, Y = y => PH - (y - y0) * SC;

    /* ---- Inhaltsstrom ---- */
    const L = { bg: [], names: [], edges: [], songs: [], arts: [], title: [] };
    let cur = L.bg; const fillA = {};
    const gsId = a => { const q = Math.max(0, Math.min(1000, Math.round(a * 200) * 5)); fillA[q] = 1; return '/GA' + q; };
    const A = a => gsId(a) + ' gs ';
    const rg = c => f3(c[0] / 255) + ' ' + f3(c[1] / 255) + ' ' + f3(c[2] / 255);
    const imgs = new Map(), imgList = [];                // key -> {id,w,h,bytes|null}
    const wantImg = (key, make) => { let e = imgs.get(key); if (!e) { e = { key, id: imgList.length + 1, make, bytes: null, w: 0, h: 0 }; imgs.set(key, e); imgList.push(e); } return e; };
    const links = [];                                     // {r:[x0,y0,x1,y1], url}
    const textImgs = [];                                  // Bild-Fallback fuer Schrift ausserhalb Latin-1
    prog(T('Karte wird gezeichnet …'), .05);

    /* Hintergrund + Glut der Kontinente */
    cur = L.bg;
    cur.push(rg(PCOL.bg) + ' rg 0 0 ' + f2(PW) + ' ' + f2(PH) + ' re f\n');
    const glow = (cx, cy, rad, rgb, aStep, n) => { for (let k = 0; k < n; k++) { const f = 1 - .86 * k / n; cur.push(A(aStep) + rg(rgb) + ' rg ' + circ(X(cx), Y(cy), rad * f * SC) + 'f\n'); } };
    if (mode === 'map') {
      regs.forEach(r => { if (!r.act) return; glow(r.tcx, r.tcy, r.trad * 1.08, dark ? r.rgb : darken(r.rgb, .1), dark ? .016 : .014, 18); });
      scs.forEach(s => { if (s.act < 3 || s.n < 6) return; glow(s.tcx, s.tcy, s.trad * 1.1, dark ? s.rgb : darken(s.rgb, .1), dark ? .01 : .009, 9); });
    }
    cur.push(A(1));

    /* Beschriftung von Text (Helvetica) oder, falls noetig, als Bild */
    const lblRects = [], grid = new Map(); const CELL = 40;
    const gkeys = (a, b, c, d) => { const o = []; for (let gx = Math.floor(a / CELL); gx <= Math.floor(c / CELL); gx++) for (let gy = Math.floor(b / CELL); gy <= Math.floor(d / CELL); gy++) o.push(gx + ',' + gy); return o; };
    const free = (a, b, c, d) => { for (const k of gkeys(a, b, c, d)) { const g = grid.get(k); if (g) for (const r of g) if (a < r[2] && c > r[0] && b < r[3] && d > r[1]) return false; } return true; };
    const take = (a, b, c, d) => { const r = [a, b, c, d]; for (const k of gkeys(a, b, c, d)) { let g = grid.get(k); if (!g) grid.set(k, g = []); g.push(r); } };
    const wTxt = (txt, bold) => { const b = enc(txt); if (b != null) return { b, w: tw(b, bold) }; const c = document.createElement('canvas').getContext('2d'); c.font = (bold ? '700 ' : '500 ') + '100px ' + FONT; return { b: null, w: c.measureText(txt).width / 100 / 1.0 * .94 }; };
    /* gibt Zeichenfolge zurueck, fs in Kartenmetern; x,y = Grundlinie links */
    function drawText(out, txt, x, y, fs, bold, rgb, halo, charSp) {
      const e = wTxt(txt, bold);
      if (e.b != null) {
        const body = (bold ? '/F2 ' : '/F1 ') + f2(fs * SC) + ' Tf ' + (charSp ? f2(charSp * SC) + ' Tc ' : '') + '1 0 0 1 ' + f2(X(x)) + ' ' + f2(Y(y)) + ' Tm (' + esc(e.b) + ') Tj ET Q\n';
        if (halo) out.push('q BT ' + rg(PCOL.halo) + ' RG ' + f2(fs * SC * .2) + ' w 1 j 1 Tr ' + body);      // erst die Kontur ...
        out.push('q BT ' + rg(rgb) + ' rg ' + body);                                                        // ... dann die Fuellung
      } else {
        const key = 'T' + (bold ? 'b' : 'r') + '|' + txt + '|' + rgb.join(',');
        let t = textImgs.find(q => q.key === key);
        if (!t) { t = { key, txt, bold, rgb, id: textImgs.length + 1 }; textImgs.push(t); }
        out.push({ ti: t, x, y, fs, w: e.w });         // Platzhalter, wird in finalize() durch den Bildbefehl ersetzt
      }
      return e.w * fs + (charSp || 0) * (txt.length);
    }
    /* spots: Liste moeglicher Platzierungen {k:'r'|'l'|'b'|'t', x, y}; probiert Schriftgroessen 100/74/55 % in allen Lagen */
    function tryLabel(out, spots, txt, fs0, bold, rgb) {
      const e = wTxt(txt, bold);
      for (const f of [1, .74, .55]) {
        const fs = fs0 * f, w = e.w * fs, h = fs * 1.2;
        for (const sp of spots) {
          let a, b2, c, d, bx, by;
          if (sp.k === 'r') { a = sp.x; b2 = sp.y - h / 2; c = a + w; d = b2 + h; bx = a; by = sp.y + fs * .34; }
          else if (sp.k === 'l') { c = sp.x; a = c - w; b2 = sp.y - h / 2; d = b2 + h; bx = a; by = sp.y + fs * .34; }
          else if (sp.k === 'b') { a = sp.x - w / 2; b2 = sp.y; c = a + w; d = b2 + h; bx = a; by = sp.y + fs * .95; }
          else { a = sp.x - w / 2; d = sp.y; c = a + w; b2 = d - h; bx = a; by = b2 + fs * .95; }
          if (!free(a, b2, c, d)) continue;
          take(a, b2, c, d); drawText(out, txt, bx, by, fs, bold, rgb, true);
          return { x0: a, y0: b2, x1: c, y1: d, fs };
        }
      }
      return null;
    }

    /* Kontinent-/Szenen-Namen (unter den Objekten, grosse, transparente Schrift) */
    cur = L.names;
    if (mode === 'map') {
      const order = regs.filter(r => r.act && r.trad > 10).sort((a, b) => b.trad - a.trad);
      order.forEach(r => {
        const fs = Math.max(14, r.trad * .105), rgb = tintC(r.rgb, .22);
        const lines = r.lines || [r.name]; const lh = fs * 1.1, h0 = -(lines.length - 1) / 2 * lh;
        cur.push(A(.8));
        lines.forEach((ln, j) => { const sp = fs * .12, e = wTxt(ln.toUpperCase(), true), w = e.w * fs + sp * ln.length; drawText(cur, ln.toUpperCase(), r.tcx - w / 2, r.tcy + h0 + j * lh + fs * .34, fs, true, rgb, true, sp); });
        cur.push(A(1));
      });
      scs.filter(s => s.act >= 3 && s.n >= 6 && s.trad > 14).sort((a, b) => b.cm - a.cm).forEach(s => {
        const fs = Math.max(8, s.trad * .085), rgb = tintC(s.rgb, .4), lines = s.lines || [s.name]; const lh = fs * 1.12, h0 = -(lines.length - 1) / 2 * lh;
        cur.push(A(.8));
        lines.forEach((ln, j) => { const e = wTxt(ln, true), w = e.w * fs; drawText(cur, ln, s.tcx - w / 2, s.tcy + h0 + j * lh + fs * .34, fs, true, rgb, true); });
        cur.push(A(1));
      });
    }

    /* Verbindungen */
    cur = L.edges;
    if (mode === 'map') {
      regs.forEach((r, ri) => {
        const g = edgeGroups[ri]; if (!g || !g.length) return;
        let s = ''; let n = 0;
        for (const e of g) {
          const a = art[e[0]], b = art[e[1]]; if (!(a.tsc > .05 && b.tsc > .05)) continue;
          const x1_ = X(a.tx), y1_ = Y(a.ty), x2_ = X(b.tx), y2_ = Y(b.ty), mx = (x1_ + x2_) / 2 + (y2_ - y1_) * -.08, my = (y1_ + y2_) / 2 - (x2_ - x1_) * -.08;
          const c1x = x1_ + 2 / 3 * (mx - x1_), c1y = y1_ + 2 / 3 * (my - y1_), c2x = x2_ + 2 / 3 * (mx - x2_), c2y = y2_ + 2 / 3 * (my - y2_);
          s += f2(x1_) + ' ' + f2(y1_) + ' m ' + f2(c1x) + ' ' + f2(c1y) + ' ' + f2(c2x) + ' ' + f2(c2y) + ' ' + f2(x2_) + ' ' + f2(y2_) + ' c\n'; n++;
        }
        if (n) cur.push(A(dark ? .22 : .3) + rg(tintC(r.rgb, .3)) + ' RG ' + f2(.9 * SC) + ' w\n' + s + 'S\n');
      });
      cur.push(A(1));
    }

    /* Hilfsfunktionen fuer Bilder */
    const clipImg = (shape, cx, cy, half, e, ring, rgbRing, lw) => {
      const X_ = X(cx), Y_ = Y(cy), h = half * SC;
      const path = shape === 'c' ? circ(X_, Y_, h * .985) : rrect(X_ - h * .985, Y_ - h * .985, h * 1.97, h * 1.97, h * .2);
      let s = 'q ' + path + 'W n ' + f2(h * 2) + ' 0 0 ' + f2(h * 2) + ' ' + f2(X_ - h) + ' ' + f2(Y_ - h) + ' cm /I' + e.id + ' Do Q\n';
      if (ring) s += rg(rgbRing) + ' RG ' + f2(lw * SC) + ' w ' + (shape === 'c' ? circ(X_, Y_, h + lw * SC * .35) : rrect(X_ - h - lw * SC * .35, Y_ - h - lw * SC * .35, (h + lw * SC * .35) * 2, (h + lw * SC * .35) * 2, h * .2)) + 'S\n';
      return s;
    };
    const tileImg = (kind, idx) => wantImg(kind + ':' + idx, () => {
      const T_ = kind === 'A' ? TA : kind === 'B' ? TB : TC, im = kind === 'A' ? imgA : kind === 'B' ? imgB : imgC, [tx, ty] = kind === 'A' ? tileA(idx) : kind === 'B' ? tileB(idx) : tileC(idx);
      const c = document.createElement('canvas'); c.width = c.height = T_; const g = c.getContext('2d'); g.fillStyle = dark ? '#161b2c' : '#e8e0cd'; g.fillRect(0, 0, T_, T_); g.drawImage(im, tx, ty, T_, T_, 0, 0, T_, T_); return c;
    });
    const hiList = [];
    const artistImg = a => { const e = a.hc >= 0 ? tileImg('C', a.hc) : a.h >= 0 ? tileImg('B', a.h) : tileImg('A', a.i); return e; };
    const coverImg = t => { const al = t.al >= 0 ? alb[t.al] : null; return al && al.hc >= 0 ? tileImg('C', al.hc) : al && al.h >= 0 ? tileImg('B', al.h) : tileImg('A', t.t); };
    const hiFor = (e, kind, o, half) => { if (opt.hires && !IS_ART && half * SC >= 55 && hiUrl(kind, o)) { const key = 'H:' + kind + o.i; const h = wantImg(key, null); h.url = hiUrl(kind, o); h.fallback = e; h.dark = dark; hiList.push(h); return h; } return e; };

    /* Songs (Monde) */
    cur = L.songs;
    const moonLabels = [], hubLabels = [];
    if (mode === 'map') {
      hubs.forEach(a => {
        if (a.k !== 0 || !a.tRings.length || !S.rings) return;
        const rk = 1; cur.push(A(dark ? .2 : .25) + rg(a.rgb) + ' RG ' + f2(.8 * SC) + ' w\n');
        a.tRings.forEach(rr => cur.push(circ(X(a.tx), Y(a.ty), rr * rk * SC) + 'S\n')); cur.push(A(1));
      });
      moons.forEach(t => {
        const half = t.tr * t.tsc * S.moonScale; if (half < .35) return;
        const a = t.art, X_ = X(t.tx), Y_ = Y(t.ty);
        if (half * SC < 1.6) { cur.push(rg(a.rgb) + ' rg ' + f2(X_ - half * SC) + ' ' + f2(Y_ - half * SC) + ' ' + f2(half * 2 * SC) + ' ' + f2(half * 2 * SC) + ' re f\n'); return; }
        const e = hiFor(coverImg(t), 'b', t.al >= 0 ? alb[t.al] : { i: -1 }, half);
        cur.push(clipImg('r', t.tx, t.ty, half, e, half * SC > 3, a.rgb, Math.max(.4, half * .06)));
        if (t.sp) links.push({ r: [X_ - half * SC, Y_ - half * SC, X_ + half * SC, Y_ + half * SC], url: 'https://open.spotify.com/track/' + t.sp });
        moonLabels.push({ t, half });
      });
    }

    /* Artists, Einzel-Song-Kacheln, Song-Kacheln */
    cur = L.arts;
    const uni = [];            // Beschriftungs-Kandidaten
    const placeArt = a => {
      const R = (mode === 'map' ? a.tR : a.tR) * a.tsc; if (R < .35) return; const X_ = X(a.tx), Y_ = Y(a.ty);
      if (R * SC < 1.4) { cur.push(rg(a.rgb) + ' rg ' + circ(X_, Y_, Math.max(R * SC, .5)) + 'f\n'); return; }
      const e = hiFor(artistImg(a), 'a', a, R);
      cur.push(clipImg('c', a.tx, a.ty, R, e, true, a.rgb, Math.max(.8, Math.min(R * .07, 3.5))));
      if (a.sp) links.push({ r: [X_ - R * SC, Y_ - R * SC, X_ + R * SC, Y_ + R * SC], url: 'https://open.spotify.com/artist/' + a.sp });
      uni.push({ kind: 'a', a, R, pri: a.cm + 1e-3 * a.m });
    };
    hubs.forEach(placeArt);
    solos.forEach(a => {
      const t = trk[a.tr[0]]; const half = a.tR * Math.max(a.tsc, t.tsc) * .88; if (half < .35) return; const X_ = X(a.tx), Y_ = Y(a.ty);
      if (half * SC < 1.6) { cur.push(rg(a.rgb) + ' rg ' + f2(X_ - half * SC) + ' ' + f2(Y_ - half * SC) + ' ' + f2(half * 2 * SC) + ' ' + f2(half * 2 * SC) + ' re f\n'); return; }
      const e = hiFor(coverImg(t), 'b', t.al >= 0 ? alb[t.al] : { i: -1 }, half);
      cur.push(clipImg('r', a.tx, a.ty, half, e, half * SC > 3, a.rgb, Math.max(.5, Math.min(half * .06, 2.2))));
      if (t.sp) links.push({ r: [X_ - half * SC, Y_ - half * SC, X_ + half * SC, Y_ + half * SC], url: 'https://open.spotify.com/track/' + t.sp });
      uni.push({ kind: 's', a, t, half, pri: a.cm + 1e-3 * a.m });
    });
    tiles.forEach(t => {
      const half = t.tr * t.tsc; if (half < .35) return; const X_ = X(t.tx), Y_ = Y(t.ty), a = t.art;
      if (half * SC < 1.6) { cur.push(rg(a.rgb) + ' rg ' + f2(X_ - half * SC) + ' ' + f2(Y_ - half * SC) + ' ' + f2(half * 2 * SC) + ' ' + f2(half * 2 * SC) + ' re f\n'); return; }
      const e = hiFor(coverImg(t), 'b', t.al >= 0 ? alb[t.al] : { i: -1 }, half);
      cur.push(clipImg('r', t.tx, t.ty, half, e, half * SC > 3, a.rgb, Math.max(.5, Math.min(half * .06, 2.2))));
      if (t.sp) links.push({ r: [X_ - half * SC, Y_ - half * SC, X_ + half * SC, Y_ + half * SC], url: 'https://open.spotify.com/track/' + t.sp });
      uni.push({ kind: 'k', t, a, half, pri: t.cm + 1e-3 * t.m });
    });

    /* Beschriftungen mit Kollisionspruefung (Prioritaet = Hoerzeit): erst Artists/Kacheln, danach die Songs (Monde) rundherum */
    prog(T('Beschriftungen werden gesetzt …'), .15);
    const labLayer = { arts: [], songs: [] }, lc = rgb => tintC(rgb, dark ? .28 : .1);
    uni.forEach(u => { const r = u.kind === 'a' ? u.R : u.half, cx = u.kind === 'k' ? u.t.tx : u.a.tx, cy = u.kind === 'k' ? u.t.ty : u.a.ty; take(cx - r, cy - r, cx + r, cy + r); });      // Bilder sind Hindernisse
    uni.sort((p, q) => q.pri - p.pri).forEach(u => {
      let txt, cx, cy, r, fs, sub, bold, rgb;
      if (u.kind === 'a') { r = u.R; cx = u.a.tx; cy = u.a.ty; txt = u.a.n; fs = 10.5 / Math.max(1, 8 / r) + r * .075; bold = true; rgb = u.a.rgb; sub = r > 34 ? fmtMetric(u.a.cm, u.a.cs) : null; }
      else { r = u.half; cx = u.kind === 'k' ? u.t.tx : u.a.tx; cy = u.kind === 'k' ? u.t.ty : u.a.ty; txt = u.t.n; fs = 9.5 / Math.max(1, 8 / r) + r * .05; bold = false; rgb = u.a.rgb; sub = u.a.n; }
      if (!txt) return;
      const q = tryLabel(labLayer.arts, [{ k: 'b', x: cx, y: cy + r + 3 }, { k: 't', x: cx, y: cy - r - 3 }], txt, fs, bold, lc(rgb));
      if (q && sub) { const sw = wTxt(sub, false).w * q.fs * .8; drawText(labLayer.arts, sub, (q.x0 + q.x1) / 2 - sw / 2, q.y1 + q.fs * .85, q.fs * .8, false, PCOL.sub, true); take(q.x0, q.y1, q.x1, q.y1 + q.fs); }
    });
    moonLabels.forEach(m => take(m.t.tx - m.half, m.t.ty - m.half, m.t.tx + m.half, m.t.ty + m.half));
    moonLabels.sort((p, q) => (q.t.cm + 1e-3 * q.t.m) - (p.t.cm + 1e-3 * p.t.m)).forEach(m => {
      const t = m.t, mr = t.tr * t.tsc, fs = 10 / Math.max(1, 6 / mr) + mr * .08, h = m.half;
      tryLabel(labLayer.songs, [{ k: 'r', x: t.tx + h + 1.5, y: t.ty }, { k: 'l', x: t.tx - h - 1.5, y: t.ty }, { k: 'b', x: t.tx, y: t.ty + h + 1 }, { k: 't', x: t.tx, y: t.ty - h - 1 }], t.n, fs, false, lc(t.art.rgb));
    });
    labLayer.songs.forEach(o => L.songs.push(o)); labLayer.arts.forEach(o => L.arts.push(o));

    /* Titel und Legende */
    cur = L.title;
    {
      const tfs = Math.max(34, (x1 - x0) * .02), tx0 = x0 + MG * .6, ty0 = y0 + MT * .42;
      drawText(cur, 'KLANGKARTE', tx0, ty0, tfs * .34, true, PCOL.sub, false, tfs * .08);
      drawText(cur, HUD.user, tx0, ty0 + tfs * 1.05, tfs, true, PCOL.text, false);
      const rt = rangeText(), s1 = rt + ' · ' + fmt((isFull() ? HUD.minutes : rangeMinutes) / 60) + (LANG === 'en' ? ' h · ' : ' Std. · ') + fmt(isFull() ? HUD.streams : rangeStreams) + ' Streams · ' + (hubs.length + solos.length || tiles.length) + (mode === 'songs' ? ' Songs' : ' Artists');
      drawText(cur, s1, tx0, ty0 + tfs * 1.62, tfs * .36, false, PCOL.sub, false);
      const lg = T('Größe = Hörzeit · Farbe = Genre-Kontinent · kleine Quadrate rund um einen Artist = seine Songs · Nähe = ähnliche Musik · Mit Zoom entdeckst du jeden Song');
      drawText(cur, lg, tx0, y1 - MB * .4, tfs * .3, false, PCOL.sub, false);
      const dt = new Date(); drawText(cur, 'stats.fm · ' + String(dt.getDate()).padStart(2, '0') + '.' + String(dt.getMonth() + 1).padStart(2, '0') + '.' + dt.getFullYear(), tx0, y1 - MB * .4 + tfs * .42, tfs * .26, false, PCOL.sub, false);
    }

    /* ---- Bilder erzeugen ---- */
    prog(T('Cover werden eingebettet …'), .3);
    const hi = imgList.filter(e => e.url); const std = imgList.filter(e => !e.url);
    // Standard-Kacheln -> JPEG
    const CH = 150;
    for (let i = 0; i < std.length; i += CH) {
      await Promise.all(std.slice(i, i + CH).map(async e => {
        const ck = e.key + (dark ? 'd' : 'l'), c0 = PDFX.cache.get(ck); if (c0) { e.bytes = c0.bytes; e.w = c0.w; e.h = c0.h; return; }
        const cv = e.make(); e.w = cv.width; e.h = cv.height; e.bytes = await toJpeg(cv); PDFX.cache.set(ck, { bytes: e.bytes, w: e.w, h: e.h });
      }));
      prog('Cover werden eingebettet … ' + Math.min(std.length, i + CH) + ' / ' + std.length, .3 + .35 * Math.min(1, (i + CH) / Math.max(1, std.length)));
      await waitFrames();
    }
    // Hi-Res aus dem Netz (optional)
    let hiOk = 0;
    if (hi.length) {
      const q = hi.slice(); let done = 0;
      const worker = async () => { while (q.length) { const e = q.shift(); const im = await loadImg(e.url); if (im && im.naturalWidth > 64) { const c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight; const g = c.getContext('2d'); g.fillStyle = e.dark ? '#161b2c' : '#e8e0cd'; g.fillRect(0, 0, c.width, c.height); g.drawImage(im, 0, 0); try { e.bytes = await toJpeg(c); e.w = c.width; e.h = c.height; hiOk++; } catch (_) { } } done++; prog('Hochauflösende Cover … ' + done + ' / ' + hi.length, .65 + .12 * done / hi.length); } };
      await Promise.all([worker(), worker(), worker(), worker(), worker(), worker()]);
      hi.forEach(e => { if (!e.bytes && e.fallback) { e.bytes = e.fallback.bytes; e.w = e.fallback.w; e.h = e.fallback.h; } });
    }

    /* Text-Bilder (Schriftzeichen ausserhalb von Latin-1) */
    prog(T('Sonderzeichen …'), .8);
    for (const t of textImgs) {
      const PX = 64, c = document.createElement('canvas'), g = c.getContext('2d'); g.font = (t.bold ? '700 ' : '500 ') + PX + 'px ' + FONT;
      const w = Math.ceil(g.measureText(t.txt).width) + 8, h = Math.ceil(PX * 1.45); c.width = w; c.height = h;
      g.font = (t.bold ? '700 ' : '500 ') + PX + 'px ' + FONT; g.fillStyle = '#000'; g.textBaseline = 'alphabetic'; g.fillText(t.txt, 4, PX * 1.05);
      const d = g.getImageData(0, 0, w, h).data, al = new Uint8Array(w * h), rgbp = new Uint8Array(w * h * 3);
      for (let i = 0; i < w * h; i++) { al[i] = d[i * 4 + 3]; rgbp[i * 3] = t.rgb[0]; rgbp[i * 3 + 1] = t.rgb[1]; rgbp[i * 3 + 2] = t.rgb[2]; }
      const da = await deflate(al), dr = await deflate(rgbp);
      t.w = w; t.h = h; t.z = !!(da && dr); t.alpha = t.z ? da : al; t.rgbp = t.z ? dr : rgbp; t.PX = PX;
    }
    // Platzhalter in den Ebenen durch echte Text-Bild-Befehle ersetzen
    const finalize = arr => arr.map(o => {
      if (typeof o === 'string') return o;
      const t = o.ti, k = o.fs / t.PX, w = t.w * k, h = t.h * k;
      return 'q ' + f2(w * SC) + ' 0 0 ' + f2(h * SC) + ' ' + f2(X(o.x - 4 * k)) + ' ' + f2(Y(o.y) - (t.h - 1.05 * t.PX) * k * SC) + ' cm /TI' + t.id + ' Do Q\n';
    }).join('');

    /* ---- PDF zusammensetzen ---- */
    prog(T('PDF wird geschrieben …'), .84);
    const W_ = new Writer();
    const idCat = W_.alloc(), idPages = W_.alloc(), idPage = W_.alloc(), idF1 = W_.alloc(), idF2 = W_.alloc(), idInfo = W_.alloc();
    const ocg = {}; ['bg', 'edges', 'songs', 'arts', 'names', 'title'].forEach(k => { ocg[k] = W_.alloc(); });
    const OCN = { bg: T('Hintergrund & Farbflächen'), names: T('Kontinent- und Szenennamen'), edges: T('Verbindungslinien'), songs: T('Songs (Monde)'), arts: T('Artists & Namen'), title: T('Titel & Legende') };
    for (const k in ocg) W_.obj(ocg[k], '<< /Type /OCG /Name ' + hex16(OCN[k]) + ' >>');
    W_.obj(idF1, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
    W_.obj(idF2, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
    W_.obj(idInfo, '<< /Title ' + hex16('Klangkarte – ' + HUD.user) + ' /Creator ' + hex16('Klangkarte') + ' /Producer ' + hex16('Klangkarte PDF-Export') + ' >>');
    const gsIds = {}; for (const q in fillA) { const id = W_.alloc(); gsIds[q] = id; const v = (q / 1000); W_.obj(id, '<< /Type /ExtGState /ca ' + v + ' /CA ' + v + ' >>'); }
    // Bilder
    const imgIds = {};
    for (const e of imgList) {
      if (!e.bytes) continue; const id = W_.alloc(); imgIds[e.id] = id;
      W_.obj(id, '/Type /XObject /Subtype /Image /Width ' + e.w + ' /Height ' + e.h + ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Interpolate true', e.bytes);
    }
    const tiIds = {};
    for (const t of textImgs) {
      const idA = W_.alloc(), idI = W_.alloc(); tiIds[t.id] = idI;
      W_.obj(idA, '/Type /XObject /Subtype /Image /Width ' + t.w + ' /Height ' + t.h + ' /ColorSpace /DeviceGray /BitsPerComponent 8' + (t.z ? ' /Filter /FlateDecode' : ''), t.alpha);
      W_.obj(idI, '/Type /XObject /Subtype /Image /Width ' + t.w + ' /Height ' + t.h + ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Interpolate true /SMask ' + idA + ' 0 R' + (t.z ? ' /Filter /FlateDecode' : ''), t.rgbp);
    }
    // Inhalt (je Ebene in Marked Content)
    const parts = [];
    ['bg', 'edges', 'songs', 'arts', 'names', 'title'].forEach(k => { parts.push('/OC /OC_' + k + ' BDC\n' + finalize(L[k]) + 'EMC\n'); });
    let content = s2u(parts.join('')); const cz = await deflate(content);
    const idCont = W_.alloc(); W_.obj(idCont, cz ? '/Filter /FlateDecode' : '', cz || content);
    // Verknuepfungen
    const annIds = [];
    for (const l of links) { const id = W_.alloc(); annIds.push(id); W_.obj(id, '<< /Type /Annot /Subtype /Link /Rect [' + l.r.map(f2).join(' ') + '] /Border [0 0 0] /A << /S /URI /URI (' + l.url + ') >> >>'); }
    // Gliederung (Kontinente)
    const outItems = [];
    if (mode === 'map') regs.filter(r => r.act && r.trad > 10).sort((a, b) => b.cm - a.cm).forEach(r => { outItems.push({ title: r.name, rect: [X(r.tcx - r.trad), Y(r.tcy + r.trad), X(r.tcx + r.trad), Y(r.tcy - r.trad)] }); });
    let idOut = 0;
    if (outItems.length) {
      idOut = W_.alloc(); const ids = outItems.map(() => W_.alloc());
      W_.obj(idOut, '<< /Type /Outlines /First ' + ids[0] + ' 0 R /Last ' + ids[ids.length - 1] + ' 0 R /Count ' + ids.length + ' >>');
      outItems.forEach((it, i) => W_.obj(ids[i], '<< /Title ' + hex16(it.title) + ' /Parent ' + idOut + ' 0 R' + (i > 0 ? ' /Prev ' + ids[i - 1] + ' 0 R' : '') + (i < ids.length - 1 ? ' /Next ' + ids[i + 1] + ' 0 R' : '') + ' /Dest [' + idPage + ' 0 R /FitR ' + it.rect.map(f2).join(' ') + '] >>'));
    }
    const res = '<< /Font << /F1 ' + idF1 + ' 0 R /F2 ' + idF2 + ' 0 R >> /ExtGState << ' + Object.keys(gsIds).map(q => '/GA' + q + ' ' + gsIds[q] + ' 0 R').join(' ') + ' >> /XObject << '
      + imgList.filter(e => imgIds[e.id]).map(e => '/I' + e.id + ' ' + imgIds[e.id] + ' 0 R').join(' ') + ' ' + textImgs.map(t => '/TI' + t.id + ' ' + tiIds[t.id] + ' 0 R').join(' ')
      + ' >> /Properties << ' + Object.keys(ocg).map(k => '/OC_' + k + ' ' + ocg[k] + ' 0 R').join(' ') + ' >> >>';
    W_.obj(idPage, '<< /Type /Page /Parent ' + idPages + ' 0 R /MediaBox [0 0 ' + f2(PW) + ' ' + f2(PH) + '] /Resources ' + res + ' /Contents ' + idCont + ' 0 R' + (annIds.length ? ' /Annots [' + annIds.map(i => i + ' 0 R').join(' ') + ']' : '') + ' >>');
    W_.obj(idPages, '<< /Type /Pages /Kids [' + idPage + ' 0 R] /Count 1 >>');
    const ocgs = Object.keys(ocg).map(k => ocg[k] + ' 0 R').join(' ');
    W_.obj(idCat, '<< /Type /Catalog /Pages ' + idPages + ' 0 R' + (idOut ? ' /Outlines ' + idOut + ' 0 R /PageMode /UseOutlines' : '') + ' /OCProperties << /OCGs [' + ocgs + '] /D << /Order [' + ocgs + '] /ON [' + ocgs + '] >> >> >>');
    const blob = W_.finish(idCat, idInfo);
    prog(T('Fertig'), 1);
    return { blob, info: { pageW: PW, pageH: PH, artists: hubs.length + solos.length, moons: moons.length, labels: labLayer.arts.length + labLayer.songs.length, images: imgList.filter(e => e.bytes).length, hiRes: hiOk, links: links.length, bytes: blob.size } };
  }
  PDFX.build = build;
})();

async function exportPDF(opt) {
  if (PDFX.busy) return; PDFX.busy = true;
  const bar = $('pdf-bar'), msg = $('pdf-msg'), go = $('pdf-go');
  go.disabled = true; $('pdf-prog').classList.remove('hidden');
  const prog = (t, f) => { msg.textContent = t; bar.style.width = Math.round(f * 100) + '%'; };
  try {
    const t0 = performance.now(); const r = await PDFX.build(opt, prog);
    PDFX.last = r;
    if (opt.upload) { await fetch(opt.upload, { method: 'POST', body: r.blob }); }
    else if (!(await saveFile(r.blob, 'Klangkarte_' + HUD.user + '.pdf'))) { msg.textContent = 'Nicht gespeichert'; return r; }
    msg.textContent = 'Fertig · ' + (r.info.bytes / 1048576).toFixed(1) + ' MB · ' + r.info.images + ' Cover · ' + Math.round((performance.now() - t0) / 1000) + ' s';
    return r;
  } catch (e) { console.error(e); msg.textContent = 'Fehler: ' + e.message; }
  finally { PDFX.busy = false; go.disabled = false; }
}
function openPdfDialog() { $('pdf').classList.add('show'); $('pdf-prog').classList.add('hidden'); $('pdf-msg').textContent = ''; $('pdf-bar').style.width = '0'; }

/* ---------- Live-Modus: was gerade laeuft, blueht auf der Karte auf (stats.fm /streams/current, kein Spotify-Login noetig) ---------- */
const LIVE = { on: false, cur: null, follow: true, timer: 0, err: 0, spMap: null, nmMap: null, anMap: null, bloom: 0, count: 0, lastId: null };
function liveIndex() {
  if (LIVE.spMap) return;
  LIVE.spMap = new Map(); LIVE.nmMap = new Map(); LIVE.anMap = new Map();
  trk.forEach(t => { if (t.sp) LIVE.spMap.set(t.sp, t.i); const k = norm(t.n) + '|' + norm(art[t.p].n); if (!LIVE.nmMap.has(k)) LIVE.nmMap.set(k, t.i); });
  art.forEach(a => { const k = norm(a.n); if (!LIVE.anMap.has(k)) LIVE.anMap.set(k, a.i); });
}
function liveMatch(tr) {
  const sp = ((tr.externalIds || {}).spotify || [])[0]; let ti = sp ? LIVE.spMap.get(sp) : undefined;
  const a0 = tr.artists && tr.artists[0] ? tr.artists[0].name : '';
  if (ti === undefined) ti = LIVE.nmMap.get(norm(tr.name || '') + '|' + norm(a0));
  let ai = ti !== undefined ? trk[ti].p : LIVE.anMap.get(norm(a0));
  if (ai === undefined && tr.artists) for (const x of tr.artists) { const q = LIVE.anMap.get(norm(x.name)); if (q !== undefined) { ai = q; break; } }
  return { ti, ai };
}
function liveCard() {
  let c = $('live'); if (c) return c;
  c = document.createElement('div'); c.id = 'live'; c.className = 'glass hidden';
  c.innerHTML = '<div class="lv-cover" id="lv-cover"></div><div class="lv-txt"><div class="lv-k"><i></i><span>Live · stats.fm</span></div><div class="lv-t" id="lv-t"></div><div class="lv-a" id="lv-a"></div><div class="lv-bar"><i id="lv-bar"></i></div></div><div class="lv-btns"><button id="lv-follow" class="on" title="Kamera folgt" aria-label="Kamera folgt"><svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="10" cy="10" r="3"/><path d="M10 2v3M10 15v3M2 10h3M15 10h3"/></svg></button><button id="lv-x" aria-label="Schließen"><svg width="12" height="12" viewBox="0 0 14 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 3l8 8M11 3l-8 8"/></svg></button></div>';
  document.body.appendChild(c);
  $('lv-follow').onclick = () => { LIVE.follow = !LIVE.follow; $('lv-follow').classList.toggle('on', LIVE.follow); if (LIVE.follow && LIVE.cur) liveFly(); };
  $('lv-x').onclick = () => setLive(false);
  return c;
}
function liveRender() {
  const c = liveCard(), cur = LIVE.cur; c.classList.toggle('hidden', !LIVE.on); c.classList.toggle('idle', !cur);
  if (!LIVE.on) return;
  if (!cur) { $('lv-t').textContent = T('Gerade läuft nichts'); $('lv-a').textContent = LIVE.err > 2 ? T('Keine Verbindung zu stats.fm') : ''; $('lv-cover').style.background = ''; $('lv-bar').style.width = '0'; return; }
  $('lv-t').textContent = cur.name; $('lv-a').textContent = cur.artists + (cur.ai == null ? ' · ' + T('Neu auf deiner Karte') : '');
  const al = cur.ti != null && trk[cur.ti].al >= 0 ? alb[trk[cur.ti].al] : null;
  const ts = cur.ti != null ? thumbStyle(trk[cur.ti].t, 52) : null;
  $('lv-cover').style.cssText = cur.img ? 'background:url(' + cur.img + ') center/cover' : (ts ? ts : '');
}
function liveTick() {                       // Fortschrittsbalken lokal fortschreiben
  const cur = LIVE.cur; if (!LIVE.on || !cur || !cur.dur) return;
  const p = clamp((cur.prog + (performance.now() - cur.at)) / cur.dur, 0, 1); const b = $('lv-bar'); if (b) b.style.width = (p * 100).toFixed(1) + '%';
}
function liveFly() {
  const c = LIVE.cur; if (!c || c.ai == null || PATH === 'songs') return; const a = art[c.ai]; if (isHidA(a)) return;
  if (PATH === 'map') focusOn(a.tx, a.ty, a.k === 1 ? Math.max(a.tR, 8) : Math.max(a.tF * .9, 28), 1.5, 1500); else focusOn(a.tx, a.ty, Math.max(a.tR, 8), 4, 1200);
}
function liveSet(item) {
  const tr = item && item.isPlaying !== false ? item.track : null;
  if (!tr) { if (LIVE.cur) { LIVE.cur = null; liveRender(); requestDraw(); } return; }
  const id = tr.id + '|' + (item.progressMs != null ? '' : ''), same = LIVE.cur && LIVE.cur.id === tr.id;
  const m = liveMatch(tr), now = performance.now();
  if (same) { LIVE.cur.prog = item.progressMs || 0; LIVE.cur.at = now; return; }
  LIVE.cur = { id: tr.id, name: tr.name, artists: (tr.artists || []).map(x => x.name).join(', '), img: ((tr.albums || [])[0] || {}).image || null, dur: tr.durationMs || 0, prog: item.progressMs || 0, at: now, ti: m.ti, ai: m.ai, born: now };
  LIVE.bloom = now; LIVE.count++;
  liveRender(); if (LIVE.follow) liveFly(); requestDraw();
}
async function livePoll() {
  if (!LIVE.on) return;
  try {
    const r = await fetch('https://api.stats.fm/api/v1/users/' + encodeURIComponent(HUD.user) + '/streams/current', { cache: 'no-store' });
    if (!r.ok) throw new Error('http'); const d = await r.json(); LIVE.err = 0; liveSet(d.item);
  } catch (e) { LIVE.err++; if (LIVE.err === 3) liveRender(); }
  clearTimeout(LIVE.timer); if (LIVE.on) LIVE.timer = setTimeout(livePoll, document.hidden ? 20000 : 6000);
}

/* ---------- Neue Streams nachladen (beim Oeffnen, per Menue und fortlaufend im Live-Modus) ----------
   Holt Streams seit dem Stand der Karte von stats.fm, ordnet sie bekannten Songs/Artists zu und rechnet sie in Summen, Tageswerte und Groessen ein.
   Songs/Artists, die noch nicht auf der Karte sind, werden gezaehlt, erscheinen aber erst nach einem Neuaufbau. */
const SYNC = { busy: false, no: false, tcache: new Map(), timer: 0 };
function tzOffsetMs(tz, ts) {                                                    // Abstand der Zeitzone zu UTC zum Zeitpunkt ts (wie beim Bau der Karte)
  try {
    const f = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });
    const p = {}; f.formatToParts(new Date(ts)).forEach(x => { p[x.type] = x.value; });
    return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second) - Math.floor(ts / 1000) * 1000;
  } catch (e) { return 0; }
}
const syncOff = ts => HUD.tz ? tzOffsetMs(HUD.tz, ts) : 7200000;                      // aeltere Staende (Python-Bau): fest UTC+2
const syncOK = () => !CMP && !SYNC.no && HUD.src !== 'spotify' && !!HUD.user && !window.__NOSYNC;
function syncBase() {
  if (HUD.lastTs) return { ts: HUD.lastTs + 1, skip: 0 };
  let ld = ND - 1; while (ld > 0 && !HUD.day_n[ld]) ld--;                         // aeltere Staende: ab Tagesbeginn des letzten Datentags, schon gezaehlte Streams ueberspringen
  const lt = (D0 + ld) * 86400000; return { ts: lt - syncOff(lt), skip: HUD.day_n[ld] };
}
async function syncGet(url) {
  for (let t = 0; t < 4; t++) {
    const r = await fetch(url, { cache: 'no-store' });
    if (r.status === 429) { await new Promise(res => setTimeout(res, 1200 * (t + 1))); continue; }
    return r;
  }
  throw new Error('rate');
}
async function syncFetch(after) {
  const out = new Map(); let before = Date.now() + 86400000;
  for (let page = 0; page < 12; page++) {
    const r = await syncGet('https://api.stats.fm/api/v1/users/' + encodeURIComponent(HUD.user) + '/streams?limit=1000&after=' + after + '&before=' + before);
    if (r.status === 404 || r.status === 401 || r.status === 403) { SYNC.no = true; return null; }
    if (!r.ok) throw new Error('http ' + r.status);
    const items = (await r.json()).items || []; let fresh = 0;
    for (const s of items) if (!out.has(s.id)) { out.set(s.id, s); fresh++; }
    if (items.length < 1000 || !fresh) break;
    before = Math.min(Date.parse(items[items.length - 1].endTime) + 1, before - 1);
  }
  return Array.from(out.values()).sort((a, b) => a.endTime < b.endTime ? -1 : a.endTime > b.endTime ? 1 : 0);
}
async function syncTrack(id) {
  if (SYNC.tcache.has(id)) return SYNC.tcache.get(id);
  let tr = null; try { const r = await syncGet('https://api.stats.fm/api/v1/tracks/' + id); if (r.ok) tr = (await r.json()).item; } catch (e) { }
  SYNC.tcache.set(id, tr); return tr;
}
function growDays(newND) {                                                          // neue Tage hinten anhaengen
  const wasFull = isFull(), oldND = ND;
  for (let d = ND; d < newND; d++) { HUD.day_min.push(0); HUD.day_n.push(0); }
  ND = newND; HUD.nd = newND; if (wasFull) rB = ND - 1; if (tv.b === oldND - 1) tv.b = ND - 1;
}
const pushDay = (dy, d, min) => { const n = dy.length; if (n && dy[n - 3] === d) { dy[n - 2] += min; dy[n - 1] += 1; } else if (!n || dy[n - 3] < d) dy.push(d, min, 1); };
async function liveSync(manual) {
  if (SYNC.busy || !syncOK()) { if (manual && !syncOK()) toast(LANG === 'en' ? 'Updating is not possible for this map' : 'Aktualisieren ist für diese Karte nicht möglich'); return 0; }
  SYNC.busy = true;
  try {
    liveIndex(); const base = syncBase();
    let list = await syncFetch(base.ts); if (!list) { if (manual) toast(LANG === 'en' ? 'Updating is not possible for this map' : 'Aktualisieren ist für diese Karte nicht möglich'); return 0; }
    if (base.skip) { let skipped = 0; list = list.filter(s => { if (Date.parse(s.endTime) < base.ts + 86400000 && skipped < base.skip) { skipped++; return false; } return true; }); }
    if (!list.length) { if (manual) toast(LANG === 'en' ? 'Already up to date' : 'Schon auf dem neuesten Stand'); return 0; }
    const ids = [...new Set(list.map(s => s.trackId))].filter(id => !SYNC.tcache.has(id)); let qi = 0;
    await Promise.all(Array.from({ length: 4 }, async () => { while (qi < ids.length) await syncTrack(ids[qi++]); }));
    let added = 0, unknown = 0, mins = 0;
    for (const s of list) {
      const tr = SYNC.tcache.get(s.trackId), t = Date.parse(s.endTime), min = (s.playedMs || 0) / 60000, d = Math.floor((t + syncOff(t)) / 86400000) - D0;
      if (!tr || d < 0) { unknown++; continue; }
      const m = liveMatch(tr); if (m.ti === undefined) { unknown++; continue; }
      if (d >= ND) growDays(d + 1);
      const tk = trk[m.ti], ar = art[tk.p], al = tk.al >= 0 ? alb[tk.al] : null;
      [tk, ar, al].forEach(o => { if (!o) return; o.m += min; o.st += 1; pushDay(o.dy, d, min); if (typeof o.l === 'number') o.l = Math.max(o.l, D0 + d); });
      HUD.minutes += min; HUD.streams += 1; HUD.day_min[d] += min; HUD.day_n[d] += 1; HUD.last = Math.max(HUD.last, D0 + d); HUD.lastTs = Math.max(HUD.lastTs || 0, t);
      added++; mins += min;
    }
    if (!HUD.lastTs && list.length) HUD.lastTs = Date.parse(list[list.length - 1].endTime);
    if (added) {
      K_STR = HUD.minutes / Math.max(1, HUD.streams); buildMonths(); computeBuckets();
      setRange(rA, rB, { force: true, noView: true, keepPlay: true }); renderHud(); requestDraw();
    }
    if (added || manual) {
      const en = LANG === 'en', more = unknown ? (en ? ' · ' + unknown + ' from songs not on your map yet' : ' · ' + unknown + ' von Songs, die noch nicht auf der Karte sind') : '';
      toast(added ? (en ? '+' + added + ' new streams added' : '+' + added + ' neue Streams hinzugefügt') + more : (en ? 'Already up to date' : 'Schon auf dem neuesten Stand') + more);
    }
    return added;
  } catch (e) { if (manual) toast(LANG === 'en' ? 'Could not reach stats.fm' : 'stats.fm nicht erreichbar'); return 0; }
  finally { SYNC.busy = false; }
}
function syncStart() { if (SYNC.timer) return; SYNC.timer = setInterval(() => { if (LIVE.on && !document.hidden) liveSync(false); }, 75000); }
const liveWanted = () => { try { return localStorage.getItem('kk-live') !== '0'; } catch (e) { return true; } };          // Standard: an, bis man ihn selbst ausschaltet
function setLive(on, quiet) {
  try { localStorage.setItem('kk-live', on ? '1' : '0'); } catch (e) { }
  LIVE.on = on; $('t-live').classList.toggle('on', on); document.body.classList.toggle('live-on', on); liveCard();
  if (on) { liveIndex(); LIVE.err = 0; liveRender(); livePoll(); LIVE.tick = setInterval(liveTick, 500); if (!quiet) toast('Live-Modus an'); liveSync(false); syncStart(); }
  else { clearTimeout(LIVE.timer); clearInterval(LIVE.tick); LIVE.cur = null; liveRender(); toast('Live-Modus aus'); }
  requestDraw();
}
/* Aufbluehen: pulsierende Ringe + Leuchten um den gerade laufenden Artist, Markierung am Song-Mond */
function drawLiveOverlay(z, ox, oy) {
  const c = LIVE.cur; if (!c || PATH === 'songs') return;
  const now = performance.now(), t = (now - c.born) / 1000;
  if (c.ai == null || isHidA(art[c.ai])) return;
  const a = art[c.ai], sx = a.x * z + ox, sy = a.y * z + oy, rs = Math.max((PATH === 'map' && a.k === 1 ? a.R * .88 : a.R * Math.max(a.sc, .2)) * z, 7);
  ctx.save();
  const g = ctx.createRadialGradient(sx, sy, rs * .5, sx, sy, rs * 3.6); g.addColorStop(0, rgba(a.rgb, .55)); g.addColorStop(1, rgba(a.rgb, 0));
  ctx.globalAlpha = .6 + .25 * Math.sin(t * 3.2); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(sx, sy, rs * 3.6, 0, 6.2832); ctx.fill();
  for (let k = 0; k < 3; k++) { const ph = (t * .5 + k / 3) % 1, rr = rs + 6 + ph * Math.max(46, rs * 1.3); ctx.globalAlpha = (1 - ph) * .8; ctx.lineWidth = 1 + 3 * (1 - ph); ctx.strokeStyle = rgba(a.rgb, 1); ctx.beginPath(); ctx.arc(sx, sy, rr, 0, 6.2832); ctx.stroke(); }
  const bt = (now - LIVE.bloom) / 1800;
  if (bt < 1) { ctx.globalAlpha = (1 - bt) * .9; ctx.lineWidth = 6 * (1 - bt) + 1; ctx.strokeStyle = '#fff'; ctx.beginPath(); ctx.arc(sx, sy, rs + bt * Math.max(180, rs * 5), 0, 6.2832); ctx.stroke(); }
  ctx.globalAlpha = 1; ctx.lineWidth = 3; ctx.strokeStyle = rgba(a.rgb, 1); ctx.beginPath(); ctx.arc(sx, sy, rs + 5, 0, 6.2832); ctx.stroke();
  if (c.ti != null && PATH === 'map') { const tk = trk[c.ti]; if (tk.sc > .05) { const tx = tk.x * z + ox, ty = tk.y * z + oy, mr = Math.max(tk.r * tk.sc * z, 4) + 3; ctx.lineWidth = 2.4; ctx.strokeStyle = '#fff'; roundRectPath(tx - mr, ty - mr, mr * 2, mr * 2, mr * .3); ctx.stroke(); } }
  if (show.labels) addLabel(sx, sy + rs + 8, '▶ ' + c.name, c.artists, 14, 9.99e8, a.rgb, 'below', true);
  ctx.restore(); requestDraw();
}

/* ---------- Freundes-Vergleich: gemeinsame Karte zweier Profile, "Wer"-Filter, Faerbung nach Anteil, Vergleichsseite ---------- */
const WHOC_MID = [226, 223, 238];            // beide ähnlich viel
const mixRGB = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
/* Farbe eines Artists beim Vergleich. excl: nur einer hat ihn gehoert = leuchtende Farbe der Person; beide haben ihn gehoert = blasser Ton, zur Person hin getoent, die mehr gehoert hat.
   ramp: der alte Verlauf von Freund ueber "gleich" zu ich. Schwelle fuer "nur einer": der andere hoert weniger als 3 % davon. */
function whoRGB(a) {
  const me = hex2rgb(S.cmpMe), fr = hex2rgb(S.cmpFr), share = (a.mM + 1e-6) / (a.mM + a.mF + 2e-6);
  if (S.cmpMode === 'ramp') return ramp([fr, WHOC_MID, me], share);
  const onlyM = a.mM > 0 && a.mF <= a.mM * .03, onlyF = a.mF > 0 && a.mM <= a.mF * .03;
  if (onlyM) return me; if (onlyF) return fr;
  const t = Math.abs(share - .5) * 2; return mixRGB(WHOC_MID, share >= .5 ? me : fr, .18 + .34 * t);
}
function cmpColorRows() {
  const row = (key, label) => '<div class="set-row"><div class="lb">' + label + '</div><div class="ctrl"><input type="color" value="' + S[key] + '" data-cmpc="' + key + '" aria-label="' + esc(label) + '"></div></div>';
  return row('cmpMe', CMP.names[0]) + row('cmpFr', CMP.names[1]);
}
const cmpDefault = () => { S.cmpMe = DEF.S.cmpMe; S.cmpFr = DEF.S.cmpFr; };
document.addEventListener('input', e => { const c = e.target.closest && e.target.closest('[data-cmpc]'); if (c && CMP) { S[c.dataset.cmpc] = c.value; recolor(); requestDraw(); } });
document.addEventListener('change', e => { const c = e.target.closest && e.target.closest('[data-cmpc]'); if (c && CMP) { setSetting(c.dataset.cmpc, c.value, { force: true }); if (drawerTab === 'cmp') renderDrawer(); } });
function cmpName(w) { return w === 'M' ? CMP.names[0] : w === 'F' ? CMP.names[1] : T('Beide'); }
function recalcMonths() { MON.forEach(mo => { mo.min = 0; mo.n = 0; for (let d = mo.s; d <= mo.e; d++) { mo.min += HUD.day_min[d]; mo.n += HUD.day_n[d]; } }); }
function setWho(w) {
  if (!CMP) return; S.who = w;
  [art, trk, alb].forEach(arr => arr.forEach(o => { o.dy = o['dy' + w]; o.m = o['m' + w]; o.st = o['st' + w]; }));
  ['streams', 'minutes', 'hour', 'weekday', 'day_min', 'day_n'].forEach(k => { HUD[k] = HUD[k + w]; });
  K_STR = HUD.minutes / Math.max(1, HUD.streams); recalcMonths();
  assignValues(); recompute(); rankings(); recolor(); computeFocus(); renderHud(); renderPresets(); onRangeChange(); drawTimeline();
  applyLayout({ fit: 'force' }); syncSegOnly(); if (drawerTab === 'cmp') renderDrawer(); requestDraw();
}
function cmpInit() {
  if (!CMP) return;
  HUD.user = CMP.names.join(' × ');
  $('tab-cmp').classList.remove('hidden'); $('vb-who').classList.remove('hidden');
  $('who-m').textContent = CMP.names[0]; $('who-f').textContent = CMP.names[1];
  if (S.colorMode !== 'who') { S.colorMode = 'who'; }
}
const pct = (a, b) => b > 0 ? Math.round(a / b * 100) : 0;
function cmpRow(a, extra) {
  return '<div class="row img" data-go="a' + a.i + '" data-hl="a' + a.i + '" style="--c:' + a.c + '"><div>' + thumbA(a, 36) + '</div><div class="rt"><div class="nm">' + esc(a.n) + '</div><div class="sb">' + extra + '</div></div><div class="mn"><small>' + esc(a.reg.short || '') + '</small></div></div>';
}
function cmpHTML() {
  if (!CMP) return '';
  const [n1, n2] = CMP.names, avatar = (u, i, c) => u ? '<img src="' + esc(u) + '" alt="" referrerpolicy="no-referrer">' : '<span>' + esc((i || '?')[0].toUpperCase()) + '</span>';
  let h = '<div class="cmp-top"><div class="cmp-p me">' + avatar(CMP.images[0], n1) + '<b>' + esc(n1) + '</b></div><div class="cmp-score"><div class="big">' + CMP.score + ' %</div><span>Musik-Übereinstimmung</span></div><div class="cmp-p fr">' + avatar(CMP.images[1], n2) + '<b>' + esc(n2) + '</b></div></div>';
  h += '<div class="kpis">' + kpi('Gleiche Artists', fmt(CMP.shared), 'von euch beiden gehört') + kpi('Geteilte Hörzeit', CMP.sharedShare + ' %', 'in gemeinsamen Artists') + kpi('Genre-Nähe', CMP.cosGenres + ' %', 'Artist-Nähe ' + CMP.cosArtists + ' %') + '</div>';
  h += '<div class="btns" style="margin-top:12px"><button class="btn' + (S.who === 'B' ? ' pri' : '') + '" data-who="B">' + T('Beide') + '</button><button class="btn' + (S.who === 'M' ? ' pri' : '') + '" data-who="M">' + esc(n1) + '</button><button class="btn' + (S.who === 'F' ? ' pri' : '') + '" data-who="F">' + esc(n2) + '</button></div>';
  /* Kontinente: Anteil beider */
  const totM = HUD.minutesM || 1, totF = HUD.minutesF || 1;
  const regRows = CMP.regions.map(r => ({ r: regs[r.id], m: r.m / totM, f: r.f / totF })).sort((a, b) => (b.m + b.f) - (a.m + a.f)).slice(0, 12);
  const mx = Math.max.apply(null, regRows.map(x => Math.max(x.m, x.f))) || 1;
  h += '<div class="sect"><h3>Kontinente <em>Anteil an der jeweiligen Hörzeit</em></h3>' + regRows.map(x => '<div class="cmp-reg" data-go="r' + x.r.id + '"><div class="nm"><i style="background:' + x.r.color + '"></i>' + esc(x.r.name) + '</div><div class="bars"><div class="b me" style="width:' + Math.max(1, x.m / mx * 100) + '%"><span>' + Math.round(x.m * 100) + ' %</span></div><div class="b fr" style="width:' + Math.max(1, x.f / mx * 100) + '%"><span>' + Math.round(x.f * 100) + ' %</span></div></div></div>').join('') + '</div>';
  /* Listen */
  const list = (title, arr, fn) => arr.length ? '<div class="sect"><h3>' + title + '</h3>' + arr.map(fn).join('') + '</div>' : '';
  const both = art.filter(a => a.mM > 0 && a.mF > 0).sort((a, b) => Math.min(b.mM, b.mF) - Math.min(a.mM, a.mF)).slice(0, 8);
  const onlyM = art.filter(a => a.mM > 0 && a.mF <= a.mM * .03).sort((a, b) => b.mM - a.mM).slice(0, 8);
  const onlyF = art.filter(a => a.mF > 0 && a.mM <= a.mF * .03).sort((a, b) => b.mF - a.mF).slice(0, 8);
  h += list('Gemeinsame Favoriten', both, a => cmpRow(a, '<span class="m1">' + fmtMin(a.mM) + '</span> · <span class="f1">' + fmtMin(a.mF) + '</span>'));
  h += list('Nur ' + esc(n1), onlyM, a => cmpRow(a, '<span class="m1">' + fmtMin(a.mM) + '</span>'));
  h += list('Nur ' + esc(n2), onlyF, a => cmpRow(a, '<span class="f1">' + fmtMin(a.mF) + '</span>'));
  const sw = (c, t) => '<span class="cmp-sw"><i style="background:' + c + '"></i><span>' + t + '</span></span>';
  const c1 = rgb2hex(hex2rgb(S.cmpMe)), c2 = rgb2hex(hex2rgb(S.cmpFr)), pale = (c, on) => rgb2hex(mixRGB(WHOC_MID, hex2rgb(c), .5));
  h += '<div class="sect"><h3>Farben <em>auf der Karte (Färbung „Wer hört mehr“)</em></h3><div class="cmp-leg">'
    + sw(c1, 'Nur ' + esc(n1)) + sw(c2, 'Nur ' + esc(n2)) + sw(pale(S.cmpMe), 'Beide, ' + esc(n1) + ' mehr') + sw(pale(S.cmpFr), 'Beide, ' + esc(n2) + ' mehr') + sw(rgb2hex(WHOC_MID), 'Beide ähnlich')
    + '</div><div class="cmp-colors"><label><input type="color" value="' + S.cmpMe + '" data-cmpc="cmpMe" aria-label="' + esc(n1) + '"><span>' + esc(n1) + '</span></label><label><input type="color" value="' + S.cmpFr + '" data-cmpc="cmpFr" aria-label="' + esc(n2) + '"><span>' + esc(n2) + '</span></label>'
    + '<button class="btn" data-cmpmode="' + (S.cmpMode === 'excl' ? 'ramp' : 'excl') + '">' + (S.cmpMode === 'excl' ? 'Verlauf statt Gruppen' : 'Nur einer / beide') + '</button></div>'
    + '<div class="rec" style="margin-top:8px;color:var(--dim)">Leuchtend = nur eine Person hat den Artist gehört. Blass = beide haben ihn gehört, der Ton zeigt, wer mehr gehört hat.</div></div>';
  return h;
}
document.addEventListener('click', e => { const b = e.target.closest('[data-who]'); if (b && CMP) setSetting('who', b.dataset.who); const m = e.target.closest('[data-cmpmode]'); if (m && CMP) { setSetting('cmpMode', m.dataset.cmpmode); if (drawerTab === 'cmp') renderDrawer(); } });

/* ---------- Kontinente anpassen: Farbe je Kontinent und Verschieben per Ziehen (wird im Browser gemerkt) ---------- */
const RC = { key: 'klangkarte-kontinente-v4:' + HUD.user + (MAPS ? ':' + MAPV : ''), legacy: (MAPS && MAPV === 'classic' ? 'klangkarte-kontinente-v3:' + HUD.user + ':classic' : 'klangkarte-kontinente-v2:' + HUD.user),
  colors: {}, pos: null, anc: {}, opos: {}, magnet: 1, unit: 'region', dropped: false, edit: false, drag: null, glowT: 0, sel: new Set(), band: null, empty: null };
const rkey = r => r.anchor || r.de || String(r.id);
/* Gespeichert wird je Karte: Farben, Positionen aller Artists, Anker verschobener Kontinente, von Hand verschobene Artists (opos), Magnet-Stufe.
   Positionen aus aelteren Versionen (v2/v3) werden verworfen, nur die Farben werden uebernommen. */
function rcLoad() {
  try {
    let raw = localStorage.getItem(RC.key), legacy = false;
    if (!raw) { raw = localStorage.getItem(RC.legacy); legacy = !!raw; }
    const o = JSON.parse(raw || '{}'); RC.colors = o.colors || {};
    if (legacy) { RC.dropped = Array.isArray(o.pos); return; }
    RC.anc = o.anc || {}; RC.opos = o.opos || {}; RC.magnet = o.mag === 0 || o.mag === 2 ? o.mag : 1; RC.pos = Array.isArray(o.pos) && o.pos.length === NA ? o.pos : null;
  } catch (e) { }
}
function rcSave() { try { localStorage.setItem(RC.key, JSON.stringify({ colors: RC.colors, pos: RC.pos, anc: RC.anc, opos: RC.opos, mag: RC.magnet })); } catch (e) { } }
function toHsl(c) {
  const r = c[0] / 255, g = c[1] / 255, b = c[2] / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn; let h = 0, s = 0;
  if (d > 1e-9) { s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn); h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; }
  return { h, s, l };
}
function fromHsl(h, s, l) {
  h = ((h % 360) + 360) % 360 / 360; if (s < 1e-9) { const v = Math.round(l * 255); return [v, v, v]; }
  const q = l < .5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q, f = t => { t = (t + 1) % 1; return t < 1 / 6 ? p + (q - p) * 6 * t : t < .5 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p; };
  return [f(h + 1 / 3), f(h), f(h - 1 / 3)].map(v => Math.round(v * 255));
}
/* Originale Farben merken, damit sich alles zuruecksetzen laesst */
regs.forEach(r => { r.color0 = r.color; r.rgbO = r.rgb.slice(); });
art.forEach(a => { a.rgbOrig = a.rgb0.slice(); a.px0 = a.bx; a.py0 = a.by; });

function setRegionColor(r, hex, save) {
  const rgb = hex2rgb(hex); r.color = hex; r.rgb = rgb; r.light = lighten(rgb, .35);
  scs.forEach(s => { if (s.reg === r.id) { s.rgb = rgb; s.light = lighten(rgb, .4); } });
  const h0 = toHsl(r.rgbO), h1 = toHsl(rgb), same = hex.toLowerCase() === r.color0.toLowerCase();
  r.members.forEach(i => {
    const a = art[i]; a._rs = null;
    if (same) { a.rgb0 = a.rgbOrig.slice(); }
    else { const ha = toHsl(a.rgbOrig); a.rgb0 = fromHsl(ha.h + h1.h - h0.h, clamp(ha.s * (h1.s / Math.max(.08, h0.s)), 0, 1), clamp(ha.l + (h1.l - h0.l), .2, .92)); }
    a.rgb = a.rgb0; a.c0 = a.c = rgb2hex(a.rgb0);
  });
  if (same) delete RC.colors[rkey(r)]; else RC.colors[rkey(r)] = hex;
  if (save) rcSave();
}
function rcColorsApplied() { recolor(); glowDirty = true; mmDirty = true; requestDraw(); }
function rcPreset(kind) {
  const gx = regs.reduce((s, r) => s + r.cx, 0) / regs.length, gy = regs.reduce((s, r) => s + r.cy, 0) / regs.length;
  regs.forEach(r => {
    const h = toHsl(r.rgbO); let hex;
    if (kind === 'orig') hex = r.color0;
    else if (kind === 'spectrum') { const ang = (Math.atan2(r.cy - gy, r.cx - gx) * 180 / Math.PI + 360) % 360; hex = rgb2hex(fromHsl(ang + 15, .6, .68)); }
    else if (kind === 'pastel') hex = rgb2hex(fromHsl(h.h, .42, .78));
    else hex = rgb2hex(fromHsl(h.h, .88, .62));          // vivid
    setRegionColor(r, hex, false);
  });
  rcSave(); rcColorsApplied(); if (drawerTab === 'settings') renderDrawer();
}

/* ---- Position ---- */
function rcMoveArtist(a, dx, dy) {
  a.bx += dx; a.by += dy; a.x += dx; a.y += dy; a.tx += dx; a.ty += dy; if (a.ax != null) { a.ax += dx; a.ay += dy; }
  a.tr.forEach(k => { const t = trk[k]; t.bx += dx; t.by += dy; t.x += dx; t.y += dy; t.tx += dx; t.ty += dy; });
}
function rcGeo() {                                   // Grund-Mittelpunkte der Kontinente/Szenen aus den Artists neu bestimmen
  [regs, scs].forEach(list => list.forEach(g => {
    const c = robustCenter(g.members.map(i => [art[i].bx, art[i].by, art[i].bF * art[i].bF]));
    if (c) { g.bcx = g.cx = g.tcx = c[0]; g.bcy = g.cy = g.tcy = c[1]; }
  }));
}
function rcPositions() { RC.pos = art.map(a => [Math.round(a.bx * 10) / 10, Math.round(a.by * 10) / 10]); }
function rcApplySaved() {
  regs.forEach(r => { const c = RC.colors[rkey(r)]; if (c) setRegionColor(r, c, false); });
  if (RC.pos) { art.forEach((a, i) => rcMoveArtist(a, RC.pos[i][0] - a.bx, RC.pos[i][1] - a.by)); rcGeo(); }
}

/* ---- Dynamisches Umordnen beim Verschieben ----
   Verschoben wird eine Gruppe: ein Kontinent, eine Szene oder frei gewaehlte Artists. Die "Hand" traegt sie mit begrenzter Geschwindigkeit (und nur bis knapp ueber den Kartenrand hinaus)
   und verdraengt die uebrigen Artists wie eine inkompressible Fluessigkeit (Potentialstroemung auf einem Raster): Nachbarn fliessen um sie herum und schliessen hinter ihr die Luecke,
   ohne den Kontinent zu wechseln oder sich zu kreuzen. Beim Loslassen haelt die Gruppe ihre Mitte (darf sich aber verformen), liegt sie abseits, wird sie bis zur Beruehrung herangeschoben (andocken).
   Die uebrigen Kontinente federn zu ihrer Form zurueck (Federn zu aehnlichen Artists halten die Nachbarschaft zusammen) und ruecken per sanfter Schwerkraft in verbliebene Luecken; zuletzt werden alle
   Ueberlappungen aufgeloest und versprengte Gruppen herangeholt (keine Inseln). Laeuft als Animation. */
const RPAD = 9, BIGF = 70, SCELL = 150, BCELL = 500, HB = 8191;
const RPH = { vflow: 70, vmax: 260, vpx: 16, h: 100, pad: 2600, omega: 1.8, iters: 200, tol: .002, cs: 3, vcap: 2.5, pinM: 8, pinG: 40, push: 2, sN: 150, kp: .03, kh: .03, gc: 6, gp: .02, cN: 700, vs: 80, dock: 300, stray: 150,
  mag: [{ kl: .03, km: 0, lim: 1.6 }, { kl: .1, km: .003, lim: 1 }, { kl: .16, km: .01, lim: .6 }] };      // Magnet aus / mittel / stark: Zusammenhalt der Artists im Kontinent
const RSIM = { on: false, ph: 'D', kind: 'region', gr: -1, G: [], carry: false, release: false, it: 0, raf: 0, n: 0, R: 0, worst: 0, hx: 0, hy: 0, sx: 0, sy: 0, gm: 1, sN: 260, tries: 0 };

/* gm: Mitglieder einer frei gewaehlten Gruppe (Szene, Artists): sie bilden einen eigenen Cluster neben dem Rest ihres Kontinents; ohne gm sind die Kontinente die Cluster */
function rcSimInit(gm) {
  const s = RSIM, n = NA, R0 = regs.length, R = R0 + (gm ? 1 : 0); s.n = n; s.R = R; s.mx = 0;
  const F64 = k => new Float64Array(k), ing = new Uint8Array(n); if (gm) gm.forEach(i => { ing[i] = 1; });
  s.px = F64(n); s.py = F64(n); s.ax = F64(n); s.ay = F64(n); s.F = F64(n); s.w = F64(n); s.ox = F64(n); s.oy = F64(n); s.ex = F64(n); s.ey = F64(n); s.mass = F64(n);
  s.rid = new Int32Array(n);
  art.forEach((a, i) => { s.px[i] = s.ax[i] = a.bx; s.py[i] = s.ay[i] = a.by; s.F[i] = a.bF; s.w[i] = a.bF * a.bF; s.rid[i] = ing[i] ? R0 : a.r; s.mass[i] = a.bF + 4; if (a.bF > s.mx) s.mx = a.bF; });
  s.cx = F64(R); s.cy = F64(R); s.cw = F64(R); s.rr = F64(R);
  s.mem = regs.map(r => gm ? r.members.filter(i => !ing[i]) : r.members); s.home = regs.map(r => RC.anc[rkey(r)] || null);          // frueher platzierte Kontinente kehren zu ihrem Anker zurueck
  if (gm) { s.mem.push(gm.slice()); s.home.push(null); }
  s.nbj = new Array(n); s.nbw = new Array(n);                                                    // Ausgangsform: Abstaende zu aehnlichen Artists im selben Cluster
  for (let i = 0; i < n; i++) {
    const j = [], w = [];
    art[i].nb.forEach(u => { if (s.rid[u[0]] === s.rid[i]) { j.push(u[0]); w.push(u[1] + .05); } });
    s.nbj[i] = j; s.nbw[i] = w;
  }
  s.hS = new Int32Array(HB + 1); s.hB = new Int32Array(HB + 1); s.nx = new Int32Array(n); s.stamp = new Int32Array(n); s.q = 0;
  s.cap = 1 << 15; s.ci = new Int32Array(s.cap); s.cj = new Int32Array(s.cap); s.cov = F64(s.cap); s.cux = F64(s.cap); s.cuy = F64(s.cap); s.nc = 0;
  rcCentroids();
  {                                                    // Ruhelage (Form) = gespeicherte Anordnung des Kontinents (Ursprungs-Layout, ausser fuer von Hand verformte Kontinente); eine frei gewaehlte Gruppe behaelt ihre aktuelle Anordnung
    const sx = F64(R), sy = F64(R), sw = F64(R), qx = i => ing[i] ? art[i].bx : art[i].px0, qy = i => ing[i] ? art[i].by : art[i].py0;
    for (let i = 0; i < n; i++) { const r = s.rid[i]; sx[r] += qx(i) * s.w[i]; sy[r] += qy(i) * s.w[i]; sw[r] += s.w[i]; }
    for (let i = 0; i < n; i++) { const r = s.rid[i]; s.ox[i] = qx(i) - sx[r] / sw[r]; s.oy[i] = qy(i) - sy[r] / sw[r]; }
    for (const k in RC.opos) { const i = +k; if (i >= 0 && i < n && !ing[i]) { s.ox[i] = RC.opos[k][0]; s.oy[i] = RC.opos[k][1]; } }
    const mx = F64(R), my = F64(R); for (let i = 0; i < n; i++) { const r = s.rid[i]; mx[r] += s.ox[i] * s.w[i]; my[r] += s.oy[i] * s.w[i]; }
    for (let i = 0; i < n; i++) { const r = s.rid[i]; s.ox[i] -= mx[r] / sw[r]; s.oy[i] -= my[r] / sw[r]; }                         // Schwerpunkt der Ruhelage = 0 (kein Driften)
  }
  s.kind = 'region'; s.gr = -1; s.G = []; s.carry = false; s.release = false; s.ph = 'D'; s.it = 0; s.tries = 0; s.hx = s.hy = s.sx = s.sy = 0; s.grid = null; s.gm = 1; s.sN = RPH.sN; s.done = null;
}
/* Cluster gr wird getragen: Handbereich = Kartenrahmen der uebrigen Artists, nur ein Stueck (RPH.dock) darueber hinaus */
function rcSetGroup(gr, kind) {
  const s = RSIM; s.gr = gr; s.kind = kind; s.G = s.mem[gr]; s.carry = true; s.gm = kind === 'artist' ? 0 : kind === 'scene' ? .6 : 1; s.pin = kind === 'region' ? RPH.pinM : RPH.pinG; s.sN = kind === 'artist' ? 140 : RPH.sN; rcSetMass(); rcCentroids(); s.c0x = s.cx[gr]; s.c0y = s.cy[gr];
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9, g0 = 1e9, h0 = 1e9, g1 = -1e9, h1 = -1e9;
  for (let i = 0; i < s.n; i++) {
    const f = s.F[i], px = s.px[i], py = s.py[i];
    if (s.rid[i] === gr) { if (px - f < g0) g0 = px - f; if (px + f > g1) g1 = px + f; if (py - f < h0) h0 = py - f; if (py + f > h1) h1 = py + f; }
    else { if (px - f < x0) x0 = px - f; if (px + f > x1) x1 = px + f; if (py - f < y0) y0 = py - f; if (py + f > y1) y1 = py + f; }
  }
  const D = RPH.dock;
  if (x0 > x1) { s.bx0 = s.by0 = -1e9; s.bx1 = s.by1 = 1e9; return; }
  s.bx0 = x0 - D + (s.c0x - g0); s.bx1 = x1 + D - (g1 - s.c0x); s.by0 = y0 - D + (s.c0y - h0); s.by1 = y1 + D - (h1 - s.c0y);
  if (s.bx0 > s.bx1) s.bx0 = s.bx1 = (x0 + x1) / 2; if (s.by0 > s.by1) s.by0 = s.by1 = (y0 + y1) / 2;
}
function rcHandTarget() {                              // wohin die Hand die Gruppe gerade tragen will (relativ zum Start), auf den Handbereich begrenzt
  const s = RSIM; return [Math.max(s.bx0, Math.min(s.bx1, s.c0x + s.hx)) - s.c0x, Math.max(s.by0, Math.min(s.by1, s.c0y + s.hy)) - s.c0y];
}
function rcSetMass() {                                // die getragene Gruppe ist unbeweglich, die abgelegte sehr traege (Artists anderer Kontinente, die in ihren Luecken sitzen, muessen ausweichen koennen)
  const s = RSIM; for (let i = 0; i < s.n; i++) s.mass[i] = s.rid[i] === s.gr ? (s.carry ? 1e7 : (s.F[i] + 4) * s.pin) : s.F[i] + 4;
}
function rcCentroids() {
  const s = RSIM; s.cx.fill(0); s.cy.fill(0); s.cw.fill(0);
  for (let i = 0; i < s.n; i++) { const r = s.rid[i], w = s.w[i]; s.cx[r] += s.px[i] * w; s.cy[r] += s.py[i] * w; s.cw[r] += w; }
  let gx = 0, gy = 0, gw = 0;
  for (let r = 0; r < s.R; r++) if (s.cw[r]) { gx += s.cx[r]; gy += s.cy[r]; gw += s.cw[r]; s.cx[r] /= s.cw[r]; s.cy[r] /= s.cw[r]; }
  s.gx = gx / gw; s.gy = gy / gw;
}
/* alle ueberlappenden Paare (inkl. Abstand pad) finden: kleine Artists in einem feinen, grosse in einem groben Hash-Gitter */
function rcContacts(pad) {
  const s = RSIM, n = s.n, px = s.px, py = s.py, F = s.F, hS = s.hS, hB = s.hB, nx = s.nx, stamp = s.stamp;
  hS.fill(-1); hB.fill(-1); s.nc = 0;
  const hs = (x, y) => ((x * 73856093) ^ (y * 19349663)) & HB;
  for (let i = 0; i < n; i++) {
    if (F[i] <= BIGF) { const h = hs(Math.floor(px[i] / SCELL), Math.floor(py[i] / SCELL)); nx[i] = hS[h]; hS[h] = i; }
    else { const h = hs(Math.floor(px[i] / BCELL), Math.floor(py[i] / BCELL)); nx[i] = hB[h]; hB[h] = i; }
  }
  const test = (i, j) => {
    const dx = px[j] - px[i], dy = py[j] - py[i], rr = F[i] + F[j] + pad, d2 = dx * dx + dy * dy; if (d2 >= rr * rr) return;
    if (s.nc === s.cap) rcGrow();
    const d = Math.sqrt(d2), c = s.nc++; s.ci[c] = i; s.cj[c] = j; s.cov[c] = rr - d;
    if (d < 1e-6) { s.cux[c] = 1; s.cuy[c] = 0; } else { s.cux[c] = dx / d; s.cuy[c] = dy / d; }
  };
  for (let i = 0; i < n; i++) {
    const big = F[i] > BIGF, q = ++s.q, cx = Math.floor(px[i] / SCELL), cy = Math.floor(py[i] / SCELL), k1 = Math.ceil((F[i] + BIGF + pad) / SCELL);
    for (let x = cx - k1; x <= cx + k1; x++) for (let y = cy - k1; y <= cy + k1; y++) {
      for (let j = hS[hs(x, y)]; j >= 0; j = nx[j]) { if (stamp[j] === q) continue; stamp[j] = q; if (!big && j <= i) continue; test(i, j); }
    }
    if (big) {
      const bx = Math.floor(px[i] / BCELL), by = Math.floor(py[i] / BCELL), k2 = Math.ceil((F[i] + s.mx + pad) / BCELL);
      for (let x = bx - k2; x <= bx + k2; x++) for (let y = by - k2; y <= by + k2; y++) {
        for (let j = hB[hs(x, y)]; j >= 0; j = nx[j]) { if (stamp[j] === q) continue; stamp[j] = q; if (j > i) test(i, j); }
      }
    }
  }
}
function rcGrow() {
  const s = RSIM, cap = s.cap * 2, g = (A, T) => { const B = new T(cap); B.set(A); return B; };
  s.ci = g(s.ci, Int32Array); s.cj = g(s.cj, Int32Array); s.cov = g(s.cov, Float64Array); s.cux = g(s.cux, Float64Array); s.cuy = g(s.cuy, Float64Array); s.cap = cap;
}
/* alle Paare auseinanderschieben: leichtere Artists weichen mehr, die getragene Gruppe gar nicht */
function rcPushOut(k) {
  const s = RSIM, n = s.n, M = s.mass; rcContacts(RPAD);
  s.ex.fill(0); s.ey.fill(0); let worst = 0;
  for (let c = 0; c < s.nc; c++) {
    const i = s.ci[c], j = s.cj[c], ov = s.cov[c]; if (ov <= 2.5) continue; if (ov > worst) worst = ov;
    const ma = M[i], mb = M[j], sa = mb / (ma + mb) * ov * k, sb = ma / (ma + mb) * ov * k;
    s.ex[i] -= s.cux[c] * sa; s.ey[i] -= s.cuy[c] * sa; s.ex[j] += s.cux[c] * sb; s.ey[j] += s.cuy[c] * sb;
  }
  for (let i = 0; i < n; i++) { s.px[i] += s.ex[i]; s.py[i] += s.ey[i]; }
  return worst;
}
/* Gauss-Seidel-Durchgang: die Paare werden von der getragenen Gruppe nach aussen aufgeloest (Reihenfolge = Breitensuche ueber die Beruehrungen), jede Korrektur wirkt sofort auf die folgenden Paare.
   Druckketten laufen so in einem Durchgang bis zum Rand durch (Jacobi braucht dafuer hunderte Schritte) und die Karte muss nur dort Platz machen, wo er fehlt. Rueckgabe: groesste Ueberlappung vor dem Aufloesen. */
function rcPushGS(k, sweeps) {
  const s = RSIM, n = s.n, M = s.mass, px = s.px, py = s.py, F = s.F; rcContacts(RPAD); const nc = s.nc; if (!nc) return 0;
  if (!s.lv || s.lv.length !== n) { s.lv = new Int32Array(n); s.qu = new Int32Array(n); s.ao = new Int32Array(n + 1); s.fp = new Int32Array(n); }
  if (!s.adj || s.adj.length < 2 * s.cap) { s.adj = new Int32Array(2 * s.cap); s.ord = new Int32Array(s.cap); }
  const lv = s.lv, qu = s.qu, ao = s.ao, fp = s.fp, adj = s.adj, ord = s.ord, ci = s.ci, cj = s.cj; ao.fill(0);
  for (let c = 0; c < nc; c++) { ao[ci[c] + 1]++; ao[cj[c] + 1]++; }
  for (let i = 0; i < n; i++) ao[i + 1] += ao[i];
  for (let i = 0; i < n; i++) fp[i] = ao[i];
  for (let c = 0; c < nc; c++) { adj[fp[ci[c]]++] = cj[c]; adj[fp[cj[c]]++] = ci[c]; }
  lv.fill(-1); let qh = 0, qt = 0;
  if (s.gr >= 0) { for (let i = 0; i < n; i++) if (s.rid[i] === s.gr) { lv[i] = 0; qu[qt++] = i; } }
  else { let b = 0, bd = 1e18; for (let i = 0; i < n; i++) { const d = (px[i] - s.gx) * (px[i] - s.gx) + (py[i] - s.gy) * (py[i] - s.gy); if (d < bd) { bd = d; b = i; } } lv[b] = 0; qu[qt++] = b; }
  let top = 0;
  while (qh < qt) { const i = qu[qh++], l = lv[i] + 1; for (let e = ao[i]; e < ao[i + 1]; e++) { const j = adj[e]; if (lv[j] < 0) { lv[j] = l; if (l > top) top = l; qu[qt++] = j; } } }
  const K = top + 2, cnt = s.cnt && s.cnt.length >= K + 1 ? s.cnt : (s.cnt = new Int32Array(Math.max(K + 1, 256))); cnt.fill(0, 0, K + 1);
  const key = c => { const a = lv[ci[c]], b = lv[cj[c]], m = a < b ? a : b; return m < 0 ? (a < 0 && b < 0 ? K - 1 : (a > b ? a : b)) : m; };
  for (let c = 0; c < nc; c++) cnt[key(c) + 1]++;
  for (let q = 0; q < K; q++) cnt[q + 1] += cnt[q];
  for (let c = 0; c < nc; c++) ord[cnt[key(c)]++] = c;
  let worst = 0;
  for (let sw = sweeps || 1; sw > 0; sw--) {                                                  // weitere Durchgaenge ueber dieselbe Paarliste (neu entstandene Beruehrungen erfasst erst der naechste Aufruf)
    let any = false;
    for (let q = 0; q < nc; q++) {
      const c = ord[q], i = ci[c], j = cj[c], dx = px[j] - px[i], dy = py[j] - py[i], rr = F[i] + F[j] + RPAD, d2 = dx * dx + dy * dy; if (d2 >= rr * rr) continue;
      const d = Math.sqrt(d2), ov = rr - d; if (ov <= 2.5) continue; any = true; if (ov > worst && sw === (sweeps || 1)) worst = ov;
      const ma = M[i], mb = M[j], sa = mb / (ma + mb) * ov * k, sb = ma / (ma + mb) * ov * k;
      let ux, uy; if (d < 1e-6) { ux = 1; uy = 0; } else { ux = dx / d; uy = dy / d; }
      px[i] -= ux * sa; py[i] -= uy * sa; px[j] += ux * sb; py[j] += uy * sb;
    }
    if (!any) break;
  }
  return worst;
}
/* Potentialstroemung: das Raster deckt die Karte samt Rand ab, die getragene Gruppe ist ein Hindernis, das sich um (dx,dy) bewegt;
   die uebrigen Artists werden entlang der (divergenzfreien) Stroemung verschoben, die das Hindernis umfliesst und hinter ihm nachstroemt. */
function rcGridInit() {
  const s = RSIM, h = RPH.h; let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (let i = 0; i < s.n; i++) { if (s.px[i] < x0) x0 = s.px[i]; if (s.px[i] > x1) x1 = s.px[i]; if (s.py[i] < y0) y0 = s.py[i]; if (s.py[i] > y1) y1 = s.py[i]; }
  const g = { x0: x0 - RPH.pad, y0: y0 - RPH.pad }; g.w = Math.ceil((x1 - x0 + 2 * RPH.pad) / h) + 2; g.hh = Math.ceil((y1 - y0 + 2 * RPH.pad) / h) + 2; const N = g.w * g.hh;
  g.have = new Uint8Array(N); g.sx = new Float64Array(N); g.sy = new Float64Array(N); g.obst = new Uint8Array(N); g.cnt = new Uint8Array(N); g.rhs = new Float64Array(N); g.phi = new Float64Array(N); g.vx = new Float64Array(N); g.vy = new Float64Array(N);
  s.grid = g;
}
function rcFlowStep(dx, dy) {
  const s = RSIM; if (!s.grid) rcGridInit();
  const g = s.grid, h = RPH.h, W = g.w, H = g.hh, obst = g.obst, cnt = g.cnt, rhs = g.rhs, phi = g.phi, vx = g.vx, vy = g.vy, mem = s.G;
  obst.fill(0); let ob = 0;
  for (let q = 0; q < mem.length; q++) {                                          // Hindernis: Raster-Zellen, deren Mitte im (leicht vergroesserten) Artist liegt
    const i = mem[q], r = s.F[i] + 25, r2 = r * r, i0 = Math.max(1, Math.floor((s.px[i] - r - g.x0) / h)), i1 = Math.min(W - 2, Math.floor((s.px[i] + r - g.x0) / h) + 1), j0 = Math.max(1, Math.floor((s.py[i] - r - g.y0) / h)), j1 = Math.min(H - 2, Math.floor((s.py[i] + r - g.y0) / h) + 1);
    for (let j = j0; j <= j1; j++) { const cy = g.y0 + (j + .5) * h - s.py[i]; for (let ii = i0; ii <= i1; ii++) { const cx = g.x0 + (ii + .5) * h - s.px[i]; if (cx * cx + cy * cy <= r2 && !obst[j * W + ii]) { obst[j * W + ii] = 1; ob++; } } }
  }
  if (!ob) return;                                                                 // zu klein fuer das Raster: nur die Kollisionen schieben die Nachbarn
  for (let j = 1; j < H - 1; j++) for (let i = 1; i < W - 1; i++) {
    const c = j * W + i; if (obst[c]) continue; let n = 0, rh = 0;
    if (obst[c + 1]) rh += h * dx; else n++; if (obst[c - 1]) rh -= h * dx; else n++; if (obst[c + W]) rh += h * dy; else n++; if (obst[c - W]) rh -= h * dy; else n++;
    cnt[c] = n; rhs[c] = rh;
  }
  const om = RPH.omega, tol = RPH.tol * h * Math.hypot(dx, dy);
  for (let it = 0; it < RPH.iters; it++) {
    let mx = 0;
    for (let j = 1; j < H - 1; j++) for (let i = 1; i < W - 1; i++) {
      const c = j * W + i; if (obst[c]) continue; const n = cnt[c]; if (!n) { phi[c] = 0; continue; }
      let sm = rhs[c]; if (!obst[c + 1]) sm += phi[c + 1]; if (!obst[c - 1]) sm += phi[c - 1]; if (!obst[c + W]) sm += phi[c + W]; if (!obst[c - W]) sm += phi[c - W];
      const dp = om * (sm / n - phi[c]); phi[c] += dp; if (dp > mx) mx = dp; else if (-dp > mx) mx = -dp;
    }
    if (mx < tol) break;                                                           // Aenderung unter der Toleranz: die Stroemung ist ausgerechnet (die Loesung des letzten Schritts dient als Startwert)
  }
  for (let j = 1; j < H - 1; j++) for (let i = 1; i < W - 1; i++) {
    const c = j * W + i;
    if (obst[c]) { vx[c] = dx; vy[c] = dy; continue; }
    if (!cnt[c]) { vx[c] = dx; vy[c] = dy; continue; }
    const pr = obst[c + 1] ? phi[c] + h * dx : phi[c + 1], pl = obst[c - 1] ? phi[c] - h * dx : phi[c - 1], pd = obst[c + W] ? phi[c] + h * dy : phi[c + W], pu = obst[c - W] ? phi[c] - h * dy : phi[c - W];
    vx[c] = (pr - pl) / (2 * h); vy[c] = (pd - pu) / (2 * h);
  }
  const sx = g.sx, sy = g.sy, have = g.have;                                       // fuer fremde Artists: Hindernis-Zellen bekommen die Geschwindigkeit ihrer Fluessigkeits-Nachbarn (kein starres Mitfahren)
  for (let c = 0; c < W * H; c++) { sx[c] = vx[c]; sy[c] = vy[c]; have[c] = obst[c] ? 0 : 1; }
  for (let pass = 0; pass < 5; pass++) {
    const add = [];
    for (let j = 1; j < H - 1; j++) for (let i = 1; i < W - 1; i++) {
      const c = j * W + i; if (have[c]) continue; let n = 0, ax = 0, ay = 0;
      if (have[c + 1]) { n++; ax += sx[c + 1]; ay += sy[c + 1]; } if (have[c - 1]) { n++; ax += sx[c - 1]; ay += sy[c - 1]; } if (have[c + W]) { n++; ax += sx[c + W]; ay += sy[c + W]; } if (have[c - W]) { n++; ax += sx[c - W]; ay += sy[c - W]; }
      if (n) add.push(c, ax / n, ay / n);
    }
    for (let q = 0; q < add.length; q += 3) { const c = add[q]; sx[c] = add[q + 1]; sy[c] = add[q + 2]; have[c] = 1; }
  }
  const lim = Math.hypot(dx, dy) * RPH.vcap;
  for (let i = 0; i < s.n; i++) {
    if (s.rid[i] === s.gr) continue;
    const fx = (s.px[i] - g.x0) / h - .5, fy = (s.py[i] - g.y0) / h - .5, ix = Math.floor(fx), iy = Math.floor(fy);
    if (ix < 1 || iy < 1 || ix >= W - 2 || iy >= H - 2) continue;
    const tx = fx - ix, ty = fy - iy, c = iy * W + ix, w00 = (1 - tx) * (1 - ty), w10 = tx * (1 - ty), w01 = (1 - tx) * ty, w11 = tx * ty;
    let ux = sx[c] * w00 + sx[c + 1] * w10 + sx[c + W] * w01 + sx[c + W + 1] * w11, uy = sy[c] * w00 + sy[c + 1] * w10 + sy[c + W] * w01 + sy[c + W + 1] * w11;
    const ul = Math.hypot(ux, uy); if (!(ul <= lim)) { if (!isFinite(ul)) continue; ux *= lim / ul; uy *= lim / ul; }       // Ausreisser (Ecken des Hindernisses) begrenzen
    s.px[i] += ux; s.py[i] += uy;
  }
}
/* Tragephase: die Hand bewegt die Gruppe ein Stueck zum Ziel, der Rest stroemt um sie herum (Schritt auf dem Bildschirm etwa gleich lang, damit kleine Gruppen der Hand folgen) */
function rcCarry() {
  const s = RSIM, tg = rcHandTarget(), rx = tg[0] - s.sx, ry = tg[1] - s.sy, d = Math.hypot(rx, ry);
  if (d > .3) {
    const vs = Math.min(RPH.vmax, Math.max(RPH.vflow, RPH.vpx / cam.z)), st = Math.min(d, vs), dx = rx / d * st, dy = ry / d * st, mem = s.G;
    rcFlowStep(dx, dy);
    for (let q = 0; q < mem.length; q++) { s.px[mem[q]] += dx; s.py[mem[q]] += dy; }
    s.sx += dx; s.sy += dy;
  }
  return rcPushGS(1, RPH.push);
}
/* Eine Gruppe von Artists (mem, Markierung inSet) starr in Richtung (tx,ty) rutschen lassen, bis sie andere Artists beruehrt */
function rcSlide(mem, inSet, tx, ty) {
  const s = RSIM; let cx = 0, cy = 0, w = 0; mem.forEach(i => { cx += s.px[i] * s.w[i]; cy += s.py[i] * s.w[i]; w += s.w[i]; }); cx /= w; cy /= w;
  let ux = tx - cx, uy = ty - cy; const dist = Math.hypot(ux, uy); if (dist < 1) return false; ux /= dist; uy /= dist;
  const touches = () => { rcContacts(RPAD); for (let c = 0; c < s.nc; c++) if (inSet[s.ci[c]] !== inSet[s.cj[c]] && s.cov[c] > 0) return true; return false; };
  const shift = k => { for (let q = 0; q < mem.length; q++) { s.px[mem[q]] += ux * k; s.py[mem[q]] += uy * k; } };
  if (touches()) return false;
  let moved = 0;
  while (moved < dist) { shift(40); moved += 40; if (touches()) { shift(-40); moved -= 40; break; } }
  for (let k = 0; k < 8 && moved < dist; k++) { shift(5); moved += 5; if (touches()) { shift(-5); moved -= 5; break; } }
  for (let k = 0; k < 5 && moved < dist; k++) { shift(1); moved += 1; if (touches()) { shift(-1); break; } }
  return true;
}
/* Abgelegte Gruppe beruehrt nichts? Dann starr in Richtung der uebrigen Karte rutschen lassen, bis sie Nachbarn beruehrt (keine Insel, keine Luecke) */
function rcDock() {
  const s = RSIM; if (s.gr < 0 || !s.G.length) return;
  const inSet = new Uint8Array(s.n); s.G.forEach(i => { inSet[i] = 1; });
  let tx = 0, ty = 0, tw = 0; for (let i = 0; i < s.n; i++) if (!inSet[i]) { tx += s.px[i] * s.w[i]; ty += s.py[i] * s.w[i]; tw += s.w[i]; }
  if (!tw) return; rcSlide(s.G, inSet, tx / tw, ty / tw);
  rcCentroids(); s.tgx = s.cx[s.gr]; s.tgy = s.cy[s.gr];
}
/* Die abgelegte Gruppe haelt ihre Mitte (darf sich dabei verformen): Abweichung zurueckschieben */
function rcHold(k) {
  const s = RSIM, g = s.gr; if (g < 0 || !s.cw[g]) return;
  let cx = 0, cy = 0, w = 0; const mem = s.G; for (let q = 0; q < mem.length; q++) { const i = mem[q]; cx += s.px[i] * s.w[i]; cy += s.py[i] * s.w[i]; w += s.w[i]; }
  const dx = (s.tgx - cx / w) * k, dy = (s.tgy - cy / w) * k; if (!dx && !dy) return;
  for (let q = 0; q < mem.length; q++) { s.px[mem[q]] += dx; s.py[mem[q]] += dy; }
}
/* Gruppen, die einander nicht beruehren (Abstand >= RPH.stray), werden nacheinander an die Hauptgruppe herangeschoben: es bleibt eine zusammenhaengende Karte. true = es wurde etwas bewegt */
function rcGatherStrays() {
  const s = RSIM, n = s.n; let moved = false;
  for (let round = 0; round < 14; round++) {
    rcContacts(RPH.stray);
    const par = new Int32Array(n); for (let i = 0; i < n; i++) par[i] = i;
    const f = x => { while (par[x] !== x) { par[x] = par[par[x]]; x = par[x]; } return x; };
    for (let c = 0; c < s.nc; c++) { const a = f(s.ci[c]), b = f(s.cj[c]); if (a !== b) par[a] = b; }
    const gm = new Map();
    for (let i = 0; i < n; i++) { const q = f(i); let g = gm.get(q); if (!g) { g = { m: 0, mem: [], cx: 0, cy: 0 }; gm.set(q, g); } g.m += s.w[i]; g.cx += s.px[i] * s.w[i]; g.cy += s.py[i] * s.w[i]; g.mem.push(i); }
    if (gm.size < 2) return moved;
    const groups = [...gm.values()]; groups.forEach(g => { g.cx /= g.m; g.cy /= g.m; });
    const main = groups.reduce((p, q) => q.m > p.m ? q : p); let best = null, bd = 1e18;
    groups.forEach(g => { if (g === main) return; const d = Math.hypot(g.cx - main.cx, g.cy - main.cy); if (d < bd) { bd = d; best = g; } });
    const inSet = new Uint8Array(n); best.mem.forEach(i => { inSet[i] = 1; }); rcSlide(best.mem, inSet, main.cx, main.cy); moved = true;
  }
  return moved;
}
/* Setzphase vorbereiten: Massen, erlaubte Abweichung je Cluster (Form = Ruhelage aus rcSimInit), Mitte der abgelegten Gruppe */
function rcBeginSettle() {
  const s = RSIM; s.carry = false; rcSetMass(); s.ph = 'S'; s.it = 0; rcCentroids(); s.rr.fill(0);
  for (let i = 0; i < s.n; i++) s.rr[s.rid[i]] += s.w[i];
  s.lim = s.rr.map(v => 160 + .12 * Math.sqrt(v / .62));                                          // erlaubte Abweichung eines Artists von seiner Form (Gesamtlage folgt dem Cluster)
  if (s.gr >= 0) { s.tgx = s.cx[s.gr]; s.tgy = s.cy[s.gr]; }
}
/* Gruppe abgelegt: andocken, versprengte Gruppen heranholen, dann setzen */
function rcDropBegin() {
  const s = RSIM; s.carry = false; rcSetMass(); rcDock(); rcGatherStrays(); rcBeginSettle();
}
/* Aufraeumen ohne Ziehen: verstreute Kontinente heranholen, Ausreisser zur Form zurueckholen, Luecken schliessen, Ueberlappungen aufloesen */
function rcTidy() {
  if (RSIM.on) return; rcSimStop(); rcGeo(); rcSimInit(); RSIM.on = true;
  toast('Räume auf …'); rcGatherStrays(); rcBeginSettle(); rcSimLoop();
}
/* Setzphase (Magnet): 1. Cluster ruecken als Ganzes zur Kartenmitte / zu ihrem Anker (starr, Artists bleiben beisammen; Ueberlappungen loest
   erst Schritt 3 lokal, da sich die Kontinente teils ineinander verzahnen); 2. Artists halten Zusammenhalt (Zug zu aehnlichen Artists und zur Cluster-Mitte, Rueckholfeder zur Form beim Ablegen,
   die bei Ausreissern stark wird); 3. verbleibende Ueberlappungen werden aufgeloest. a = 1 .. 0 (laesst die Kraefte auslaufen). */
function rcIter(a, k) {
  const s = RSIM, n = s.n, R = s.R, M = RPH.mag[RC.magnet];
  rcCentroids();
  for (let r = 0; r < R; r++) {
    if (!s.cw[r] || r === s.gr) continue; let tx = 0, ty = 0;
    const h = s.home[r]; if (h) { tx += (h[0] - s.cx[r]) * RPH.kh; ty += (h[1] - s.cy[r]) * RPH.kh; }
    const gx = s.gx - s.cx[r], gy = s.gy - s.cy[r], gd = Math.hypot(gx, gy);
    const ag = Math.max(0, (a - .3) / .7) * s.gm;                                                 // Schwerkraft laeuft frueh aus, der Rest ist Entspannen (Feder + Kollision)
    if (gd > 1 && ag > 0) { const st = Math.min(gd * RPH.gp, RPH.gc) * ag; tx += gx / gd * st; ty += gy / gd * st; }
    const tl = Math.hypot(tx, ty); if (tl > 40) { tx *= 40 / tl; ty *= 40 / tl; }
    if (tx || ty) { const mem = s.mem[r]; for (let q = 0; q < mem.length; q++) { s.px[mem[q]] += tx; s.py[mem[q]] += ty; } }
  }
  rcCentroids();
  for (let i = 0; i < n; i++) {
    const r = s.rid[i]; let x = s.px[i], y = s.py[i];
    const bx = s.cx[r] + s.ox[i], by = s.cy[r] + s.oy[i], ex = bx - x, ey = by - y, e = Math.hypot(ex, ey), L = s.lim[r] * M.lim;
    if (e > L) { const m = Math.min(e - L, RPH.vs) / e; x += ex * m; y += ey * m; }             // Ausreisser kehren mit begrenzter Geschwindigkeit zur erlaubten Entfernung von ihrer Form zurueck
    else { x += ex * RPH.kp; y += ey * RPH.kp; }                                                 // sonst lineare Feder zur Form (kein Drift der Cluster-Mitte)
    const nj = s.nbj[i];
    if (M.kl > 0 && nj.length) {                                                                  // Federn zu aehnlichen Artists im selben Cluster (Abstaende der alten Form bleiben erhalten, kein Driften)
      const nw = s.nbw[i]; let sx = 0, sy = 0, sw = 0;
      for (let u = 0; u < nj.length; u++) { const j = nj[u], w = nw[u]; sx += (s.px[j] + s.ox[i] - s.ox[j]) * w; sy += (s.py[j] + s.oy[i] - s.oy[j]) * w; sw += w; }
      x += (sx / sw - x) * M.kl; y += (sy / sw - y) * M.kl;
    }
    if (M.km > 0) { x += (s.cx[r] - x) * M.km * a; y += (s.cy[r] - y) * M.km * a; }                // Magnet: leichter Zug zur Mitte des Clusters
    s.px[i] = x; s.py[i] = y;
  }
  const w = rcPushGS(k); rcHold(1); return w;
}
/* ein Schritt der Animation; true = fertig */
function rcSimStep() {
  const s = RSIM;
  if (s.ph === 'D') {
    s.worst = rcCarry(); s.it++;
    if (s.release) { const tg = rcHandTarget(); if (Math.hypot(tg[0] - s.sx, tg[1] - s.sy) <= .3) rcDropBegin(); }       // angekommen: Gruppe ablegen, vom Durchzug verformte Kontinente federn zur Ursprungsform zurueck
  } else if (s.ph === 'S') {
    const a = 1 - s.it / s.sN; s.worst = rcIter(a, .6); s.it++;
    if (s.it >= s.sN) { rcDock(); rcGatherStrays(); s.ph = 'C'; s.it = 0; s.tries = 0; }
  } else {
    s.worst = rcPushGS(1, RPH.cs); rcHold(1); s.it++;
    if (s.worst <= 5 || (s.it > 120 && s.worst <= 9.5) || s.it >= RPH.cN) {
      if (s.tries < 3 && rcGatherStrays()) { s.tries++; s.it = 0; return false; }       // beim Setzen versprengt: heranholen und nochmal aufraeumen
      return true;
    }
  }
  return false;
}
/* berechnete Positionen auf Artists/Songs uebertragen und neu zeichnen */
function rcApply() {
  const s = RSIM;
  for (let i = 0; i < s.n; i++) {
    const dx = s.px[i] - s.ax[i], dy = s.py[i] - s.ay[i];
    if (dx !== 0 || dy !== 0) { rcMoveArtist(art[i], dx, dy); s.ax[i] = s.px[i]; s.ay[i] = s.py[i]; }
  }
  updateRegionGeom();
  [regs, scs].forEach(l => l.forEach(g => { g.cx = g.tcx; g.cy = g.tcy; g.rad = g.trad; }));
  const now = performance.now(); if (now - RC.glowT > 90) { RC.glowT = now; glowDirty = true; }
  mmDirty = true; requestDraw();
}
function rcSimRun(ms) {                                  // fuer die Animation (und Tests) direkt aufrufbar
  const s = RSIM, t0 = performance.now(); let done = false;
  do { if (rcSimStep()) { done = true; break; } } while (performance.now() - t0 < ms);
  rcApply();
  if (done) rcSimFinish();
  return done;
}
function rcSimLoop() {
  if (RSIM.raf || !RSIM.on) return;
  const tick = () => { RSIM.raf = 0; if (!RSIM.on) return; rcSimRun(RSIM.ph === 'D' ? 11 : 24); if (RSIM.on) RSIM.raf = requestAnimationFrame(tick); };
  RSIM.raf = requestAnimationFrame(tick);
}
function rcSimStop() { RSIM.on = false; if (RSIM.raf) { cancelAnimationFrame(RSIM.raf); RSIM.raf = 0; } }
/* Schwerpunkt eines Kontinents wie in der Simulation (Gewicht = Flaeche) */
function rcWCenter(r) {
  let cx = 0, cy = 0, w = 0; r.members.forEach(i => { const a = art[i], q = a.bF * a.bF; cx += a.bx * q; cy += a.by * q; w += q; });
  return w ? [cx / w, cy / w] : [r.bcx, r.bcy];
}
/* Aktuelle Anordnung der Kontinente wird ihre neue Ruhelage (bleibt bei spaeteren Zuegen); unveraenderte Kontinente behalten ihre Ursprungsform */
function rcSnapshot() {
  regs.forEach(r => {
    const mem = r.members; let cx = 0, cy = 0, ox = 0, oy = 0, w = 0;
    mem.forEach(i => { const a = art[i], q = a.bF * a.bF; cx += a.bx * q; cy += a.by * q; ox += a.px0 * q; oy += a.py0 * q; w += q; });
    if (!w) return; cx /= w; cy /= w; ox /= w; oy /= w;
    mem.forEach(i => {
      const a = art[i], dx = a.bx - cx, dy = a.by - cy;
      if (Math.hypot(dx - (a.px0 - ox), dy - (a.py0 - oy)) > 3) RC.opos[i] = [Math.round(dx), Math.round(dy)]; else delete RC.opos[i];
    });
  });
}
function rcSimFinish() {
  const s = RSIM, gr = s.gr, kind = s.kind; rcSimStop(); rcGeo();
  regs.forEach((r, i) => { const k = rkey(r); if (RC.anc[k] || (kind === 'region' && i === gr)) { const c = rcWCenter(r); RC.anc[k] = [Math.round(c[0]), Math.round(c[1])]; } });      // der abgelegte Kontinent bleibt, wo er liegt; fruehere Anker ziehen mit
  rcSnapshot(); rcPositions(); applyLayout({ instant: true, fit: false }); rcSave(); toast('Karte neu geordnet');
  const cb = s.done; s.done = null; if (cb) cb();
}

/* ---- Zeigen und Ziehen ---- */
function rcRegionAt(sx, sy) {
  const z = cam.z, wx = (sx - W / 2) / z + cam.x, wy = (sy - H / 2) / z + cam.y;
  const h = pick(sx, sy); if (h) return h.t === 'a' ? art[h.i].reg : trk[h.i].art.reg;
  let best = null, bd = 1e9; regs.forEach(r => { if (r.act < 1) return; const d = Math.hypot(wx - r.cx, wy - r.cy) / Math.max(1, r.rad); if (d < 1.05 && d < bd) { bd = d; best = r; } });
  return best;
}
function rcSceneAt(sx, sy) {
  const z = cam.z, wx = (sx - W / 2) / z + cam.x, wy = (sy - H / 2) / z + cam.y;
  const h = pick(sx, sy); if (h) return scs[(h.t === 'a' ? art[h.i] : trk[h.i].art).s];
  let best = null, bd = 1e9; scs.forEach(g => { if (g.act < 1) return; const d = Math.hypot(wx - g.cx, wy - g.cy) / Math.max(1, g.rad); if (d < 1.05 && d < bd) { bd = d; best = g; } });
  return best;
}
const rcArtistAt = (sx, sy) => { const h = pick(sx, sy); return h ? (h.t === 'a' ? art[h.i] : trk[h.i].art) : null; };
function rcDragStart(e, kind, mem, reg) {
  e.stopImmediatePropagation(); try { cv.setPointerCapture(e.pointerId); } catch (_) { }
  if (RSIM.on) { rcSimRun(1200); if (RSIM.on) { rcSimStop(); rcApply(); rcSimFinish(); } }          // eine noch laufende Animation vorher abschliessen
  rcSimStop(); rcGeo(); rcSimInit(kind === 'region' ? null : mem); rcSetGroup(kind === 'region' ? reg : RSIM.R - 1, kind); RSIM.on = true;
  RC.drag = { kind, x0: e.clientX, y0: e.clientY, lx: e.clientX, ly: e.clientY, moved: false, id: e.pointerId };
  fly = null; inertia = null; hover = null; showTip(null); cv.classList.add('drag');
}
cv.addEventListener('pointerdown', e => {
  if (!RC.edit || PATH !== 'map') return;
  if (RC.drag || RC.band) { e.stopImmediatePropagation(); return; }                                 // ein zweiter Finger stoert das laufende Ziehen nicht
  if (e.button > 0) return;
  if (RC.unit === 'artist') {
    const a = rcArtistAt(e.clientX, e.clientY), mod = e.shiftKey || e.ctrlKey || e.metaKey;
    if (!a) {                                                                                       // freie Flaeche: Umschalt+Ziehen = Auswahlrahmen, sonst wie gewohnt die Karte verschieben (ein Klick ins Leere hebt die Auswahl auf)
      if (mod && e.pointerType === 'mouse') { e.stopImmediatePropagation(); try { cv.setPointerCapture(e.pointerId); } catch (_) { } RC.band = { x0: e.clientX, y0: e.clientY, x1: e.clientX, y1: e.clientY, id: e.pointerId }; hover = null; showTip(null); }
      else if (RC.sel.size) RC.empty = { x: e.clientX, y: e.clientY };
      return;
    }
    if (mod) { rcToggleSel(a.i); e.stopImmediatePropagation(); return; }                           // Umschalt/Strg+Klick: Artist zur Auswahl hinzufuegen oder entfernen
    const keep = RC.sel.has(a.i);
    rcDragStart(e, 'artist', keep ? [...RC.sel] : [a.i]);
    RC.drag.tap = a.i; RC.drag.keep = keep; RC.drag.touch = e.pointerType !== 'mouse';
    return;
  }
  if (RC.unit === 'scene') { const g = rcSceneAt(e.clientX, e.clientY); if (g && g.members.length) rcDragStart(e, 'scene', g.members.slice()); return; }
  const r = rcRegionAt(e.clientX, e.clientY); if (r) rcDragStart(e, 'region', null, regs.indexOf(r));
});
cv.addEventListener('pointermove', e => {
  if (RC.band) { e.stopImmediatePropagation(); if (e.pointerId === RC.band.id) { RC.band.x1 = e.clientX; RC.band.y1 = e.clientY; requestDraw(); } return; }
  if (!RC.drag) { if (RC.empty && Math.hypot(e.clientX - RC.empty.x, e.clientY - RC.empty.y) > 4) RC.empty = null; return; }
  e.stopImmediatePropagation();
  const d = RC.drag; if (e.pointerId !== d.id) return;
  if (!d.moved) {                                                                                  // erst nach ein paar Pixeln gilt es als Ziehen (auch bei sehr langsamer Hand); die Strecke seit dem Aufsetzen zaehlt mit
    if (Math.hypot(e.clientX - d.x0, e.clientY - d.y0) < 3) return;
    d.moved = true; d.lx = d.x0; d.ly = d.y0;
    if (d.kind === 'artist') { if (!d.keep) RC.sel = new Set([d.tap]); rcLabels(); }               // unmarkierter Artist: die Auswahl besteht nur noch aus ihm
  }
  const dx = (e.clientX - d.lx) / cam.z, dy = (e.clientY - d.ly) / cam.z; d.lx = e.clientX; d.ly = e.clientY;
  RSIM.hx += dx; RSIM.hy += dy; rcSimLoop();                                                       // Ziel der Hand; die Gruppe folgt mit begrenzter Geschwindigkeit
});
function rcToggleSel(i) { if (RC.sel.has(i)) RC.sel.delete(i); else RC.sel.add(i); rcLabels(); requestDraw(); }
function rcClearSel() { if (!RC.sel.size) return; RC.sel = new Set(); rcLabels(); requestDraw(); }
function rcDragEnd(e) {
  if (RC.band) {                                                                                   // Auswahlrahmen loslassen: alle sichtbaren Artists im Rahmen kommen zur Auswahl
    if (e) e.stopImmediatePropagation(); if (e && e.pointerId !== RC.band.id) return;
    const b = RC.band; RC.band = null;
    const z = cam.z, ox = W / 2 - cam.x * z, oy = H / 2 - cam.y * z, x0 = Math.min(b.x0, b.x1), x1 = Math.max(b.x0, b.x1), y0 = Math.min(b.y0, b.y1), y1 = Math.max(b.y0, b.y1);
    if (x1 - x0 > 3 || y1 - y0 > 3) art.forEach(a => { if (a.sc < .05) return; const sx = a.x * z + ox, sy = a.y * z + oy; if (sx >= x0 && sx <= x1 && sy >= y0 && sy <= y1) RC.sel.add(a.i); });
    rcLabels(); requestDraw(); return;
  }
  if (RC.empty && e && e.type === 'pointerup') { RC.empty = null; rcClearSel(); }                  // Klick ins Leere (ohne Ziehen) hebt die Auswahl auf; die Karte reagiert wie gewohnt
  const d = RC.drag; if (!d) return; if (e) e.stopImmediatePropagation(); if (e && e.pointerId !== d.id) return;
  RC.drag = null; cv.classList.remove('drag');
  if (!d.moved) {
    rcSimStop();
    if (d.kind === 'artist') { if (d.touch) rcToggleSel(d.tap); else { RC.sel = new Set([d.tap]); rcLabels(); requestDraw(); } }      // Tippen/Klicken: Touch schaltet um, Maus waehlt genau diesen Artist
    return;
  }
  RSIM.release = true; toast('Ordne neu …'); rcSimLoop();
}
cv.addEventListener('pointerup', rcDragEnd); cv.addEventListener('pointercancel', rcDragEnd);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && RC.edit && RC.sel.size && !RC.drag) rcClearSel(); });
/* Auswahl-Overlay im Bearbeiten-Modus: Ringe um markierte Artists, Auswahlrahmen */
function drawEditSel(z, ox, oy) {
  if (RC.sel.size) {
    ctx.save(); ctx.lineWidth = 2; ctx.strokeStyle = TH.tint === 'light' ? 'rgba(20,24,38,.95)' : 'rgba(255,255,255,.95)'; ctx.fillStyle = TH.tint === 'light' ? 'rgba(20,24,38,.12)' : 'rgba(255,255,255,.14)';
    RC.sel.forEach(i => { const a = art[i]; if (a.sc < .05) return; const sx = a.x * z + ox, sy = a.y * z + oy; if (sx < -60 || sy < -60 || sx > W + 60 || sy > H + 60) return; const rs = Math.max(a.F * a.sc * z, 5) + 3; ctx.beginPath(); ctx.arc(sx, sy, rs, 0, 6.2832); ctx.fill(); ctx.stroke(); });
    ctx.restore();
  }
  if (RC.band) {
    const b = RC.band; ctx.save(); ctx.lineWidth = 1.2; ctx.setLineDash([5, 4]); ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.fillStyle = 'rgba(160,190,255,.12)';
    ctx.fillRect(Math.min(b.x0, b.x1), Math.min(b.y0, b.y1), Math.abs(b.x1 - b.x0), Math.abs(b.y1 - b.y0)); ctx.strokeRect(Math.min(b.x0, b.x1), Math.min(b.y0, b.y1), Math.abs(b.x1 - b.x0), Math.abs(b.y1 - b.y0)); ctx.restore();
  }
}
/* Artist zu seinem Kontinent zurueckholen: Ziel ist das Mittel seiner aehnlichen Artists im Kontinent, dort wird der naechste freie Platz gesucht */
function rcReturnArtist(i) {
  if (RSIM.on) return; const a = art[i]; let tx = 0, ty = 0, tw = 0;
  a.nb.forEach(u => { const b = art[u[0]]; if (b.r === a.r) { const w = u[1] + .05; tx += b.bx * w; ty += b.by * w; tw += w; } });
  if (tw) { tx /= tw; ty /= tw; } else { const c = robustCenter(regs[a.r].members.filter(k => k !== i).map(k => [art[k].bx, art[k].by, art[k].bF * art[k].bF])); if (!c) return; tx = c[0]; ty = c[1]; }
  const free = (x, y) => { for (let k = 0; k < NA; k++) { if (k === i) continue; const b = art[k]; if (Math.hypot(b.bx - x, b.by - y) < a.bF + b.bF + 9) return false; } return true; };
  let nx = tx, ny = ty, found = free(nx, ny);
  for (let r = 25; r <= 1800 && !found; r += 25) for (let q = 0, n = Math.max(8, Math.round(r / 12)); q < n && !found; q++) { const an = q / n * 6.2832 + r * .37; nx = tx + Math.cos(an) * r; ny = ty + Math.sin(an) * r; found = free(nx, ny); }
  if (!found) { nx = tx; ny = ty; }
  rcMoveArtist(a, nx - a.bx, ny - a.by); rcGeo();
  let cx = 0, cy = 0, w = 0; regs[a.r].members.forEach(k => { const q = art[k].bF * art[k].bF; cx += art[k].bx * q; cy += art[k].by * q; w += q; });
  RC.opos[i] = [Math.round(a.bx - cx / w), Math.round(a.by - cy / w)];
  rcPositions(); applyLayout({ instant: true, fit: false }); rcSave(); toast('Artist zurückgeholt'); if (sel && sel.t === 'a' && sel.i === i) flyToSel();
}
function rcResetPositions() {
  rcSimStop(); art.forEach(x => rcMoveArtist(x, x.px0 - x.bx, x.py0 - x.by)); rcGeo(); RC.pos = null; RC.anc = {}; RC.opos = {}; RC.sel = new Set(); rcSave(); applyLayout({ instant: true, fit: 'force' }); rcLabels(); toast('Positionen zurückgesetzt');
}
/* Bearbeiten-Modus: die Karte zeigt immer das volle Grundlayout (alle Artists, ohne Zeitraum/Filter/Ausblenden), damit die Hand genau dort ablegt, wo sie loslaesst */
function rcEdit(on) {
  if (!on && RSIM.on) rcSimRun(1e9);                                                      // noch laufende Animation sofort zu Ende bringen
  RC.edit = on; if (!on) { RC.sel = new Set(); RC.band = null; RC.empty = null; }
  hidePause(on); document.body.classList.toggle('edit-conts', on); $('t-edit').classList.toggle('on', on);
  let b = $('edit-banner');
  if (!b) { b = document.createElement('div'); b.id = 'edit-banner'; b.className = 'glass'; b.innerHTML = '<span id="edit-hint"></span><div class="seg"><button class="btn" data-ed="u-region">Kontinent</button><button class="btn" data-ed="u-scene">Szene</button><button class="btn" data-ed="u-artist">Artists</button></div><button class="btn" data-ed="clr">Auswahl aufheben</button><button class="btn" data-ed="mag"></button><button class="btn" data-ed="tidy">Aufräumen</button><button class="btn" data-ed="colors">Farben …</button><button class="btn" data-ed="reset">Zurücksetzen</button><button class="btn pri" data-ed="done">Fertig</button>'; document.body.appendChild(b);
    b.addEventListener('click', e => {
      const x = e.target.closest('[data-ed]'); if (!x) return; const k = x.dataset.ed;
      if (k === 'done') rcEdit(false); else if (k === 'mag') rcSetMagnet((RC.magnet + 1) % 3); else if (k.startsWith('u-')) rcSetUnit(k.slice(2)); else if (k === 'clr') rcClearSel(); else if (k === 'tidy') rcTidy(); else if (k === 'reset') rcResetPositions();
      else { openDrawer('settings'); setTimeout(() => { const s = document.getElementById('rc-sect'); if (s) { openFoldOf(s); s.scrollIntoView({ block: 'start' }); } }, 60); }
    }); }
  b.classList.toggle('show', on); rcLabels(); applyLayout({ fit: false });
  if (on) { clearSel(); toast(RC.unit === 'artist' ? 'Ziehe einen Artist an eine neue Stelle' : RC.unit === 'scene' ? 'Ziehe eine Szene, um sie zu verschieben' : 'Ziehe einen Kontinent, um ihn zu verschieben'); }
}
const RMAG = ['Aus', 'Mittel', 'Stark'];
function rcLabels() {
  const q = k => document.querySelector('#edit-banner [data-ed="' + k + '"]'), h = document.getElementById('edit-hint'), n = RC.sel.size;
  const m = q('mag'); if (m) m.textContent = T('Magnet') + ': ' + T(RMAG[RC.magnet]);
  ['region', 'scene', 'artist'].forEach(u => { const x = q('u-' + u); if (x) x.classList.toggle('pri', RC.unit === u); });
  const c = q('clr'); if (c) { c.style.display = RC.unit === 'artist' && n ? '' : 'none'; c.textContent = T('Auswahl aufheben') + ' (' + n + ')'; }
  const touch = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  if (h) h.textContent = RC.unit === 'artist' ? T(touch ? 'Artists verschieben: tippe Artists an, um sie auszuwählen, und ziehe sie dann gemeinsam.' : 'Artists verschieben: ziehe einen Artist an eine neue Stelle. Mehrere auswählen: Umschalt+Klick oder Umschalt+Rahmen aufziehen, dann gemeinsam ziehen.')
    : RC.unit === 'scene' ? T('Szenen verschieben: ziehe eine Szene (Unter-Genre) an eine neue Stelle – sie gehört weiter zu ihrem Kontinent, die Nachbarn weichen aus.') : T('Kontinente verschieben: ziehe einen Kontinent an eine neue Stelle – die anderen weichen aus und rücken nach.');
}
function rcSetMagnet(v) { RC.magnet = v; rcSave(); rcLabels(); if (drawerTab === 'settings') renderDrawer(); toast(T('Magnet') + ': ' + T(RMAG[v])); }
function rcSetUnit(u) {
  if (RSIM.on) return; RC.unit = u; if (u !== 'artist') RC.sel = new Set(); rcLabels(); requestDraw(); if (drawerTab === 'settings') renderDrawer();
  toast(T(u === 'artist' ? 'Ziehe einen Artist an eine neue Stelle' : u === 'scene' ? 'Ziehe eine Szene, um sie zu verschieben' : 'Ziehe einen Kontinent, um ihn zu verschieben'));
}
/* Standard-Farbschema ist "Nach Lage": gilt, solange fuer diese Karte noch nichts gespeichert wurde (wird nicht selbst gespeichert) */
/* Standard-Farbschema von Tunelands (Kontinent-Anker -> Farbe); passt zur Karte von timnook73. Auf anderen Karten ohne passenden Anker gilt "Farben nach Lage". */
const KK_DEFCOLORS = {"The Neighbourhood": "#a052ff", "Edwin Rosen": "#59f9ff", "TV Girl": "#be30ff", "sign crushes motorist": "#6fc253", "Tame Impala": "#1cc984", "Kasi": "#43de95", "Radiohead": "#ffa1a1", "Zate": "#c27465", "Clairo": "#bf66ff", "Pastel Ghost": "#b01c95", "MXP": "#b34757", "Anri": "#dec97c", "Lyno Nine8": "#3579f0", "Videoclub": "#ff5ea1", "hkmori": "#570238", "XXXTENTACION": "#6783e6", "Nujabes": "#d6bc38", "Powfu": "#2de06c", "Joost": "#3469bf", "inverted mind": "#c2557d", "Lofi Girl": "#45f571"};
function rcStdColors() {
  if (!regs.some(r => KK_DEFCOLORS[rkey(r)])) { rcDefaultColors(); return; }
  regs.forEach(r => setRegionColor(r, KK_DEFCOLORS[rkey(r)] || r.color0, false));
}
function rcDefaultColors() {
  const gx = regs.reduce((s, r) => s + r.cx, 0) / regs.length, gy = regs.reduce((s, r) => s + r.cy, 0) / regs.length;
  regs.forEach(r => setRegionColor(r, rgb2hex(fromHsl((Math.atan2(r.cy - gy, r.cx - gx) * 180 / Math.PI + 360) % 360 + 15, .6, .68)), false));
}
/* Layout-Code: Farben und Positionen dieser Karte als Text (zum Uebertragen zwischen Geraeten; kann in config.js als Standard hinterlegt werden: layout: { classic: 'KK1:...' }) */
function rcPack() {
  const colors = {}; regs.forEach(r => { if (r.color.toLowerCase() !== r.color0.toLowerCase()) colors[rkey(r)] = r.color; });
  const pos = art.map(a => [Math.round(a.bx * 10) / 10, Math.round(a.by * 10) / 10]);
  return 'KK1:' + btoa(unescape(encodeURIComponent(JSON.stringify({ colors, pos, anc: RC.anc, opos: RC.opos, mag: RC.magnet }))));
}
function rcUnpack(code) {
  try { const o = JSON.parse(decodeURIComponent(escape(atob(String(code).trim().replace(/^KK1:/, ''))))); return o && Array.isArray(o.pos) && o.pos.length === NA ? o : null; } catch (e) { return null; }
}
function rcAdopt(o) { RC.colors = o.colors || {}; RC.pos = o.pos; RC.anc = o.anc || {}; RC.opos = o.opos || {}; RC.magnet = o.mag === 0 || o.mag === 2 ? o.mag : 1; }
function rcCodeExport() {
  const c = rcPack(), done = () => toast(T('Layout-Code kopiert. Auf dem anderen Gerät unter „Layout einfügen“ einfügen.'));
  try { navigator.clipboard.writeText(c).then(done, () => window.prompt(T('Layout-Code (alles kopieren):'), c)); } catch (e) { window.prompt(T('Layout-Code (alles kopieren):'), c); }
}
function rcCodeImport() {
  const c = window.prompt(T('Layout-Code einfügen:')); if (!c) return;
  const o = rcUnpack(c); if (!o) { toast(T('Der Code passt nicht zu dieser Karte.')); return; }
  rcAdopt(o); rcSave(); location.reload();
}
function rcBuiltin() { try { const L = (window.__KK_CFG__ || {}).layout, c = L && (typeof L === 'object' ? L[MAPV || 'default'] : L); return c ? rcUnpack(c) : null; } catch (e) { return null; } }
function rcInit() { let fresh = false; try { fresh = !localStorage.getItem(RC.key) && !localStorage.getItem(RC.legacy); } catch (e) { } rcLoad(); const bi = fresh ? rcBuiltin() : null; if (bi) { rcAdopt(bi); fresh = false; } rcApplySaved(); if (fresh && regs.length) rcStdColors(); if (RC.dropped) { RC.dropped = false; rcSave(); setTimeout(() => toast(T('Gespeicherte Positionen einer älteren Version wurden verworfen, die Farben bleiben erhalten.')), 2500); } }

/* ---- Oberflaeche: Farbwahl je Kontinent (Einstellungen) ---- */
function rcHTML() {
  let h = '';
  if (MAPS) h += '<div class="sect"><h3>Karte <em>Layout und Farben</em></h3></div><div class="btns" style="margin:0 0 4px">' + [['classic', 'Klassisch'], ['neu', 'Neu']].filter(m => MAPS[m[0]]).map(m => '<button class="btn' + (MAPV === m[0] ? ' pri' : '') + '" data-map="' + m[0] + '">' + m[1] + '</button>').join('') + '</div><div class="hint" style="margin:0 0 10px;font-size:12px;opacity:.7">Klassisch: Anordnung und Farben vom 21.10. – Neu: verbesserte Genre-Zuordnung (21 Kontinente).</div>';
  h += '<div class="sect" id="rc-sect"><h3>Kontinente <em>Farbe und Lage</em></h3></div>';
  h += '<div class="btns" style="margin:0 0 8px"><button class="btn' + (RC.edit ? ' pri' : '') + '" data-rcp="edit">Kontinente verschieben</button><button class="btn" data-rcp="resetpos">Lage zurücksetzen</button><button class="btn" data-rcp="tidy">Aufräumen</button></div>';
  h += '<div class="btns" style="margin:0 0 8px"><button class="btn" data-rcp="codeout">Layout kopieren</button><button class="btn" data-rcp="codein">Layout einfügen</button></div>';
  h += '<div class="rc-presets"><span>Magnet <em style="opacity:.6">(Zusammenhalt)</em></span>' + RMAG.map((m, i) => '<button class="btn' + (RC.magnet === i ? ' pri' : '') + '" data-rcm="' + i + '">' + m + '</button>').join('') + '</div>';
  h += '<div class="rc-presets"><span>Farbschema</span>' + [['orig', 'Original'], ['spectrum', 'Nach Lage'], ['pastel', 'Pastell'], ['vivid', 'Kräftig']].map(p => '<button class="btn" data-rcp="' + p[0] + '">' + p[1] + '</button>').join('') + '</div>';
  h += '<div class="rc-list">' + regs.slice().sort((a, b) => b.cm - a.cm).map(r => '<label class="rc-row"><input type="color" value="' + r.color + '" data-rc="' + r.id + '"><span>' + esc(r.name) + '</span>' + (RC.colors[rkey(r)] ? '<i class="rc-mod" title="Geändert"></i>' : '') + '</label>').join('') + '</div>';
  return h;
}
document.addEventListener('input', e => { const c = e.target.closest && e.target.closest('input[data-rc]'); if (!c) return; setRegionColor(regs[+c.dataset.rc], c.value, false); rcColorsApplied(); });
document.addEventListener('change', e => { const c = e.target.closest && e.target.closest('input[data-rc]'); if (!c) return; rcSave(); if (drawerTab === 'settings') renderDrawer(); });
document.addEventListener('click', e => {
  const mp = e.target.closest('[data-map]'); if (mp) { const v = mp.dataset.map; if (v === MAPV) return; try { localStorage.setItem('kk-map', v); } catch (e) { } try { location.hash = 'map=' + v; location.reload(); } catch (e) { location.reload(); } return; }
  const mb = e.target.closest('[data-rcm]'); if (mb) { rcSetMagnet(+mb.dataset.rcm); return; }
  const b = e.target.closest('[data-rcp]'); if (!b) return; const k = b.dataset.rcp;
  if (k === 'edit') rcEdit(!RC.edit); else if (k === 'resetpos') rcResetPositions(); else if (k === 'tidy') rcTidy(); else if (k === 'codeout') rcCodeExport(); else if (k === 'codein') rcCodeImport(); else rcPreset(k);
});

/* =====================================================================
   KLANGKARTE – Ausblenden
   Kontinente, Szenen, einzelne Artists und Songs lassen sich von der Karte nehmen, damit auch aus Bild und PDF.
   Es betrifft nur die Karte (Karte, Reihen, Spirale, Export): Ranglisten, Summen und die Suche bleiben unverändert.
   Nichts wird gespeichert: Nach dem Neuladen ist wieder alles da.
   Ausgeblendete Artists/Songs fallen über passA/passT aus dem Layout; die Karte behält ihre Plätze (Lücken), solange kein Filter aktiv ist.
   ===================================================================== */
const HID = { r: new Set(), s: new Set(), a: new Set(), k: new Set(), x: new Set(), y: new Set(), yA: new Set(), n: 0, off: false };      // Kontinent, Szene, Artist, Song (Nummern wie bei sel); x/y = Ausnahmen: Artist/Song bleibt sichtbar, obwohl sein Kontinent/seine Szene (bzw. sein Artist) ausgeblendet ist; yA = Artists mit Song-Ausnahme; off = pausiert (Kontinente verschieben)
const FX = { a: new Set(), k: new Set(), n: 0 };      // dauerhaft ausgeblendet durch "Fehler melden" (03h_fix.js): gelten wie HID, werden aber gespeichert und zaehlen nicht in der Pille
const HID_ORDER = ['r', 's', 'a', 'k'];
const HID_LAB = { r: 'Kontinent', s: 'Szene', a: 'Artist', k: 'Song', x: 'Artist', y: 'Song' };
const HID_VIA = { r: 'Ausgeblendet über den Kontinent.', s: 'Ausgeblendet über die Szene.', a: 'Ausgeblendet über den Artist.', k: 'Ausgeblendet über den Song.' };
/* Gruppe (Kontinent/Szene) blendet den Artist aus, sofern keine Ausnahme gilt */
const grpHid = a => (HID.r.has(a.r) || HID.s.has(a.s)) && !HID.x.has(a.i) && !HID.yA.has(a.i);
const hidTotal = () => HID.r.size + HID.s.size + HID.a.size + HID.k.size;
const isHidA = a => (HID.n > 0 || FX.n > 0) && !HID.off && (grpHid(a) || HID.a.has(a.i) || FX.a.has(a.i) || (a.k === 1 && (HID.k.has(a.tr[0]) || FX.k.has(a.tr[0]))));
const isHidT = t => (HID.n > 0 || FX.n > 0) && !HID.off && (HID.k.has(t.i) || FX.k.has(t.i) || isHidA(art[t.p]) || (HID.yA.has(t.p) && !HID.y.has(t.i) && !HID.x.has(t.p) && (HID.r.has(art[t.p].r) || HID.s.has(art[t.p].s))));
/* Was blendet das Element aus? {t, i} des Auslösers (das Element selbst oder sein Szene/Kontinent/Artist), sonst null */
function hideCause(t, i) {
  if ((!HID.n && !FX.n) || HID.off) return null;
  if (t === 'r') return HID.r.has(i) ? { t, i } : null;
  if (t === 's') return HID.s.has(i) ? { t, i } : HID.r.has(scs[i].reg) ? { t: 'r', i: scs[i].reg } : null;
  if (t === 'a') {
    const a = art[i];
    if (FX.a.has(i)) return { t, i, fx: 1 };
    if (HID.a.has(i)) return { t, i };
    if (a.k === 1 && FX.k.has(a.tr[0])) return { t: 'k', i: a.tr[0], fx: 1 };
    if (a.k === 1 && HID.k.has(a.tr[0])) return { t: 'k', i: a.tr[0] };
    if (HID.x.has(i) || HID.yA.has(i)) return null;
    if (HID.s.has(a.s)) return { t: 's', i: a.s };
    return HID.r.has(a.r) ? { t: 'r', i: a.r } : null;
  }
  if (t === 'k') {
    if (FX.k.has(i)) return { t, i, fx: 1 }; if (HID.k.has(i)) return { t, i };
    const p = trk[i].p, a = art[p];
    if (HID.y.has(i)) return FX.a.has(p) || HID.a.has(p) ? hideCause('a', p) : null;           // Ausnahme: nur dieser Song bleibt sichtbar
    if (HID.yA.has(p) && !HID.x.has(p) && (HID.r.has(a.r) || HID.s.has(a.s))) return HID.s.has(a.s) ? { t: 's', i: a.s } : { t: 'r', i: a.r };
    return hideCause('a', p);
  }
  return null;
}
function hideIs(t, i) { return !!hideCause(t, i); }
const hideName = (t, i) => t === 'r' ? regs[i].name : t === 's' ? scs[i].name : (t === 'a' || t === 'x') ? art[i].n : trk[i].n;

/* ---------- Ändern ---------- */
function hideSet(t, i, on) {
  const set = HID[t]; if (!(set instanceof Set) || t === 'yA') return;
  const was = set.has(i); if (on == null) on = !was; if (on === was) return;
  if (on) set.add(i); else set.delete(i);
  if (on && t === 'a') HID.x.delete(i);                       // direkt ausgeblendet: eine fruehere Ausnahme gilt nicht mehr
  if (on && t === 'k') HID.y.delete(i);
  if (t === 'y') { const p = trk[i].p; if (on) HID.yA.add(p); else if (!art[p].tr.some(k => HID.y.has(k))) HID.yA.delete(p); }
  hideApply();
}
function hideClear() { if (!hidTotal() && !HID.x.size && !HID.y.size) return; HID_ORDER.concat(['x', 'y', 'yA']).forEach(t => HID[t].clear()); hideApply(); }
/* Beim Verschieben der Kontinente ist alles sichtbar (sonst stoßen sichtbare Artists an unsichtbare) */
function hidePause(on) { on = !!on; if (HID.off === on) return; HID.off = on; if (hidTotal() || FX.n) hideApply(); }
function hideApply() {
  HID.n = hidTotal();
  computeFocus(); applyLayout({ fit: false }); hideUI();
  if (drawerTab === 'settings') hidePanel(); else if (drawerTab === 'detail') renderDrawer();
  requestDraw();
}
function hideUI() {
  const n = hidTotal();
  document.querySelectorAll('.hid-pill').forEach(p => {
    p.classList.toggle('hidden', !n); p.classList.toggle('paused', !!n && HID.off);
    p.title = n && HID.off ? T('Beim Verschieben der Kontinente ist alles sichtbar.') : '';
    const b = p.querySelector('.hp-n'); if (b) b.textContent = n + ' ausgeblendet';
  });
}

/* ---------- Bausteine für Detailansichten ---------- */
const hideBtn = (t, i) => hideCause(t, i) ? '' : '<button class="btn" data-hide="' + t + i + '">' + HID_LAB[t] + ' ausblenden</button>';
function hideNote(t, i) {
  const c = hideCause(t, i);
  if (!c) {                                                       // sichtbar trotz ausgeblendetem Kontinent/Szene: Ausnahme anzeigen
    const a = t === 'a' ? art[i] : t === 'k' ? art[trk[i].p] : null;
    if (a && !HID.off && (HID.r.has(a.r) || HID.s.has(a.s)) && (t === 'a' ? HID.x.has(i) : HID.y.has(i))) return '<div class="hid-note"><span>Ausnahme: bleibt sichtbar, obwohl ' + (HID.s.has(a.s) ? 'die Szene' : 'der Kontinent') + ' ausgeblendet ist.</span><button class="btn" data-hide="' + (t === 'a' ? 'x' : 'y') + i + '">Ausnahme aufheben</button></div>';
    return '';
  }
  if (c.fx) return '<div class="hid-note"><span>' + (c.t === t && c.i === i ? 'Korrigiert: nicht auf der Karte.' : HID_VIA[c.t]) + '</span><button class="btn" data-fix="undo:' + c.t + c.i + '">Rückgängig</button></div>';
  const own = c.t === t && c.i === i, viaGrp = (t === 'a' || t === 'k') && (c.t === 'r' || c.t === 's') || (t === 'k' && c.t === 'a');
  const ex = viaGrp ? '<button class="btn" data-hide="' + (t === 'a' ? 'x' : 'y') + i + '">' + (t === 'a' ? 'Nur diesen Artist anzeigen' : 'Nur diesen Song anzeigen') + '</button>' : '';
  return '<div class="hid-note"><span>' + (own ? 'Ausgeblendet: nicht auf der Karte und nicht im Export.' : HID_VIA[c.t]) + '</span><button class="btn" data-hide="' + c.t + c.i + '">' + HID_LAB[c.t] + ' wieder einblenden</button>' + ex + '</div>';
}

/* ---------- Einstellungen: Suchen, Liste, Alles einblenden ---------- */
function hideRowHTML(t, i) {
  const direct = HID[t].has(i), c = direct ? null : hideCause(t, i);
  let ctx = '';
  if (t === 'a' || t === 'x') ctx = art[t === 'x' ? i : i].reg.name; else if (t === 's') ctx = regs[scs[i].reg].name; else if (t === 'k' || t === 'y') ctx = trk[i].a.map(x => art[x].n).join(', ');
  const act = direct ? '<button class="btn hid-b" data-hide="' + t + i + '">' + (t === 'x' || t === 'y' ? 'Ausnahme aufheben' : 'Wieder einblenden') + '</button>'
    : c ? '<span class="hid-via">' + HID_VIA[c.t] + '</span>'
      : '<button class="btn hid-b" data-hide="' + t + i + '">Ausblenden</button>';
  return '<div class="hid-row"><div class="hid-t"><span class="hid-k">' + (t === 'x' || t === 'y' ? 'Ausnahme · ' : '') + HID_LAB[t] + '</span><b>' + esc(hideName(t, i)) + '</b>' + (ctx ? '<small>' + esc(ctx) + '</small>' : '') + '</div>' + act + '</div>';
}
function hideListHTML() {
  let rows = ''; HID_ORDER.concat(['x', 'y']).forEach(t => HID[t].forEach(i => { rows += hideRowHTML(t, i); }));
  return rows ? rows + '<div class="btns"><button class="btn" data-hide="all">Alles wieder einblenden</button></div>' : '<div class="muted hid-none">Noch nichts ausgeblendet.</div>';
}
function hideFindHTML(q) {
  const res = search(q, ['r', 's', 'a', 'k'], { r: 3, s: 4, a: 6, k: 6 }, 16);
  return res.length ? res.map(e => hideRowHTML(e.t, e.i)).join('') : '<div class="muted hid-none">Nichts gefunden.</div>';
}
function hideSettingsHTML() {
  return '<div class="sect"><h3>Ausblenden</h3></div>'
    + '<div class="muted hid-intro">Nimmt Kontinente, Szenen, Artists oder Songs von der Karte, auch aus Bild und PDF. Ranglisten und Summen bleiben gleich. Das wird nicht gespeichert: Nach dem Neuladen ist wieder alles da.</div>'
    + '<input class="hid-q" type="search" autocomplete="off" spellcheck="false" placeholder="' + esc(T('Kontinent, Szene, Artist oder Song suchen …')) + '" aria-label="' + esc(T('Zum Ausblenden suchen')) + '">'
    + '<div class="hid-res"></div><div class="hid-list">' + hideListHTML() + '</div>';
}
function hidePanel() {                // nur Liste und Treffer neu zeichnen, damit das Suchfeld seinen Fokus behält
  const l = dbody.querySelector('.hid-list'); if (l) l.innerHTML = hideListHTML();
  const q = dbody.querySelector('.hid-q'), r = dbody.querySelector('.hid-res'); if (q && r) r.innerHTML = q.value.trim() ? hideFindHTML(q.value) : '';
}
function hideOpenPanel() {
  setQ = ''; setTab('settings');
  const f = dbody.querySelector('.fold[data-t="Ausblenden"]'); if (f) { openFoldOf(f); f.scrollIntoView({ block: 'start' }); }
}

document.addEventListener('click', e => {
  const h = e.target.closest('[data-hide]'); if (!h) return;
  e.preventDefault(); e.stopPropagation();
  const v = h.dataset.hide;
  if (v === 'all') hideClear(); else if (v === 'list') hideOpenPanel(); else hideSet(v[0], +v.slice(1));
});
dbody.addEventListener('input', e => {
  const q = e.target; if (!q.classList || !q.classList.contains('hid-q')) return;
  const r = dbody.querySelector('.hid-res'); if (r) r.innerHTML = q.value.trim() ? hideFindHTML(q.value) : '';
});
hideUI();

/* =====================================================================
   KLANGKARTE – Fehler melden und sofort auf der eigenen Karte korrigieren
   Typische Fehler stammen aus den Quelldaten (z. B. gleicher Songtitel bei zwei Artists, falsche Vorschau, schiefes Genre). Jeder kann sie auf seiner Karte selbst beheben:
   - Artist: in einen anderen Kontinent verschieben (Artist fliegt hin, Farbe und Zuordnung folgen) oder dauerhaft von der Karte nehmen
   - Song: Vorschau entfernen oder dauerhaft von der Karte nehmen
   Korrekturen werden im Browser gespeichert (je Nutzer) und lassen sich unter Einstellungen > Korrekturen zuruecknehmen. Zusaetzlich kann eine Meldung vorbereitet werden
   (E-Mail oder Formular aus config.js: reportMail, reportUrl); gesammelte Meldungen lassen sich kopieren. Die Meldungen sollen spaeter fuer alle Karten geprueft werden.
   ===================================================================== */
const FXKEY = 'kk-fix:' + HUD.user;
const FXS = { a: [], k: [], pv: [], mv: {}, off: {}, sv: {}, gn: {}, rep: [] };          // gespeichert: Schluessel (Spotify-ID oder Name) der korrigierten Artists/Songs, Verschiebungen { artist: kontinent-schluessel }, Meldungen
const fxKA = a => a.sp || ('n:' + a.n), fxKT = t => t.sp || ('n:' + t.n + '|' + (t.art ? t.art.n : ''));
const fxKS = s => 'sc:' + (s.n0 != null ? s.n0 : s.de) + '|' + rkey(regs[s.r0 != null ? s.r0 : s.reg]);          // Szenen: Originalname + urspruenglicher Kontinent
const FX_BY = { a: new Map(), k: new Map(), s: new Map() };
art.forEach(a => FX_BY.a.set(fxKA(a), a.i)); trk.forEach(t => FX_BY.k.set(fxKT(t), t.i)); scs.forEach(s => FX_BY.s.set(fxKS(s), s.id));
function fxSave() { try { localStorage.setItem(FXKEY, JSON.stringify(FXS)); } catch (e) { } }
function fxCount() { FX.n = FX.a.size + FX.k.size; }
/* Zuordnung eines Artists zu einem anderen Kontinent (nur Daten: Mitglieder, Szene, Farbe, Summen) */
function fxAssign(a, newR, keepScene) {
  const old = a.r; if (old === newR || !regs[newR]) return false;
  const ro = regs[old], rn = regs[newR]; if (a.r0 == null) { a.r0 = a.r; a.s0 = a.s; a.px00 = a.px0; a.py00 = a.py0; }
  const rm = (arr, v) => { const k = arr.indexOf(v); if (k >= 0) arr.splice(k, 1); };
  rm(ro.members, a.i); if (!keepScene) rm(scs[a.s].members, a.i);
  let best = -1, bd = 1e18; scs.forEach((s, si) => { if (s.reg !== newR) return; const d = Math.hypot(s.bcx - a.bx, s.bcy - a.by); if (d < bd) { bd = d; best = si; } });
  const si = !keepScene && best >= 0 ? best : a.s, sOld = scs[a.s];
  if (!keepScene) { sOld.n = Math.max(0, sOld.n - 1); scs[si].n++; }
  ro.n = Math.max(0, ro.n - 1); rn.n++;
  a.r = newR; a.reg = rn; a.s = si; a.scn = scs[si]; rn.members.push(a.i); if (!keepScene) scs[si].members.push(a.i);
  const ho = toHsl(ro.rgbO), hn = toHsl(rn.rgbO), ha = toHsl(a.rgbOrig); a.rgbOrig = fromHsl(hn.h + (ha.h - ho.h), ha.s, ha.l);       // Farbton relativ zum neuen Kontinent
  setRegionColor(rn, rn.color, false);
  if (newR === a.r0) { a.px0 = a.px00; a.py0 = a.py00; }                                     // zurueck im Ursprungskontinent: Ausgangsposition im Grundlayout wieder gueltig
  else { let tj = -1, td = 1e18; rn.members.forEach(j => { if (j === a.i) return; const d = Math.hypot(art[j].bx - a.bx, art[j].by - a.by); if (d < td) { td = d; tj = j; } }); if (tj >= 0) { a.px0 = art[tj].px0; a.py0 = art[tj].py0; } }      // vorlaeufig: beim naechsten Mitglied des Zielkontinents (genaue Lage setzt fxLand)
  return true;
}
/* Schwerpunkt (Gewicht = Flaeche) der Mitglieder eines Kontinents ausser a: aktuell (cur) oder im Grundlayout */
function fxCen(r, ex, cur) { let cx = 0, cy = 0, w = 0; r.members.forEach(j => { if (j === ex) return; const b = art[j], q = b.bF * b.bF; cx += (cur ? b.bx : b.px0) * q; cy += (cur ? b.by : b.py0) * q; w += q; }); return w ? [cx / w, cy / w] : [0, 0]; }
/* Grundlayout-Position des verschobenen Artists = Schwerpunkt des Zielkontinents + Versatz (damit "Positionen zuruecksetzen" und spaetere Verschiebungen ihn am neuen Platz halten) */
function fxRebase(a, off) { const c = fxCen(a.reg, a.i, false); a.px0 = c[0] + off[0]; a.py0 = c[1] + off[1]; }
function fxLand(a) {
  const k = fxKA(a);
  if (a.r === a.r0) { delete FXS.off[k]; return; }
  const c = fxCen(a.reg, a.i, true); FXS.off[k] = [Math.round(a.bx - c[0]), Math.round(a.by - c[1])]; fxRebase(a, FXS.off[k]); delete RC.opos[a.i];
}
/* Ganze Szene in einen anderen Kontinent: alle Mitglieder wechseln mit, die Szene wandert in die Liste des Zielkontinents */
function fxAssignScene(s, newR) {
  const old = s.reg; if (old === newR || !regs[newR]) return false;
  if (s.r0 == null) s.r0 = old;
  const rm = (arr, v) => { const k = arr.indexOf(v); if (k >= 0) arr.splice(k, 1); };
  rm(regs[old].sc, s.id); regs[newR].sc.push(s.id); s.reg = newR;
  s.members.slice().forEach(i => fxAssign(art[i], newR, true));
  s.rgb = regs[newR].rgb; return true;
}
function fxFlyGroup(s, newR, done) {
  const st = RSIM; if (st.on) { rcSimRun(1200); if (st.on) { rcSimStop(); rcApply(); rcSimFinish(); } }
  const mem = s.members.slice(); if (!mem.length) { if (done) done(); return; }
  let cx = 0, cy = 0, w = 0; mem.forEach(i => { const a = art[i], q = a.bF * a.bF; cx += a.bx * q; cy += a.by * q; w += q; }); cx /= w; cy /= w;
  const inS = new Set(mem); let tgt = null, bd = 1e18; regs[newR].members.forEach(j => { if (inS.has(j)) return; const b = art[j], d = Math.hypot(b.bx - cx, b.by - cy); if (d < bd) { bd = d; tgt = b; } });
  if (!tgt) { if (done) done(); return; }
  if (RC.edit) rcEdit(false);
  rcSimStop(); rcGeo(); rcSimInit(mem); rcSetGroup(RSIM.R - 1, 'scene'); RSIM.on = true;
  RSIM.hx = tgt.bx - cx; RSIM.hy = tgt.by - cy; RSIM.release = true; RSIM.done = () => { mem.forEach(i => fxLand(art[i])); fxSave(); rcSave(); if (done) done(); };
  rcSimLoop();
}
function fxMoveScene(s, newR) {
  const k = fxKS(s), regKey = rkey(regs[newR]);
  if (!fxAssignScene(s, newR)) return;
  if (s.r0 === newR) delete FXS.sv[k]; else FXS.sv[k] = regKey;
  fxSave(); fxRefresh(); fxFlyGroup(s, newR, () => { fxRefresh(); applyLayout({ fit: false }); if (drawerTab === 'detail' || drawerTab === 'settings') renderDrawer(); });
}
/* Eigenes Genre: Artist und Song zeigen den Text statt der Tags, eine Szene bekommt ihn als Namen (Komma-getrennt) */
const fxTags = txt => String(txt).split(',').map(x => x.trim()).filter(Boolean).slice(0, 6);
function fxGenreKey(t, o) { return t === 'a' ? 'a:' + fxKA(o) : t === 'k' ? 'k:' + fxKT(o) : 's:' + fxKS(o); }
function fxGenreSet(t, o, txt, save) {
  const key = fxGenreKey(t, o);
  if (txt) FXS.gn[key] = txt; else delete FXS.gn[key];
  if (t === 's') { if (txt) { if (o.n0 == null) { o.n0 = o.de; o.en0 = o.en; } o.name = txt; o.en = ''; } else if (o.n0 != null) { o.name = o.n0; o.en = o.en0; } relines(); glowDirty = true; mmDirty = true; }
  else { if (txt) o.gx = fxTags(txt); else delete o.gx; }
  if (save) { fxSave(); requestDraw(); if (drawerTab === 'detail' || drawerTab === 'settings') renderDrawer(); }
}
function fxRefresh() { recompute(); rankings(); rcGeo(); updateRegionGeom(); rcColorsApplied(); }
/* Feste Korrekturen fuer eine bestimmte Karte (config.js: globalFix { benutzername: { hideArtists: ['Name'] } }), z. B. wenn stats.fm einem Artist fremde Streams zuordnet; nicht rueckgaengig machbar */
const FXG = new Set();
(function fxGlobal() {
  const g = ((window.__KK_CFG__ || {}).globalFix || {})[HUD.user]; if (!g || !Array.isArray(g.hideArtists)) return;
  art.forEach(a => { if (g.hideArtists.indexOf(a.n) >= 0) { FX.a.add(a.i); FXG.add(a.i); } }); fxCount();
})();
/* Beim Start: gespeicherte Korrekturen anwenden (vor den gespeicherten Positionen und Farben der Kontinente) */
(function fxLoad() {
  try {
    const o = JSON.parse(localStorage.getItem(FXKEY) || 'null'); if (!o) return;
    ['a', 'k', 'pv'].forEach(k => { FXS[k] = Array.isArray(o[k]) ? o[k].filter(x => typeof x === 'string') : []; });
    FXS.mv = o.mv && typeof o.mv === 'object' ? o.mv : {}; FXS.off = o.off && typeof o.off === 'object' ? o.off : {}; FXS.sv = o.sv && typeof o.sv === 'object' ? o.sv : {}; FXS.gn = o.gn && typeof o.gn === 'object' ? o.gn : {}; FXS.rep = Array.isArray(o.rep) ? o.rep.slice(-200) : [];
  } catch (e) { return; }
  FXS.a.forEach(k => { if (FX_BY.a.has(k)) FX.a.add(FX_BY.a.get(k)); });
  FXS.k.forEach(k => { if (FX_BY.k.has(k)) FX.k.add(FX_BY.k.get(k)); });
  FXS.pv.forEach(k => { const t = FX_BY.k.has(k) ? trk[FX_BY.k.get(k)] : null; if (t && t.pv) { t.pv0 = t.pv; t.pv = ''; } });
  Object.keys(FXS.mv).forEach(k => { const a = FX_BY.a.has(k) ? art[FX_BY.a.get(k)] : null, r = regs.find(r => rkey(r) === FXS.mv[k]); if (a && r && fxAssign(a, r.id) && FXS.off[k]) fxRebase(a, FXS.off[k]); });
  Object.keys(FXS.sv).forEach(k => { const s = FX_BY.s.has(k) ? scs[FX_BY.s.get(k)] : null, r = regs.find(r => rkey(r) === FXS.sv[k]); if (s && r && fxAssignScene(s, r.id)) s.members.forEach(i => { const o = FXS.off[fxKA(art[i])]; if (o) fxRebase(art[i], o); }); });
  Object.keys(FXS.gn).forEach(k => { const t = k[0], key = k.slice(2), o = t === 'a' ? (FX_BY.a.has(key) ? art[FX_BY.a.get(key)] : null) : t === 'k' ? (FX_BY.k.has(key) ? trk[FX_BY.k.get(key)] : null) : (FX_BY.s.has(key) ? scs[FX_BY.s.get(key)] : null); if (o) fxGenreSet(t, o, FXS.gn[k], false); });
  rcGeo(); fxCount();
})();
/* Verschieben mit der Simulation: der Artist fliegt zum naechsten Mitglied des Zielkontinents, die Nachbarn weichen aus */
function fxFly(a, newR, done) {
  const s = RSIM; if (s.on) { rcSimRun(1200); if (s.on) { rcSimStop(); rcApply(); rcSimFinish(); } }
  let tgt = null, bd = 1e18; regs[newR].members.forEach(j => { if (j === a.i) return; const b = art[j], d = Math.hypot(b.bx - a.bx, b.by - a.by); if (d < bd) { bd = d; tgt = b; } });
  if (!tgt) { if (done) done(); return; }
  if (RC.edit) rcEdit(false);
  rcSimStop(); rcGeo(); rcSimInit([a.i]); rcSetGroup(RSIM.R - 1, 'artist'); RSIM.on = true;
  RSIM.hx = tgt.bx - a.bx; RSIM.hy = tgt.by - a.by; RSIM.release = true; RSIM.done = () => { fxLand(a); fxSave(); rcSave(); if (done) done(); };
  rcSimLoop();
}
function fxMoveTo(a, newR) {
  const k = fxKA(a), regKey = rkey(regs[newR]);
  if (!fxAssign(a, newR)) return;
  if (a.r0 === newR) delete FXS.mv[k]; else FXS.mv[k] = regKey;          // zurueck im Ursprungskontinent: Eintrag entfaellt
  fxSave(); fxRefresh(); fxFly(a, newR, () => { fxRefresh(); applyLayout({ fit: false }); if (drawerTab === 'detail' || drawerTab === 'settings') renderDrawer(); });
}
/* ---------- Dialog ---------- */
function fixBtn(t, i) { return '<button class="btn" data-fix="' + t + i + '">Fehler melden</button>'; }
function fxMailText(rep) {
  return ['Tunelands – Fehlermeldung', 'Typ: ' + rep.kind + ' (' + ({ a: 'Artist', k: 'Song', s: 'Szene' })[rep.t] + ')', ({ a: 'Artist: ', k: 'Song: ', s: 'Szene: ' })[rep.t] + rep.name + (rep.by ? ' von ' + rep.by : ''), rep.reg ? 'Kontinent auf meiner Karte: ' + rep.reg : '', rep.to ? 'Vorschlag Kontinent: ' + rep.to : '', rep.suggest ? 'Eigenes Genre/Vorschlag: ' + rep.suggest : '', rep.note ? 'Anmerkung: ' + rep.note : '', 'ID: ' + rep.id, 'Sprache: ' + LANG].filter(Boolean).join('\n');
}
function fxSend(rep) {
  const cfg = window.__KK_CFG__ || {}, txt = fxMailText(rep);
  try { navigator.clipboard.writeText(txt).catch(() => { }); } catch (e) { }
  if (cfg.reportUrl) { window.open(cfg.reportUrl, '_blank', 'noopener'); toast('Meldung kopiert und Formular geöffnet'); return; }
  const to = cfg.reportMail || 'tunelands@proton.me';
  window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent('Tunelands: Fehler melden – ' + rep.name) + '&body=' + encodeURIComponent(txt);
  toast('Meldung vorbereitet und kopiert');
}
let fxCur = null;
function fxOpen(t, i) {
  fxCur = { t, i }; const el = $('fixdlg'), isA = t === 'a', isS = t === 's', o = isA ? art[i] : isS ? scs[i] : trk[i];
  const genreLab = isS ? 'Falscher Kontinent oder falsches Genre der Szene' : isA ? 'Falscher Kontinent oder falsches Genre' : 'Falsches Genre';
  let opts;
  if (isA) opts = [['genre', genreLab], ['hide', 'Gehört nicht auf meine Karte (z. B. falscher Song zugeordnet)'], ['other', 'Etwas anderes']];
  else if (isS) opts = [['genre', genreLab], ['other', 'Etwas anderes']];
  else { opts = [['genre', genreLab], ['preview', 'Die Vorschau gehört nicht zu diesem Song'], ['hide', 'Diesen Song habe ich nie gehört (falsch zugeordnet)'], ['other', 'Etwas anderes']]; if (!o.pv) opts.splice(1, 1); }
  $('fx-what').innerHTML = (isA ? 'Artist' : isS ? 'Szene' : 'Song') + ' <b>' + esc(o.n || o.name) + '</b>' + (isA || isS ? (isS ? ' <span>' + esc(regs[o.reg].name) + '</span>' : '') : ' <span>' + esc(o.a.map(x => art[x].n).join(', ')) + '</span>');
  $('fx-opts').innerHTML = opts.map((p, k) => '<label class="fx-opt"><input type="radio" name="fx-kind" value="' + p[0] + '"' + (k === 0 ? ' checked' : '') + '><span>' + p[1] + '</span></label>').join('');
  const cur = isA ? o.r : isS ? o.reg : -1;
  $('fx-reg').innerHTML = '<option value="">' + esc(T('Kontinent beibehalten')) + '</option>' + regs.filter(r => r.id !== cur).sort((x, y) => y.cm - x.cm).map(r => '<option value="' + r.id + '">' + esc(r.name) + '</option>').join('');
  $('fx-regl').classList.toggle('hidden', t === 'k');
  $('fx-sug').value = (isA ? o.gx : t === 'k' ? o.gx : null) ? (isA || t === 'k' ? o.gx.join(', ') : '') : ''; $('fx-note').value = ''; $('fx-send').checked = true; fxSync(); el.classList.add('show');
}
function fxSync() { const k = (document.querySelector('input[name="fx-kind"]:checked') || {}).value; $('fx-genre').classList.toggle('hidden', !(fxCur && k === 'genre')); }
function fxClose() { $('fixdlg').classList.remove('show'); fxCur = null; }
function fxApply() {
  if (!fxCur) return; const { t, i } = fxCur, kind = (document.querySelector('input[name="fx-kind"]:checked') || {}).value, isA = t === 'a', isS = t === 's', o = isA ? art[i] : isS ? scs[i] : trk[i];
  const rep = { id: Date.now().toString(36), d: new Date().toISOString().slice(0, 10), t, kind: ({ genre: 'Falscher Kontinent/Genre', hide: 'Gehört nicht auf die Karte', preview: 'Falsche Vorschau', other: 'Sonstiges' })[kind], name: isS ? o.name : o.n, by: t === 'k' ? o.a.map(x => art[x].n).join(', ') : '', reg: isA ? o.reg.name : isS ? regs[o.reg].name : o.art.reg.name, suggest: $('fx-sug').value.trim().slice(0, 120), note: $('fx-note').value.trim().slice(0, 300), to: '' };
  if (kind === 'genre') {
    const rv = t === 'k' ? '' : $('fx-reg').value, txt = $('fx-sug').value.trim().slice(0, 120);
    if (!rv && !txt) { toast('Bitte einen Kontinent wählen oder ein Genre eingeben'); return; }
    fxClose(); const nm = rep.name;
    if (txt) fxGenreSet(t, o, txt, true);
    if (rv) { const r = +rv; rep.to = regs[r].name; if (isA) fxMoveTo(o, r); else fxMoveScene(o, r); toast(T('Korrigiert:') + ' ' + nm + ' → ' + regs[r].name); }
    else toast(T('Korrigiert:') + ' ' + nm + ' → ' + txt);
  } else if (kind === 'hide') {
    fxClose(); if (isA) { FXS.a.push(fxKA(o)); FX.a.add(i); } else { FXS.k.push(fxKT(o)); FX.k.add(i); }
    fxCount(); fxSave(); hideApply(); toast('Korrigiert: nicht mehr auf der Karte');
  } else if (kind === 'preview') {
    fxClose(); if (audioId === i) stopPreview(); o.pv0 = o.pv; o.pv = ''; FXS.pv.push(fxKT(o)); fxSave(); if (drawerTab === 'detail') renderDrawer(); toast('Korrigiert: Vorschau entfernt');
  } else fxClose();
  FXS.rep.push(rep); fxSave(); if (drawerTab === 'settings') renderDrawer();
  if ($('fx-send').checked) fxSend(rep);
}
function fxUndo(kind, id) {
  if (kind === 'a') { if (FXG.has(id)) return; const a = art[id]; FX.a.delete(id); FXS.a = FXS.a.filter(k => k !== fxKA(a)); }
  else if (kind === 'k') { const t = trk[id]; FX.k.delete(id); FXS.k = FXS.k.filter(k => k !== fxKT(t)); }
  else if (kind === 'p') { const t = trk[id]; if (t.pv0) { t.pv = t.pv0; } FXS.pv = FXS.pv.filter(k => k !== fxKT(t)); }
  else if (kind === 'm') { const a = art[id]; if (a.r0 != null) fxMoveTo(a, a.r0); return; }
  else if (kind === 'c') { const s = scs[id]; if (s.r0 != null) fxMoveScene(s, s.r0); return; }
  else if (kind === 'n') { fxGenreSet('a', art[id], '', true); return; }
  else if (kind === 'q') { fxGenreSet('k', trk[id], '', true); return; }
  else if (kind === 'z') { fxGenreSet('s', scs[id], '', true); return; }
  fxCount(); fxSave(); hideApply(); if (drawerTab === 'detail') renderDrawer();
}
/* ---------- Einstellungen: Liste der Korrekturen ---------- */
function fixSettingsHTML() {
  const rows = [];
  FX.a.forEach(i => { if (!FXG.has(i)) rows.push(['Artist ausgeblendet', art[i].n, '', 'a' + i]); });
  FX.k.forEach(i => rows.push(['Song ausgeblendet', trk[i].n, trk[i].a.map(x => art[x].n).join(', '), 'k' + i]));
  trk.forEach(t => { if (t.pv0 && !t.pv) rows.push(['Vorschau entfernt', t.n, t.a.map(x => art[x].n).join(', '), 'p' + t.i]); });
  art.forEach(a => { const s = scs[a.s]; if (a.r0 != null && a.r !== a.r0 && !(s.r0 != null && s.reg !== s.r0)) rows.push(['Verschoben nach ' + a.reg.name, a.n, 'zuvor ' + regs[a.r0].name, 'm' + a.i]); });
  scs.forEach(s => { if (s.r0 != null && s.reg !== s.r0) rows.push(['Szene verschoben nach ' + regs[s.reg].name, s.name, 'zuvor ' + regs[s.r0].name, 'c' + s.id]); if (s.n0 != null && s.de !== s.n0) rows.push(['Szene umbenannt', s.name, 'zuvor ' + s.n0, 'z' + s.id]); });
  art.forEach(a => { if (a.gx) rows.push(['Eigenes Genre', a.n, a.gx.join(', '), 'n' + a.i]); }); trk.forEach(t => { if (t.gx) rows.push(['Eigenes Genre (Song)', t.n, t.gx.join(', '), 'q' + t.i]); });
  let h = '<div class="sect"><h3>Korrekturen</h3></div><div class="muted hid-intro">Fehler, die du über „Fehler melden“ in der Detailansicht eines Artists oder Songs korrigierst, gelten sofort auf dieser Karte und bleiben im Browser gespeichert. Hier kannst du sie zurücknehmen.</div>';
  h += rows.length ? rows.map(r => '<div class="hid-row"><div class="hid-t"><span class="hid-k">' + esc(r[0]) + '</span><b>' + esc(r[1]) + '</b>' + (r[2] ? '<small>' + esc(r[2]) + '</small>' : '') + '</div><button class="btn hid-b" data-fix="undo:' + r[3] + '">Rückgängig</button></div>').join('') : '<div class="muted hid-none">Noch keine Korrekturen.</div>';
  if (FXS.rep.length) h += '<div class="btns"><button class="btn" data-fix="copyrep">Meldungen kopieren (' + FXS.rep.length + ')</button></div>';
  return h;
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-fix]'); if (!b) return; const v = b.dataset.fix; e.preventDefault(); e.stopPropagation();
  if (v.startsWith('undo:')) { const r = v.slice(5); fxUndo(r[0], +r.slice(1)); }
  else if (v === 'copyrep') { const txt = FXS.rep.map(fxMailText).join('\n\n---\n\n'); try { navigator.clipboard.writeText(txt).then(() => toast('Meldungen kopiert'), () => window.prompt(T('Meldungen (alles kopieren):'), txt)); } catch (err) { window.prompt(T('Meldungen (alles kopieren):'), txt); } }
  else fxOpen(v[0], +v.slice(1));
});
$('fx-cancel').onclick = fxClose; $('fx-go').onclick = fxApply;
$('fixdlg').addEventListener('click', e => { if (e.target.id === 'fixdlg') fxClose(); });
$('fixdlg').addEventListener('change', fxSync);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('fixdlg').classList.contains('show')) fxClose(); });

/* =====================================================================
   KLANGKARTE – Community: Social-Links (Instagram, TikTok, YouTube) und Umfrage-Hinweis
   Der Hinweis erscheint einmal nach einer Weile auf der Karte (Standard 45 s Sichtzeit), laesst sich wegklicken und kommt dann hoechstens noch zweimal (fruehestens nach einem Tag).
   Einstellbar in config.js: social { instagram, tiktok, youtube }, surveyDelay (Millisekunden, 0 = aus), feedback (Umfrage-Link, ein Link oder { de, en }).
   ===================================================================== */
(function community() {
  const cfg = window.__KK_CFG__ || {}, SOC = Object.assign({ instagram: 'https://www.instagram.com/tunelands', tiktok: 'https://www.tiktok.com/@tunelands_maps', youtube: 'https://youtube.com/@tunelands-g3m' }, cfg.social || {});
  const handle = u => { const m = String(u).match(/(?:instagram\.com\/|tiktok\.com\/|youtube\.com\/)(@?[^/?#]+)/i); return m ? (m[1][0] === '@' ? m[1] : '@' + m[1]) : ''; };
  [['ig', 'instagram'], ['tt', 'tiktok'], ['yt', 'youtube']].forEach(([k, n]) => { const a = $('soc-' + k); if (!a) return; const q = $('qk-' + k); if (SOC[n]) { a.href = SOC[n]; $('soc-' + k + '-n').textContent = handle(SOC[n]); if (q) q.href = SOC[n]; } else { a.remove(); if (q) q.remove(); } });
  const pick = v => (v && typeof v === 'object') ? (v[LANG] || v.de || v.en || '') : (v || '');
  const surveyUrl = () => pick(cfg.survey || cfg.feedback);
  const dlg = $('community'), openDlg = on => { dlg.classList.toggle('show', on); if (on) { setMenu(false); $('soc-survey').classList.toggle('hidden', !surveyUrl()); } };
  $('t-social').onclick = () => openDlg(true); $('soc-close').onclick = () => openDlg(false);
  dlg.addEventListener('click', e => { if (e.target === dlg) openDlg(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && dlg.classList.contains('show')) openDlg(false); });
  const KEY = 'kk-survey', load = () => { try { return Object.assign({ s: 'new', n: 0, t: 0 }, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { return { s: 'new', n: 0, t: 0 }; } };
  const save = o => { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) { } };
  const card = $('survey'), hide = () => card.classList.add('hidden');
  function go() { const u = surveyUrl(); if (!u) return; const o = load(); o.s = 'done'; save(o); hide(); openDlg(false); window.open(u, '_blank', 'noopener'); }
  $('soc-survey').onclick = go; $('sv-go').onclick = go; $('qk-sv').onclick = go; if (surveyUrl()) $('qk-sv').classList.remove('hidden');
  const later = () => { const o = load(); o.n++; o.t = Date.now(); save(o); hide(); };
  $('sv-later').onclick = later; $('sv-x').onclick = later;
  $('sv-never').onclick = () => { const o = load(); o.s = 'never'; save(o); hide(); };
  const delay = cfg.surveyDelay == null ? 45000 : +cfg.surveyDelay;
  /* Ko-fi-Hinweis: nur mit gesetztem cfg.donate, nach kofiDelay Sichtzeit (Standard 4 Minuten), nie zugleich mit der Umfrage-Karte;
     "Spaeter" hoechstens zweimal (fruehestens nach 3 Tagen wieder), "Nicht mehr anzeigen" beendet ihn. */
  const KF = 'kk-kofi', kload = () => { try { return Object.assign({ s: 'new', n: 0, t: 0 }, JSON.parse(localStorage.getItem(KF) || '{}')); } catch (e) { return { s: 'new', n: 0, t: 0 }; } };
  const ksave = o => { try { localStorage.setItem(KF, JSON.stringify(o)); } catch (e) { } };
  const kcard = $('kofi'), khide = () => kcard.classList.add('hidden'), donateUrl = () => pick(cfg.donate);
  $('kf-go').onclick = () => { const u = donateUrl(); if (!u) return; const o = kload(); o.s = 'done'; ksave(o); khide(); window.open(u, '_blank', 'noopener'); };
  const klater = () => { const o = kload(); o.n++; o.t = Date.now(); ksave(o); khide(); };
  $('kf-later').onclick = klater; $('kf-x').onclick = klater;
  $('kf-never').onclick = () => { const o = kload(); o.s = 'never'; ksave(o); khide(); };
  const kdelay = cfg.kofiDelay == null ? 240000 : +cfg.kofiDelay, ko = kload();
  const kofiOk = !IS_ART && !!donateUrl() && kdelay > 0 && ko.s === 'new' && ko.n < 2 && Date.now() - ko.t > 3 * 864e5;
  const surveyOk = !IS_ART && !!surveyUrl() && delay > 0, o0 = load(), surveyDue = surveyOk && o0.s === 'new' && o0.n < 3 && Date.now() - o0.t >= 864e5;
  if (!surveyDue && !kofiOk) return;
  let seen = 0, shownSurvey = false;
  const busy = () => document.hidden || RC.edit || (typeof tour !== 'undefined' && tour.on) || document.body.classList.contains('clean') || document.querySelector('#help.show,#pdf.show,#community.show');
  const timer = setInterval(() => {
    if (busy()) return; seen += 1000;
    if (surveyDue && !shownSurvey && seen >= delay) { shownSurvey = true; card.classList.remove('hidden'); if (!kofiOk) clearInterval(timer); return; }
    if (kofiOk && seen >= kdelay && card.classList.contains('hidden')) { clearInterval(timer); kcard.classList.remove('hidden'); }
  }, 1000);
})();

/* =====================================================================
   KLANGKARTE – Einstellungen, Designs, Ansicht-Leiste, Übersicht/Legende
   ===================================================================== */
const SKEY = 'klangkarte-einstellungen-v2';
const DEF = { S: JSON.parse(JSON.stringify(S)), show: JSON.parse(JSON.stringify(show)), UI: { minimap: false, legend: false, mmPos: null, timeline: true } };
const TRANSIENT = ['view', 'objs', 'who'];      // werden nicht gespeichert (Start immer auf der Karte)
function loadSettings() {
  if (window.innerWidth <= 900) { UI.minimap = false; UI.legend = false; UI.timeline = false; }      // auf dem Handy standardmaessig aus
  try {
    const raw = localStorage.getItem(SKEY); if (!raw) return;
    const o = JSON.parse(raw);
    if (o.S) Object.keys(DEF.S).forEach(k => { if (!TRANSIENT.includes(k) && k in o.S && typeof o.S[k] === typeof DEF.S[k]) S[k] = o.S[k]; });
    if (o.show) Object.keys(DEF.show).forEach(k => { if (typeof o.show[k] === 'boolean') show[k] = o.show[k]; });
    if (o.UI) { UI.minimap = o.UI.minimap !== false; UI.legend = o.UI.legend !== false; if (typeof o.UI.timeline === 'boolean') UI.timeline = o.UI.timeline; UI.mmPos = o.UI.mmPos && typeof o.UI.mmPos.x === 'number' ? o.UI.mmPos : null; }
  } catch (e) { }
}
function saveSettings() {
  try { const s = {}; Object.keys(S).forEach(k => { if (!TRANSIENT.includes(k)) s[k] = S[k]; }); localStorage.setItem(SKEY, JSON.stringify({ S: s, show, UI: { minimap: UI.minimap, legend: UI.legend, mmPos: UI.mmPos, timeline: UI.timeline } })); } catch (e) { }
}

/* ---------- Anwenden ---------- */
function applyTheme() {
  TH = THEMES[S.theme] || THEMES.night;
  document.documentElement.setAttribute('data-theme', S.theme);
  const meta = document.querySelector('meta[name="color-scheme"]'); if (meta) meta.setAttribute('content', TH.ui === 'light' ? 'light' : 'dark');
  dust = null; glowDirty = true; mmDirty = true; drawTimeline(); requestDraw();
}
function applyFont() {
  FONT = FONTS[S.font] || FONTS.sans; document.documentElement.style.setProperty('--font', FONT);
  textW.clear(); drawTimeline(); mmDirty = true; requestDraw();
}
const REACT = {
  theme: 'theme', font: 'font', fontScale: 'draw', labelDensity: 'draw', regionLabels: 'draw', regionSize: 'draw', sceneLabels: 'draw', stars: 'draw', glowAmt: 'glow',
  view: 'view', objs: 'view', rowDir: 'view', gridCols: 'view', gridRows: 'view', metric: 'metric', timeMode: 'time', sizeCurve: 'layout', artScale: 'layout', songScale: 'layout', spread: 'layout', moonScale: 'draw',
  colorMode: 'recolor', linkAmt: 'draw', rings: 'draw', followCam: 'none', animSpeed: 'none', topN: 'layout', minMin: 'layout', minStr: 'layout', perf: 'perf', who: 'who', cmpMode: 'recolor', cmpMe: 'recolor', cmpFr: 'recolor'
};
function setSetting(key, val, opts) {
  opts = opts || {};
  if (typeof DEF.S[key] === 'number' && typeof val === 'string') val = parseFloat(val);
  if (S[key] === val && !opts.force) return;
  S[key] = val;
  switch (REACT[key]) {
    case 'theme': applyTheme(); break;
    case 'font': applyFont(); break;
    case 'view': applyLayout({ fit: 'force' }); break;
    case 'metric': assignValues(); rankings(); drawTimeline(); onRangeChange(); applyLayout({ fit: false }); break;
    case 'time': renderPresets(); applyLayout({ fit: 'force' }); break;
    case 'layout': scheduleLayout(30); break;
    case 'recolor': recolor(); break;
    case 'glow': glowDirty = true; requestDraw(); break;
    case 'who': setWho(val); return;
    case 'perf': resize(); setGlowBounds(); mmFit(); glowDirty = true; mmDirty = true; textW.clear(); requestDraw(); break;
    case 'none': break;
    default: mmDirty = true; requestDraw();
  }
  saveSettings(); syncSettingsUI(opts.fromPanel);
}
function setShow(key, on) { show[key] = on; if (key === 'songs' || key === 'links' || key === 'labels') { requestDraw(); } saveSettings(); syncSettingsUI(true); }
function setUI(key, on) {
  UI[key] = on; $(key === 'minimap' ? 'minimap' : 'legend').classList.toggle('hidden', !on);
  if (key === 'minimap' && on) { mmResize(); mmDirty = true; placeMinimap(); }
  saveSettings(); syncSettingsUI(true); requestDraw();
}

/* ---------- Ansicht-Leiste, Werkzeuge ---------- */
function syncSettingsUI(skipPanel) {
  document.querySelectorAll('[data-set]').forEach(g => { const k = g.dataset.set; g.querySelectorAll('button[data-v]').forEach(b => b.classList.toggle('on', String(S[k]) === b.dataset.v)); });
  const vo = $('vb-objs'); if (vo) vo.classList.toggle('off', S.view === 'map');
  const T = (id, on) => { const e = $(id); if (e) e.classList.toggle('on', !!on); };
  T('t-timeline', UI.timeline); T('t-clean', UI.clean);
  T('t-songs', show.songs); T('t-links', show.links); T('t-labels', show.labels); T('t-regions', S.regionLabels); T('t-minimap', UI.minimap); T('t-legend', UI.legend);
  if (!skipPanel && drawerTab === 'settings') renderDrawer();
}
const THEME_SW = {
  night: 'radial-gradient(circle at 35% 40%,#1a2240,#080a14 70%)', black: 'radial-gradient(circle at 35% 40%,#101016,#000 70%)',
  paper: 'radial-gradient(circle at 35% 40%,#faf5ea,#e3dac4 80%)', ocean: 'radial-gradient(circle at 35% 40%,#14506a,#041823 75%)',
  forest: 'radial-gradient(circle at 35% 40%,#1a4030,#040a07 75%)',
  dusk: 'radial-gradient(circle at 35% 40%,#3a2a66,#080614 75%)',
  wine: 'radial-gradient(circle at 35% 40%,#4a1a2c,#0a0307 75%)',
  ember: 'radial-gradient(circle at 35% 40%,#46301a,#090502 75%)',
  slate: 'radial-gradient(circle at 35% 40%,#2c3540,#07090b 75%)',
  sky: 'radial-gradient(circle at 35% 40%,#f2f8fd,#cfe0ee 80%)',
  rose: 'radial-gradient(circle at 35% 40%,#fdf3f4,#ebd2d6 80%)'
};
const rowSeg = (key, label, opts, hint) => '<div class="set-row"><div class="lb">' + label + (hint ? '<small>' + hint + '</small>' : '') + '</div><div class="ctrl"><div class="seg sm" data-set="' + key + '">' + opts.map(o => '<button data-v="' + o[0] + '" class="' + (String(S[key]) === String(o[0]) ? 'on' : '') + '">' + o[1] + '</button>').join('') + '</div></div></div>';
const FMT = { gridCols: v => v ? String(v) : 'Auto', gridRows: v => v ? String(v) : 'Auto', minMin: v => v + ' min', minStr: v => v + '×',  artScale: v => v.toFixed(2) + '×', songScale: v => v.toFixed(2) + '×', spread: v => v.toFixed(2) + '×', moonScale: v => Math.round(v * 100) + ' %', labelDensity: v => v.toFixed(1) + '×', regionSize: v => v.toFixed(1) + '×', fontScale: v => Math.round(v * 100) + ' %', linkAmt: v => v.toFixed(1) + '×', glowAmt: v => v.toFixed(1) + '×' };
const rowRange = (key, label, min, max, step, hint) => '<div class="set-row"><div class="lb">' + label + (hint ? '<small>' + hint + '</small>' : '') + '</div><div class="ctrl"><input type="range" min="' + min + '" max="' + max + '" step="' + step + '" value="' + S[key] + '" data-range="' + key + '" aria-label="' + label + '"><span class="val" id="v-' + key + '">' + FMT[key](S[key]) + '</span></div></div>';
const rowNum = (key, label, min, max, step, hint) => '<div class="set-row"><div class="lb">' + label + (hint ? '<small>' + hint + '</small>' : '') + '</div><div class="ctrl"><input type="range" min="' + min + '" max="' + max + '" step="' + step + '" value="' + Math.min(max, S[key]) + '" data-range="' + key + '" aria-label="' + label + '"><input class="num" type="number" inputmode="numeric" min="' + min + '" step="' + step + '" value="' + S[key] + '" data-num="' + key + '" aria-label="' + label + ' (Zahl eingeben)"></div></div>';
const rowSwitch = (attr, key, on, label, hint) => '<div class="set-row"><div class="lb">' + label + (hint ? '<small>' + hint + '</small>' : '') + '</div><div class="ctrl"><label class="switch"><input type="checkbox" ' + attr + '="' + key + '"' + (on ? ' checked' : '') + ' aria-label="' + label + '"><span></span></label></div></div>';
function settingsHTML() {
  let h = '<div class="muted" style="margin-bottom:6px;line-height:1.5">Alles wird in deinem Browser gespeichert.</div>';
  h += presetsHTML();
  h += '<div class="sect"><h3>Ansicht</h3></div>'
    + rowSeg('view', 'Darstellung', [['map', 'Karte'], ['rows', 'Reihen'], ['spiral', 'Spirale']], 'Reihen und Spirale ordnen nach Größe, ohne Genre-Nähe.')
    + rowSeg('objs', 'Objekte (Reihen/Spirale)', [['artists', 'Artists'], ['songs', 'Songs']])
    + rowSeg('rowDir', 'Anordnung der Reihen', [['h', 'Waagerecht'], ['v', 'Senkrecht']], 'Gilt für die Ansicht „Reihen“: Die Größten stehen zuerst, waagerecht Zeile für Zeile oder senkrecht Spalte für Spalte.')
    + rowNum('gridCols', 'Spalten', 0, 40, 1, 'Anzahl pro Zeile (waagerecht). 0 = automatisch.')
    + rowNum('gridRows', 'Zeilen', 0, 80, 1, 'Anzahl pro Spalte (senkrecht). 0 = automatisch.')
    + rowSeg('metric', 'Größe nach', [['min', 'Hörzeit'], ['str', 'Streams']], 'Die Kreise wachsen und schrumpfen animiert.')
    + rowSeg('timeMode', 'Zeitraum-Modus', [['dynamic', 'Dynamisch'], ['fixed', 'Fest']], 'Dynamisch: Die Karte ordnet sich neu an und zeigt nur, was im Zeitraum gehört wurde. Fest: Alle Plätze bleiben, nur die Größe ändert sich.')
    + rowSwitch('data-sw', 'followCam', S.followCam, 'Kamera folgt der Karte', 'Passt den Ausschnitt an, wenn sich die Karte stark verändert.')
    + rowSeg('animSpeed', 'Animationstempo', [[.6, 'Langsam'], [1, 'Normal'], [1.8, 'Schnell']]);
  h += '<div class="sect"><h3>Leistung</h3></div>'
    + rowSeg('perf', 'Qualität', [['min', 'Minimal'], ['balanced', 'Ausgewogen'], ['max', 'Maximal']], 'Minimal: niedrige Auflösung, kein Nebel, wenige Namen (schwache Geräte). Maximal: volle Bildschirm-Auflösung, scharfer Nebel in hoher Auflösung, mehr Namen. Bei Rucklern auf Minimal stellen.');
  h += '<div class="sect"><h3>Filter</h3></div>'
    + rowSeg('topN', 'Nur die größten zeigen', [[0, 'Alle'], [250, '250'], [100, '100'], [50, '50'], [25, '25'], [10, '10']], 'Gilt für Artists (Karte, Reihen, Spirale) bzw. für Songs in der Songs-Ansicht.')
    + '<div class="set-row"><div class="lb">… oder genaue Anzahl<small>0 = alle</small></div><div class="ctrl"><input class="num" type="number" inputmode="numeric" min="0" step="1" value="' + S.topN + '" data-num="topN" aria-label="Anzahl eingeben"></div></div>'
    + rowNum('minMin', 'Mindest-Hörzeit (Minuten)', 0, 300, 1, 'Blendet alles unter dieser Zeit aus (im gewählten Zeitraum).')
    + rowNum('minStr', 'Mindest-Streams', 0, 100, 1, 'Blendet alles mit weniger Streams aus.');
  h += hideSettingsHTML();
  h += fixSettingsHTML();
  h += '<div class="sect"><h3>Größen und Abstand</h3></div>'
    + rowSeg('sizeCurve', 'Größenskala', [['soft', 'Gestaucht'], ['sqrt', 'Normal'], ['strong', 'Verstärkt']], 'Gestaucht: Kleine Objekte werden größer, große weniger dominant.')
    + rowRange('artScale', 'Artists', .5, 2, .05) + rowRange('songScale', 'Songs und Monde', .5, 2.5, .05)
    + rowRange('spread', 'Abstand der Objekte', .7, 2, .05, 'Zieht die Karte auseinander (mehr Freiraum).') + rowRange('moonScale', 'Monde: Größe in der Bahn', .6, 1, .02, 'Kleiner = mehr Luft zwischen den Songs.');
  h += '<div class="sect"><h3>Beschriftung</h3></div>'
    + rowSwitch('data-show', 'labels', show.labels, 'Artist- und Song-Namen')
    + rowRange('labelDensity', 'Dichte der Namen', .4, 2, .1, 'Mehr = mehr Namen gleichzeitig.')
    + rowSwitch('data-sw', 'regionLabels', S.regionLabels, 'Kontinent-Namen') + rowRange('regionSize', 'Größe der Kontinent-Namen', .5, 1.8, .1)
    + rowSwitch('data-sw', 'sceneLabels', S.sceneLabels, 'Szenen-Namen')
    + '<div class="set-row"><div class="lb">Schriftart</div><div class="ctrl"><select data-sel="font" aria-label="Schriftart">' + [['sans', 'Standard'], ['serif', 'Serif'], ['mono', 'Monospace'], ['round', 'Rund']].map(o => '<option value="' + o[0] + '"' + (S.font === o[0] ? ' selected' : '') + '>' + o[1] + '</option>').join('') + '</select></div></div>'
    + rowRange('fontScale', 'Schriftgröße', .8, 1.5, .05);
  h += '<div class="sect"><h3>Farben und Linien</h3></div>'
    + rowSeg('colorMode', 'Färbung', [['region', 'Kontinent'], ['heat', 'Hörzeit'], ['new', 'Entdeckung']].concat(CMP ? [['who', 'Wer hört mehr']] : []), 'Hörzeit: kalt nach warm. Entdeckung: von alt nach neu.')
    + (CMP ? rowSeg('cmpMode', 'Vergleichsfarben', [['excl', 'Nur einer / beide'], ['ramp', 'Verlauf']], 'Nur einer / beide: leuchtend = nur eine Person hat es gehört, blass = beide.') + cmpColorRows() : '')
    + rowSwitch('data-show', 'songs', show.songs, 'Songs als Monde') + rowSwitch('data-sw', 'rings', S.rings, 'Orbit-Ringe')
    + rowSwitch('data-show', 'links', show.links, 'Verbindungslinien') + rowRange('linkAmt', 'Stärke der Linien', 0, 2, .1)
    + rowRange('glowAmt', 'Leuchten und Nebel', 0, 2, .1);
  h += '<div class="sect"><h3>Design</h3></div><div class="theme-grid">'
    + Object.keys(THEMES).map(k => '<button class="theme-tile' + (S.theme === k ? ' on' : '') + '" data-theme-pick="' + k + '"><div class="sw" style="background:' + THEME_SW[k] + '"><i style="left:16%;top:26%;background:#ffb27a"></i><i style="left:44%;top:50%;background:#8fb6ff;width:9px;height:9px"></i><i style="left:70%;top:24%;background:#c4a1ff;width:15px;height:15px"></i></div>' + THEMES[k].name + '</button>').join('')
    + '</div>' + rowSwitch('data-sw', 'stars', S.stars, 'Sterne im Hintergrund');
  h += '<div class="sect"><h3>Anzeige</h3></div>'
    + rowSwitch('data-ui', 'minimap', UI.minimap, 'Übersicht (Minimap)', 'Lässt sich auch verschieben und mit dem x schließen.') + rowSwitch('data-ui', 'legend', UI.legend, 'Legende');
  h += rcHTML();
  h += '<div class="sect"><h3>Sprache</h3></div><div class="set-row"><div class="lb">Sprache</div><div class="ctrl"><div class="seg sm" data-lang="1"><button data-v="de" class="' + (LANG === 'de' ? 'on' : '') + '">Deutsch</button><button data-v="en" class="' + (LANG === 'en' ? 'on' : '') + '">English</button></div></div></div>';
  h += '<div class="btns"><button class="btn" data-act="reset-settings">Alle Einstellungen zurücksetzen</button></div>';
  return h;
}
/* Delegation fuer Segmente, Schalter, Regler (Ansicht-Leiste + Panel) */
document.addEventListener('click', e => {
  const lg = e.target.closest('[data-lang] button[data-v]'); if (lg) { setLanguage(lg.dataset.v); return; }
  const b = e.target.closest('[data-set] button[data-v]');
  if (b) { setSetting(b.closest('[data-set]').dataset.set, b.dataset.v, { fromPanel: !!b.closest('#dbody') }); return; }
  const tp = e.target.closest('[data-theme-pick]'); if (tp) { setSetting('theme', tp.dataset.themePick); return; }
  if (e.target.closest('[data-act="reset-settings"]')) resetSettings();
});
document.addEventListener('change', e => {
  const t = e.target;
  if (t.dataset.num) {
    const k = t.dataset.num; const v = Math.max(0, Math.round(parseFloat(t.value) || 0)); t.value = v;
    const sl = document.querySelector('input[data-range="' + k + '"]'); if (sl) sl.value = Math.min(+sl.max, v);
    setSetting(k, v, { fromPanel: true }); syncSegOnly(); return;
  }
  if (t.dataset.sw) setSetting(t.dataset.sw, t.checked, { fromPanel: true });
  else if (t.dataset.show) setShow(t.dataset.show, t.checked);
  else if (t.dataset.ui) setUI(t.dataset.ui, t.checked);
  else if (t.dataset.sel) setSetting(t.dataset.sel, t.value, { fromPanel: true });
});
document.addEventListener('input', e => {
  const t = e.target; if (!t.dataset || !t.dataset.range) return;
  const k = t.dataset.range, v = parseFloat(t.value); const lab = $('v-' + k); if (lab) lab.textContent = FMT[k](v);
  const nb = document.querySelector('input[data-num="' + k + '"]'); if (nb) nb.value = v;
  setSetting(k, v, { fromPanel: true });
});
function syncSegOnly() { document.querySelectorAll('[data-set]').forEach(g => { const k = g.dataset.set; g.querySelectorAll('button[data-v]').forEach(b => b.classList.toggle('on', String(S[k]) === b.dataset.v)); }); }
function resetSettings() {
  Object.keys(DEF.S).forEach(k => { if (!TRANSIENT.includes(k)) S[k] = DEF.S[k]; });
  Object.assign(show, DEF.show); UI.minimap = DEF.UI.minimap; UI.legend = DEF.UI.legend; UI.mmPos = null;
  $('minimap').classList.remove('hidden'); $('legend').classList.remove('hidden'); placeMinimap();
  applyTheme(); applyFont(); recolor(); assignValues(); rankings(); onRangeChange(); renderPresets(); applyLayout({ fit: 'force' });
  saveSettings(); syncSettingsUI(); toast('Einstellungen zurückgesetzt');
}

/* ---------- Übersicht: verschiebbar und schließbar ---------- */
function placeMinimap() {
  const m = $('minimap'); if (!UI.mmPos || window.innerWidth <= 900) { m.style.left = m.style.top = m.style.bottom = ''; return; }
  const r = m.getBoundingClientRect();
  const x = clamp(UI.mmPos.x, 4, Math.max(4, window.innerWidth - r.width - 4)), y = clamp(UI.mmPos.y, 4, Math.max(4, window.innerHeight - r.height - 4));
  m.style.left = x + 'px'; m.style.top = y + 'px'; m.style.bottom = 'auto';
}
(function () {
  const head = $('mm-head'), box = $('minimap'); let st = null;
  head.addEventListener('pointerdown', e => {
    if (e.target.closest('#mm-close')) return;
    head.setPointerCapture(e.pointerId); const r = box.getBoundingClientRect(); st = { dx: e.clientX - r.left, dy: e.clientY - r.top }; head.classList.add('drag'); e.preventDefault();
  });
  head.addEventListener('pointermove', e => {
    if (!st) return; UI.mmPos = { x: e.clientX - st.dx, y: e.clientY - st.dy }; placeMinimap();
  });
  const end = () => { if (st) { st = null; head.classList.remove('drag'); saveSettings(); } };
  head.addEventListener('pointerup', end); head.addEventListener('pointercancel', end);
  $('mm-close').addEventListener('click', () => setUI('minimap', false));
  $('lg-close').addEventListener('click', () => setUI('legend', false));
  window.addEventListener('resize', placeMinimap);
})();

/* ---------- Einstellungen: Gruppen einklappbar (am Handy standardmaessig zu) und durchsuchbar ---------- */
let setQ = '', foldPref = {};
try { foldPref = JSON.parse(localStorage.getItem('kk-folds') || '{}') || {}; } catch (e) { }
const foldIsOpen = t => (t in foldPref) ? !!foldPref[t] : innerWidth > 900;
function foldSave() { try { localStorage.setItem('kk-folds', JSON.stringify(foldPref)); } catch (e) { } }
function settingsFold() {
  const groups = []; let cur = null;
  Array.from(dbody.children).forEach(k => {
    if (k.classList.contains('sect') && k.querySelector('h3')) { cur = { head: k, kids: [], title: k.querySelector('h3').textContent.trim() }; groups.push(cur); }
    else if (cur) cur.kids.push(k);
  });
  groups.forEach(g => {
    const f = document.createElement('div'), b = document.createElement('div'); f.className = 'fold'; f.dataset.t = g.title; b.className = 'fold-body';
    dbody.insertBefore(f, g.head); g.head.classList.add('fold-h'); f.appendChild(g.head); f.appendChild(b); g.kids.forEach(k => b.appendChild(k));
  });
  dbody.insertAdjacentHTML('afterbegin', '<input class="set-search" type="search" autocomplete="off" spellcheck="false" placeholder="' + esc(T('Einstellungen suchen …')) + '" value="' + esc(setQ) + '" aria-label="' + esc(T('Einstellungen suchen …')) + '">');
  settingsFilter();
}
function settingsFilter() {
  const q = setQ.trim().toLowerCase();
  dbody.querySelectorAll('.fold').forEach(f => {
    const title = f.dataset.t, titleHit = !!q && title.toLowerCase().includes(q); let any = false;
    Array.from(f.querySelector('.fold-body').children).forEach(c => { const hit = !q || titleHit || c.textContent.toLowerCase().includes(q); c.style.display = hit ? '' : 'none'; if (hit) any = true; });
    f.style.display = (any || !q) ? '' : 'none';
    f.classList.toggle('closed', q ? false : !foldIsOpen(title));
  });
}
function openFoldOf(el) { const f = el && el.closest && el.closest('.fold'); if (f) { foldPref[f.dataset.t] = true; foldSave(); settingsFilter(); } }
dbody.addEventListener('input', e => { if (e.target.classList && e.target.classList.contains('set-search')) { setQ = e.target.value; settingsFilter(); } });
dbody.addEventListener('click', e => {
  const h = e.target.closest('.fold-h'); if (!h || setQ.trim()) return; const f = h.closest('.fold');
  foldPref[f.dataset.t] = f.classList.contains('closed'); foldSave(); settingsFilter();
});

/* =====================================================================
   KLANGKARTE – Presets: Erscheinungsbild (alle Einstellungen + Farbschema der Kontinente) anwenden, speichern, kopieren und einfuegen
   Ein Preset ist ein kleines Objekt { n: Name, s: Einstellungen, sh: Ein-/Aus-Schalter, ui: Uebersicht/Legende, c: Farben je Kontinent | cs: Farbschema }.
   Eigene Presets liegen im Browser (kk-presets); als Text 'KP1:...' lassen sie sich einzeln oder als Sammlung teilen. Nicht enthalten: Layout der Kontinente (dafuer gibt es den Layout-Code),
   Ansicht/Objekte (fluechtig), Qualitaetsstufe (haengt vom Geraet ab). Beim Anwenden werden nur die Werte gesetzt, die das Preset enthaelt.
   ===================================================================== */
const PP_KEY = 'kk-presets';
const PP_SKIP = ['perf'];
const PP_RANGE = { fontScale: [.8, 1.5], labelDensity: [.4, 2], regionSize: [.5, 1.8], glowAmt: [0, 2], artScale: [.5, 2], songScale: [.5, 2.5], spread: [.7, 2], moonScale: [.6, 1], linkAmt: [0, 2], animSpeed: [.6, 1.8], gridCols: [0, 40], gridRows: [0, 80], topN: [0, 100000], minMin: [0, 10000], minStr: [0, 10000] };
const PP_ENUM = { sizeCurve: ['soft', 'sqrt', 'strong'], metric: ['min', 'str'], timeMode: ['dynamic', 'fixed'], rowDir: ['h', 'v'], colorMode: ['region', 'heat', 'new'] };
function ppBuilt() {
  const look = ['theme', 'font', 'fontScale', 'labelDensity', 'regionLabels', 'regionSize', 'sceneLabels', 'stars', 'glowAmt', 'sizeCurve', 'artScale', 'songScale', 'spread', 'moonScale', 'colorMode', 'linkAmt', 'rings', 'topN'];
  const std = {}; look.concat(['metric', 'timeMode', 'followCam', 'animSpeed', 'minMin', 'minStr']).forEach(k => { std[k] = DEF.S[k]; });
  return [
    { id: 'std', n: 'Standard', d: 'Das Standard-Preset von Tunelands', s: std, sh: { songs: true, links: true, labels: true }, ui: { minimap: false, legend: false }, cs: 'std' },
    { id: 'calm', n: 'Ruhig', d: 'Wenige Namen, kaum Linien, Pastellfarben', s: { labelDensity: .6, sceneLabels: false, linkAmt: .3, glowAmt: .7, stars: false, rings: false }, sh: { songs: false, links: true, labels: true }, cs: 'pastel' },
    { id: 'paper', n: 'Papier', d: 'Helles Design mit Serifenschrift', s: { theme: 'paper', font: 'serif', glowAmt: .6, stars: false }, cs: 'pastel' },
    { id: 'neon', n: 'Neon', d: 'Tiefschwarz mit starkem Leuchten und kräftigen Farben', s: { theme: 'black', glowAmt: 1.6, linkAmt: 1.3 }, cs: 'vivid' },
    { id: 'ocean', n: 'Ozean', d: 'Blaues Design mit runder Schrift', s: { theme: 'ocean', font: 'round' }, cs: 'spectrum' },
    { id: 'big', n: 'Groß und lesbar', d: 'Große Schrift und Kreise, Übersicht und Legende aus (für das Handy)', s: { fontScale: 1.3, labelDensity: .8, regionSize: 1.3, artScale: 1.2 }, ui: { minimap: false, legend: false } },
    { id: 'top', n: 'Nur die Großen', d: 'Die 50 größten Artists, viele Namen, keine Monde', s: { topN: 50, labelDensity: 1.4 }, sh: { songs: false, links: true, labels: true } },
    { id: 'rich', n: 'Detailreich', d: 'Viele Namen, mehr Abstand, Songs als Monde', s: { labelDensity: 1.6, spread: 1.3, songScale: 1.2, rings: true }, sh: { songs: true, links: true, labels: true } }
  ];
}
function ppLoad() { try { const a = JSON.parse(localStorage.getItem(PP_KEY) || '[]'); return Array.isArray(a) ? a.filter(o => o && typeof o.n === 'string') : []; } catch (e) { return []; } }
function ppStore(a) { try { localStorage.setItem(PP_KEY, JSON.stringify(a)); return true; } catch (e) { toast('Speichern nicht möglich (der Browser blockiert den Speicher)'); return false; } }
function ppCurrent(name) {
  const s = {}; Object.keys(DEF.S).forEach(k => { if (!TRANSIENT.includes(k) && !PP_SKIP.includes(k)) s[k] = S[k]; });
  return { n: name, s, sh: Object.assign({}, show), ui: { minimap: UI.minimap, legend: UI.legend }, c: Object.assign({}, RC.colors) };
}
function ppEncode(x) { return 'KP1:' + btoa(unescape(encodeURIComponent(JSON.stringify(x)))); }
function ppDecode(code) {
  try {
    const o = JSON.parse(decodeURIComponent(escape(atob(String(code).trim().replace(/^KP1:/, ''))))), a = (Array.isArray(o) ? o : [o]).filter(x => x && typeof x === 'object' && (x.s || x.c || x.cs));
    return a.length ? a.map(x => ({ n: String(x.n || 'Preset').slice(0, 40), s: x.s && typeof x.s === 'object' ? x.s : {}, sh: x.sh, ui: x.ui, c: x.c && typeof x.c === 'object' ? x.c : undefined, cs: typeof x.cs === 'string' ? x.cs : undefined })) : null;
  } catch (e) { return null; }
}
/* Preset anwenden: Werte pruefen und setzen, Farben, dann alles neu aufbauen (wie beim Zuruecksetzen der Einstellungen) */
function ppApply(o) {
  const s = o.s || {};
  Object.keys(DEF.S).forEach(k => {
    if (TRANSIENT.includes(k) || PP_SKIP.includes(k) || !(k in s) || typeof s[k] !== typeof DEF.S[k]) return;
    let v = s[k];
    if (k === 'theme' && !THEMES[v]) return; if (k === 'font' && !FONTS[v]) return;
    if (PP_ENUM[k] && !PP_ENUM[k].includes(v)) return;
    if (PP_RANGE[k]) { if (!isFinite(v)) return; v = clamp(v, PP_RANGE[k][0], PP_RANGE[k][1]); if (k === 'topN' || k === 'minMin' || k === 'minStr') v = Math.round(v); }
    S[k] = v;
  });
  if (o.sh) Object.keys(DEF.show).forEach(k => { if (typeof o.sh[k] === 'boolean') show[k] = o.sh[k]; });
  if (o.ui) {
    if (typeof o.ui.minimap === 'boolean') UI.minimap = o.ui.minimap; if (typeof o.ui.legend === 'boolean') UI.legend = o.ui.legend;
    $('minimap').classList.toggle('hidden', !UI.minimap); $('legend').classList.toggle('hidden', !UI.legend); if (UI.minimap) { mmResize(); mmDirty = true; placeMinimap(); }
  }
  if (o.cs === 'std') { rcStdColors(); rcSave(); }
  else if (o.cs && ['orig', 'spectrum', 'pastel', 'vivid'].includes(o.cs)) rcPreset(o.cs);
  else if (o.c) { regs.forEach(r => { const h = o.c[rkey(r)]; setRegionColor(r, /^#[0-9a-f]{6}$/i.test(h) ? h : r.color0, false); }); rcSave(); }
  applyTheme(); applyFont(); recolor(); assignValues(); rankings(); onRangeChange(); renderPresets(); applyLayout({ fit: 'force' });
  saveSettings(); syncSettingsUI(); glowDirty = true; mmDirty = true; requestDraw();
}
const ppName = o => o.id ? T(o.n) : o.n;
function presetsHTML() {
  const my = ppLoad();
  let h = '<div class="sect"><h3>Presets <em>Erscheinungsbild</em></h3></div>';
  h += '<div class="muted" style="margin:0 0 8px;font-size:12px;line-height:1.5">Ein Preset bündelt alle Einstellungen und das Farbschema der Kontinente. Zum Teilen kopieren und beim anderen einfügen (die Lage der Kontinente gehört nicht dazu, dafür gibt es „Layout kopieren“).</div>';
  h += '<div class="pp-grid">' + ppBuilt().map(b => '<button class="btn" data-pp="b:' + b.id + '" title="' + esc(T(b.d)) + '">' + esc(T(b.n)) + '</button>').join('') + '</div>';
  if (my.length) h += '<div class="pp-list">' + my.map((o, i) => '<div class="pp-row"><button class="pp-name" data-pp="u:' + i + '" title="' + esc(T('Anwenden')) + '">' + esc(o.n) + '</button><button class="pp-ic" data-pp="c:' + i + '" title="' + esc(T('Kopieren')) + '" aria-label="' + esc(T('Kopieren')) + '">⧉</button><button class="pp-ic" data-pp="d:' + i + '" title="' + esc(T('Löschen')) + '" aria-label="' + esc(T('Löschen')) + '">✕</button></div>').join('') + '</div>';
  h += '<div class="btns" style="margin:8px 0 4px"><button class="btn pri" data-pp="save">Aktuelle Einstellungen speichern …</button><button class="btn" data-pp="paste">Preset einfügen</button>' + (my.length ? '<button class="btn" data-pp="copyall">Alle kopieren</button>' : '') + '</div>';
  return h;
}
function ppCopy(code, msg) { const done = () => toast(msg); try { navigator.clipboard.writeText(code).then(done, () => window.prompt(T('Preset-Code (alles kopieren):'), code)); } catch (e) { window.prompt(T('Preset-Code (alles kopieren):'), code); } }
function ppUnique(list, n) { let m = n, k = 2; while (list.some(o => o.n === m)) m = n + ' (' + (k++) + ')'; return m; }
document.addEventListener('click', e => {
  const b = e.target.closest('[data-pp]'); if (!b) return; const k = b.dataset.pp, my = ppLoad();
  if (k.startsWith('b:')) { const o = ppBuilt().find(x => x.id === k.slice(2)); if (o) { ppApply(o); toast(T('Preset angewendet') + ': ' + T(o.n)); } }
  else if (k.startsWith('u:')) { const o = my[+k.slice(2)]; if (o) { ppApply(o); toast(T('Preset angewendet') + ': ' + o.n); } }
  else if (k.startsWith('c:')) { const o = my[+k.slice(2)]; if (o) ppCopy(ppEncode(o), T('Preset-Code kopiert. Beim anderen unter „Preset einfügen“ einfügen.')); }
  else if (k.startsWith('d:')) { const i = +k.slice(2); if (my[i] && window.confirm(T('Preset löschen') + ': ' + my[i].n + '?')) { my.splice(i, 1); ppStore(my); renderDrawer(); } }
  else if (k === 'save') {
    const n = window.prompt(T('Name für das Preset:'), ppUnique(my, T('Mein Preset'))); if (!n || !n.trim()) return;
    my.push(ppCurrent(ppUnique(my, n.trim().slice(0, 40)))); if (ppStore(my)) { toast(T('Preset gespeichert')); renderDrawer(); }
  }
  else if (k === 'paste') {
    const c = window.prompt(T('Preset-Code einfügen:')); if (!c) return;
    const a = ppDecode(c); if (!a) { toast(T('Das ist kein gültiger Preset-Code.')); return; }
    a.forEach(o => { o.n = ppUnique(my, o.n); my.push(o); });
    if (ppStore(my)) { if (a.length === 1) { ppApply(a[0]); toast(T('Preset eingefügt und angewendet') + ': ' + a[0].n); } else toast(a.length + ' ' + T('Presets eingefügt')); renderDrawer(); }
  }
  else if (k === 'copyall') ppCopy(ppEncode(my), T('Alle Presets kopiert. Beim anderen unter „Preset einfügen“ einfügen.'));
});

/* =====================================================================
   KLANGKARTE – Interaktion & Start
   ===================================================================== */
function onCamera() { }

/* ---------- Zeiger: Verschieben, Pinch, Klick ---------- */
const pointers = new Map();
let drag = null, pinch = null, clickTimer = 0, hoverRaf = 0, lastMouse = null;
cv.addEventListener('pointerdown', e => {
  cv.setPointerCapture(e.pointerId); pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (pointers.size === 1) {
    const now = performance.now();
    drag = { x: e.clientX, y: e.clientY, cx: cam.x, cy: cam.y, moved: false, vx: 0, vy: 0, lx: e.clientX, ly: e.clientY, lt: now };
    inertia = null; fly = null; cv.classList.add('drag'); hover = null; showTip(null);
  } else if (pointers.size === 2) {
    const [p, q] = [...pointers.values()]; pinch = { d: Math.hypot(p.x - q.x, p.y - q.y), z: cam.z }; drag = null;
  }
});
cv.addEventListener('pointermove', e => {
  if (pointers.has(e.pointerId)) pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (pinch && pointers.size >= 2) {
    const [p, q] = [...pointers.values()]; const d = Math.hypot(p.x - q.x, p.y - q.y);
    zoomAt((p.x + q.x) / 2, (p.y + q.y) / 2, (pinch.z * d / pinch.d) / cam.z); return;
  }
  if (drag) {
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) > 4) drag.moved = true;
    if (drag.moved) {
      cam.x = drag.cx - dx / cam.z; cam.y = drag.cy - dy / cam.z; markInteract();
      const now = performance.now(), dt = Math.max(1, now - drag.lt);
      drag.vx = .8 * drag.vx + .2 * (e.clientX - drag.lx) / dt; drag.vy = .8 * drag.vy + .2 * (e.clientY - drag.ly) / dt; drag.lx = e.clientX; drag.ly = e.clientY; drag.lt = now;
      requestDraw();
    }
    return;
  }
  if (e.pointerType === 'mouse') { lastMouse = { x: e.clientX, y: e.clientY }; if (!hoverRaf) hoverRaf = requestAnimationFrame(updateHover); }
});
function updateHover() {
  hoverRaf = 0; if (!lastMouse || drag) return;
  const h = pick(lastMouse.x, lastMouse.y);
  const changed = (h ? h.t + h.i : '') !== (hover ? hover.t + hover.i : '');
  hover = h; cv.classList.toggle('hit', !!h || !!labelAt(lastMouse.x, lastMouse.y));
  showTip(h, lastMouse.x, lastMouse.y);
  if (changed) requestDraw();
}
function labelAt(x, y) {
  let best = null; for (const r of labelRects) if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h && (!best || r.prio > best.prio)) best = r; return best;
}
function endPointer(e) {
  pointers.delete(e.pointerId);
  if (pointers.size < 2) pinch = null;
  if (drag && pointers.size === 0) {
    cv.classList.remove('drag');
    if (!drag.moved) {
      const x = e.clientX, y = e.clientY; clearTimeout(clickTimer);
      clickTimer = setTimeout(() => handleClick(x, y), 190);
    } else if (Math.hypot(drag.vx, drag.vy) > .06) { inertia = { vx: drag.vx, vy: drag.vy }; requestDraw(); }
    drag = null;
  }
}
cv.addEventListener('pointerup', endPointer); cv.addEventListener('pointercancel', endPointer);
cv.addEventListener('pointerleave', () => { if (!drag) { hover = null; showTip(null); requestDraw(); } });
function handleClick(x, y) {
  if (tour.on) { tourEnd(); }
  const h = pick(x, y);
  if (h) { if (sel && sel.t === h.t && sel.i === h.i) { closeDetail(); return; } selectItem(h.t, h.i); return; }   // zweiter Tipp auf dasselbe Objekt schliesst
  const l = labelAt(x, y); if (l) { if (sel && sel.t === l.t && sel.i === l.i) { closeDetail(); return; } selectItem(l.t, l.i); return; }
  closeDetail();      // Tipp auf freie Flaeche schliesst Auswahl und Seitenleiste
}
function closeDetail() {
  const wasDetail = drawerTab === 'detail';
  if (sel) clearSel();
  if (body.classList.contains('drawer-open') && wasDetail) closeDrawer();
}
cv.addEventListener('dblclick', e => {
  clearTimeout(clickTimer);
  const nz = clamp(cam.z * 2.6, zMin, zMax); const wx = (e.clientX - W / 2) / cam.z + cam.x, wy = (e.clientY - H / 2) / cam.z + cam.y;
  goto_(wx - (e.clientX - W / 2) / nz, wy - (e.clientY - H / 2) / nz, nz, 480, 0);
});
cv.addEventListener('wheel', e => {
  e.preventDefault();
  const k = e.ctrlKey ? .012 : (e.deltaMode === 1 ? .05 : .0017);
  zoomAt(e.clientX, e.clientY, Math.exp(-e.deltaY * k));
}, { passive: false });

/* ---------- Werkzeuge ---------- */
$('t-songs').onclick = () => setShow('songs', !show.songs);
$('t-links').onclick = () => setShow('links', !show.links);
$('t-labels').onclick = () => setShow('labels', !show.labels);
$('t-regions').onclick = () => setSetting('regionLabels', !S.regionLabels);
$('t-minimap').onclick = () => setUI('minimap', !UI.minimap);
$('t-legend').onclick = () => setUI('legend', !UI.legend);
$('t-settings').onclick = () => { if (drawerTab === 'settings' && body.classList.contains('drawer-open')) closeDrawer(); else openDrawer('settings'); };
/* Menue, Suche (mobil als Overlay) */
const tmenu = $('toolmenu');
function setMenu(on) { tmenu.classList.toggle('open', on); $('t-menu').classList.toggle('on', on); $('t-menu').setAttribute('aria-expanded', on ? 'true' : 'false'); }
$('t-menu').onclick = e => { e.stopPropagation(); setMenu(!tmenu.classList.contains('open')); };
document.addEventListener('pointerdown', e => { if (tmenu.classList.contains('open') && !e.target.closest('#tools')) setMenu(false); });
$('t-drawer2').onclick = () => { setMenu(false); if (body.classList.contains('drawer-open')) closeDrawer(); else openDrawer(drawerTab); };
function setSearchOpen(on) { document.body.classList.toggle('search-open', on); if (on) { setMenu(false); $('q').focus(); } }
$('t-search').onclick = () => setSearchOpen(!document.body.classList.contains('search-open'));
$('t-timeline').onclick = () => setTimelineVisible(!UI.timeline);
$('tl-close').onclick = () => setTimelineVisible(false);
$('tl-open').onclick = () => setTimelineVisible(true);
$('t-link').onclick = () => { setMenu(false); if (drawerTab === 'link' && body.classList.contains('drawer-open')) closeDrawer(); else openDrawer('link'); };
if ($('t-live')) $('t-live').onclick = () => { setMenu(false); setLive(!LIVE.on); };
if ($('t-sync')) $('t-sync').onclick = () => { setMenu(false); liveSync(true); };
/* Huelle der Web-App: Zurueck zur Startseite (Karten bleiben im Browser gespeichert), Feedback-Link und Beta-Marke. Ohne Startseite (Einzeldatei, installierte App) entfallen die Knoepfe. */
(function shell() {
  const cfg = window.__KK_CFG__ || {}, prod = !!window.__PRODUCT__;
  const goHome = () => { try { location.assign(location.pathname); } catch (e) { location.href = './'; } };
  ['t-homebtn', 't-home'].forEach(id => { const b = $(id); if (!b) return; if (!prod) { b.remove(); return; } b.classList.remove('hidden'); b.onclick = () => { setMenu(false); goHome(); }; });
  const k = document.querySelector('#hud .kicker');
  if (k && prod) { k.classList.add('home'); k.setAttribute('role', 'link'); k.tabIndex = 0; k.title = T('Zur Startseite'); k.onclick = goHome; k.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goHome(); } }; }
  if (k && cfg.beta) k.insertAdjacentHTML('beforeend', '<span class="beta">Beta</span>');
  const pick = v => (v && typeof v === 'object') ? (v[LANG] || v.de || v.en || '') : (v || '');  /* ein Link fuer alle Sprachen oder { de, en } */
  [['t-feedback', cfg.feedback], ['t-donate', cfg.donate]].forEach(([id, v]) => { const b = $(id); if (!b) return; if (pick(v)) { b.classList.remove('hidden'); b.onclick = () => { setMenu(false); window.open(pick(v), '_blank', 'noopener'); }; } else b.remove(); });
})();
$('t-edit').onclick = () => { setMenu(false); rcEdit(!RC.edit); };
$('t-clean').onclick = () => { setMenu(false); setClean(!UI.clean); };
$('clean-exit').onclick = () => setClean(false);
$('t-tour').onclick = tourStart;
$('t-drawer').onclick = () => { if (body.classList.contains('drawer-open')) closeDrawer(); else openDrawer(drawerTab); };
$('d-close').onclick = () => { if (sel) clearSel(); closeDrawer(); };
$('t-pdf').onclick = () => { setMenu(false); openPdfDialog(); };
$('pdf-close').onclick = () => $('pdf').classList.remove('show');
$('pdf').addEventListener('click', e => { if (e.target.id === 'pdf' && !PDFX.busy) $('pdf').classList.remove('show'); });
['pdf-theme', 'pdf-res'].forEach(id => $(id).addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; $(id).querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); }));
$('pdf-go').onclick = () => exportPDF({ theme: $('pdf-theme').querySelector('.on').dataset.v, hires: $('pdf-res').querySelector('.on').dataset.v === 'hi' });
$('t-help').onclick = () => $('help').classList.add('show');
$('help-ok').onclick = () => $('help').classList.remove('show');
$('help').addEventListener('click', e => { if (e.target.id === 'help') $('help').classList.remove('show'); });
$('t-full').onclick = () => { try { if (document.fullscreenElement) document.exitFullscreen(); else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => toast('Vollbild ist hier nicht verfügbar')); } catch (e) { toast('Vollbild ist hier nicht verfügbar'); } };
$('t-shot').onclick = () => {
  draw(); cv.toBlob(async b => { if (await saveFile(b, 'Klangkarte_' + HUD.user + '.png')) toast('Ansicht gespeichert'); });
};
if (IS_ART) {                                                      // im Artefakt: Speichern nur ueber die Downloads-Faehigkeit des Viewers (sonst Knoepfe ausblenden)
  if ($('t-live')) $('t-live').remove();
  { const r = $('pdf-res'); if (r && r.parentNode) r.parentNode.style.display = 'none'; }                      // "Hochauflösend" laedt Bilder aus dem Netz: im Artefakt gesperrt, es gilt Standard
  (async () => { let dl = null; try { dl = window.claude && window.claude.use ? await window.claude.use('downloads') : null; } catch (e) { } if (!dl) { $('t-shot').remove(); $('t-pdf').remove(); } })();
}
$('hud-toggle').onclick = () => $('hud').classList.toggle('collapsed');
$('hud-expand').onclick = () => { const h = $('hud'); h.classList.toggle('open'); $('hud-expand').textContent = h.classList.contains('open') ? 'Weniger anzeigen' : 'Mehr über dein Hörverhalten'; };
$('hud').classList.remove('open');
if (window.innerWidth < 1150 || window.innerHeight < 760) $('hud').classList.add('collapsed');
document.querySelectorAll('#drawer .tab').forEach(b => b.addEventListener('click', () => setTab(b.dataset.tab)));

/* ---------- Seitenleiste: Klicks & Hover ---------- */
dbody.addEventListener('click', e => {
  const go = e.target.closest('[data-go]');
  if (go) { e.preventDefault(); const g = parseGo(go.dataset.go); selectItem(g.t, g.i); return; }
  const act = e.target.closest('[data-act]'); if (!act) return; const a = act.dataset.act;
  if (a === 'tab-top') setTab('top');
  else if (a === 'tour') tourStart();
  else if (a === 'more-songs') { songLimit = 9999; renderDrawer(); }
  else if (a === 'center') flyToSel();
  else if (a === 'art-home' && sel && sel.t === 'a') rcReturnArtist(sel.i);
  else if (a === 'play-prev' && sel && sel.t === 'k') togglePreview(trk[sel.i]);
  else if (a.startsWith('top-')) { topMode = a.slice(4); topLimit = 60; renderDrawer(); }
  else if (a === 'more-top') { topLimit += 100; renderDrawer(); }
});
dbody.addEventListener('mouseover', e => { const r = e.target.closest('[data-hl]'); if (r) { const g = parseGo(r.dataset.hl); hl = { t: g.t, i: g.i }; requestDraw(); } });
dbody.addEventListener('mouseout', e => { const r = e.target.closest('[data-hl]'); if (r && !r.contains(e.relatedTarget)) { hl = null; requestDraw(); } });

/* ---------- Suche ---------- */
const q = $('q');
q.addEventListener('input', renderResults);
q.addEventListener('blur', () => setTimeout(() => { if (document.activeElement !== q) document.body.classList.remove('search-open'); }, 200));
q.addEventListener('focus', () => { if (q.value.trim()) renderResults(); });
q.addEventListener('keydown', e => {
  const items = document.querySelectorAll('#results .res');
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault(); if (!items.length) return; resSel = (resSel + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
    items.forEach((it, n) => it.classList.toggle('on', n === resSel)); items[resSel].scrollIntoView({ block: 'nearest' });
  } else if (e.key === 'Enter') { e.preventDefault(); chooseResult(resSel); }
  else if (e.key === 'Escape') { q.value = ''; $('results').classList.remove('show'); q.blur(); document.body.classList.remove('search-open'); }
});
$('results').addEventListener('mousedown', e => { const r = e.target.closest('.res'); if (r) { e.preventDefault(); chooseResult(+r.dataset.n); } });
document.addEventListener('pointerdown', e => { if (!e.target.closest('#search')) $('results').classList.remove('show'); });

/* ---------- Minimap ---------- */
let mmDrag = false;
mm.addEventListener('pointerdown', e => { mm.setPointerCapture(e.pointerId); mmDrag = true; fly = null; const [x, y] = mmToWorld(e); const b = availBox(); cam.x = x + (W / 2 - (b.x0 + b.x1) / 2) / cam.z; cam.y = y + (H / 2 - (b.y0 + b.y1) / 2) / cam.z; requestDraw(); });
mm.addEventListener('pointermove', e => { if (!mmDrag) return; const [x, y] = mmToWorld(e); const b = availBox(); cam.x = x + (W / 2 - (b.x0 + b.x1) / 2) / cam.z; cam.y = y + (H / 2 - (b.y0 + b.y1) / 2) / cam.z; requestDraw(); });
mm.addEventListener('pointerup', () => { mmDrag = false; });

/* ---------- Tastatur ---------- */
document.addEventListener('keydown', e => {
  const typing = /^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName);
  if ((e.key === 'k' || e.key === 'K') && (e.ctrlKey || e.metaKey)) { e.preventDefault(); q.focus(); q.select(); return; }
  if (typing) return;
  if (e.key === '/') { e.preventDefault(); if (window.innerWidth <= 900) setSearchOpen(true); else { q.focus(); q.select(); } return; }
  if (e.key === 'Escape') {
    if (UI.clean) { setClean(false); return; }
    if ($('help').classList.contains('show')) { $('help').classList.remove('show'); return; }
    if ($('pdf').classList.contains('show') && !PDFX.busy) { $('pdf').classList.remove('show'); return; }
    if (tour.on) { tourEnd(); clearSel(); return; }
    if (LINKV) { lkClearView(); return; }
    if (sel) { clearSel(); return; }
    if (body.classList.contains('drawer-open')) { closeDrawer(); return; }
    fitAll(true); return;
  }
  const k = e.key.toLowerCase();
  if (k === '0') { clearSel(); fitAll(true); }
  else if (k === '+' || k === '=') zoomAt(W / 2, H / 2, 1.35);
  else if (k === '-' || k === '_') zoomAt(W / 2, H / 2, 1 / 1.35);
  else if (k === 's') $('t-songs').click();
  else if (k === 'l') $('t-links').click();
  else if (k === 'n') $('t-labels').click();
  else if (k === 'r') $('t-regions').click();
  else if (k === 'm') $('t-minimap').click();
  else if (k === 'v') { const o = ['map', 'rows', 'spiral']; setSetting('view', o[(o.indexOf(S.view) + 1) % 3]); toast({ map: 'Ansicht: Karte', rows: 'Ansicht: Rangliste in Reihen', spiral: 'Ansicht: Spirale' }[S.view]); }
  else if (k === 't') tourStart();
  else if (k === 'z') $('t-timeline').click();
  else if (k === 'h') $('t-clean').click();
  else if (k === '?') $('help').classList.add('show');
  else if (k.startsWith('arrow')) { e.preventDefault(); const s = 90 / cam.z; fly = null; if (k === 'arrowleft') cam.x -= s; if (k === 'arrowright') cam.x += s; if (k === 'arrowup') cam.y -= s; if (k === 'arrowdown') cam.y += s; markInteract(); requestDraw(); }
});

/* ---------- Start ---------- */
window.addEventListener('resize', () => { resize(); mmResize(); tlResize(); placeMinimap(); });
new ResizeObserver(() => { mmResize(); }).observe($('minimap'));
(async function init() {
  document.documentElement.lang = LANG; i18nStart(); if (LANG === 'en') { relines(); trTree(document.body); }
  resize();
  loadSettings(); applyTheme(); applyFont();
  document.body.classList.toggle('tl-off', !UI.timeline); $('tl-open').classList.toggle('hidden', UI.timeline);
  $('minimap').classList.toggle('hidden', !UI.minimap); $('legend').classList.toggle('hidden', !UI.legend);
  mmResize(); placeMinimap();
  await loadAtlas(); atlasReady = true;
  cmpInit(); rcInit(); if (CMP) { $('t-live').remove(); if ($('t-sync')) $('t-sync').remove(); } else if (syncOK()) { if (liveWanted()) setTimeout(() => { if (!LIVE.on) setLive(true, true); }, 1200); else setTimeout(() => liveSync(false), 2500); }
  if (HUD.src === 'spotify' && $('t-sync')) $('t-sync').remove();
  recolor(); recompute(); rankings(); renderHud(); renderPresets(); renderDrawer(); tlResize(); onRangeChange();
  applyLayout({ instant: true, fit: false }); fitAll(false); syncSettingsUI(); mmResize();
  requestDraw();
  setTimeout(() => $('loading').classList.add('done'), 250);
  setTimeout(() => { $('loading').style.display = 'none'; }, 1100);
  try { if (!localStorage.getItem('klangkarte-help')) { $('help').classList.add('show'); localStorage.setItem('klangkarte-help', '1'); } } catch (e) { }
})();
window.__km = { prof: profileDraw, tick: n => { let c = 0; for (let i = 0; i < n; i++) { stepAnim(16, performance.now() + i * 16); c++; if (!animOn && !solver) break; } return c; }, get solving() { return !!solver; }, S, UI, show, setSetting, applyLayout, get PATH() { return PATH; }, bench: n => { const t = performance.now(); for (let i = 0; i < (n || 20); i++) draw(); return (performance.now() - t) / (n || 20); }, cam, art, trk, alb, regs, scs, selectItem, setRange, fitAll, goto_, focusOn, tourStart, get sel() { return sel; }, frameStats, RC, rcPreset, fixDev: { FX, FXS, isHidA, isHidT, fxMoveTo, fxUndo }, hideDev: { HID, hideSet, hideClear, hideNote }, vid: { stopFly: () => { fly = null; inertia = null; }, get LB() { return LB; }, hopInfo, tagName, LK, lkSet, lkRun, lkReset, clearSel, dijkstra, setClean, requestDraw, computeFocus, get LINKV() { return LINKV; }, get rA() { return rA; }, get rB() { return rB; }, get ND() { return ND; }, HUD, dayDate }, rcDev: { rcTidy, rcReturnArtist, rcSetGroup, rcDropBegin, rcDock, rcGatherStrays, rcSnapshot, rcHandTarget, rcSimFinish, rcSimStop, robustCenter, rcFlowStep, rcGridInit, rcSetMass, RPH, RSIM, rcSimInit, rcSimRun, rcSimStep, rcApply, rcGeo, rcPositions, rcResetPositions, rcContacts, rcCentroids, rcPushGS, rcPushOut, rcCarry, rcIter },mmDbg: () => ({ mmW, mmH, mmDirty, mmw: mm.width, base: mmBase && mmBase.width, frameN, uimm: UI.minimap, glowW: glow.width }), setWho, CMP, live: { LIVE, liveSet, setLive }, pdf: exportPDF, PDFX, lk: { LK, findRoutes, hopInfo, hopLines, graph, dijkstra, get LINKV() { return LINKV; }, set: lkSet, run: lkRun, rand: lkRand } };

})();
