import { Map2D } from "@/features/map/Map2D";
import { ModuleHost } from "@/features/shell/ModuleHost";
import { useGeoStore } from "@/core/geo/geo-store";
import "./LiveView.css";

export function LiveView() {
  const collection = useGeoStore((state) => state.live.collection);
  const source = useGeoStore((state) => state.source);
  const count = collection.features.length;

  return (
    <section className="live-view">
      <div className="live-view__map">
        <Map2D data={collection} />
        <p className="live-view__badge">
          {source === "websocket" ? "Live-WebSocket" : source === "demo" ? "Demo-Feed" : "Keine Daten"}
          {" · "}
          {count} Objekte
        </p>
      </div>
      <ModuleHost />
    </section>
  );
}
