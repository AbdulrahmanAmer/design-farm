import type { ReactNode } from "react";
import { cx } from "../../lib/cx";
import "./Illustrations.css";

/**
 * Line-art spot illustrations. Strokes use currentColor (ink by default) and
 * fills read --ds-illus-paper / --ds-illus-accent so they adapt to the surface.
 */
function Spot({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <svg
      className={cx("ds-illus", className)}
      viewBox="0 0 120 100"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={label}
    >
      {children}
    </svg>
  );
}

const paper = "var(--ds-illus-paper)";
const accent = "var(--ds-illus-accent)";
const ink = "currentColor";

export function CalendarIllustration({ className }: { className?: string }) {
  const cells = [30, 44, 58, 72].flatMap((x) => [44, 56, 68].map((y) => ({ x, y })));
  return (
    <Spot label="Spiral calendar with a highlighted day" className={className}>
      <g transform="rotate(-7 60 55)">
        <rect x="22" y="20" width="74" height="68" rx="7" fill={paper} />
        <path d="M22 36h74" />
        {[32, 44, 56, 68, 80].map((x) => (
          <g key={x}>
            <circle cx={x} cy="24" r="2.4" fill={paper} />
            <path d={`M${x} 12v10`} />
          </g>
        ))}
        {cells.map(({ x, y }) => (
          <rect
            key={`${x}-${y}`}
            x={x}
            y={y}
            width="10"
            height="8"
            rx="1.6"
            fill={x === 44 && y === 56 ? accent : x === 30 && y === 68 ? ink : paper}
          />
        ))}
      </g>
      <path d="M84 66l9 21 3-8.5 8.5-3z" fill={paper} />
    </Spot>
  );
}

export function NotesIllustration({ className }: { className?: string }) {
  return (
    <Spot label="Notes hanging on a line" className={className}>
      <path d="M6 20c34 10 74 10 108-2" />
      <g transform="rotate(-12 30 52)">
        <rect x="14" y="28" width="34" height="46" rx="3" fill={paper} />
        <path d="M21 40h20M21 47h14M21 54h18" />
        <rect x="24" y="22" width="6" height="10" rx="1" fill={ink} />
      </g>
      <g transform="rotate(9 62 58)">
        <rect x="48" y="32" width="30" height="42" rx="3" fill={paper} />
        <rect x="54" y="42" width="18" height="8" rx="1.5" fill={accent} />
        <path d="M54 58h14M54 64h10" />
        <rect x="58" y="26" width="6" height="10" rx="1" fill={ink} />
      </g>
      <g transform="rotate(-5 96 46)">
        <rect x="82" y="26" width="28" height="36" rx="3" fill={paper} />
        <path d="M89 37l12 12M101 37L89 49" />
        <rect x="92" y="20" width="6" height="10" rx="1" fill={ink} />
      </g>
    </Spot>
  );
}

export function CollaborateIllustration({ className }: { className?: string }) {
  return (
    <Spot label="Shared browser window with message bubble" className={className}>
      <rect x="16" y="20" width="78" height="58" rx="5" fill={paper} />
      <path d="M16 31h78" />
      <circle cx="23" cy="25.5" r="1.4" fill={ink} />
      <circle cx="28.5" cy="25.5" r="1.4" fill={ink} />
      <rect x="30" y="40" width="46" height="12" rx="3" fill={accent} />
      <path d="M37 46h20" stroke={paper} />
      <path d="M28 60h30M28 66h20" />
      <rect x="80" y="8" width="30" height="22" rx="3" fill={paper} />
      <path d="M86 15h6M100 13l5 5M105 13l-5 5" />
      <rect x="22" y="84" width="16" height="8" rx="2" fill={paper} />
      <rect x="42" y="84" width="22" height="8" rx="2" fill={ink} />
      <rect x="68" y="84" width="16" height="8" rx="2" fill={paper} />
      <rect x="88" y="84" width="10" height="8" rx="2" fill={accent} />
    </Spot>
  );
}

export function GiftIllustration({ className }: { className?: string }) {
  return (
    <Spot label="Hands presenting a gift box" className={className}>
      {/* sparkles */}
      <path d="M26 18v8M22 22h8M96 14v6M93 17h6M100 42l4 4M104 42l-4 4" />
      <circle cx="18" cy="44" r="2" fill={paper} />
      <circle cx="84" cy="10" r="1.6" fill={ink} />
      {/* box */}
      <rect x="44" y="44" width="32" height="26" rx="3" fill={ink} />
      <rect x="40" y="36" width="40" height="10" rx="2" fill={paper} />
      <path d="M60 36v34" stroke={paper} />
      <path d="M60 36c-6-10-16-8-14-2 1 3 8 3 14 2zM60 36c6-10 16-8 14-2-1 3-8 3-14 2z" fill={paper} />
      <path d="M50 56l4 3M66 54l3 4" stroke={paper} />
      {/* hands */}
      <path d="M8 98c4-14 12-24 24-30l14 2c4 1 4 7-1 7h-8l-2 4 16 1" fill={paper} />
      <path d="M112 98c-4-14-12-24-24-30l-14 2c-4 1-4 7 1 7h8l2 4-16 1" fill={paper} />
    </Spot>
  );
}
