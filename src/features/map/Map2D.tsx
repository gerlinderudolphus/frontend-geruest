import type { CircleLayerSpecification, SymbolLayerSpecification } from "maplibre-gl";
import Map, { Layer, NavigationControl, Source } from "react-map-gl/maplibre";
import type { LiveFeatureCollection } from "@/core/geo/types";
import { appConfig } from "@/config";
import "maplibre-gl/dist/maplibre-gl.css";
import "./Map2D.css";

type Map2DProps = {
  data: LiveFeatureCollection;
  interactive?: boolean;
};

const circlePaint: CircleLayerSpecification["paint"] = {
  "circle-radius": 10,
  "circle-color": [
    "match",
    ["get", "status"],
    "alert",
    "#ef4444",
    "idle",
    "#94a3b8",
    "#38bdf8",
  ],
  "circle-stroke-width": 3,
  "circle-stroke-color": "#0f1720",
};

const labelLayout: SymbolLayerSpecification["layout"] = {
  "text-field": ["get", "label"],
  "text-size": 13,
  "text-offset": [0, 1.4],
};

export function Map2D({ data, interactive = true }: Map2DProps) {
  return (
    <div className="map2d">
      <Map
        initialViewState={{ longitude: 13.405, latitude: 52.52, zoom: 12 }}
        mapStyle={appConfig.mapStyleUrl}
        attributionControl={false}
        dragRotate={false}
        touchPitch={false}
        interactive={interactive}
        reuseMaps
      >
        <NavigationControl position="top-left" showCompass={false} />
        <Source id="live-entities" type="geojson" data={data}>
          <Layer id="live-circles" type="circle" paint={circlePaint} />
          <Layer id="live-labels" type="symbol" layout={labelLayout} />
        </Source>
      </Map>
    </div>
  );
}
