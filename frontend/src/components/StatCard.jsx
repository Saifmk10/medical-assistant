// =============================================================
// StatCard — KPI tile shown at the top of each dashboard
// -------------------------------------------------------------
// Props:
//   label — metric name, e.g. "Patients Today"
//   value — big number / text
//   delta — small comparison text under the value
//   trend — 'up' | 'down' | 'flat' → colours the delta
//   icon  — optional icon component
//   delay — stagger offset (ms) for the entrance animation
// =============================================================
const TREND_STYLES = {
  up: 'text-green-600', // improvement or growth
  down: 'text-brand', // e.g. reduced wait time (good news in blue)
  flat: 'text-slate-500', // neutral info
};

export default function StatCard({ label, value, delta, trend = 'flat', icon, delay = 0 }) {
  return (
    <div
      style={{ animationDelay: `${delay}ms` }}
      className="surface-card surface-card-hover animate-fade-in-up"
    >
      <div className="flex items-start justify-between">
        <div>
          {/* Metric label */}
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>

          {/* Metric value — the attention grabber */}
          <p className="mt-2 font-display text-3xl font-extrabold tracking-tight text-slate-900">
            {value}
          </p>

          {/* Comparison / context line, coloured by trend */}
          {delta && (
            <p className={`mt-1 text-xs font-semibold ${TREND_STYLES[trend]}`}>{delta}</p>
          )}
        </div>

        {/* Optional icon in a soft brand tile */}
        {icon && (
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-faint text-brand">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
