# Tablet-Frontend-Gerüst

Betriebssystemunabhängige Web-App für Tablets. Der größte Bereich ist eine 2D-Karte. Daneben laufen unabhängige Module. Ein zweiter Bereich **Playback** zeigt dieselbe Karte mit Zeitsteuerung. Live- und Playback-Karte nutzen dieselbe GeoJSON-Struktur.

## Wie die Software funktioniert

Die App ist eine Browser-Anwendung (PWA-fähig). Sie läuft auf iPad, Android und Windows ohne native Installation. Beim Start registriert `App` alle Module und startet den gemeinsamen GeoJSON-Feed.

```
WebSocket oder Demo-Feed
        │
        ▼
   useGeoStore  ── aktueller Frame (live)
        │       ── Verlauf (history, max. 240 Frames)
        │
   ┌────┴────┐
   ▼         ▼
 Live-Karte  Playback-Karte + Steuerung
   │
   └── Module (eigene Datenquellen, unabhängig voneinander)
```

### Bereiche

| Bereich | Route | Inhalt |
| --- | --- | --- |
| Live | `/` | Große 2D-Karte plus rechte Modulleiste |
| Playback | `/playback` | Dieselbe Kartenkomponente `Map2D` plus Play/Pause und Zeitschiene |

Die Kopfleiste (`AppShell`) schaltet zwischen Live und Playback um und blendet Module ein oder aus. Offene Module rendert `ModuleHost` als Karten in der rechten Leiste.

### Gemeinsamer GeoJSON-Feed

`useGeoStore` ist die einzige gemeinsame Datenquelle für Lagebilddaten.

1. Ist `VITE_GEOJSON_WS_URL` gesetzt, verbindet ein `WebSocketAdapter` und parst jede Nachricht.
2. Ist keine URL gesetzt, erzeugt ein Demo-Feed bewegte Punkte um Berlin (abschaltbar mit `VITE_DEMO_FEED=false`).
3. Jeder gültige Frame landet in `live` und wird an `history` angehängt.

Akzeptierte Nachrichten:

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [13.405, 52.52] },
      "properties": {
        "id": "alpha",
        "label": "Alpha",
        "kind": "vehicle",
        "status": "active"
      }
    }
  ]
}
```

oder mit Zeitstempel:

```json
{
  "timestamp": 1710000000000,
  "collection": { "type": "FeatureCollection", "features": [] }
}
```

`status` steuert die Punktfarbe: `active` (blau), `idle` (grau), `alert` (rot).

Live liest `live.collection`. Playback liest `history` und spielt die Frames im Abstand von 700 ms ab. Beide Karten sind Instanzen von `src/features/map/Map2D.tsx` (MapLibre).

### Module

Module sind eigenständige React-Komponenten. Die Shell kennt nur die Registry, nicht die Interna.

- Eintrag in `src/modules/register.ts`
- Umschalten über die Kopfleiste
- Anzeige nur in der Live-Ansicht (`ModuleHost`)
- Eigene Schnittstellen über Adapter in `src/core/adapters/`

Module dürfen einander nicht importieren. Lagebilddaten nur über `useGeoStore`. Alles andere (REST, IndexedDB, Datei) bleibt im jeweiligen Modul.

Mitgelieferte Beispiele:

| Modul | Quelle | Zweck |
| --- | --- | --- |
| Feed | `useGeoStore` | Zeigt Quelle, Objektzahl, Frame-Anzahl |
| Notizen | IndexedDB | Lokaler Text auf dem Gerät |
| Wetter | REST | Eigenes API-Beispiel (Open-Meteo) |
| Archiv | Festplatte | Verlauf als JSON speichern/laden |

### Wichtige Ordner

```
src/
  app-Einstieg: main.tsx, App.tsx, config.ts
  core/adapters/     WebSocket, REST, IndexedDB, Dateisystem
  core/geo/          Store, Parser, Demo-Feed, Typen
  core/modules/      Registry und Modulvertrag
  features/live/     Live-Ansicht
  features/map/      gemeinsame 2D-Karte
  features/playback/ Playback-Ansicht und Steuerung
  features/shell/    Tablet-Rahmen und Modulleiste
  modules/           konkrete Module + register.ts
