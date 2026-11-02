import type { HTMLAttributes } from "react";
import { cx } from "../../lib/cx";
import "./Badge.css";

export type BadgeTone = "accent" | "success" | "danger" | "neutral";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  /** solid = filled chip ("Package design"), soft = tinted label ("High"). */
  variant?: "solid" | "soft";
  size?: "xs" | "sm" | "md";
}

/** Chips, tags, priority labels and micro badges ("NEW", "xls"). */
export function Badge({ tone = "accent", variant = "soft", size = "sm", className, ...rest }: BadgeProps) {
  return <span className={cx("ds-badge", `ds-badge--${tone}`, `ds-badge--${variant}`, `ds-badge--${size}`, className)} {...rest} />;
}

export interface StatusDotProps {
  tone?: "online" | "attention" | "accent" | "danger";
  /** Adds a halo in the parent background colour so the dot can overlap icons. */
  ring?: boolean;
  label?: string;
  className?: string;
}

export function StatusDot({ tone = "online", ring, label, className }: StatusDotProps) {
  return (
    <span
      className={cx("ds-dot", `ds-dot--${tone}`, ring && "ds-dot--ring", className)}
      role={label ? "status" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  );
}
