import { cx } from "../../lib/cx";
import type { Tone } from "../../../tokens";
import "./Progress.css";

export interface ProgressBarProps {
  value: number;
  tone?: Tone;
  /** Shows the "90%" label next to the track. */
  showValue?: boolean;
  /** Which side of the track the value sits on. */
  valuePosition?: "start" | "end";
  label: string;
  className?: string;
}

/** Thin linear progress used in task rows. */
export function ProgressBar({ value, tone = "accent", showValue = true, valuePosition = "start", label, className }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={cx("ds-progress", valuePosition === "end" && "ds-progress--value-end", className)}>
      {showValue && <span className="ds-progress__value">{pct}%</span>}
      <div
        className={cx("ds-progress__track", `ds-progress--${tone}`)}
        role="progressbar"
        aria-label={label}
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <span className="ds-progress__fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export interface ProgressRingProps {
  value: number;
  tone?: Tone;
  size?: number;
  thickness?: number;
  label: string;
  className?: string;
}

/** Circular progress with the percentage centred (stat cards). */
export function ProgressRing({ value, tone = "accent", size = 56, thickness = 4, label, className }: ProgressRingProps) {
  const pct = Math.max(0, Math.min(100, value));
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div
      className={cx("ds-ring", `ds-ring--${tone}`, className)}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-label={label}
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        <circle className="ds-ring__track" cx={size / 2} cy={size / 2} r={r} strokeWidth={thickness} fill="none" />
        <circle
          className="ds-ring__fill"
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={thickness}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct / 100)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="ds-ring__value">{pct}%</span>
    </div>
  );
}
