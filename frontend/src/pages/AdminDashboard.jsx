// =============================================================
// AdminDashboard — hospital administrator view
// Route: /admin/dashboard (protected, role = admin)
// -------------------------------------------------------------
// Sections:
//   1. KPI stat row          — patients, staff, beds, wait time
//   2. Department occupancy  — animated capacity bars per dept
//   3. Staff on duty         — live roster with status badges
//   4. Recent activity       — admissions / discharges feed
// All data is mock data from src/data/mockData.js.
// =============================================================
import PageShell from '../components/PageShell.jsx';
import DashboardHeader from '../components/DashboardHeader.jsx';
import StatCard from '../components/StatCard.jsx';
import SectionCard from '../components/SectionCard.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import Badge from '../components/Badge.jsx';
import { IconUsers, IconBed, IconClock, IconPulse } from '../components/icons.jsx';
import {
  ADMIN_STATS,
  DEPARTMENT_OCCUPANCY,
  STAFF_ON_DUTY,
  RECENT_ACTIVITY,
} from '../data/mockData.js';

// Icons for the four KPI tiles, in the same order as ADMIN_STATS
const STAT_ICONS = [
  <IconUsers key="1" className="h-5 w-5" />,
  <IconPulse key="2" className="h-5 w-5" />,
  <IconBed key="3" className="h-5 w-5" />,
  <IconClock key="4" className="h-5 w-5" />,
];

// Colour-code each activity type with a small dot
const ACTIVITY_DOT = {
  admission: 'bg-green-500',
  discharge: 'bg-brand',
  emergency: 'bg-red-500',
  staff: 'bg-amber-400',
  pharmacy: 'bg-violet-500',
};

// Occupancy bar colour depends on how full a department is
function occupancyTone(pct) {
  if (pct >= 85) return 'red'; // nearly full — needs attention
  if (pct >= 65) return 'amber'; // filling up
  return 'green'; // comfortable
}

export default function AdminDashboard() {
  return (
    <PageShell>
      {/* Greeting strip */}
      <DashboardHeader subtitle="Hospital-wide operations at a glance" />

      {/* ===== 1. KPI stat row ===== */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ADMIN_STATS.map((stat, i) => (
          <StatCard
            key={stat.label}
            {...stat}
            icon={STAT_ICONS[i]}
            delay={i * 100} // stagger: 0ms, 100ms, 200ms, 300ms
          />
        ))}
      </div>

      {/* ===== 2–4. Main panels ===== */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ---- Department occupancy (2/3 width on large screens) ---- */}
        <SectionCard title="DEPARTMENT OCCUPANCY" delay={350} className="lg:col-span-2">
          <div className="space-y-4">
            {DEPARTMENT_OCCUPANCY.map((dept, i) => {
              const pct = Math.round((dept.occupied / dept.total) * 100);
              return (
                <ProgressBar
                  key={dept.name}
                  label={dept.name}
                  value={dept.occupied}
                  total={dept.total}
                  tone={occupancyTone(pct)}
                  delay={400 + i * 80}
                />
              );
            })}
          </div>

          {/* Legend for the bar colours */}
          <div className="mt-5 flex flex-wrap gap-4 border-t border-black/10 pt-3 text-[11px] font-semibold text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-green-500" /> &lt; 65% comfortable
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-400" /> 65–84% filling
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-500" /> ≥ 85% critical
            </span>
          </div>
        </SectionCard>

        {/* ---- Staff on duty ---- */}
        <SectionCard title="STAFF ON DUTY" delay={450} bodyClassName="scroll-slim max-h-80 space-y-3 overflow-y-auto pr-1">
          {STAFF_ON_DUTY.map((person, i) => (
            <div
              key={person.name}
              style={{ animationDelay: `${500 + i * 70}ms` }}
              className="flex animate-fade-in-up items-center justify-between rounded-xl border border-black/10 bg-white/80 px-4 py-3"
            >
              {/* Name + role + shift */}
              <div>
                <p className="text-sm font-semibold text-slate-900">{person.name}</p>
                <p className="text-xs text-slate-500">
                  {person.role} · <span className="font-mono">{person.shift}</span>
                </p>
              </div>
              {/* Live status badge */}
              <Badge status={person.status} />
            </div>
          ))}
        </SectionCard>

        {/* ---- Recent activity feed (full width) ---- */}
        <SectionCard title="RECENT ACTIVITY" delay={550} className="lg:col-span-3">
          <ol className="divide-y divide-black/10">
            {RECENT_ACTIVITY.map((item, i) => (
              <li
                key={`${item.time}-${item.text}`}
                style={{ animationDelay: `${600 + i * 70}ms` }}
                className="flex animate-fade-in-up items-center gap-4 py-3"
              >
                {/* Coloured dot indicating the activity type */}
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${ACTIVITY_DOT[item.type]}`} />
                {/* Timestamp in mono for alignment (reference theme touch) */}
                <span className="w-14 shrink-0 font-mono text-xs font-semibold text-slate-500">
                  {item.time}
                </span>
                {/* Event description */}
                <span className="text-sm font-medium text-slate-800">{item.text}</span>
              </li>
            ))}
          </ol>
        </SectionCard>
      </div>
    </PageShell>
  );
}