```

## Benötigte Versionen

Auf dem Rechner müssen installiert sein:

| Software | Version | Hinweis |
| --- | --- | --- |
| **Node.js** | 20.19 oder neuer, empfohlen 22.12+ | Vorgabe von Vite 7 |
| **npm** | 10 oder neuer | kommt mit Node.js |
| **Git** | beliebig aktuell | nur zum Klonen, nicht zum Bauen nötig |

Geprüft mit: `node -v` und `npm -v`.

Ein aktueller Browser genügt zum Ausführen (Chrome, Edge, Firefox, Safari / iPadOS). Für Festplattenzugriff ist Chromium am vollständigsten. Safari nutzt den Datei-Dialog-Fallback.

Die App selbst bringt diese Bibliotheken mit (`npm install` lädt sie):

| Paket | Eingesetzte Linie | Rolle |
| --- | --- | --- |
| react / react-dom | 19.1 | UI |
| react-router-dom | 7.8 | Live- und Playback-Route |
| maplibre-gl | 5.6 | 2D-Karte |
| react-map-gl | 8.1 | React-Anbindung an MapLibre |
| zustand | 5.0 | Feed-Store und Modul-Registry |
| vite | 7.1 | Dev-Server und Production-Build |
| typescript | 5.9 | Typprüfung |
| @vitejs/plugin-react | 5.0 | React in Vite |

Keine Java-, Python- oder Datenbank-Installation ist nötig.

## Installieren, starten, bauen

Im Projektordner:

```bash
npm install
```

### Entwicklung

```bash
npm run dev
```

Vite startet unter [http://localhost:5173/](http://localhost:5173/) und im LAN unter der angezeigten Network-Adresse (für das Tablet im selben WLAN).

### Produktionsbuild

```bash
npm run build
```

Ablauf: TypeScript prüft das Projekt (`tsc -b`), Vite schreibt die statischen Dateien nach `dist/`.

Lokal ansehen:

```bash
npm run preview
```

`dist/` kann auf jeden statischen Webserver gelegt werden (nginx, IIS, GitHub Pages, intern). Es gibt kein Backend in diesem Gerüst.

### Umgebung

Datei `.env` im Projektroot, Vorlage ist `.env.example`:

```
VITE_GEOJSON_WS_URL=ws://localhost:8080/geo
VITE_MAP_STYLE_URL=https://tiles.openfreemap.org/styles/liberty
VITE_DEMO_FEED=true
```

| Variable | Wirkung |
| --- | --- |
| `VITE_GEOJSON_WS_URL` | WebSocket für Live- und Playback-Frames. Leer = Demo-Feed. |
| `VITE_MAP_STYLE_URL` | MapLibre-Stil. Standard: OpenFreeMap Liberty. |
| `VITE_DEMO_FEED` | `false` schaltet den Demo-Feed aus. |

Nach Änderungen an `.env` den Dev-Server neu starten.

## Ein Modul erstellen

Jedes Modul besteht aus einer React-Komponente und einem Eintrag in der Registry. Die Shell findet neue Module nur über `src/modules/register.ts`.

### 1. Ordner und Komponente

Neuen Ordner unter `src/modules/<kurzname>/` anlegen. Beispiel `src/modules/zaehler/ZaehlerModule.tsx`:

```tsx
import { useState } from "react";

export function ZaehlerModule() {
  const [count, setCount] = useState(0);

  return (
    <div className="stack">
      <p>Stand: {count}</p>
      <button type="button" className="touch-btn" onClick={() => setCount((n) => n + 1)}>
        Erhöhen
      </button>
    </div>
  );
}
```

Bestehende CSS-Klassen nutzen: `stack`, `touch-btn`, `touch-input`, `hint`, `kv`.

### 2. In der Registry eintragen

In `src/modules/register.ts` importieren und an `appModules` anhängen:

```tsx
import { ZaehlerModule } from "./zaehler/ZaehlerModule";

