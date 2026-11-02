import { useRef, type KeyboardEvent } from "react";
import { cx } from "../../lib/cx";
import { Icon, type IconName } from "./Icon";
import "./SegmentedControl.css";

export interface SegmentOption<T extends string> {
  value: T;
  label?: string;
  icon?: IconName;
  /** Accessible name for icon-only segments. */
  ariaLabel?: string;
}

export interface SegmentedControlProps<T extends string> {
  options: readonly SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** filled = tinted track (theme switch); plain = no track (view switcher). */
  variant?: "filled" | "plain";
  size?: "sm" | "md";
  label: string;
  className?: string;
}

/** Radio-group style toggle: Light/Dark theme switch, list/grid/board view switcher. */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  variant = "filled",
  size = "md",
  label,
  className,
}: SegmentedControlProps<T>) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  function onKeyDown(e: KeyboardEvent, index: number) {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (index + step + options.length) % options.length;
    onChange(options[next].value);
    refs.current[next]?.focus();
  }

  return (
    <div role="radiogroup" aria-label={label} className={cx("ds-seg", `ds-seg--${variant}`, `ds-seg--${size}`, className)}>
      {options.map((o, i) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={o.label ? undefined : o.ariaLabel}
            tabIndex={active ? 0 : -1}
            className={cx("ds-seg__item", active && "is-active", !o.label && "ds-seg__item--icon")}
            onClick={() => onChange(o.value)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            {o.icon && <Icon name={o.icon} size={size === "sm" ? 13 : 14} />}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
