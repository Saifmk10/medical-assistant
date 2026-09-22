# context/

React Context providers that hold app-wide state so multiple screens can share the same data without prop-drilling.

## Files

- **AuthContext.tsx** — The signed-in patient's session (`patient`, `isAuthenticated`, `login`, `logout`). `login()` is simulated; replace it with a real `POST /auth/login` call when the backend adds authentication.
- **AppointmentsContext.tsx** — The patient's appointment list plus `bookAppointment`, `cancelAppointment`, `rescheduleAppointment` actions. Wraps `services/appointmentService.ts` — screens never call the service directly, they call this context so every screen stays in sync after a booking/cancellation.
- **VoiceAssistantContext.tsx** — Drives the Voice Assistant screen: holds the conversation transcript and the `idle → listening → processing → responding` state machine. Wraps `services/voiceService.ts` (currently simulated — see that file's header comment for how to wire real speech-to-text/TTS).

## Usage

Both providers are mounted once in `App.tsx`. Any screen can consume them:

```tsx
const { patient } = useAuth();
const { appointments, cancelAppointment } = useAppointments();
```
