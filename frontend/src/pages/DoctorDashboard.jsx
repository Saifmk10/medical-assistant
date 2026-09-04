// =============================================================
// DoctorDashboard — physician view
// Route: /doctor/dashboard (protected, role = doctor)
// -------------------------------------------------------------
// Sections:
//   1. KPI stat row        — appointments, patients, reports
//   2. Today's schedule    — appointment list with statuses
//   3. Admitted patients   — ward list with severity badges
//   4. Pending lab reports — results awaiting review
// All data is mock data from src/data/mockData.js.
// =============================================================
import PageShell from '../components/PageShell.jsx';
import DashboardHeader from '../components/DashboardHeader.jsx';
import StatCard from '../components/StatCard.jsx';
import SectionCard from '../components/SectionCard.jsx';
import Badge from '../components/Badge.jsx';
import {
  IconCalendar,
  IconUsers,
  IconClipboard,
  IconPulse,
  IconClock,
} from '../components/icons.jsx';
import {
  DOCTOR_STATS,
  DOCTOR_APPOINTMENTS,
  DOCTOR_PATIENTS,
  PENDING_REPORTS,
} from '../data/mockData.js';

// Icons for the four KPI tiles, in the same order as DOCTOR_STATS
const STAT_ICONS = [
  <IconCalendar key="1" className="h-5 w-5" />,
  <IconUsers key="2" className="h-5 w-5" />,
  <IconClipboard key="3" className="h-5 w-5" />,
  <IconPulse key="4" className="h-5 w-5" />,
];

export default function DoctorDashboard() {
  return (
    <PageShell>
      {/* Greeting strip */}
      <DashboardHeader subtitle="Your schedule, patients and reports for today" />

      {/* ===== 1. KPI stat row ===== */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {DOCTOR_STATS.map((stat, i) => (
          <StatCard key={stat.label} {...stat} icon={STAT_ICONS[i]} delay={i * 100} />
        ))}
      </div>

      {/* ===== 2–4. Main panels ===== */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ---- Today's appointments (2/3 width) ---- */}
        <SectionCard
          title="TODAY'S APPOINTMENTS"
          delay={350}
          className="lg:col-span-2"
          bodyClassName="scroll-slim max-h-96 space-y-3 overflow-y-auto pr-1"
        >
          {DOCTOR_APPOINTMENTS.map((appt, i) => (
            <div
              key={`${appt.time}-${appt.patient}`}
              style={{ animationDelay: `${400 + i * 70}ms` }}
              className="flex animate-fade-in-up items-center gap-4 rounded-xl border border-black/10 bg-gradient-to-r from-white to-blue-50 px-4 py-3"
            >
              {/* Time chip — black pill, mono font */}
              <span className="flex w-20 shrink-0 items-center justify-center gap-1 rounded-lg bg-black px-2 py-1 font-mono text-xs font-semibold text-white">
                <IconClock className="h-3.5 w-3.5" />
                {appt.time}
              </span>

              {/* Patient + reason */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">{appt.patient}</p>
                <p className="truncate text-xs text-slate-500">{appt.reason}</p>
              </div>

              {/* Appointment status badge */}
              <Badge status={appt.status} />
            </div>
          ))}
        </SectionCard>

        {/* ---- Admitted patients ---- */}
        <SectionCard
          title="ADMITTED PATIENTS"
          delay={450}
          bodyClassName="scroll-slim max-h-96 space-y-3 overflow-y-auto pr-1"
        >
          {DOCTOR_PATIENTS.map((patient, i) => (
            <div
              key={patient.name}
              style={{ animationDelay: `${500 + i * 70}ms` }}
              className="animate-fade-in-up rounded-xl border border-black/10 bg-white/80 px-4 py-3"
            >
              {/* Name + severity badge */}
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">{patient.name}</p>
                <Badge status={patient.severity} />
              </div>
              {/* Ward + condition */}
              <p className="mt-1 font-mono text-xs text-slate-500">{patient.ward}</p>
              <p className="mt-0.5 text-xs text-slate-600">{patient.condition}</p>
            </div>
          ))}
        </SectionCard>

        {/* ---- Pending lab reports (full width) ---- */}
        <SectionCard title="PENDING LAB REPORTS" delay={550} className="lg:col-span-3">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              {/* Table header */}
              <thead>
                <tr className="border-b border-black/10 text-xs uppercase tracking-wider text-slate-500">
                  <th className="pb-2 pr-4 font-semibold">Patient</th>
                  <th className="pb-2 pr-4 font-semibold">Test</th>
                  <th className="pb-2 pr-4 font-semibold">Ordered</th>
                  <th className="pb-2 font-semibold">Priority</th>
                </tr>
              </thead>

              {/* Rows — urgent items highlighted in red */}
              <tbody className="divide-y divide-black/10">
                {PENDING_REPORTS.map((report, i) => (
                  <tr
                    key={`${report.patient}-${report.test}`}
                    style={{ animationDelay: `${600 + i * 70}ms` }}
                    className="animate-fade-in-up"
                  >
                    <td className="py-3 pr-4 font-semibold text-slate-900">{report.patient}</td>
                    <td className="py-3 pr-4 text-slate-700">{report.test}</td>
                    <td className="py-3 pr-4 font-mono text-xs text-slate-500">{report.ordered}</td>
                    <td className="py-3">
                      {report.urgent ? (
                        <Badge status="High" />
                      ) : (
                        <span className="text-xs font-semibold text-slate-400">Routine</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>
    </PageShell>
  );
}
