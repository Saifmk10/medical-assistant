# components/

Reusable, presentational UI building blocks. None of these files fetch data directly — they receive everything through props and call back through `onPress`/`onXxx` handlers, so they can be reused across screens and are easy to unit test.

## Files

- **Button.tsx** — Primary call-to-action button with `primary` / `secondary` / `ghost` / `danger` variants and a loading state.
- **Card.tsx** — Generic elevated, rounded surface used as the base for other cards.
- **StatusBadge.tsx** — Small colored pill showing an `AppointmentStatus` (booked/confirmed/cancelled/etc.), colors sourced from `theme/colors.ts`.
- **ScreenContainer.tsx** — Safe-area + background wrapper every screen should use as its root element.
- **SectionHeader.tsx** — Section title with an optional "See all" action link.
- **EmptyState.tsx** — Centered icon + message shown when a list has no data.
- **DoctorCard.tsx** — Provider summary card used in search/booking results.
- **AppointmentCard.tsx** — Appointment summary card with optional Reschedule/Cancel actions, used on the Dashboard and My Appointments screen.
- **TimeSlotChip.tsx** — Selectable pill for choosing an appointment time slot.
- **MicButton.tsx** — Large circular microphone button that visually reflects the voice assistant state (idle/listening/processing).
- **ChatBubble.tsx** — Single transcript message bubble (user vs. assistant) for the Voice Assistant screen.

## Convention for connecting the backend

These components never import from `services/`. Screens fetch data (via `context/` or `services/`) and pass it down as props — keep it that way so components stay reusable and backend changes never touch this folder.
