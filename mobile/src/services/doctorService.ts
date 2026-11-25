import { apiGet } from './apiClient';
import { PROFILE_API_BASE_URL } from './config';

export interface DoctorDirectoryEntry {
  name: string;
  specialty: string;
  workingHours: string | null;
}

export async function getDoctors(): Promise<DoctorDirectoryEntry[]> {
  const response = await apiGet<unknown>('/doctor-details', { baseUrl: PROFILE_API_BASE_URL });
  if (!Array.isArray(response)) {
    throw new Error('The doctor directory is temporarily unavailable. Please try again later.');
  }

  return response.map((item: unknown) => {
    if (
      typeof item !== 'object' || item === null ||
      !('doc_name' in item) || typeof item.doc_name !== 'string' ||
      !('designation' in item) || typeof item.designation !== 'string' ||
      !item.doc_name.trim() || !item.designation.trim() ||
      ('working_hours' in item && item.working_hours != null && typeof item.working_hours !== 'string')
    ) {
      throw new Error('The doctor directory returned an invalid response.');
    }

    return {
      name: item.doc_name,
      specialty: item.designation,
      workingHours: 'working_hours' in item && typeof item.working_hours === 'string'
        ? item.working_hours
        : null,
    };
  });
}
