# services/

The data-access layer — every screen fetches data through these functions instead of calling `fetch` directly. This is the **primary place to connect the real backend** later.

## Files

- **config.ts** — `API_BASE_URL` (points at the FastAPI backend in `/services/main.py`) and the `USE_MOCK_DATA` flag. Flip `USE_MOCK_DATA` to `false` once real endpoints exist.
- **apiClient.ts** — Thin `fetch` wrapper (`apiGet`, `apiPost`) with shared error handling. Add auth headers / retry logic here once needed.
- **doctorService.ts** — Doctor/provider lookup. Already wired to the real `GET /doctor-details` endpoint (see `services/doctor_details_api.py` in the project root) behind the mock-data flag.
- **appointmentService.ts** — Appointment CRUD (list, book, cancel, reschedule, available slots). Currently backed by an in-memory copy of the mock data since no appointments API exists yet. Each function documents the REST route it should call once the backend adds one.
- **voiceService.ts** — Stub for the voice pipeline. The real implementation should connect to `/voice_modules` (`gemini_live.py`, `voice_assistant.py`) for speech-to-text, intent understanding and text-to-speech. Simulated functions here let the full conversational UI be built and demoed before that wiring exists.

## Backend endpoint map (current ↔ expected)

| UI needs | Status | Backend reference |
|---|---|---|
| List doctors | ✅ live | `GET /doctor-details` (`services/doctor_details_api.py`) |
| List/book/cancel/reschedule appointments | 🚧 mocked | not yet implemented — see TODO comments in `appointmentService.ts` |
| Voice transcription + assistant reply + TTS | 🚧 mocked | `/voice_modules/gemini_live.py`, `voice_assistant.py` |

When adding a new real endpoint, keep the exported function names and return types (from `src/types/`) unchanged so no screen needs to be touched.
