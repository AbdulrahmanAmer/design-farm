import { cx } from "../../lib/cx";
import { pad, useNow } from "../../lib/useNow";
import { Card } from "../primitives/Card";
import { Icon, type IconName } from "../primitives/Icon";
import "./Readouts.css";

/* ---------------------------------------------------------------- DayChips */

export interface DayChipsProps {
  days: number[];
  selected: number;
  onSelect?: (day: number) => void;
  label?: string;
  className?: string;
}

/** Row of round date chips; the selected one takes the selection colour. */
export function DayChips({ days, selected, onSelect, label = "Day", className }: DayChipsProps) {
  return (
    <div className={cx("ds-daychips", className)} role="group" aria-label={label}>
      {days.map((d) => (
        <button
          key={d}
          type="button"
          className={cx("ds-daychip", d === selected && "is-active")}
          aria-pressed={d === selected}
          onClick={() => onSelect?.(d)}
        >
          {d}
        </button>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- WeatherCard */

export interface WeatherCardProps {
  condition: string;
  temperature: number;
  unit?: string;
  icon?: IconName;
  days: number[];
  selectedDay: number;
  onSelectDay?: (day: number) => void;
  className?: string;
}

/** Condition + temperature readout on a raised plate, with a day picker below. */
export function WeatherCard({ condition, temperature, unit = "°C", icon = "sun", days, selectedDay, onSelectDay, className }: WeatherCardProps) {
  return (
    <Card as="section" padding="md" className={cx("ds-weather", className)} aria-label="Weather">
      <div className="ds-weather__plate">
        <div className="ds-weather__reading">
          <span className="ds-weather__condition">{condition}</span>
          <span className="ds-weather__temp">
            {pad(temperature)}
            <span className="ds-weather__unit">{unit}</span>
          </span>
        </div>
        <Icon name={icon} size={30} strokeWidth={1.6} className="ds-weather__icon" />
      </div>
      <DayChips days={days} selected={selectedDay} onSelect={onSelectDay} />
    </Card>
  );
}

/* ---------------------------------------------------------------- Countdown */

export interface TimeChipProps {
  value: number;
  unit: string;
  digits?: number;
}

/** Accent pill holding a zero-padded number with its unit set small after it. */
export function TimeChip({ value, unit, digits = 2 }: TimeChipProps) {
  return (
    <span className="ds-timechip">
      <span className="ds-timechip__value">{pad(value, digits)}</span>
      <span className="ds-timechip__unit">{unit}</span>
    </span>
  );
}

export interface CountdownCardProps {
  title: string;
  target: Date;
  /** Freeze "now" for stories and screenshots. */
  now?: Date;
  className?: string;
}

/** Days / hours / minutes left until `target`, refreshed every 30 s. */
export function CountdownCard({ title, target, now: fixedNow, className }: CountdownCardProps) {
  const now = useNow(30_000, fixedNow);
  const totalMin = Math.max(0, Math.floor((target.getTime() - now.getTime()) / 60_000));
  const d = Math.floor(totalMin / 1440);
  const h = Math.floor((totalMin % 1440) / 60);
  const m = totalMin % 60;
  return (
    <Card as="section" padding="md" className={cx("ds-countdown", className)}>
      <h3 className="ds-countdown__title">{title}</h3>
      <p className="ds-countdown__chips" role="timer" aria-label={`${d} days, ${h} hours, ${m} minutes left`}>
        <TimeChip value={d} unit="d" digits={3} />
        <TimeChip value={h} unit="h" />
        <TimeChip value={m} unit="m" />
      </p>
    </Card>
  );
}
