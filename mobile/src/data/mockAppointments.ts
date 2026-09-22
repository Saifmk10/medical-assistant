// =============================================================
// data/mockAppointments.ts — sample booked appointments
// -------------------------------------------------------------
// Used by services/appointmentService.ts as the seed for its
// in-memory appointment store. Shape matches `Appointment` in
// src/types/index.ts.
// =============================================================
import { MOCK_DOCTORS } from './mockDoctors';
import type { Appointment } from '../types';

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'appt-1',
    doctor: MOCK_DOCTORS[0],
    date: '2026-09-22',
    startTime: '17:30',
    endTime: '18:00',
    location: 'City Clinic — Indiranagar',
    status: 'confirmed',
    notes: 'Follow-up on skin rash',
  },
  {
    id: 'appt-2',
    doctor: MOCK_DOCTORS[2],
    date: '2026-09-18',
    startTime: '10:00',
    endTime: '10:30',
    location: 'Heart Care Institute — Whitefield',
    status: 'completed',
  },
  {
    id: 'appt-3',
    doctor: MOCK_DOCTORS[3],
    date: '2026-09-10',
    startTime: '09:30',
    endTime: '10:00',
    location: 'Bone & Joint Clinic — HSR Layout',
    status: 'cancelled',
  },
];