export const appModules: AppModule[] = [
  // ... bestehende Module
  {
    id: "zaehler",
    title: "Zähler",
    description: "Beispielmodul ohne externe Schnittstelle.",
    area: "rail",
    defaultOpen: false,
    Component: ZaehlerModule,
  },
];
```

Felder:

| Feld | Pflicht | Bedeutung |
| --- | --- | --- |
| `id` | ja | Stabiler Schlüssel, nur Kleinbuchstaben/Bindestrich |
| `title` | ja | Beschriftung in der Kopfleiste |
| `description` | ja | Kurztext über dem Modulinhalt |
| `area` | ja | `rail` = rechte Leiste (aktuell genutzt) |
| `defaultOpen` | nein | `true` = nach dem Start sichtbar |
| `Component` | ja | Die React-Komponente |

Nach dem Speichern erscheint der Button **Zähler** in der Kopfleiste. Klick öffnet das Modul in der Live-Ansicht.

### 3. Externe Schnittstelle anbinden

Adapter liegen in `src/core/adapters/`. Das Modul instanziiert seinen Adapter selbst.

**REST**

```tsx
import { RestAdapter } from "@/core/adapters/rest";

const api = new RestAdapter<{ id: string }, { name: string }>(
  "mein-modul",
  (query) => `https://api.example.com/items/${query.id}`,
);

const result = await api.query({ id: "1" });
```

**IndexedDB**

```tsx
import { IndexedDbAdapter } from "@/core/adapters/indexed-db";

const db = new IndexedDbAdapter<string>("mein-modul", "mein-db");
await db.save("wert");
const value = await db.load();
```

**Festplatte**

```tsx
import { FileSystemAdapter } from "@/core/adapters/file-system";

const disk = new FileSystemAdapter<{ note: string }>("mein-modul");
await disk.save({ note: "export" });
const loaded = await disk.load();
```

**WebSocket (nur für eigene Moduldaten, nicht für die Karte)**

```tsx
import { WebSocketAdapter } from "@/core/adapters/websocket";

const stream = new WebSocketAdapter("mein-modul", "ws://localhost:8080/extra", (raw) =>
  JSON.parse(raw),
);
stream.subscribe((payload) => {
  // eigenen State setzen
});
stream.connect();
```

Die Karten-Daten laufen nicht über einen Modul-WebSocket, sondern immer über `useGeoStore`.

**Lagebild im Modul anzeigen**

```tsx
import { useGeoStore } from "@/core/geo/geo-store";

export function MeinLageModul() {
  const features = useGeoStore((state) => state.live.collection.features);
  return <p>{features.length} Objekte</p>;
}
```

### 4. Regeln

- Keine Imports von einem Modul in ein anderes.
- Keine direkte Änderung fremder Stores außer `useGeoStore` fürs Lagebild.
- IDs eindeutig halten.
- Touch-tauglich bleiben (`touch-btn`, mindestens 44 px).
- Schwere Abhängigkeiten im eigenen Modul belassen, nicht in `core/` ziehen, solange nur dieses Modul sie braucht.

Vorlagen: `src/modules/notes/NotesModule.tsx` (IndexedDB), `src/modules/weather/WeatherModule.tsx` (REST), `src/modules/archive/ArchiveModule.tsx` (Datei), `src/modules/feed-status/FeedStatusModule.tsx` (Geo-Store).

## Technologie-Wahl

| Bedarf | Wahl | Begründung |
| --- | --- | --- |
| OS-unabhängig, Tablet | Web-App / PWA (Vite, React, TypeScript) | Läuft im Browser. Später optional mit Tauri verpacken. |
| 2D-Karte + GeoJSON | MapLibre GL + react-map-gl | Open Source, geeignet für häufige Source-Updates. |
| Live + Playback | ein Feed-Store | Beide Karten lesen dieselbe FeatureCollection. |
| Module | Registry + Adapter | Keine Kopplung zwischen Modulen. |
| Lokale Datenbank | IndexedDB | Kein Server. SQL später über wa-sqlite. |
| Server-Datenbank | REST | Postgres/MySQL gehören hinter eine API, nicht ins Frontend. |
