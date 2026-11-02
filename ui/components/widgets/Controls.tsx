import { useId, type ReactNode } from "react";
import { cx } from "../../lib/cx";
import { Card } from "../primitives/Card";
import { Icon, type IconName } from "../primitives/Icon";
import "./Controls.css";

/* ---------------------------------------------------------------- AppTile */

export interface AppTileProps {
  icon: IconName;
  label: string;
  size?: "md" | "lg";
  /** Solid glyph. Only for silhouette icons (camera, flashlight, fan); icons with inner detail stay outlined. */
  filled?: boolean;
  onClick?: () => void;
  className?: string;
}

/** Raised square launcher with an accent glyph. Presses in on :active. */
export function AppTile({ icon, label, size = "md", filled, onClick, className }: AppTileProps) {
  return (
    <button type="button" className={cx("ds-apptile", `ds-apptile--${size}`, className)} aria-label={label} title={label} onClick={onClick}>
      <Icon name={icon} size={size === "lg" ? 40 : 30} strokeWidth={filled ? 2.2 : 2.6} filled={filled} />
    </button>
  );
}

/** A card holding a 2-column grid of AppTiles. */
export function AppGrid({ apps, className }: { apps: AppTileProps[]; className?: string }) {
  return (
    <Card as="nav" padding="md" className={cx("ds-appgrid", className)} aria-label="Apps">
      {apps.map((a) => (
        <AppTile key={a.label} {...a} />
      ))}
    </Card>
  );
}

/* ---------------------------------------------------------------- KnobSwitch */

/** Default knob face: yellow eyes, accent smile. */
export function Smiley() {
  return (
    <svg viewBox="0 0 48 48" className="ds-smiley" aria-hidden>
      <ellipse cx="17" cy="16" rx="3" ry="4.5" className="ds-smiley__eye" />
      <ellipse cx="31" cy="16" rx="3" ry="4.5" className="ds-smiley__eye" />
      <path d="M9 26c3 9 9 13 15 13s12-4 15-13" className="ds-smiley__mouth" />
    </svg>
  );
}

export interface KnobSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Visible label inside the track. */
  children: ReactNode;
  knob?: ReactNode;
  className?: string;
}

/** Oversized toggle: inset track carrying a label, raised knob that slides across. */
export function KnobSwitch({ checked, onChange, children, knob = <Smiley />, className }: KnobSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={cx("ds-knobswitch", checked && "is-on", className)}
      onClick={() => onChange(!checked)}
    >
      <span className="ds-knobswitch__label">{children}</span>
      <span className="ds-knobswitch__knob">{knob}</span>
    </button>
  );
}

/* ---------------------------------------------------------------- IntakeStepper */

export interface IntakeStepperProps {
  title: string;
  value: number;
  max: number;
  onChange: (value: number) => void;
  /** Singular unit for the button labels, e.g. "glass". */
  unit?: string;
  className?: string;
}

/** − / + stepper around a cup that fills as the count rises. */
export function IntakeStepper({ title, value, max, onChange, unit = "glass", className }: IntakeStepperProps) {
  const level = Math.max(0, Math.min(1, value / max));
  // Cup interior spans y 8→52 in the 64-unit viewBox.
  const fillTop = 52 - 44 * level;
  const clipId = useId();
  return (
    <Card as="section" padding="md" className={cx("ds-intake", className)} aria-label={title}>
      <h3 className="ds-intake__title">{title}</h3>
      <div className="ds-intake__row">
        <button type="button" className="ds-intake__step" aria-label={`Remove a ${unit}`} disabled={value <= 0} onClick={() => onChange(value - 1)}>
          <Icon name="minus" size={18} strokeWidth={2.6} />
        </button>
        <span className="ds-intake__cup">
          <svg viewBox="0 0 64 64" aria-hidden>
            <defs>
              <clipPath id={clipId}>
                <path d="M10 8h36l-3 44a5 5 0 0 1-5 4.5H18A5 5 0 0 1 13 52Z" />
              </clipPath>
            </defs>
            <rect x="0" y={fillTop} width="64" height={64 - fillTop} clipPath={`url(#${clipId})`} className="ds-intake__water" />
            <path d="M10 8h36l-3 44a5 5 0 0 1-5 4.5H18A5 5 0 0 1 13 52Z" className="ds-intake__glass" />
            <path d="M45 18h4a7 7 0 0 1 0 14h-5" className="ds-intake__glass" />
          </svg>
          <output className="ds-intake__count" aria-live="polite">
            {value}/{max}
          </output>
        </span>
        <button type="button" className="ds-intake__step" aria-label={`Add a ${unit}`} disabled={value >= max} onClick={() => onChange(value + 1)}>
          <Icon name="plus" size={18} strokeWidth={2.6} />
        </button>
      </div>
    </Card>
  );
}
