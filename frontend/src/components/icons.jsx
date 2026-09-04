// =============================================================
// icons.jsx — central inline-SVG icon set
// -------------------------------------------------------------
// Keeping icons as tiny React components avoids an icon-library
// dependency and keeps bundle size small. Every icon accepts a
// `className` so callers control size/colour via Tailwind
// (e.g. <IconUsers className="h-5 w-5 text-white" />).
// All icons use stroke="currentColor" so `text-*` sets colour.
// =============================================================

// Shared props spread onto every <svg> for consistency
const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24',
  'aria-hidden': true,
};

// Medical cross — brand / logo mark
export function IconMedicalCross({ className = 'h-6 w-6' }) {
  return (
    <svg {...base} className={className}>
      <path d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7z" />
    </svg>
  );
}

// Shield — Admin role
export function IconShield({ className = 'h-6 w-6' }) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

// Stethoscope — Doctor role
export function IconStethoscope({ className = 'h-6 w-6' }) {
  return (
    <svg {...base} className={className}>
      <path d="M6 3v5a4 4 0 0 0 8 0V3" />
      <path d="M10 12v3a5 5 0 0 0 10 0v-1" />
      <circle cx="20" cy="12" r="2" />
    </svg>
  );
}

// Wrench — Maintenance role
export function IconWrench({ className = 'h-6 w-6' }) {
  return (
    <svg {...base} className={className}>
      <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4L14 13l-3-3z" />
    </svg>
  );
}

// Users — staff / patients
export function IconUsers({ className = 'h-6 w-6' }) {
  return (
    <svg {...base} className={className}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <path d="M16 4.5a3.5 3.5 0 0 1 0 7M17.5 14.5c2 .8 3.5 2.8 3.5 5.5" />
    </svg>
  );
}

// Calendar — appointments / schedules
export function IconCalendar({ className = 'h-6 w-6' }) {
  return (
    <svg {...base} className={className}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 10h18" />
    </svg>
  );
}

// Bed — occupancy
export function IconBed({ className = 'h-6 w-6' }) {
  return (
    <svg {...base} className={className}>
      <path d="M3 18V8M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-8v5" />
      <circle cx="7" cy="10" r="1.6" />
    </svg>
  );
}

// Clipboard — reports / prescriptions
export function IconClipboard({ className = 'h-6 w-6' }) {
  return (
    <svg {...base} className={className}>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4a3 3 0 0 1 6 0M9 11h6M9 15h4" />
    </svg>
  );
}

// Alert triangle — warnings / urgent items
export function IconAlert({ className = 'h-6 w-6' }) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3l10 18H2z" />
      <path d="M12 10v5M12 18.5v.5" />
    </svg>
  );
}

// Check circle — completed items
export function IconCheck({ className = 'h-6 w-6' }) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l2.5 2.5L16 9.5" />
    </svg>
  );
}

// Clock — times / schedules
export function IconClock({ className = 'h-6 w-6' }) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

// Logout arrow — sign-out button
export function IconLogout({ className = 'h-6 w-6' }) {
  return (
    <svg {...base} className={className}>
      <path d="M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 17l5-5-5-5M15 12H3" />
    </svg>
  );
}

// Heartbeat pulse — decorative / stats
export function IconPulse({ className = 'h-6 w-6' }) {
  return (
    <svg {...base} className={className}>
      <path d="M3 12h4l2-6 4 12 2.5-6H21" />
    </svg>
  );
}

// Map-pin — locations
export function IconPin({ className = 'h-6 w-6' }) {
  return (
    <svg {...base} className={className}>
      <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}
