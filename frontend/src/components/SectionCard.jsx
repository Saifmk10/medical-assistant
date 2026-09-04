// =============================================================
// SectionCard — standard dashboard panel
// -------------------------------------------------------------
// Gray rounded container with the reference theme's black pill
// header. All dashboard widgets are built from this shell so the
// visual language stays consistent across roles.
//
// Props:
//   title    — text inside the black pill header
//   action   — optional node rendered at the right of the header
//   delay    — stagger offset (ms) for the entrance animation
//   children — panel content
//   className / bodyClassName — layout overrides
// =============================================================
export default function SectionCard({
  title,
  action,
  delay = 0,
  children,
  className = '',
  bodyClassName = '',
}) {
  return (
    <section
      style={{ animationDelay: `${delay}ms` }}
      className={`animate-fade-in-up rounded-2xl bg-gray-200/95 p-4 shadow-card ${className}`}
    >
      {/* Header row: black pill title + optional right-side action */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="pill-header">{title}</h2>
        {action}
      </div>

      {/* Panel body */}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}
