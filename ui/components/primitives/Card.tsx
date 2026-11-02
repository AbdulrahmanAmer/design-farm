import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cx } from "../../lib/cx";
import "./Card.css";

export type Elevation = 0 | 1 | 2 | 3;

export interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  /** 0 flat · 1 resting card · 2 raised (feature tiles, active row) · 3 floating (popovers, dragged card) */
  elevation?: Elevation;
  padding?: "none" | "sm" | "md" | "lg";
  radius?: "lg" | "xl" | "2xl";
  tone?: "surface" | "accent" | "sunken";
  interactive?: boolean;
}

/** The base surface every widget sits on. */
export function Card({
  as: Tag = "div",
  elevation = 1,
  padding = "lg",
  radius = "xl",
  tone = "surface",
  interactive,
  className,
  ...rest
}: CardProps) {
  return (
    <Tag
      className={cx(
        "ds-card",
        `ds-card--e${elevation}`,
        `ds-card--p-${padding}`,
        `ds-card--r-${radius}`,
        `ds-card--${tone}`,
        interactive && "ds-card--interactive",
        className,
      )}
      {...rest}
    />
  );
}

export interface CardHeaderProps {
  title: ReactNode;
  /** Heading level; cards on a dashboard are usually h2. */
  level?: 2 | 3;
  /** Right-aligned slot: actions, view switchers, pagers. */
  actions?: ReactNode;
  /** Inline content that follows the title (e.g. an AvatarGroup). */
  adornment?: ReactNode;
  className?: string;
}

export function CardHeader({ title, level = 2, actions, adornment, className }: CardHeaderProps) {
  const H = level === 2 ? "h2" : "h3";
  return (
    <header className={cx("ds-card-header", className)}>
      <div className="ds-card-header__title">
        <H>{title}</H>
        {adornment}
      </div>
      {actions && <div className="ds-card-header__actions">{actions}</div>}
    </header>
  );
}
