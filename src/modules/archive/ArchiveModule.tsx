import { FileSystemAdapter } from "@/core/adapters/file-system";
import { useGeoStore } from "@/core/geo/geo-store";
import type { GeoFrame } from "@/core/geo/types";

const disk = new FileSystemAdapter<GeoFrame[]>("geo-archive");

export function ArchiveModule() {
  const history = useGeoStore((state) => state.history);

  return (
    <div className="stack">
      <p className="hint">
        Exportiert den gemeinsamen GeoJSON-Verlauf auf die Festplatte. Import ist
        unabhängig vom Live-Feed.
      </p>
      <button
        type="button"
        className="touch-btn"
        onClick={() => disk.save(history)}
        disabled={history.length === 0}
      >
        Verlauf speichern
      </button>
      <button
        type="button"
        className="touch-btn"
        onClick={async () => {
          const frames = await disk.load();
          if (frames) {
            useGeoStore.setState({ history: frames, live: frames.at(-1) ?? useGeoStore.getState().live });
          }
        }}
      >
        Verlauf laden
      </button>
    </div>
  );
}
