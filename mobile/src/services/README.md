# services/

The data-access layer — every screen fetches data through these functions instead of calling `fetch` directly. This is the **primary place to connect the real backend** later.

## Files

- **config.ts** — `API_BASE_URL` (points at the FastAPI backend in `/services/main.py`) and the `USE_MOCK_DATA` flag. Flip `USE_MOCK_DATA` to `false` once real endpoints exist.
- **apiClient.ts** — Thin `fetch` wrapper (`apiGet`, `apiPost`) with shared error handling. Add auth headers / retry logic here once needed.
- **doctorService.ts** — Doctor/provider lookup. Already wired to the real `GET /doctor-details` endpoint (see `services/doctor_details_api.py` in the project root) behind the mock-data flag.
- **appointmentService.ts** — Appointment CRUD (list, book, cancel, reschedule, available slots). Currently backed by an in-memory copy of the mock data since no appointments API exists yet. Each function documents the REST route it should call once the backend adds one.
- **voiceService.ts** — WebSocket transport to `wss://api.saifmk.online/medical-voice-api/ws` for microphone PCM, transcript events and assistant PCM audio.
- **pcmAudioPlayer.ts** — Converts streamed 24 kHz PCM chunks to native audio buffers and plays them as they arrive, with a short jitter buffer.

## Backend endpoint map (current ↔ expected)

| UI needs | Status | Backend reference |
|---|---|---|
| List doctors | ✅ live | `GET /doctor-details` (`services/doctor_details_api.py`) |
| List/book/cancel/reschedule appointments | 🚧 mocked | not yet implemented — see TODO comments in `appointmentService.ts` |
| Voice transcription + assistant reply + TTS | ✅ live voice service | `voiceService.ts` connects to the hosted WebSocket; `pcmAudioPlayer.ts` streams replies to the audio output |

When adding a new real endpoint, keep the exported function names and return types (from `src/types/`) unchanged so no screen needs to be touched.
