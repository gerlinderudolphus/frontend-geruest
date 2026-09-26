import { useGeoStore } from "@/core/geo/geo-store";

export function FeedStatusModule() {
  const live = useGeoStore((state) => state.live);
  const source = useGeoStore((state) => state.source);
  const history = useGeoStore((state) => state.history);

  return (
    <dl className="kv">
      <div>
        <dt>Quelle</dt>
        <dd>{source}</dd>
      </div>
      <div>
        <dt>Objekte</dt>
        <dd>{live.collection.features.length}</dd>
      </div>
      <div>
        <dt>Gespeicherte Frames</dt>
        <dd>{history.length}</dd>
      </div>
    </dl>
  );
}
