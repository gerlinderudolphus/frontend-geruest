import { create } from "zustand";
import { appConfig } from "@/config";
import { WebSocketAdapter } from "@/core/adapters/websocket";
import { createDemoFrame } from "./demo-feed";
import { parseGeoFrame } from "./parse-frame";
import { emptyCollection, type GeoFrame, type LiveFeatureCollection } from "./types";

type GeoState = {
  live: GeoFrame;
  history: GeoFrame[];
  source: "websocket" | "demo" | "idle";
  connected: boolean;
  start: () => void;
  stop: () => void;
};

const HISTORY_LIMIT = 240;
const socket = appConfig.geoJsonWebsocketUrl
  ? new WebSocketAdapter("geojson-live", appConfig.geoJsonWebsocketUrl, parseGeoFrame)
  : null;

export const useGeoStore = create<GeoState>((set, get) => {
  let demoTimer: number | null = null;
  let startedAt = 0;
  let unsubscribe: (() => void) | null = null;

  const pushFrame = (frame: GeoFrame, source: GeoState["source"]) => {
    const history = [...get().history, frame].slice(-HISTORY_LIMIT);
    set({ live: frame, history, source, connected: true });
  };

  return {
    live: { timestamp: 0, collection: emptyCollection() },
    history: [],
    source: "idle",
    connected: false,
    start() {
      if (socket) {
        unsubscribe = socket.subscribe((frame) => pushFrame(frame, "websocket"));
        socket.connect();
        set({ source: "websocket" });
      }

      if (!socket && appConfig.demoFeedEnabled) {
        startedAt = performance.now();
        demoTimer = window.setInterval(() => {
          pushFrame(createDemoFrame(performance.now() - startedAt), "demo");
        }, 700);
      }
    },
    stop() {
      unsubscribe?.();
      unsubscribe = null;
      socket?.disconnect();
      if (demoTimer !== null) {
        window.clearInterval(demoTimer);
        demoTimer = null;
      }
      set({ connected: false, source: "idle" });
    },
  };
});

export const selectLiveCollection = (state: GeoState): LiveFeatureCollection =>
  state.live.collection;
