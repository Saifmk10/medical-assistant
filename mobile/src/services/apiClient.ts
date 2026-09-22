// =============================================================
// services/apiClient.ts — thin fetch wrapper for the FastAPI backend
// -------------------------------------------------------------
// Every network call in the app should go through `apiGet` / `apiPost`
// instead of calling `fetch` directly. This gives us one place to add
// auth headers, timeouts, and error handling once the real backend
// grows beyond the current /doctor-details endpoint.
// =============================================================
import { API_BASE_URL } from './config';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new ApiError(`Request failed with status ${response.status}`, response.status);
  }
  return (await response.json()) as T;
}

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);
  return handleResponse<T>(response);
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return handleResponse<T>(response);
}
