// =============================================================
// MaintenanceDashboard — facilities / biomedical engineering view
// Route: /maintenance/dashboard (protected, role = maintenance)
// -------------------------------------------------------------
// Sections:
//   1. KPI stat row        — tickets, equipment uptime, tasks
//   2. Open tickets        — prioritised work queue
//   3. Equipment status    — animated health bars per category
//   4. Today's schedule    — preventive maintenance checklist
// All data is mock data from src/data/mockData.js.
// =============================================================
import PageShell from '../components/PageShell.jsx';
import DashboardHeader from '../components/DashboardHeader.jsx';
import StatCard from '../components/StatCard.jsx';
import SectionCard from '../components/SectionCard.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import Badge from '../components/Badge.jsx';
import {
  IconAlert,
  IconPulse,
  IconCheck,
  IconWrench,
  IconPin,
} from '../components/icons.jsx';
import {
  MAINT_STATS,
  MAINT_TICKETS,
  EQUIPMENT_STATUS,
  MAINT_SCHEDULE,
} from '../data/mockData.js';

// Icons for the four KPI tiles, in the same order as MAINT_STATS
const STAT_ICONS = [
  <IconAlert key="1" className="h-5 w-5" />,
  <IconPulse key="2" className="h-5 w-5" />,
  <IconCheck key="3" className="h-5 w-5" />,
  <IconWrench key="4" className="h-5 w-5" />,
];

// Health-bar colour depends on the % of units online
function healthTone(pct) {
  if (pct < 90) return 'red'; // too many units down
  if (pct < 96) return 'amber'; // degraded
  return 'green'; // healthy
}

export default function MaintenanceDashboard() {
  return (
    <PageShell>
      {/* Greeting strip */}
      <DashboardHeader subtitle="Facility health, tickets and today's work plan" />

      {/* ===== 1. KPI stat row ===== */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MAINT_STATS.map((stat, i) => (
          <StatCard key={stat.label} {...stat} icon={STAT_ICONS[i]} delay={i * 100} />
        ))}
      </div>

      {/* ===== 2–4. Main panels ===== */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ---- Open tickets (2/3 width) ---- */}
        <SectionCard
          title="OPEN TICKETS"
          delay={350}
          className="lg:col-span-2"
          bodyClassName="scroll-slim max-h-96 space-y-3 overflow-y-auto pr-1"
        >
          {MAINT_TICKETS.map((ticket, i) => (
            <div
              key={ticket.id}
              style={{ animationDelay: `${400 + i * 60}ms` }}
              className="flex animate-fade-in-up items-center gap-4 rounded-xl border border-black/10 bg-white/80 px-4 py-3"
            >
              {/* Ticket ID — black mono chip */}
              <span className="hidden w-20 shrink-0 rounded-lg bg-black px-2 py-1 text-center font-mono text-xs font-semibold text-white sm:block">
                {ticket.id}
              </span>

              {/* Title + location */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">{ticket.title}</p>
                <p className="flex items-center gap-1 truncate text-xs text-slate-500">
                  <IconPin className="h-3 w-3" />
                  {ticket.location}
                </p>
              </div>

              {/* Priority + workflow status */}
              <div className="flex shrink-0 flex-col items-end gap-1">
                <Badge status={ticket.priority} />
                <span className="text-[11px] font-semibold text-slate-500">{ticket.status}</span>
              </div>
            </div>
          ))}
        </SectionCard>

        {/* ---- Equipment status ---- */}
        <SectionCard title="EQUIPMENT STATUS" delay={450}>
          <div className="space-y-4">
            {EQUIPMENT_STATUS.map((item, i) => {
              const pct = Math.round((item.online / item.total) * 100);
              return (
                <ProgressBar
                  key={item.name}
                  label={item.name}
                  value={item.online}
                  total={item.total}
                  tone={healthTone(pct)}
                  delay={500 + i * 80}
                />
              );
            })}
          </div>
          <p className="mt-4 text-[11px] font-medium text-slate-500">
            Units reporting online vs total installed.
          </p>
        </SectionCard>

        {/* ---- Today's preventive maintenance schedule ---- */}
        <SectionCard title="TODAY'S SCHEDULE" delay={550} className="lg:col-span-3">
          <ol className="divide-y divide-black/10">
            {MAINT_SCHEDULE.map((item, i) => (
              <li
                key={`${item.time}-${item.task}`}
                style={{ animationDelay: `${600 + i * 70}ms` }}
                className="flex animate-fade-in-up items-center gap-4 py-3"
              >
                {/* Time chip */}
                <span className="w-14 shrink-0 font-mono text-xs font-semibold text-slate-500">
                  {item.time}
                </span>

                {/* Task + area — struck through when completed */}
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm font-semibold ${
                      item.done ? 'text-slate-400 line-through' : 'text-slate-900'
                    }`}
                  >
                    {item.task}
                  </p>
                  <p className="text-xs text-slate-500">{item.area}</p>
                </div>

                {/* Done ✓ / Pending badge */}
                {item.done ? (
                  <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
                    <IconCheck className="h-4 w-4" /> Done
                  </span>
                ) : (
                  <Badge status="Upcoming" />
                )}
              </li>
            ))}
          </ol>
        </SectionCard>
      </div>
    </PageShell>
  );
}
