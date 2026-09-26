import type { FeatureCollection, Point } from "geojson";

export type EntityProperties = {
  id: string;
  label: string;
  kind: "vehicle" | "unit" | "marker";
  status?: "active" | "idle" | "alert";
};

export type LiveFeatureCollection = FeatureCollection<Point, EntityProperties>;

export type GeoFrame = {
  timestamp: number;
  collection: LiveFeatureCollection;
};

export const emptyCollection = (): LiveFeatureCollection => ({
  type: "FeatureCollection",
  features: [],
});
