// =============================================================
// data/mockDoctors.ts — sample provider directory
// -------------------------------------------------------------
// Used by services/doctorService.ts while USE_MOCK_DATA is true.
// Shape matches the `Doctor` type in src/types/index.ts.
// =============================================================
import type { Doctor } from '../types';

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Anita Sharma',
    specialty: 'Dermatology',
    qualification: 'MD, Dermatology',
    clinic: 'City Clinic',
    location: 'Bangalore — Indiranagar',
    rating: 4.8,
    yearsExperience: 12,
  },
  {
    id: 'doc-2',
    name: 'Dr. Rohan Verma',
    specialty: 'Dermatology',
    qualification: 'MBBS, DVD',
    clinic: 'Skin & Wellness Center',
    location: 'Bangalore — Koramangala',
    rating: 4.6,
    yearsExperience: 8,
  },
  {
    id: 'doc-3',
    name: 'Dr. Meera Iyer',
    specialty: 'Cardiology',
    qualification: 'MD, DM Cardiology',
    clinic: 'Heart Care Institute',
    location: 'Bangalore — Whitefield',
    rating: 4.9,
    yearsExperience: 16,
  },
  {
    id: 'doc-4',
    name: 'Dr. Karan Mehta',
    specialty: 'Orthopedics',
    qualification: 'MS Orthopedics',
    clinic: 'Bone & Joint Clinic',
    location: 'Bangalore — HSR Layout',
    rating: 4.7,
    yearsExperience: 10,
  },
  {
    id: 'doc-5',
    name: 'Dr. Priya Nair',
    specialty: 'General Medicine',
    qualification: 'MBBS, MD',
    clinic: 'City Clinic',
    location: 'Bangalore — Indiranagar',
    rating: 4.5,
    yearsExperience: 6,
  },
];
