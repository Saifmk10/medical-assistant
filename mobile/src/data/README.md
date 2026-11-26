# data/

Legacy hardcoded sample data. The app does not use these files for the doctor
directory, patient appointments or medical history. See
[`services/README.md`](../services/README.md) for live services and limitations.

## Files

- **mockDoctors.ts** — Sample provider directory (`Doctor[]`).
- **mockSlots.ts** — Sample bookable appointment slots per doctor (`AppointmentSlot[]`).
- **mockAppointments.ts** — Sample booked appointments (`Appointment[]`).
- **mockPatient.ts** — Sample signed-in patient profile and medical history (`Patient`, `MedicalHistoryEntry[]`).
