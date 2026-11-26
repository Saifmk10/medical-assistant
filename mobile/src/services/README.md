# services/

The mobile app uses these services for network access and audio.

- `doctorService.ts` reads the hosted `GET /database-api/doctor-details`
  endpoint. Its `doc_name`, `designation` and `working_hours` fields are shown
  in the directory. A null, invalid or failed response is shown as an error.
- `appointmentService.ts` reports appointments, slots, booking, cancellation and
  rescheduling as unavailable. The existing booking and cancellation endpoints
  do not provide the authenticated patient-scoped operations, stable identifiers
  or slot availability required by the app. In particular, cancellation can
  delete rows matching *any* supplied field; the app must not call it.
- `profileService.ts` contains the unused profile sync client. Profile sync is
  disabled; the hosted user endpoints are unauthenticated and include profile
  information in query strings; see [database API](../../../database/services/README.md).
- `voiceService.ts` connects to the hosted voice WebSocket, and
  `pcmAudioPlayer.ts` plays its audio responses.

Medical history has no API and is displayed as unavailable rather than demo data.
Do not treat the sample files in `data/` as real patient records.
