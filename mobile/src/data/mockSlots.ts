// =============================================================
// data/mockSlots.ts — sample bookable appointment slots
// -------------------------------------------------------------
// Used by services/appointmentService.ts::getAvailableSlots().
// Shape matches the `AppointmentSlot` type in src/types/index.ts.
// =============================================================
import type { AppointmentSlot } from '../types';

export const MOCK_SLOTS: AppointmentSlot[] = [
  { id: 'slot-1', doctorId: 'doc-1', date: '2026-09-22', startTime: '17:30', endTime: '18:00', isAvailable: true },
  { id: 'slot-2', doctorId: 'doc-1', date: '2026-09-22', startTime: '19:00', endTime: '19:30', isAvailable: true },
  { id: 'slot-3', doctorId: 'doc-2', date: '2026-09-22', startTime: '18:00', endTime: '18:30', isAvailable: true },
  { id: 'slot-4', doctorId: 'doc-3', date: '2026-09-23', startTime: '10:00', endTime: '10:30', isAvailable: true },
  { id: 'slot-5', doctorId: 'doc-3', date: '2026-09-25', startTime: '17:00', endTime: '17:30', isAvailable: true },
  { id: 'slot-6', doctorId: 'doc-3', date: '2026-09-25', startTime: '18:30', endTime: '19:00', isAvailable: true },
  { id: 'slot-7', doctorId: 'doc-4', date: '2026-09-24', startTime: '09:30', endTime: '10:00', isAvailable: true },
];
