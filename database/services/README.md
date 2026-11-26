# Database API

Caddy routes `https://api.saifmk.online/database-api/` to the database API,
removing the `/database-api` prefix. The URLs below describe the current
source code; changes must be deployed before they are available in production.

Parameters are URL query parameters, not JSON request bodies. Use the HTTP
method shown for each URL; opening a URL in a browser sends a GET request.

| Method | API URL | Example URL with parameters |
| --- | --- | --- |
| GET | `https://api.saifmk.online/database-api/` | `https://api.saifmk.online/database-api/` |
| GET | `https://api.saifmk.online/database-api/doctor-details` | `https://api.saifmk.online/database-api/doctor-details` |
| POST | `https://api.saifmk.online/database-api/appointment-booking` | `https://api.saifmk.online/database-api/appointment-booking?uid=123e4567-e89b-12d3-a456-426614174000&patient_name=Jane&doc_name=Smith&designation=Cardiology&slot_booking_time=2026-12-01%2010%3A00%3A00&hospital=General&contact=5550100` |
| POST | `https://api.saifmk.online/database-api/appointment-cancellation` | `https://api.saifmk.online/database-api/appointment-cancellation?uid=123e4567-e89b-12d3-a456-426614174000&patient_name=Jane&doc_name=Smith&designation=Cardiology&slot_booking_time=2026-12-01%2010%3A00%3A00&hospital=General&contact=5550100` |
| GET | `https://api.saifmk.online/database-api/user-appointments` | `https://api.saifmk.online/database-api/user-appointments?uid=123e4567-e89b-12d3-a456-426614174000` |
| POST | `https://api.saifmk.online/database-api/new-user` | `https://api.saifmk.online/database-api/new-user?id=123e4567-e89b-12d3-a456-426614174000&username=Test%20User&email=test%40example.com` |
| GET | `https://api.saifmk.online/database-api/get-user` | `https://api.saifmk.online/database-api/get-user?user_id=123e4567-e89b-12d3-a456-426614174000` |
| PUT | `https://api.saifmk.online/database-api/update-user-name` | `https://api.saifmk.online/database-api/update-user-name?user_id=123e4567-e89b-12d3-a456-426614174000&full_name=New%20Name` |
| DELETE | `https://api.saifmk.online/database-api/delete-user` | `https://api.saifmk.online/database-api/delete-user?user_id=123e4567-e89b-12d3-a456-426614174000` |

For example, to create a user:

```sh
curl -X POST 'https://api.saifmk.online/database-api/new-user?id=123e4567-e89b-12d3-a456-426614174000&username=Test%20User&email=test%40example.com'
```

Cancellation requires a non-empty UID and at least one appointment detail. All
detail parameters must be present, but unknown values can be empty. It deletes
rows matching the UID and all non-empty details. The API does not authenticate
the supplied user IDs; do not expose these endpoints without authentication.
