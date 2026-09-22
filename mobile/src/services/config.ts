// =============================================================
// services/config.ts — backend connection configuration
// -------------------------------------------------------------
// Change API_BASE_URL to point at the running FastAPI backend
// (see /services/main.py in the project root). When testing on a
// physical device, `localhost` will NOT work — use your machine's
// LAN IP address instead (e.g. http://192.168.1.20:8000).
// =============================================================

/** Base URL of the FastAPI backend (services/main.py). */
export const API_BASE_URL = 'http://127.0.0.1:8000';

/** Toggle this to false once real backend endpoints exist for
 * appointments/booking — see services/README.md for the full
 * list of endpoints the UI expects and which ones are still mocked. */
export const USE_MOCK_DATA = true;
