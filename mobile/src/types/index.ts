// =============================================================
// types/index.ts — shared TypeScript types for the whole app
// -------------------------------------------------------------
// These shapes intentionally mirror what the backend services are
// expected to return (see services/main.py and
// services/doctor_details_api.py in the project root). Screens and
// components should only ever depend on these types, never on the
// mock-data or API-response shape directly, so swapping mock data
// for real API calls later requires no UI changes.
// =============================================================

/** A medical specialty, e.g. "Dermatology", "Cardiology". */
export type Specialty = string;

/** A doctor / healthcare provider record. */
export interface Doctor {
  id: string;
  name: string;
  specialty: Specialty;
  qualification: string;
  clinic: string;
  location: string;
  avatarUrl?: string;
  rating?: number;
  yearsExperience?: number;
}

/** A single bookable appointment slot for a doctor. */
export interface AppointmentSlot {
  id: string;
  doctorId: string;
  date: string; // ISO date, e.g. "2026-09-22"
  startTime: string; // "17:30"
  endTime: string; // "18:00"
  isAvailable: boolean;
}

/** Lifecycle states an appointment can be in. */
export type AppointmentStatus =
  | 'available'
  | 'booked'
  | 'confirmed'
  | 'cancelled'
  | 'rescheduled'
  | 'completed';

/** A booked appointment tied to a patient, doctor and slot. */
export interface Appointment {
  id: string;
  doctor: Doctor;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  status: AppointmentStatus;
  notes?: string;
}

/** The signed-in patient's profile. */
export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  preferredLocation?: string;
}

/** A single entry in the patient's medical history. */
export interface MedicalHistoryEntry {
  id: string;
  type: 'appointment' | 'diagnosis' | 'medication' | 'allergy' | 'report' | 'procedure';
  title: string;
  date: string;
  description?: string;
}

/** Conversational turn shown in the Voice Assistant screen transcript. */
export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
}

/** High-level state machine for the voice assistant UI (see README.md in this folder). */
export type VoiceAssistantState = 'idle' | 'listening' | 'processing' | 'responding';
