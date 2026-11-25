# src/

All application source code for the Medical Assistant mobile app, organized so the UI layer and the data layer are cleanly separated — this is the folder to look in when wiring up the real backend.

## Folder map

| Folder | Purpose |
|---|---|
| [theme/](./theme/README.md) | Design tokens: colors (incl. primary `#2868C9`), typography, spacing, shadows. |
| [types/](./types/README.md) | Shared TypeScript interfaces (`Doctor`, `Appointment`, `Patient`, etc.) — the contract between UI and backend. |
| [services/](./services/README.md) | All network/data-access calls. **Start here to connect the real backend.** |
| [data/](./data/README.md) | Legacy sample data, not used as patient records. |
| [context/](./context/README.md) | App-wide React state: auth session, appointments, voice assistant conversation. |
| [navigation/](./navigation/README.md) | React Navigation stack + tab bar setup and route param types. |
| [components/](./components/README.md) | Reusable, presentational UI building blocks. |
| [screens/](./screens/README.md) | Full app screens, one subfolder per feature area. |
| [utils/](./utils/README.md) | Small shared helper functions (date formatting, etc.). |

## Where to plug in the real backend

Read [services/README.md](./services/README.md) for the live endpoints and
missing patient-scoped functionality before connecting additional services.
