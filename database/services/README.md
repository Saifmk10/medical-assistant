# Database API

| API endpoint | Function | Status (Caddyfile) |
| --- | --- | --- |
| GET `https://api.saifmk.online/database-api/` | Health | Configured |
| GET `https://api.saifmk.online/database-api/doctor-details` | Doctors | Configured |
| POST `https://api.saifmk.online/database-api/appointment-booking` | Booking | Configured |
| POST `https://api.saifmk.online/database-api/appointment-cancellation` | Cancellation | Configured |
| POST `https://api.saifmk.online/database-api/new-user` | Create | Configured |
| GET `https://api.saifmk.online/database-api/get-user` | Retrieve | Configured |
| PUT `https://api.saifmk.online/database-api/update-user-name` | Update | Configured |
| DELETE `https://api.saifmk.online/database-api/delete-user` | Delete | Configured |

## Example query parameters

These are URL query parameters, not JSON request bodies.

| Endpoint | Example parameters |
| --- | --- |
| GET `/` | None |
| GET `/doctor-details` | None |
| POST `/appointment-booking` | `uid=user-123&patient_name=Jane&doc_name=Smith&designation=Cardiology&slot_booking_time=2026-12-01%2010%3A00%3A00&hospital=General&contact=5550100` |
| POST `/appointment-cancellation` | `uid=user-123&patient_name=Jane&doc_name=Smith&designation=Cardiology&slot_booking_time=2026-12-01%2010%3A00%3A00&hospital=General&contact=5550100` |
| POST `/new-user` | `id=123e4567-e89b-12d3-a456-426614174000&username=Test%20User&email=test%40example.com` |
| GET `/get-user` | `user_id=123e4567-e89b-12d3-a456-426614174000` |
| PUT `/update-user-name` | `user_id=123e4567-e89b-12d3-a456-426614174000&full_name=New%20Name` |
| DELETE `/delete-user` | `user_id=123e4567-e89b-12d3-a456-426614174000` |

Cancellation requires a non-empty UID and at least one appointment detail. It deletes rows matching the UID and all non-empty details; leave unknown details empty. The UID is not authenticated by this API.


curl -X POST "https://api.saifmk.online/database-api/new-user?id=123e4567-e89b-12d3-a456-426614174000&username=Test%20User&email=test%40example.com"