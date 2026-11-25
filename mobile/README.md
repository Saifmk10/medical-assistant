# mobile/

The cross-platform (Android + iOS) patient-facing app for the Medical Assistant project, built with **Expo + React Native + TypeScript**. This implements the voice-first appointment experience described in the root [README.md](../README.md).

## Tech stack

- **Expo (SDK 57) + React Native + TypeScript** — one codebase for both Android and iOS.
- **React Navigation** (`@react-navigation/native-stack` + `@react-navigation/bottom-tabs`) — app navigation.
- **React Context** — app-wide state (auth session, appointments, voice assistant conversation) instead of a heavier state library, since the app's state needs are modest.
- **expo-linear-gradient**, **@expo/vector-icons** — used for the premium visual styling (gradient headers, icon set).
- **expo-audio** — stream microphone PCM to the hosted voice service and play assistant replies.

## Folder structure

```
mobile/
├── App.tsx              — app entry point: providers + navigation container
├── app.json              — Expo config (app name, bundle IDs, splash/icon colors)
├── assets/               — app icons and splash image
└── src/                  — all application code (see src/README.md)
```

See [src/README.md](./src/README.md) for the full breakdown of the `src/` folder and where to plug in the real backend.

## Voice service

The mobile app connects to `wss://api.saifmk.online/medical-voice-api/ws`. It streams 16 kHz mono PCM microphone audio and starts playing 24 kHz mono PCM assistant audio as chunks arrive. No Gemini API key or locally bundled voice module is required. After installing dependencies, run `npm run android` or `npm run ios` to rebuild the native app with the audio streaming dependency before starting Metro.

## Running the app

### Google sign-in setup

Use Node.js 22. The app reads only `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY`
from the repository-root `.env` during Expo configuration. Alternatively, set
`EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in the
build environment. These values are included in the app; use only a publishable
or legacy anon key, never a secret or service-role key.

Add `medical-assistant://auth/callback` to the Supabase Authentication redirect
allow list. Google must remain configured with the Supabase project's OAuth
callback. Rebuild the native app after installing the authentication dependencies:
Expo Go cannot load the native crypto module. Sessions are stored in native
secure storage. Database profile sync is disabled; the app displays profile
information from the signed-in Supabase account.

The doctor directory uses the hosted doctor API. Appointment lists, booking,
availability, cancellation, rescheduling and medical history are unavailable
in the app until suitable backend support exists; demo records are not shown.
The current cancellation endpoint is unsafe for patient use and is not called.

```bash
cd mobile
npm install       # first time only
npm run android   # run on an Android emulator/device
npm run ios       # run on an iOS simulator (macOS only)
npm run web       # run in a browser (useful for quick UI checks)
```

Every folder inside `src/` has its own `README.md` explaining what lives there and why — start with [src/README.md](./src/README.md).

## Connecting the backend

The FastAPI backend lives in `database/services`. Voice chat connects to the
hosted voice WebSocket. See [src/services/README.md](./src/services/README.md)
for the current endpoint map and limitations.
