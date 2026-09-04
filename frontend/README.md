# MedCare HMS — Frontend

Frontend-only build of the **MedCare Hospital Administration Portal**, built with
**React 18 + Vite + Tailwind CSS**. The visual theme follows the provided
reference: vibrant blue `#007BFF` canvas, white pill navigation, black/white
contrast elements, soft gray panels, and calm, subtle animations.

---

## ✨ Features

| Area | Details |
| --- | --- |
| **Role selection** | Landing page with three role cards — **Admin**, **Doctor**, **Maintenance** |
| **Role login** | `/login/:role` — hardcoded credentials (frontend-only auth) |
| **Admin dashboard** | KPIs, department occupancy bars, staff-on-duty roster, activity feed |
| **Doctor dashboard** | KPIs, today's appointments, admitted patients, pending lab reports |
| **Maintenance dashboard** | KPIs, ticket queue, equipment health bars, daily work schedule |
| **Route protection** | Dashboards are guarded; wrong role → redirected to your own dashboard |
| **Animations** | Staggered fade-in-up entrances, floating background blobs, pulsing live dots, animated progress bars, error shake, hover lifts — all respect `prefers-reduced-motion` |

## 🔑 Demo credentials (hardcoded)

| Role | User ID | Password |
| --- | --- | --- |
| Admin | `admin` | `admin123` |
| Doctor | `doctor` | `doctor123` |
| Maintenance | `maintenance` | `maint123` |

> Credentials live in `src/data/mockData.js` → `CREDENTIALS`. Replace
> `AuthContext.login()` with a real API call when the backend is ready.

## 🚀 Getting started

```bash
cd frontend
npm install      # install dependencies
npm run dev      # start dev server → http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## 📁 Project structure

```
frontend/
├── index.html                  # HTML shell (font, favicon, #root)
├── vite.config.js              # Vite + React plugin config
├── tailwind.config.js          # Theme tokens + custom animations
├── postcss.config.js           # Tailwind via PostCSS
└── src/
    ├── main.jsx                # Entry: router + auth provider
    ├── App.jsx                 # Route table
    ├── index.css               # Tailwind layers + shared classes
    ├── data/
    │   └── mockData.js         # Credentials + all dashboard data
    ├── context/
    │   └── AuthContext.jsx     # Session state (sessionStorage backed)
    ├── components/             # Reusable, documented UI pieces
    │   ├── PageShell.jsx       # Blue canvas + blobs + navbar layout
    │   ├── Navbar.jsx          # Pill-style top nav + logout
    │   ├── Logo.jsx            # Brand mark
    │   ├── RoleCard.jsx        # Role selection tile
    │   ├── SectionCard.jsx     # Dashboard panel shell (pill header)
    │   ├── StatCard.jsx        # KPI tile
    │   ├── ProgressBar.jsx     # Animated capacity bar
    │   ├── Badge.jsx           # Status pill (central colour map)
    │   ├── DashboardHeader.jsx # Greeting strip
    │   ├── ProtectedRoute.jsx  # Role-based route guard
    │   └── icons.jsx           # Inline SVG icon set
    └── pages/
        ├── RoleSelection.jsx   # / — pick a role
        ├── Login.jsx           # /login/:role
        ├── AdminDashboard.jsx  # /admin/dashboard
        ├── DoctorDashboard.jsx # /doctor/dashboard
        └── MaintenanceDashboard.jsx
```

## 🎨 Theming notes

- Brand blue is defined once in `tailwind.config.js` (`colors.brand`) — change
  it there to re-skin the whole app.
- Custom animation utilities (`animate-fade-in-up`, `animate-float`,
  `animate-pulse-soft`, `animate-shake`, `animate-grow-bar`) are registered in
  `tailwind.config.js`; shared component classes (`.pill-header`,
  `.surface-card`, `.scroll-slim`) live in `src/index.css`.
- Status → colour mapping is centralised in `src/components/Badge.jsx`.
