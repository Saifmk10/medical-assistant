# screens/

All app screens, one subfolder per feature area. Screens are the only place that combine `context/`, `services/`, and `components/` together — components themselves stay presentational.

## Subfolders

- **auth/** — `LoginScreen.tsx`: phone-number sign-in (simulated, see `context/AuthContext.tsx`).
- **home/** — `DashboardScreen.tsx` + `DashboardHeader.tsx`: patient home screen with the next upcoming appointment and quick actions (README.md §16).
- **voice/** — `VoiceAssistantScreen.tsx`: the primary conversational UI — mic button, live transcript, state label (README.md §17). Backed by `context/VoiceAssistantContext.tsx`.
- **booking/** — `BookAppointmentScreen.tsx`: 3-step wizard (find doctor → pick slot → confirm) implementing README.md §8.
- **appointments/** — `MyAppointmentsScreen.tsx` (list), `AppointmentDetailScreen.tsx` (detail + cancel), `RescheduleAppointmentScreen.tsx` (pick a new slot) implementing README.md §9–11.
- **history/** — `MedicalHistoryScreen.tsx`: timeline of past appointments, diagnoses, medications, allergies, reports (README.md §15).
- **profile/** — `ProfileScreen.tsx`: patient profile details and sign-out (README.md §14).

## Backend integration points per screen

| Screen | Data source today | Replace with |
|---|---|---|
| DashboardScreen | `AppointmentsContext` (mock) | live `GET /appointments?patientId=` |
| BookAppointmentScreen | `doctorService`, `appointmentService` (mock/partial) | live doctor + slot + booking endpoints |
| MyAppointmentsScreen / AppointmentDetailScreen / RescheduleAppointmentScreen | `AppointmentsContext` (mock) | live appointment CRUD endpoints |
| VoiceAssistantScreen | `voiceService` (simulated) | `/voice_modules` real-time speech pipeline |
| MedicalHistoryScreen | `data/mockPatient.ts` | `GET /patients/{id}/history` |
| ProfileScreen | `AuthContext` (mock) | live `/auth` + `/patients/{id}` endpoints |
