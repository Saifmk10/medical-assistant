// =============================================================
// context/AppointmentsContext.tsx — shared appointment state
// -------------------------------------------------------------
// Wraps services/appointmentService.ts so every screen (Dashboard,
// My Appointments, Booking, Reschedule) reads/writes the same list
// instead of each fetching independently. Once a real backend exists,
// only appointmentService.ts needs to change — this context stays the same.
// =============================================================
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  bookAppointment as bookAppointmentApi,
  cancelAppointment as cancelAppointmentApi,
  getUpcomingAppointments,
  rescheduleAppointment as rescheduleAppointmentApi,
} from '../services/appointmentService';
import type { Appointment, AppointmentSlot } from '../types';

interface AppointmentsContextValue {
  appointments: Appointment[];
  isLoading: boolean;
  refresh: () => Promise<void>;
  bookAppointment: (appointment: Appointment) => Promise<void>;
  cancelAppointment: (id: string) => Promise<void>;
  rescheduleAppointment: (id: string, slot: AppointmentSlot) => Promise<void>;
}

const AppointmentsContext = createContext<AppointmentsContextValue | undefined>(undefined);

export function AppointmentsProvider({ children }: { children: React.ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getUpcomingAppointments();
      setAppointments(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const bookAppointment = useCallback(
    async (appointment: Appointment) => {
      await bookAppointmentApi(appointment);
      await refresh();
    },
    [refresh]
  );

  const cancelAppointment = useCallback(
    async (id: string) => {
      await cancelAppointmentApi(id);
      await refresh();
    },
    [refresh]
  );

  const rescheduleAppointment = useCallback(
    async (id: string, slot: AppointmentSlot) => {
      await rescheduleAppointmentApi(id, slot);
      await refresh();
    },
    [refresh]
  );

  return (
    <AppointmentsContext.Provider
      value={{ appointments, isLoading, refresh, bookAppointment, cancelAppointment, rescheduleAppointment }}
    >
      {children}
    </AppointmentsContext.Provider>
  );
}

export function useAppointments() {
  const ctx = useContext(AppointmentsContext);
  if (!ctx) throw new Error('useAppointments must be used within an AppointmentsProvider');
  return ctx;
}
