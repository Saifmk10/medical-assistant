# navigation/

React Navigation setup: one root stack that swaps between the Login screen and the authenticated app, plus a bottom tab bar for the main patient experience.

## Files

- **types.ts** — `RootStackParamList` and `MainTabParamList` — the type-safe route/param definitions used by every `useNavigation()`/`useRoute()` call in the app. Add a new screen here first when adding a route.
- **RootNavigator.tsx** — Top-level native-stack navigator. Shows `LoginScreen` when signed out (via `useAuth()`), otherwise shows `MainTabs` plus full-screen routes pushed on top of it (Book Appointment, Appointment Detail, Reschedule).
- **MainTabs.tsx** — Bottom tab bar for the signed-in patient: Home, Appointments, Ask (voice), History and Profile.

## Route map

```
Login (public)
MainTabs (protected)
├── Dashboard
├── Assistant       — voice assistant screen
├── Appointments    — my appointments list
├── History         — medical history
└── Profile
BookAppointment          (doctor directory; booking is not yet available)
AppointmentDetail        (pushed from Appointments list)
RescheduleAppointment    (pushed from Appointment detail)
```
