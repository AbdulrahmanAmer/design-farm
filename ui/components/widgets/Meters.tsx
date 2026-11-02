import { cx } from "../../lib/cx";
import { Card } from "../primitives/Card";
import "./Meters.css";

export interface MeterDatum {
  label: string;
  value: number;
  tone?: "accent" | "highlight";
}

/** One vertical well with a pill fill rising from the bottom. */
export function VerticalMeter({ label, value, tone = "accent" }: MeterDatum) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="ds-vmeter">
      <span className="ds-vmeter__value">{String(Math.round(pct)).padStart(2, "0")}%</span>
      <span
        className={cx("ds-vmeter__track", `ds-vmeter--${tone}`)}
        role="meter"
        aria-label={label}
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <span className="ds-vmeter__fill" style={{ height: `${Math.max(pct, 6)}%` }} />
      </span>
      <span className="ds-vmeter__label">{label}</span>
    </div>
  );
}

export interface MeterGroupProps {
  title: string;
  meters: MeterDatum[];
  className?: string;
}

/** Card of side-by-side vertical meters ("Count down": today / week / month / year). */
export function MeterGroup({ title, meters, className }: MeterGroupProps) {
  return (
    <Card as="section" padding="md" className={cx("ds-metergroup", className)}>
      <h3 className="ds-metergroup__title">{title}</h3>
      <div className="ds-metergroup__row">
        {meters.map((m) => (
          <VerticalMeter key={m.label} {...m} />
        ))}
      </div>
    </Card>
  );
}
