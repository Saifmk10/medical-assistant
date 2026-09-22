// =============================================================
// data/mockPatient.ts — sample signed-in patient + medical history
// -------------------------------------------------------------
// Used by context/AuthContext.tsx (default profile) and the
// Medical History screen. Shapes match `Patient` and
// `MedicalHistoryEntry` in src/types/index.ts.
// =============================================================
import type { MedicalHistoryEntry, Patient } from '../types';

export const MOCK_PATIENT: Patient = {
  id: 'patient-1',
  name: 'Aarav Kapoor',
  dateOfBirth: '1994-03-12',
  phone: '+91 98765 43210',
  email: 'aarav.kapoor@example.com',
  preferredLocation: 'Bangalore — Indiranagar',
};

export const MOCK_MEDICAL_HISTORY: MedicalHistoryEntry[] = [
  {
    id: 'hist-1',
    type: 'diagnosis',
    title: 'Mild eczema',
    date: '2026-09-18',
    description: 'Diagnosed by Dr. Anita Sharma, prescribed topical treatment.',
  },
  {
    id: 'hist-2',
    type: 'medication',
    title: 'Cetirizine 10mg',
    date: '2026-09-18',
    description: 'Once daily for 2 weeks.',
  },
  {
    id: 'hist-3',
    type: 'allergy',
    title: 'Penicillin allergy',
    date: '2021-06-02',
    description: 'Reported by patient during intake.',
  },
  {
    id: 'hist-4',
    type: 'report',
    title: 'Lipid panel',
    date: '2026-05-11',
    description: 'All values within normal range.',
  },
  {
    id: 'hist-5',
    type: 'appointment',
    title: 'Cardiology check-up',
    date: '2026-09-18',
    description: 'Routine check-up with Dr. Meera Iyer.',
  },
];
