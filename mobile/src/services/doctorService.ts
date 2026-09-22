// =============================================================
// services/doctorService.ts — doctor / provider data access
// -------------------------------------------------------------
// getDoctors() currently returns mock data (data/mockDoctors.ts).
//
// TO CONNECT THE REAL BACKEND:
//   1. Set USE_MOCK_DATA = false in services/config.ts
//   2. The GET /doctor-details endpoint already exists in
//      services/doctor_details_api.py and returns [{ name, qualification }].
//   3. Extend that endpoint (or add a new one) to also return
//      specialty, clinic, location, id, etc. matching the `Doctor`
//      type in src/types/index.ts, then map the response below.
// =============================================================
import { apiGet } from './apiClient';
import { USE_MOCK_DATA } from './config';
import { MOCK_DOCTORS } from '../data/mockDoctors';
import type { Doctor } from '../types';

/** Raw shape currently returned by GET /doctor-details. */
interface RawDoctorDetailsRow {
  name: string;
  qualification: string;
}

function mapRawDoctor(row: RawDoctorDetailsRow, index: number): Doctor {
  return {
    id: `remote-${index}`,
    name: row.name,
    qualification: row.qualification,
    specialty: 'General', // backend does not yet expose specialty — update once available
    clinic: 'City Medical Center',
    location: '—',
  };
}

export async function getDoctors(): Promise<Doctor[]> {
  if (USE_MOCK_DATA) {
    return MOCK_DOCTORS;
  }
  const rows = await apiGet<RawDoctorDetailsRow[]>('/doctor-details');
  return rows.map(mapRawDoctor);
}

export async function getDoctorById(id: string): Promise<Doctor | undefined> {
  const doctors = await getDoctors();
  return doctors.find((doctor) => doctor.id === id);
}

/** Find doctors matching a specialty keyword (used by the voice assistant flow). */
export async function findDoctorsBySpecialty(specialty: string): Promise<Doctor[]> {
  const doctors = await getDoctors();
  const query = specialty.toLowerCase();
  return doctors.filter((doctor) => doctor.specialty.toLowerCase().includes(query));
}
