import { cx } from "../../lib/cx";
import { IconButton } from "../primitives/Button";
import { Card, CardHeader } from "../primitives/Card";
import { Icon, type IconName } from "../primitives/Icon";
import { DottedRule } from "../primitives/Inputs";
import "./Calendar.css";

/* ---------------------------------------------------------------- WeekStrip */

export interface WeekDay {
  weekday: string;
  date: number;
  /** ISO date, used as key and accessible label. */
  iso: string;
}

export interface WeekStripProps {
  days: WeekDay[];
  selected: string;
  onSelect?: (iso: string) => void;
  className?: string;
}

/** Seven-day picker with a filled accent circle on the selected date. */
export function WeekStrip({ days, selected, onSelect, className }: WeekStripProps) {
  return (
    <div className={cx("ds-week", className)} role="group" aria-label="Week">
      {days.map((d) => {
        const active = d.iso === selected;
        return (
          <button
            key={d.iso}
            type="button"
            className={cx("ds-week__day", active && "is-active")}
            aria-pressed={active}
            aria-label={d.iso}
            onClick={() => onSelect?.(d.iso)}
          >
            <span className="ds-week__weekday">{d.weekday}</span>
            <span className="ds-week__date">{d.date}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------------- Agenda */

export interface AgendaEvent {
  id: string;
  icon: IconName;
  title: string;
  time: string;
  tag: string;
  tagTone?: "accent" | "danger" | "success";
}

export function AgendaItem({ event, onMore }: { event: AgendaEvent; onMore?: (id: string) => void }) {
  return (
    <li className="ds-agenda__item">
      <span className="ds-agenda__icon">
        <Icon name={event.icon} size={16} />
      </span>
      <div className="ds-agenda__text">
        <p className="ds-agenda__title">{event.title}</p>
        <p className="ds-agenda__meta">
          {event.time}
          <span className={cx("ds-agenda__tagdot", `ds-agenda__tagdot--${event.tagTone ?? "accent"}`)} aria-hidden />
          {event.tag}
        </p>
      </div>
      <IconButton icon="moreVertical" label={`Options for ${event.title}`} size="sm" onClick={() => onMore?.(event.id)} />
    </li>
  );
}

export interface AgendaSlot {
  time: string;
  events: AgendaEvent[];
}

export function TimeSlot({ slot, onMore }: { slot: AgendaSlot; onMore?: (id: string) => void }) {
  return (
    <section className="ds-agenda__slot">
      <h3 className="ds-agenda__time">
        <span>{slot.time}</span>
        <DottedRule />
      </h3>
      <ul className="ds-agenda__list">
        {slot.events.map((e) => (
          <AgendaItem key={e.id} event={e} onMore={onMore} />
        ))}
      </ul>
    </section>
  );
}

/* ---------------------------------------------------------------- CalendarCard */

export interface CalendarCardProps {
  monthLabel: string;
  days: WeekDay[];
  selected: string;
  slots: AgendaSlot[];
  onSelect?: (iso: string) => void;
  onPrev?: () => void;
  onNext?: () => void;
  onEventMore?: (id: string) => void;
  className?: string;
}

export function CalendarCard({ monthLabel, days, selected, slots, onSelect, onPrev, onNext, onEventMore, className }: CalendarCardProps) {
  return (
    <Card as="section" className={cx("ds-calendar", className)} aria-label={`Calendar, ${monthLabel}`}>
      <CardHeader
        title={monthLabel}
        actions={
          <>
            <IconButton icon="chevronLeft" label="Previous week" size="sm" variant="soft" className="ds-calendar__pager" onClick={onPrev} />
            <IconButton icon="chevronRight" label="Next week" size="sm" variant="soft" className="ds-calendar__pager" onClick={onNext} />
          </>
        }
      />
      <WeekStrip days={days} selected={selected} onSelect={onSelect} />
      <div className="ds-agenda">
        {slots.map((s) => (
          <TimeSlot key={s.time} slot={s} onMore={onEventMore} />
        ))}
      </div>
    </Card>
  );
}
