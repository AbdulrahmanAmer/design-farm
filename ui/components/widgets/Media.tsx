import { cx } from "../../lib/cx";
import { Card } from "../primitives/Card";
import { Icon } from "../primitives/Icon";
import "./Media.css";

/* ---------------------------------------------------------------- Waveform */

/** Deterministic bar heights (0–1) for a waveform when no audio analysis is available. */
export function sampleWaveform(count = 28, seed = 3): number[] {
  return Array.from({ length: count }, (_, i) => {
    const v = Math.abs(Math.sin(i * 0.9 + seed) * 0.6 + Math.sin(i * 2.3 + seed * 2) * 0.4);
    return 0.25 + v * 0.75;
  });
}

export interface WaveformProps {
  bars: number[];
  /** 0–1. Bars before this point use the accent, the rest the highlight. */
  progress: number;
  className?: string;
}

export function Waveform({ bars, progress, className }: WaveformProps) {
  const played = Math.round(bars.length * progress);
  return (
    <span className={cx("ds-wave", className)} aria-hidden>
      {bars.map((h, i) => (
        <span key={i} className={cx("ds-wave__bar", i < played && "is-played")} style={{ height: `${Math.round(h * 100)}%` }} />
      ))}
    </span>
  );
}

/* ---------------------------------------------------------------- TransportControls */

export interface TransportControlsProps {
  playing: boolean;
  onToggle: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  className?: string;
}

/** Inset pill: previous · raised play/pause knob · next. */
export function TransportControls({ playing, onToggle, onPrev, onNext, className }: TransportControlsProps) {
  return (
    <div className={cx("ds-transport", className)} role="group" aria-label="Playback">
      <button type="button" className="ds-transport__skip ds-transport__skip--prev" aria-label="Previous track" onClick={onPrev}>
        <Icon name="play" size={20} strokeWidth={2} filled />
      </button>
      <button type="button" className={cx("ds-transport__knob", playing && "is-playing")} aria-label={playing ? "Pause" : "Play"} aria-pressed={playing} onClick={onToggle}>
        <Icon name={playing ? "pause" : "play"} size={14} strokeWidth={2} filled />
      </button>
      <button type="button" className="ds-transport__skip" aria-label="Next track" onClick={onNext}>
        <Icon name="play" size={20} strokeWidth={2} filled />
      </button>
    </div>
  );
}

/* ---------------------------------------------------------------- MusicPlayer */

export interface MusicPlayerProps {
  title: string;
  bars: number[];
  progress: number;
  playing: boolean;
  onToggle: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  className?: string;
}

export function MusicPlayer({ title, bars, progress, playing, onToggle, onPrev, onNext, className }: MusicPlayerProps) {
  return (
    <Card as="section" padding="md" className={cx("ds-player", className)} aria-label={`Music player: ${title}`}>
      <div className="ds-player__head">
        <Icon name="music" size={40} strokeWidth={2} filled className="ds-player__note" />
        <div className="ds-player__meta">
          <h3 className="ds-player__title">{title}</h3>
          <Waveform bars={bars} progress={progress} />
        </div>
      </div>
      <span
        className="ds-player__scrub"
        role="progressbar"
        aria-label="Track position"
        aria-valuenow={Math.round(progress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      />
      <TransportControls playing={playing} onToggle={onToggle} onPrev={onPrev} onNext={onNext} />
    </Card>
  );
}
