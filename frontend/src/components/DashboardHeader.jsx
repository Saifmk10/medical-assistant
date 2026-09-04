// =============================================================
// DashboardHeader — greeting strip shared by all dashboards
// -------------------------------------------------------------
// Shows a contextual greeting (based on time of day), the signed
// -in user's name/title, and today's date. Keeps the three
// dashboard pages consistent and DRY.
// =============================================================
import { useAuth } from '../context/AuthContext.jsx';

// Pick a greeting appropriate to the current hour
function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardHeader({ subtitle }) {
  const { session } = useAuth();

  // Human-readable date, e.g. "Friday, 4 September 2026"
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="mb-8 animate-fade-in-up">
      {/* Eyebrow: today's date */}
      <p className="text-xs font-semibold uppercase tracking-widest text-white/70">{today}</p>

      {/* Greeting + user name */}
      <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
        {greeting()}, <span className="text-black">{session?.name}</span>
      </h1>

      {/* Role-specific context line supplied by each dashboard */}
      <p className="mt-1 text-sm font-medium text-white/80">{subtitle}</p>
    </div>
  );
}
