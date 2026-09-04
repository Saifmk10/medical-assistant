// =============================================================
// Logo — MedCare HMS brand mark
// -------------------------------------------------------------
// Compact logo used in the navbar and on the auth screens.
// White rounded tile + blue medical cross to stay consistent
// with the reference theme's pill/tile language.
// =============================================================
import { IconMedicalCross } from './icons.jsx';

export default function Logo({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      {/* Rounded tile holding the medical cross */}
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-card">
        <IconMedicalCross className="h-6 w-6 text-brand" />
      </div>

      {/* Wordmark — hidden in compact mode (e.g. small screens) */}
      {!compact && (
        <div className="leading-tight">
          <p className="font-display text-lg font-extrabold tracking-tight text-white">
            MedCare <span className="font-semibold text-white/80">HMS</span>
          </p>
          <p className="text-[11px] font-medium uppercase tracking-widest text-white/70">
            Hospital Portal
          </p>
        </div>
      )}
    </div>
  );
}
