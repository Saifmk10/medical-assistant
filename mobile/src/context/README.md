# context/

React Context providers that hold app-wide state so multiple screens can share the same data without prop-drilling.

## Files

- **AuthContext.tsx** — The signed-in patient's session (`patient`, `isAuthenticated`, `login`, `logout`). `login()` is simulated; replace it with a real `POST /auth/login` call when the backend adds authentication.
- **AppointmentsContext.tsx** — The patient's appointment list plus `bookAppointment`, `cancelAppointment`, `rescheduleAppointment` actions. Wraps `services/appointmentService.ts` — screens never call the service directly, they call this context so every screen stays in sync after a booking/cancellation.
- **VoiceAssistantContext.tsx** — Drives the Voice Assistant screen: streams microphone audio to the hosted voice WebSocket, holds the conversation transcript, and manages the `idle → listening → processing → responding` state machine. Server audio replies are played with Expo Audio; the mic is muted during playback.

## Usage

Both providers are mounted once in `App.tsx`. Any screen can consume them:

```tsx
const { patient } = useAuth();
const { appointments, cancelAppointment } = useAppointments();
```
