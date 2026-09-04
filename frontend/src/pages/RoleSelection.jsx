// =============================================================
// RoleSelection — landing page (route: /)
// -------------------------------------------------------------
// The entry point of the portal. Staff pick their role
// (Admin / Doctor / Maintenance) and are routed to the matching
// login screen at /login/:role.
// =============================================================
import { useNavigate } from 'react-router-dom';
import PageShell from '../components/PageShell.jsx';
import RoleCard from '../components/RoleCard.jsx';
import { ROLES } from '../data/mockData.js';
import {
  IconShield,
  IconStethoscope,
  IconWrench,
  IconPulse,
} from '../components/icons.jsx';

// Maps each role key to its icon — keeps the JSX below declarative
const ROLE_ICONS = {
  admin: <IconShield className="h-7 w-7" />,
  doctor: <IconStethoscope className="h-7 w-7" />,
  maintenance: <IconWrench className="h-7 w-7" />,
};

export default function RoleSelection() {
  const navigate = useNavigate();

  // Send the user to the login screen for the role they picked
  const handleSelect = (roleKey) => navigate(`/login/${roleKey}`);

  return (
    <PageShell showNav={false}>
      {/* ---------- Hero copy ---------- */}
      <div className="mt-14 text-center sm:mt-20">
        {/* Live-status eyebrow line */}
        <p className="mx-auto inline-flex animate-fade-in items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white backdrop-blur">
          <IconPulse className="h-4 w-4" />
          Hospital Administration Portal
        </p>

        {/* Main heading */}
        <h1
          className="mt-6 animate-fade-in-up font-display text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl"
          style={{ animationDelay: '100ms' }}
        >
          One hospital. <br className="hidden sm:block" />
          <span className="text-black">Every team, connected.</span>
        </h1>

        {/* Supporting line */}
        <p
          className="mx-auto mt-4 max-w-xl animate-fade-in-up text-base text-white/85"
          style={{ animationDelay: '200ms' }}
        >
          Select your role to continue. Administration, clinical staff and
          facilities each get a dashboard tailored to their day.
        </p>
      </div>

      {/* ---------- Role cards ----------
          Staggered entrance via increasing `delay` values. */}
      <div className="mx-auto mt-14 grid w-full max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
        {Object.values(ROLES).map((role, i) => (
          <RoleCard
            key={role.key}
            icon={ROLE_ICONS[role.key]}
            label={role.label}
            tagline={role.tagline}
            delay={300 + i * 120} // stagger: 300ms, 420ms, 540ms
            onClick={() => handleSelect(role.key)}
          />
        ))}
      </div>

      {/* ---------- Footer hint ---------- */}
      <p
        className="mt-14 animate-fade-in text-center text-xs font-medium text-white/60"
        style={{ animationDelay: '700ms' }}
      >
        Demo build — access is role-based with hardcoded credentials.
      </p>
    </PageShell>
  );
}
