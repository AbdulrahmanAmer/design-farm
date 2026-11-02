import type { ReactNode } from "react";
import { cx } from "../../lib/cx";
import { Button } from "../primitives/Button";
import { Card, CardHeader } from "../primitives/Card";
import { ProgressRing } from "../primitives/Progress";
import "./Cards.css";

/* ---------------------------------------------------------------- PromoCard */

export interface PromoCardProps {
  illustration: ReactNode;
  title: string;
  description: string;
  ctaLabel: string;
  onCta?: () => void;
  className?: string;
}

/** Full-bleed accent upsell card. */
export function PromoCard({ illustration, title, description, ctaLabel, onCta, className }: PromoCardProps) {
  return (
    <Card as="section" tone="accent" radius="2xl" elevation={2} className={cx("ds-promo", className)}>
      <div className="ds-promo__art">{illustration}</div>
      <h2 className="ds-promo__title">{title}</h2>
      <p className="ds-promo__desc">{description}</p>
      <Button variant="inverse" size="lg" className="ds-promo__cta" onClick={onCta}>
        {ctaLabel}
      </Button>
    </Card>
  );
}

/* ---------------------------------------------------------------- StatCard */

export interface StatCardProps {
  value: number;
  tone: "success" | "danger" | "accent";
  eyebrow: string;
  title: string;
  caption: string;
  detail: string;
  action?: { label: string; onClick?: () => void };
  className?: string;
}

/** Progress-ring summary of a workstream. */
export function StatCard({ value, tone, eyebrow, title, caption, detail, action, className }: StatCardProps) {
  return (
    <Card as="article" padding="md" className={cx("ds-stat", `ds-stat--${tone}`, className)}>
      <div className="ds-stat__head">
        <ProgressRing value={value} tone={tone} size={48} label={`${title} completion`} />
        <div className="ds-stat__labels">
          <span className="ds-stat__eyebrow">{eyebrow}</span>
          <h3 className="ds-stat__title">{title}</h3>
        </div>
      </div>
      <div className="ds-stat__foot">
        <p className="ds-stat__caption">
          {caption}
          <br />
          {detail}
        </p>
        {action && (
          <Button size="sm" onClick={action.onClick}>
            {action.label}
          </Button>
        )}
      </div>
    </Card>
  );
}

/* ---------------------------------------------------------------- MeetingCard */

export interface MeetingCardProps {
  title: string;
  when: string;
  description: string;
  onEdit?: () => void;
  onReschedule?: () => void;
  onAccept?: () => void;
  className?: string;
}

/** Invitation card with a schedule line and a secondary/primary action pair. */
export function MeetingCard({ title, when, description, onEdit, onReschedule, onAccept, className }: MeetingCardProps) {
  return (
    <Card as="section" padding="md" className={cx("ds-meeting", className)}>
      <CardHeader
        title={title}
        actions={
          <Button variant="ghost" size="sm" leadingIcon="edit" onClick={onEdit}>
            Edit
          </Button>
        }
      />
      <p className="ds-meeting__when">
        <span className="ds-meeting__dot" aria-hidden />
        {when}
      </p>
      <div className="ds-meeting__foot">
        <p className="ds-meeting__desc">{description}</p>
        <div className="ds-meeting__actions">
          <Button variant="soft" onClick={onReschedule}>
            Reschedule
          </Button>
          <Button onClick={onAccept}>Accept invite</Button>
        </div>
      </div>
    </Card>
  );
}
