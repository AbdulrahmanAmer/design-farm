import type { ReactNode } from "react";
import { cx } from "../../lib/cx";
import { Card } from "../primitives/Card";
import { Icon } from "../primitives/Icon";
import "./Hero.css";

/* ---------------------------------------------------------------- Greeting */

export interface GreetingProps {
  name: string;
  question: string;
  description?: string;
  /** Inline content after the salutation, e.g. workspace tokens. */
  adornment?: ReactNode;
  className?: string;
}

/** Display-size welcome block at the top of the dashboard. */
export function Greeting({ name, question, description, adornment, className }: GreetingProps) {
  return (
    <section className={cx("ds-greeting", className)} aria-labelledby="ds-greeting-title">
      <h1 id="ds-greeting-title" className="ds-greeting__title">
        <span className="ds-greeting__hello">
          Hi, {name}! {adornment}
        </span>
        <span>{question}</span>
      </h1>
      {description && <p className="ds-greeting__desc">{description}</p>}
    </section>
  );
}

/** The pair of round workspace tokens next to the salutation. */
export function WorkspaceTokens() {
  return (
    <span className="ds-ws-tokens" aria-hidden>
      <span className="ds-ws-token">
        <Icon name="users" size={14} strokeWidth={2.2} />
      </span>
      <span className="ds-ws-token">
        <Icon name="target" size={14} strokeWidth={2.2} />
      </span>
    </span>
  );
}

/* ------------------------------------------------------------- FeatureCard */

export interface FeatureCardProps {
  illustration: ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
  className?: string;
}

/** Raised tile with a spot illustration, title and a one-line description. */
export function FeatureCard({ illustration, title, description, onClick, className }: FeatureCardProps) {
  return (
    <Card
      as={onClick ? "button" : "article"}
      elevation={2}
      padding="md"
      interactive={!!onClick}
      onClick={onClick}
      className={cx("ds-feature", className)}
    >
      <div className="ds-feature__art">{illustration}</div>
      <h3 className="ds-feature__title">{title}</h3>
      <p className="ds-feature__desc">{description}</p>
    </Card>
  );
}

/* -------------------------------------------------------------- CreateTile */

export interface CreateTileProps {
  label: string;
  /** square = empty board slot; row = "Add new assignment" bar. */
  layout?: "square" | "row";
  onClick?: () => void;
  className?: string;
}

/** Dashed creation affordance with an accent plus. */
export function CreateTile({ label, layout = "square", onClick, className }: CreateTileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={layout === "square" ? label : undefined}
      className={cx("ds-create", `ds-create--${layout}`, className)}
    >
      <span className="ds-create__plus">
        <Icon name="plus" size={14} strokeWidth={2.4} />
      </span>
      {layout === "row" && <span>{label}</span>}
    </button>
  );
}
