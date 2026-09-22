# data/

Hardcoded sample data used while the backend endpoints for appointments/patients don't exist yet (doctor data can already be swapped for the live API — see `services/README.md`).

Every export here matches a type from `src/types/index.ts` exactly, so `services/*.ts` files can return either mock data or a real API response without any screen needing changes.

## Files

- **mockDoctors.ts** — Sample provider directory (`Doctor[]`).
- **mockSlots.ts** — Sample bookable appointment slots per doctor (`AppointmentSlot[]`).
- **mockAppointments.ts** — Sample booked appointments used to seed the in-memory appointment store (`Appointment[]`).
- **mockPatient.ts** — Sample signed-in patient profile and medical history (`Patient`, `MedicalHistoryEntry[]`).

## Removing mock data later

Once the backend exposes real appointment/patient endpoints:
1. Set `USE_MOCK_DATA = false` in `services/config.ts`.
2. Implement the real fetch calls in the corresponding `services/*.ts` file.
3. These files can be deleted once nothing references them.
