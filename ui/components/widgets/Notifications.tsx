import type { ReactNode } from "react";
import { cx } from "../../lib/cx";
import { IconButton } from "../primitives/Button";
import type { IconName } from "../primitives/Icon";
import "./Notifications.css";

/* -------------------------------------------------------- NotificationItem */

export interface NotificationItemProps {
  title: ReactNode;
  /** Inline marker after the title, e.g. a StatusDot. */
  titleAdornment?: ReactNode;
  subtitle?: ReactNode;
  /** Row of MetaItems. */
  meta?: ReactNode;
  /** Extra body such as a quick-reply TextField. */
  children?: ReactNode;
  onMore?: () => void;
  /** raised = floating on top of its swipe actions; resting = sits inside the panel. */
  state?: "resting" | "raised";
  className?: string;
}

export function NotificationItem({
  title,
  titleAdornment,
  subtitle,
  meta,
  children,
  onMore,
  state = "resting",
  className,
}: NotificationItemProps) {
  return (
    <article className={cx("ds-notif", `ds-notif--${state}`, className)}>
      <header className="ds-notif__head">
        <h3 className="ds-notif__title">
          {title}
          {titleAdornment}
        </h3>
        <IconButton icon="more" label="More options" size="sm" onClick={onMore} />
      </header>
      {subtitle && <p className="ds-notif__subtitle">{subtitle}</p>}
      {meta && <div className="ds-notif__meta">{meta}</div>}
      {children && <div className="ds-notif__body">{children}</div>}
    </article>
  );
}

/* ------------------------------------------------------------ SwipeActions */

export interface SwipeAction {
  icon: IconName;
  label: string;
  onClick?: () => void;
}

export interface SwipeActionsProps {
  actions: SwipeAction[];
  /** When open, the content slides left and lifts to reveal the action tray. */
  open?: boolean;
  children: ReactNode;
  className?: string;
}

/** Action tray revealed behind a list item (delete / edit). */
export function SwipeActions({ actions, open = false, children, className }: SwipeActionsProps) {
  return (
    <div className={cx("ds-swipe", open && "is-open", className)}>
      <div className="ds-swipe__tray" aria-hidden={!open}>
        {actions.map((a) => (
          <IconButton key={a.label} icon={a.icon} label={a.label} size="sm" onClick={a.onClick} tabIndex={open ? 0 : -1} />
        ))}
      </div>
      <div className="ds-swipe__content">{children}</div>
    </div>
  );
}
