import type { ReactNode } from "react";
import { cx } from "../../lib/cx";
import { Icon, type IconName } from "../primitives/Icon";
import { Badge, StatusDot } from "../primitives/Badge";
import "./Navigation.css";

/* ---------------------------------------------------------------- NavTabs */

export interface NavTab<T extends string> {
  id: T;
  label: string;
  icon: IconName;
  href?: string;
}

export interface NavTabsProps<T extends string> {
  tabs: readonly NavTab<T>[];
  active: T;
  onChange?: (id: T) => void;
  label?: string;
}

/** Top-level product navigation: icon + label links with an underline on the current one. */
export function NavTabs<T extends string>({ tabs, active, onChange, label = "Primary" }: NavTabsProps<T>) {
  return (
    <nav aria-label={label} className="ds-navtabs">
      {tabs.map((t) => (
        <a
          key={t.id}
          href={t.href ?? `#${t.id}`}
          aria-current={t.id === active ? "page" : undefined}
          className={cx("ds-navtabs__item", t.id === active && "is-active")}
          onClick={(e) => {
            if (onChange) {
              e.preventDefault();
              onChange(t.id);
            }
          }}
        >
          <Icon name={t.icon} size={15} />
          {t.label}
        </a>
      ))}
    </nav>
  );
}

/* ----------------------------------------------------------------- TopBar */

export interface TopBarProps {
  start: ReactNode;
  center?: ReactNode;
  end?: ReactNode;
  className?: string;
}

/** Three-slot application header: navigation, search, actions. */
export function TopBar({ start, center, end, className }: TopBarProps) {
  return (
    <header className={cx("ds-topbar", className)}>
      <div className="ds-topbar__start">{start}</div>
      {center && <div className="ds-topbar__center">{center}</div>}
      {end && <div className="ds-topbar__end">{end}</div>}
    </header>
  );
}

/* ---------------------------------------------------------------- SideRail */

export interface RailItem<T extends string> {
  id: T;
  icon: IconName;
  label: string;
  /** Pill badge next to the icon, e.g. "NEW". */
  badge?: string;
  /** Status dot on the icon corner. */
  dot?: "online" | "attention";
}

export interface SideRailProps<T extends string> {
  items: readonly RailItem<T>[];
  active: T;
  onSelect?: (id: T) => void;
  className?: string;
}

/** Wave cap in a 100×150 box: leaves the frame edge at x=0 and reaches full width at the bottom. */
const RAIL_CAP_PATH = "M0 0 C0 50 26 62 56 74 C88 88 100 108 100 150 L0 150 Z";

/**
 * The accent-coloured vertical rail with the organic wave silhouette.
 * The two curved caps keep a fixed 2:3 aspect ratio and only the straight body
 * stretches, so the curve geometry is identical at any height and the rail
 * grows with its item count.
 */
export function SideRail<T extends string>({ items, active, onSelect, className }: SideRailProps<T>) {
  return (
    <nav aria-label="Workspace" className={cx("ds-rail", className)}>
      <div className="ds-rail__shape" aria-hidden>
        <svg className="ds-rail__cap" viewBox="0 0 100 150" preserveAspectRatio="none">
          <path d={RAIL_CAP_PATH} />
        </svg>
        <div className="ds-rail__body" />
        <svg className="ds-rail__cap ds-rail__cap--end" viewBox="0 0 100 150" preserveAspectRatio="none">
          <path d={RAIL_CAP_PATH} />
        </svg>
      </div>
      <ul className="ds-rail__list">
        {items.map((it) => {
          const isActive = it.id === active;
          return (
            <li key={it.id}>
              <button
                type="button"
                className={cx("ds-rail__item", isActive && "is-active")}
                aria-label={it.label}
                aria-current={isActive ? "page" : undefined}
                title={it.label}
                onClick={() => onSelect?.(it.id)}
              >
                <Icon name={it.icon} size={20} />
                {it.dot && <StatusDot tone={it.dot} className="ds-rail__dot" />}
                {it.badge && (
                  <Badge tone="success" variant="solid" size="xs" className="ds-rail__badge">
                    {it.badge}
                  </Badge>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* ---------------------------------------------------------------- AppShell */

export interface AppShellProps {
  rail: ReactNode;
  topBar: ReactNode;
  children: ReactNode;
  className?: string;
}

/** The rounded application frame that floats on the canvas and hosts rail + header + content. */
export function AppShell({ rail, topBar, children, className }: AppShellProps) {
  return (
    <div className={cx("ds-shell", className)}>
      <div className="ds-shell__rail">{rail}</div>
      <div className="ds-shell__body">
        {topBar}
        <main className="ds-shell__main">{children}</main>
      </div>
    </div>
  );
}
