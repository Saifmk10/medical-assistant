// =============================================================
// RoleCard — selectable role tile on the landing page
// -------------------------------------------------------------
// Props:
//   icon    — icon component (from components/icons.jsx)
//   label   — role name, e.g. "Admin"
//   tagline — short description under the name
//   delay   — stagger offset (ms) for the entrance animation
//   onClick — navigation handler supplied by the parent
// =============================================================
export default function RoleCard({ icon, label, tagline, delay = 0, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{ animationDelay: `${delay}ms` }} // staggered entrance
      className="group animate-fade-in-up rounded-3xl bg-white/95 p-8 text-left shadow-card backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:shadow-card-hover focus:outline-none focus:ring-4 focus:ring-white/40"
    >
      {/* Icon in a black rounded tile — flips to brand blue on hover */}
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white transition-colors duration-300 group-hover:bg-brand">
        {icon}
      </div>

      {/* Role name */}
      <h3 className="font-display text-xl font-bold text-slate-900">{label}</h3>

      {/* Short description */}
      <p className="mt-1 text-sm leading-relaxed text-slate-500">{tagline}</p>

      {/* Call-to-action row — arrow slides right on hover */}
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand">
        Continue to login
        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </span>
    </button>
  );
}
