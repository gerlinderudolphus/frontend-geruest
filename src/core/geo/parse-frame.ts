import type { FeatureCollection } from "geojson";
import { emptyCollection, type GeoFrame, type LiveFeatureCollection } from "./types";

const isFeatureCollection = (value: unknown): value is FeatureCollection =>
  Boolean(value) &&
  typeof value === "object" &&
  (value as FeatureCollection).type === "FeatureCollection" &&
  Array.isArray((value as FeatureCollection).features);

export const parseGeoFrame = (raw: string): GeoFrame => {
  const parsed = JSON.parse(raw) as unknown;

  if (isFeatureCollection(parsed)) {
    return {
      timestamp: Date.now(),
      collection: parsed as LiveFeatureCollection,
    };
  }

  if (
    parsed &&
    typeof parsed === "object" &&
    "collection" in parsed &&
    isFeatureCollection((parsed as { collection: unknown }).collection)
  ) {
    const frame = parsed as { timestamp?: number; collection: LiveFeatureCollection };
    return {
      timestamp: frame.timestamp ?? Date.now(),
      collection: frame.collection,
    };
  }

  return { timestamp: Date.now(), collection: emptyCollection() };
};
