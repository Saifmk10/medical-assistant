// =============================================================
// Badge — small status pill
// -------------------------------------------------------------
// Maps a status string to consistent colours across the app.
// Add new statuses here rather than hardcoding colours inline.
//
// Props:
//   status — one of the keys in STATUS_STYLES (fallback: slate)
//   pulse  — show the animated "live" dot (for active states)
// =============================================================
const STATUS_STYLES = {
  // Work / appointment states
  'On Duty': 'bg-green-100 text-green-700',
  'In Surgery': 'bg-red-100 text-red-700',
  'On Break': 'bg-amber-100 text-amber-700',
  Completed: 'bg-green-100 text-green-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  Upcoming: 'bg-slate-200 text-slate-600',
  Open: 'bg-amber-100 text-amber-700',

  // Severity / priority states
  Critical: 'bg-red-100 text-red-700',
  Serious: 'bg-amber-100 text-amber-700',
  Stable: 'bg-green-100 text-green-700',
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-amber-100 text-amber-700',
  Low: 'bg-slate-200 text-slate-600',
};

// Statuses that get the animated dot (something is actively happening)
const PULSE_STATUSES = new Set(['In Progress', 'In Surgery', 'Critical', 'High']);

export default function Badge({ status }) {
  const style = STATUS_STYLES[status] ?? 'bg-slate-200 text-slate-600';
  const pulse = PULSE_STATUSES.has(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${style}`}
    >
      {/* Animated dot for live/active statuses */}
      {pulse && <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-current" />}
      {status}
    </span>
  );
}
