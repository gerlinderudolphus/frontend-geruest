import "./PlaybackControls.css";

type PlaybackControlsProps = {
  playing: boolean;
  index: number;
  total: number;
  timestamp: number;
  onToggle: () => void;
  onSeek: (index: number) => void;
};

const formatTime = (timestamp: number) => {
  if (!timestamp) return "00:00";
  return new Date(timestamp).toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export function PlaybackControls({
  playing,
  index,
  total,
  timestamp,
  onToggle,
  onSeek,
}: PlaybackControlsProps) {
  const max = Math.max(total - 1, 0);

  return (
    <div className="playback-controls">
      <button type="button" className="touch-btn" onClick={onToggle}>
        {playing ? "Pause" : "Play"}
      </button>
      <input
        className="playback-controls__slider"
        type="range"
        min={0}
        max={max}
        value={Math.min(index, max)}
        onChange={(event) => onSeek(Number(event.target.value))}
        aria-label="Wiedergabeposition"
      />
      <p className="playback-controls__meta">
        {total === 0 ? "Keine Frames" : `${index + 1} / ${total} · ${formatTime(timestamp)}`}
      </p>
    </div>
  );
}
