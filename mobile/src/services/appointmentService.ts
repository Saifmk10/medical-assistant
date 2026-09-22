// =============================================================
// services/appointmentService.ts — appointment data access
// -------------------------------------------------------------
// NOT YET BACKED BY A REAL ENDPOINT. Everything here reads/writes
// an in-memory copy of data/mockAppointments.ts so the app is fully
// interactive during frontend development.
//
// TO CONNECT THE REAL BACKEND:
//   Replace each function body with an apiGet/apiPost call once
//   these endpoints exist on the FastAPI service (suggested routes):
//     GET    /appointments?patientId=...      → list upcoming appointments
//     GET    /appointments/available?specialty=&date=  → open slots
//     POST   /appointments                    → book a new appointment
//     PATCH  /appointments/{id}/cancel        → cancel
//     PATCH  /appointments/{id}/reschedule    → reschedule
// Keep the function signatures the same so screens don't need edits.
// =============================================================
import { MOCK_APPOINTMENTS } from '../data/mockAppointments';
import { MOCK_SLOTS } from '../data/mockSlots';
import type { Appointment, AppointmentSlot } from '../types';

// In-memory store standing in for a real database while there is no
// appointments backend yet. Resets whenever the app restarts.
let appointments: Appointment[] = [...MOCK_APPOINTMENTS];

export async function getUpcomingAppointments(): Promise<Appointment[]> {
  return appointments.filter((a) => a.status !== 'cancelled' && a.status !== 'completed');
}

export async function getAppointmentById(id: string): Promise<Appointment | undefined> {
  return appointments.find((a) => a.id === id);
}

export async function getAvailableSlots(doctorId: string): Promise<AppointmentSlot[]> {
  return MOCK_SLOTS.filter((slot) => slot.doctorId === doctorId && slot.isAvailable);
}

export async function bookAppointment(newAppointment: Appointment): Promise<Appointment> {
  appointments = [newAppointment, ...appointments];
  return newAppointment;
}

export async function cancelAppointment(id: string): Promise<Appointment | undefined> {
  appointments = appointments.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a));
  return getAppointmentById(id);
}

export async function rescheduleAppointment(
  id: string,
  slot: AppointmentSlot
): Promise<Appointment | undefined> {
  appointments = appointments.map((a) =>
    a.id === id
      ? { ...a, date: slot.date, startTime: slot.startTime, endTime: slot.endTime, status: 'rescheduled' }
      : a
  );
  return getAppointmentById(id);
}
