# mobile/

The cross-platform (Android + iOS) patient-facing app for the Medical Assistant project, built with **Expo + React Native + TypeScript**. This implements the voice-first appointment experience described in the root [README.md](../README.md).

## Tech stack

- **Expo (SDK 57) + React Native + TypeScript** — one codebase for both Android and iOS.
- **React Navigation** (`@react-navigation/native-stack` + `@react-navigation/bottom-tabs`) — app navigation.
- **React Context** — app-wide state (auth session, appointments, voice assistant conversation) instead of a heavier state library, since the app's state needs are modest.
- **expo-linear-gradient**, **@expo/vector-icons** — used for the premium visual styling (gradient headers, icon set).
- **expo-audio** + **expo-speech** — stream microphone PCM to Gemini Live and speak assistant replies.

## Folder structure

```
mobile/
├── App.tsx              — app entry point: providers + navigation container
├── app.json              — Expo config (app name, bundle IDs, splash/icon colors)
├── assets/               — app icons and splash image
└── src/                  — all application code (see src/README.md)
```

See [src/README.md](./src/README.md) for the full breakdown of the `src/` folder and where to plug in the real backend.

## Testing live voice

The mobile app reads `GEMINI_API_KEY` from the repository-root `.env` while Expo starts. The key is included in the test app configuration and sent to Gemini Live from the device. This direct-key setup is for local testing only; use a server-side proxy before distributing the app or using real patient data.

## Running the app

```bash
cd mobile
npm install       # first time only
npm run android   # run on an Android emulator/device
npm run ios       # run on an iOS simulator (macOS only)
npm run web       # run in a browser (useful for quick UI checks)
```

Every folder inside `src/` has its own `README.md` explaining what lives there and why — start with [src/README.md](./src/README.md).

## Connecting the backend

The FastAPI backend lives in `/services` at the project root (`main.py`, `doctor_details_api.py`). All network calls in this app go through `src/services/`, which currently uses mock data for anything the backend doesn't yet expose. Phase-one voice connects directly to Gemini Live; appointment actions are not connected to the voice flow yet. See [src/services/README.md](./src/services/README.md) for the current endpoint map.
