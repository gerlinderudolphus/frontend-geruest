import type { GeoFrame, LiveFeatureCollection } from "./types";

const BERLIN: [number, number] = [13.405, 52.52];

const entities = [
  { id: "alpha", label: "Alpha", kind: "vehicle" as const, offset: 0 },
  { id: "bravo", label: "Bravo", kind: "unit" as const, offset: 2.1 },
  { id: "charlie", label: "Charlie", kind: "vehicle" as const, offset: 4.4 },
];

export const createDemoFrame = (elapsedMs: number): GeoFrame => {
  const t = elapsedMs / 1000;
  const collection: LiveFeatureCollection = {
    type: "FeatureCollection",
    features: entities.map((entity, index) => {
      const radius = 0.012 + index * 0.004;
      return {
        type: "Feature",
        id: entity.id,
        geometry: {
          type: "Point",
          coordinates: [
            BERLIN[0] + Math.cos(t * 0.35 + entity.offset) * radius,
            BERLIN[1] + Math.sin(t * 0.28 + entity.offset) * radius * 0.6,
          ],
        },
        properties: {
          id: entity.id,
          label: entity.label,
          kind: entity.kind,
          status: index === 2 && Math.sin(t) > 0.75 ? "alert" : "active",
        },
      };
    }),
  };

  return { timestamp: Date.now(), collection };
};
