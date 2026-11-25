import type { Appointment, AppointmentSlot } from '../types';

const unavailable =
  'Appointments are not available in the app yet. Please contact your healthcare provider.';

export async function getUpcomingAppointments(): Promise<Appointment[]> {
  throw new Error(unavailable);
}

export async function getAppointmentById(_id: string): Promise<Appointment | undefined> {
  throw new Error(unavailable);
}

export async function getAvailableSlots(_doctorId: string): Promise<AppointmentSlot[]> {
  throw new Error('Online availability is not available yet. Please contact your healthcare provider.');
}

export async function bookAppointment(_appointment: Appointment): Promise<Appointment> {
  throw new Error('Online booking is not available yet. Please contact your healthcare provider.');
}

export async function cancelAppointment(_id: string): Promise<Appointment | undefined> {
  throw new Error('Online cancellation is not available yet. Please contact your healthcare provider.');
}

export async function rescheduleAppointment(
  _id: string,
  _slot: AppointmentSlot
): Promise<Appointment | undefined> {
  throw new Error('Online rescheduling is not available yet. Please contact your healthcare provider.');
}
