import { useEffect, useState } from "react";
import { emptyCollection } from "@/core/geo/types";
import { useGeoStore } from "@/core/geo/geo-store";
import { Map2D } from "@/features/map/Map2D";
import { PlaybackControls } from "./PlaybackControls";
import "./PlaybackView.css";

export function PlaybackView() {
  const history = useGeoStore((state) => state.history);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setIndex((current) => Math.min(current, Math.max(history.length - 1, 0)));
  }, [history.length]);

  useEffect(() => {
    if (!playing || history.length === 0) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % history.length);
    }, 700);
    return () => window.clearInterval(timer);
  }, [playing, history.length]);

  const frame = history[index];

  return (
    <section className="playback-view">
      <div className="playback-view__map">
        <Map2D data={frame?.collection ?? emptyCollection()} />
      </div>
      <PlaybackControls
        playing={playing}
        index={index}
        total={history.length}
        timestamp={frame?.timestamp ?? 0}
        onToggle={() => setPlaying((value) => !value)}
        onSeek={(next) => {
          setPlaying(false);
          setIndex(next);
        }}
      />
    </section>
  );
}
