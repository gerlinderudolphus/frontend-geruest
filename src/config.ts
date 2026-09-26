export const appConfig = {
  geoJsonWebsocketUrl: import.meta.env.VITE_GEOJSON_WS_URL ?? "",
  demoFeedEnabled: import.meta.env.VITE_DEMO_FEED !== "false",
  mapStyleUrl:
    import.meta.env.VITE_MAP_STYLE_URL ??
    "https://tiles.openfreemap.org/styles/liberty",
} as const;
