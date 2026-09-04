// =============================================================
// ProgressBar — labelled capacity/health bar
// -------------------------------------------------------------
// Black track with a coloured fill, matching the reference
// theme's "medicines stock" bars. Fill width animates on mount
// via the `animate-grow-bar` keyframe for a subtle settle-in.
//
// Props:
//   label — left label, e.g. "Cardiology"
//   value — current amount
//   total — maximum amount (used for the % width + "42/50" text)
//   tone  — 'green' | 'amber' | 'red' | 'blue' fill colour
//   delay — stagger offset (ms) for the entrance animation
// =============================================================
const TONES = {
  green: 'bg-green-500',
  amber: 'bg-amber-400',
  red: 'bg-red-500',
  blue: 'bg-brand',
};

export default function ProgressBar({ label, value, total, tone = 'green', delay = 0 }) {
  // Guard against divide-by-zero and out-of-range values
  const pct = total > 0 ? Math.min(100, Math.round((value / total) * 100)) : 0;

  return (
    <div style={{ animationDelay: `${delay}ms` }} className="animate-fade-in-up">
      {/* Label row: name left, fraction right */}
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="font-semibold text-slate-800">{label}</span>
        <span className="font-mono text-xs text-slate-500">
          {value}/{total} · {pct}%
        </span>
      </div>

      {/* Track + animated fill */}
      <div className="h-2 w-full rounded-full bg-black">
        <div
          style={{ width: `${pct}%`, animationDelay: `${delay + 150}ms` }}
          className={`h-2 animate-grow-bar rounded-full transition-[width] duration-700 ${TONES[tone]}`}
        />
      </div>
    </div>
  );
}
