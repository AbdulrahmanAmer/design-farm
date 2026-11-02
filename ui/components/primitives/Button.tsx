import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "../../lib/cx";
import { Icon, type IconName } from "./Icon";
import "./Button.css";

export type ButtonVariant = "primary" | "inverse" | "soft" | "ghost" | "dashed";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leadingIcon?: IconName;
  trailingIcon?: IconName;
  /** Slot rendered after the label, e.g. a Badge ("xls"). */
  trailing?: ReactNode;
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  leadingIcon,
  trailingIcon,
  trailing,
  fullWidth,
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  const iconSize = size === "sm" ? 13 : 15;
  return (
    <button
      type={type}
      className={cx("ds-btn", `ds-btn--${variant}`, `ds-btn--${size}`, fullWidth && "ds-btn--full", className)}
      {...rest}
    >
      {leadingIcon && <Icon name={leadingIcon} size={iconSize} />}
      {children && <span className="ds-btn__label">{children}</span>}
      {trailingIcon && <Icon name={trailingIcon} size={iconSize} />}
      {trailing}
    </button>
  );
}

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconName;
  /** Accessible name; required because the button has no visible text. */
  label: string;
  variant?: "ghost" | "soft" | "accent" | "surface";
  size?: ButtonSize;
  /** Small indicator dot in the corner (notifications). */
  dot?: boolean;
}

export function IconButton({
  icon,
  label,
  variant = "ghost",
  size = "md",
  dot,
  className,
  type = "button",
  ...rest
}: IconButtonProps) {
  const iconSize = size === "sm" ? 14 : size === "lg" ? 20 : 18;
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cx("ds-icon-btn", `ds-icon-btn--${variant}`, `ds-icon-btn--${size}`, className)}
      {...rest}
    >
      <Icon name={icon} size={iconSize} />
      {dot && <span className="ds-icon-btn__dot" aria-hidden />}
    </button>
  );
}
