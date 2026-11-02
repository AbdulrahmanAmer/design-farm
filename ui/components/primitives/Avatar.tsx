import { cx } from "../../lib/cx";
import { Icon } from "./Icon";
import "./Avatar.css";

export interface AvatarProps {
  name: string;
  src?: string;
  size?: "xs" | "sm" | "md";
  className?: string;
}

const fills = [
  ["#ffd7b8", "#b9603a"],
  ["#c9e7ff", "#2f6d9e"],
  ["#ffd6e4", "#a53f66"],
  ["#d8f1e5", "#2f7d5c"],
  ["#e5ddff", "#5b47b8"],
];

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function fillFor(name: string) {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return fills[h % fills.length];
}

/** Photo avatar with an initials fallback whose colour is derived from the name. */
export function Avatar({ name, src, size = "sm", className }: AvatarProps) {
  const [bg, fg] = fillFor(name);
  return (
    <span className={cx("ds-avatar", `ds-avatar--${size}`, className)} style={{ background: bg, color: fg }} title={name}>
      {src ? <img src={src} alt={name} /> : <span aria-label={name}>{initials(name)}</span>}
    </span>
  );
}

export interface AvatarGroupProps {
  people: Array<{ name: string; src?: string }>;
  max?: number;
  size?: AvatarProps["size"];
  /** Renders the trailing "+" add-member button. */
  onAdd?: () => void;
  className?: string;
}

export function AvatarGroup({ people, max = 3, size = "sm", onAdd, className }: AvatarGroupProps) {
  const shown = people.slice(0, max);
  const extra = people.length - shown.length;
  return (
    <span className={cx("ds-avatar-group", className)}>
      {shown.map((p) => (
        <Avatar key={p.name} {...p} size={size} />
      ))}
      {extra > 0 && <span className={cx("ds-avatar", `ds-avatar--${size}`, "ds-avatar--more")}>+{extra}</span>}
      {onAdd && (
        <button type="button" className={cx("ds-avatar", `ds-avatar--${size}`, "ds-avatar--add")} onClick={onAdd} aria-label="Add member">
          <Icon name="plus" size={10} strokeWidth={2.5} />
        </button>
      )}
    </span>
  );
}
