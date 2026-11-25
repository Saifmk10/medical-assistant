// =============================================================
// context/AppointmentsContext.tsx — shared appointment state
// -------------------------------------------------------------
// Shares appointment state and reports service errors to screens.
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
  error: string | null;
  refresh: () => Promise<void>;
  bookAppointment: (appointment: Appointment) => Promise<void>;
  cancelAppointment: (id: string) => Promise<void>;
  rescheduleAppointment: (id: string, slot: AppointmentSlot) => Promise<void>;
}

const AppointmentsContext = createContext<AppointmentsContextValue | undefined>(undefined);

export function AppointmentsProvider({ children }: { children: React.ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await getUpcomingAppointments();
      setAppointments(data);
      setError(null);
    } catch (cause: unknown) {
      setAppointments([]);
      setError(cause instanceof Error ? cause.message : 'Could not load appointments.');
      throw cause;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    await load();
  }, [load]);

  useEffect(() => {
    let active = true;
    getUpcomingAppointments().then((data) => {
      if (active) {
        setAppointments(data);
        setError(null);
      }
    }).catch((cause: unknown) => {
      if (active) {
        setAppointments([]);
        setError(cause instanceof Error ? cause.message : 'Could not load appointments.');
      }
    }).finally(() => {
      if (active) setIsLoading(false);
    });
    return () => { active = false; };
  }, []);

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
      value={{ appointments, isLoading, error, refresh, bookAppointment, cancelAppointment, rescheduleAppointment }}
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
