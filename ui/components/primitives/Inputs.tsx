import type { InputHTMLAttributes, ReactNode } from "react";
import { cx } from "../../lib/cx";
import { Icon, type IconName } from "./Icon";
import "./Inputs.css";

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  /** Keyboard hint rendered at the end, e.g. "⌘K". */
  shortcut?: string;
}

/** Command/search field from the top bar. */
export function SearchInput({ label = "Search", shortcut, className, placeholder = "Search or type command", ...rest }: SearchInputProps) {
  return (
    <label className={cx("ds-search", className)}>
      <Icon name="search" size={15} className="ds-search__icon" />
      <span className="ds-visually-hidden">{label}</span>
      <input type="search" placeholder={placeholder} {...rest} />
      {shortcut && <kbd className="ds-search__kbd">{shortcut}</kbd>}
    </label>
  );
}

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

/** Inline reply field on the sunken background (message notification). */
export function TextField({ label, className, ...rest }: TextFieldProps) {
  return (
    <label className={cx("ds-textfield", className)}>
      <span className="ds-visually-hidden">{label}</span>
      <input {...rest} />
    </label>
  );
}

export interface MetaItemProps {
  icon?: IconName;
  children: ReactNode;
  className?: string;
}

/** Icon + caption pair: dates, times, attachment counts. */
export function MetaItem({ icon, children, className }: MetaItemProps) {
  return (
    <span className={cx("ds-meta", className)}>
      {icon && <Icon name={icon} size={13} />}
      {children}
    </span>
  );
}

/** Dotted rule used between calendar time blocks. */
export function DottedRule({ className }: { className?: string }) {
  return <span className={cx("ds-dotted-rule", className)} aria-hidden />;
}
