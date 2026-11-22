# Database API

| API endpoint | Function | Status (Caddyfile) |
| --- | --- | --- |
| GET `https://api.saifmk.online/database-api/` | Health | Configured |
| GET `https://api.saifmk.online/database-api/doctor-details` | Doctors | Configured |
| POST `https://api.saifmk.online/database-api/appointment-booking` | Booking | Configured |
| POST `https://api.saifmk.online/database-api/appointment-cancellation` | Cancellation | Configured |
| POST `https://api.saifmk.online/database-api/new-user` | Create | Configured |
| POST `https://api.saifmk.online/database-api/auth/profile-sync` | Create the signed-in user's profile if missing | Configured |
| GET `https://api.saifmk.online/database-api/get-user` | Retrieve | Configured |
| PUT `https://api.saifmk.online/database-api/update-user-name` | Update | Configured |
| DELETE `https://api.saifmk.online/database-api/delete-user` | Delete | Configured |

## Example query parameters

These are URL query parameters, not JSON request bodies.

| Endpoint | Example parameters |
| --- | --- |
| GET `/` | None |
| GET `/doctor-details` | None |
| POST `/appointment-booking` | `patient_name=Jane&doc_name=Smith&designation=Cardiology&slot_booking_time=2026-12-01%2010%3A00%3A00&hospital=General&contact=5550100` |
| POST `/appointment-cancellation` | `patient_name=Jane&doc_name=Smith&designation=Cardiology&slot_booking_time=2026-12-01%2010%3A00%3A00&hospital=General&contact=5550100` |
| POST `/new-user` | `id=123e4567-e89b-12d3-a456-426614174000&username=Test%20User&email=test%40example.com` |
| GET `/get-user` | `user_id=123e4567-e89b-12d3-a456-426614174000` |
| PUT `/update-user-name` | `user_id=123e4567-e89b-12d3-a456-426614174000&full_name=New%20Name` |
| DELETE `/delete-user` | `user_id=123e4567-e89b-12d3-a456-426614174000` |

**Cancellation warning:** The endpoint deletes bookings matching any supplied field.

## Supabase profile sync

Set `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` for the database API (the
Compose service passes both from the root environment). Use the same Supabase
project as the app and a publishable or legacy anon key, never a secret key.
Deploy the updated database API before using the app's profile sync.

`POST /auth/profile-sync` requires `Authorization: Bearer <access-token>`.
The server validates the token with Supabase Auth and uses the returned ID,
full name and email to insert into `app_data.users`. Phone is left untouched.
The table must already exist and `id` must have a primary-key or unique
constraint. Existing profiles are not overwritten on later sign-ins. Sync
failures are reported to the app and can be retried.

The older `/new-user`, `/get-user`, `/update-user-name` and `/delete-user`
endpoints do not verify callers; restrict access to them until they are secured.
