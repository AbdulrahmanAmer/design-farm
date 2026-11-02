import { cx } from "../../lib/cx";
import { pad, useNow } from "../../lib/useNow";
import { Card } from "../primitives/Card";
import { ProgressBar } from "../primitives/Progress";
import "./Clocks.css";

const weekday = (d: Date) => d.toLocaleDateString("en-US", { weekday: "short" });

/* ---------------------------------------------------------------- DigitalClock */

export interface DigitalClockProps {
  /** Freeze the clock; omit for live time. */
  value?: Date;
  /** Optional meter under the date (battery, day progress). */
  meter?: { value: number; label: string };
  className?: string;
}

/** Large time readout with date line and an optional meter. */
export function DigitalClock({ value, meter, className }: DigitalClockProps) {
  const now = useNow(1000, value);
  return (
    <Card as="section" padding="md" className={cx("ds-dclock", className)} aria-label="Clock">
      <time className="ds-dclock__time" dateTime={now.toISOString()}>
        {pad(now.getHours())}
        <span className="ds-dclock__colon">:</span>
        {pad(now.getMinutes())}
      </time>
      <p className="ds-dclock__date">
        {pad(now.getMonth() + 1)}/{pad(now.getDate())} {weekday(now)}
      </p>
      {meter && <ProgressBar value={meter.value} label={meter.label} valuePosition="end" className="ds-dclock__meter" />}
    </Card>
  );
}

/* ---------------------------------------------------------------- AnalogClock */

export interface AnalogClockProps {
  value?: Date;
  /** Diameter in px. Every measurement inside is a fraction of it. */
  size?: number;
  /** Position of the knob on the outer ring, 0–1. Defaults to the fraction of the day elapsed. */
  progress?: number;
  className?: string;
}

/**
 * Soft-UI analog clock. Geometry lives in a 200-unit viewBox:
 * ring r=96, ticks r 74→80 (majors from 70), raised face inset 13%, raised hub inset 35%.
 */
export function AnalogClock({ value, size = 220, progress, className }: AnalogClockProps) {
  const now = useNow(1000, value);
  const h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();
  const dayFraction = progress ?? (h * 3600 + m * 60 + s) / 86400;
  const knobAngle = (dayFraction * 360 - 90) * (Math.PI / 180);
  const hourDeg = ((h % 12) + m / 60) * 30;
  const minuteDeg = (m + s / 60) * 6;
  const secondDeg = s * 6;

  return (
    <div
      className={cx("ds-aclock", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Analog clock showing ${pad(h)}:${pad(m)}`}
    >
      <div className="ds-aclock__face" />
      <div className="ds-aclock__hub" />
      <svg viewBox="0 0 200 200" className="ds-aclock__svg" aria-hidden>
        <circle cx="100" cy="100" r="96" className="ds-aclock__ring" />
        {Array.from({ length: 60 }, (_, i) => {
          const major = i % 5 === 0;
          return (
            <line
              key={i}
              x1="100"
              y1={100 - (major ? 70 : 74)}
              x2="100"
              y2={100 - 80}
              className={major ? "ds-aclock__tick ds-aclock__tick--major" : "ds-aclock__tick"}
              transform={`rotate(${i * 6} 100 100)`}
            />
          );
        })}
        <line x1="100" y1="100" x2="100" y2="72" className="ds-aclock__hand ds-aclock__hand--hour" transform={`rotate(${hourDeg} 100 100)`} />
        <line x1="100" y1="100" x2="100" y2="50" className="ds-aclock__hand ds-aclock__hand--minute" transform={`rotate(${minuteDeg} 100 100)`} />
        <line x1="100" y1="112" x2="100" y2="44" className="ds-aclock__hand ds-aclock__hand--second" transform={`rotate(${secondDeg} 100 100)`} />
        <circle cx="100" cy="100" r="5" className="ds-aclock__pin" />
        <circle cx="100" cy="100" r="2" className="ds-aclock__pin-dot" />
        <circle cx={100 + 96 * Math.cos(knobAngle)} cy={100 + 96 * Math.sin(knobAngle)} r="5" className="ds-aclock__knob" />
      </svg>
    </div>
  );
}
