// =============================================================
// services/apiClient.ts — thin fetch wrapper for the FastAPI backend
// -------------------------------------------------------------
// Every network call in the app should go through `apiGet` / `apiPost`
// instead of calling `fetch` directly.
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

type RequestOptions = { baseUrl?: string; signal?: AbortSignal };

export async function apiGet<T>(path: string, options?: RequestOptions): Promise<T> {
  const response = await fetch(`${options?.baseUrl ?? API_BASE_URL}${path}`, { signal: options?.signal });
  return handleResponse<T>(response);
}

async function post(
  path: string,
  body: unknown,
  options?: RequestOptions,
): Promise<Response> {
  return fetch(`${options?.baseUrl ?? API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: options?.signal,
  });
}

export async function apiPost<T>(path: string, body: unknown, options?: RequestOptions): Promise<T> {
  return handleResponse<T>(await post(path, body, options));
}
