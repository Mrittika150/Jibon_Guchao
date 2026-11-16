import type { ReactNode } from "react";

// Small line icons for the journal toolbar. "currentColor" follows the button's text colour.
function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

export function BulletListIcon() {
  return (
    <Icon>
      <path d="M9 6h11M9 12h11M9 18h11" />
      <circle cx="4.5" cy="6" r="1" fill="currentColor" />
      <circle cx="4.5" cy="12" r="1" fill="currentColor" />
      <circle cx="4.5" cy="18" r="1" fill="currentColor" />
    </Icon>
  );
}

export function NumberListIcon() {
  return (
    <Icon>
      <path d="M10 6h10M10 12h10M10 18h10" />
      <path d="M4 5l1.5-1V9" />
      <path d="M3.5 13.5c0-1 .8-1.5 1.5-1.5s1.5.5 1.5 1.3c0 1.2-3 2.2-3 3.7h3" />
    </Icon>
  );
}

export function ChecklistIcon() {
  return (
    <Icon>
      <rect x="3" y="4" width="6" height="6" rx="1.5" />
      <path d="M4.5 7l1 1 2-2" />
      <rect x="3" y="14" width="6" height="6" rx="1.5" />
      <path d="M13 7h8M13 17h8" />
    </Icon>
  );
}

export function QuoteIcon() {
  return (
    <Icon>
      <path d="M8 7c-2.5 1-4 3-4 6v4h5v-5H6" />
      <path d="M19 7c-2.5 1-4 3-4 6v4h5v-5h-3" />
    </Icon>
  );
}

export function HighlightIcon() {
  return (
    <Icon>
      <path d="M14 4l6 6-8 8H6v-6z" />
      <path d="M4 21h8" />
    </Icon>
  );
}

export function UndoIcon() {
  return (
    <Icon>
      <path d="M9 14L4 9l5-5" />
      <path d="M4 9h11a5 5 0 0 1 0 10h-3" />
    </Icon>
  );
}

export function RedoIcon() {
  return (
    <Icon>
      <path d="M15 14l5-5-5-5" />
      <path d="M20 9H9a5 5 0 0 0 0 10h3" />
    </Icon>
  );
}

export function IdeaIcon() {
  return (
    <Icon>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.4 1 1.1 1 1.8V16h5v-.3c0-.7.4-1.4 1-1.8A6 6 0 0 0 12 3z" />
    </Icon>
  );
}

export function ClockIcon() {
  return (
    <Icon>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </Icon>
  );
}
