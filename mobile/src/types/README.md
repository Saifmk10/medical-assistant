# types/

Shared TypeScript interfaces used across the entire app: `Doctor`, `AppointmentSlot`, `Appointment`, `Patient`, `MedicalHistoryEntry`, `ConversationMessage`, and the `AppointmentStatus` / `VoiceAssistantState` unions.

## Why this folder exists

Screens and components import types **from here only** — never from `data/mockData.ts` or from an API response directly. This is the contract between the UI and the backend: as long as the real API returns data matching these shapes (see `services/README.md` for endpoint mapping), swapping mock data for live network calls requires zero changes to any screen or component.

## Files

- **index.ts** — All shared types in one file, each documented with the backend concept it maps to (`services/main.py`, `services/doctor_details_api.py`).
