// =============================================================
// PageShell — shared page layout
// -------------------------------------------------------------
// Every screen sits on the reference theme's signature blue
// (#007BFF) canvas with two soft, slowly-floating decorative
// blobs for depth. The shell renders <Navbar/> on top and page
// content below, so individual pages stay focused on content.
//
// Props:
//   showNav  — forwarded to Navbar (hidden on auth screens)
//   children — page content
// =============================================================
import Navbar from './Navbar.jsx';

export default function PageShell({ showNav = true, children }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-brand">
      {/* ---------- Decorative background blobs -------------
          Purely visual: aria-hidden + pointer-events-none.
          `animate-float` gives the calm, slow drift suited to
          a medical product. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-24 h-96 w-96 animate-float rounded-full bg-white/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-10 h-[28rem] w-[28rem] animate-float rounded-full bg-black/10 blur-3xl"
        style={{ animationDelay: '2.5s' }} // offset so blobs drift out of phase
      />

      {/* ---------- Foreground: nav + page content ---------- */}
      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar showNav={showNav} />
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 pb-12 sm:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
