# Medical Assistant Agent

A voice-first healthcare assistant that helps patients find the right doctor, check availability, and manage appointments through simple conversation.

## Overview

Medical Assistant Agent is designed to make appointment booking feel as easy as talking to a real healthcare concierge. Patients can describe their need in natural language, and the assistant guides them through the next steps.

## What it does

- Helps users find a suitable doctor or specialty
- Searches for available appointment slots
- Books appointments through conversational flow
- Shows upcoming appointments
- Allows rescheduling and cancellation
- Keeps the experience centered around voice interaction

## Example

> "I need to see a dermatologist tomorrow evening."

The assistant can understand the request, suggest matching doctors, present available time slots, and confirm the appointment once the patient chooses.

## Key features

- Voice-based appointment discovery
- Conversational scheduling flow
- Doctor and specialty matching
- Appointment management dashboard
- Patient profile and medical history support
- Notifications for confirmations and updates

## Why it matters

The goal is to simplify healthcare access by reducing friction in appointment scheduling and making the experience more natural, fast, and patient-friendly.

## Status

This project is a proof of concept focused on the patient-facing healthcare booking experience.

## Run the medical agent with Docker

Set `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` and `GEMINI_API_KEY` in the repository-root `.env` file, and set the agent's Google API credentials in `agents/agent-pipeline/medical_agent/.env`. Keep both files local and never commit them. Start PostgreSQL separately, then start the application stack and Caddy from the repository root:

```sh
docker volume create pdk_caddy_data
docker volume create pdk_caddy_config
docker compose up --build
```

Compose starts the database API, medical agent, and Caddy reverse proxy; it does not start or wait for PostgreSQL. Caddy's configuration is in [`rev_proxy/Caddyfile`](./rev_proxy/Caddyfile); certificate and configuration state are persisted in the `pdk_caddy_data` and `pdk_caddy_config` Docker volumes.

The database API uses `DATABASE_URL` as provided. For a PostgreSQL server running directly on the Docker host, `localhost` in this URL refers to the API container, not the host. Use a host-reachable address such as `host.docker.internal`, and configure PostgreSQL's listening address and access rules to allow the Docker connection. Restrict access to trusted networks.

Run only one Caddy service on ports 80 and 443. On hosts that already manage Caddy with a separate Compose project, mount `rev_proxy/Caddyfile` in that project and omit the main Compose project's `caddy` service. Recreate the active Caddy service after editing the file to ensure it reads the current bind-mounted file.

The medical agent API is available through Caddy at `https://api.saifmk.online/med-agent/`. The voice API is available at `https://api.saifmk.online/medical-voice-api/` and is proxied to the `voice-api` Compose service on port `8000`; the prefix is stripped before requests reach the service. The medical agent is also available locally at `http://127.0.0.1:8080`, and the database API at `http://127.0.0.1:8001`.

### User profile database functions

`database/services/generic_api/authentication_api.py` provides `new_users(id,
username, email)`, `get_user(user_id)`, `update_user_name(user_id, full_name)`,
and `delete_user(user_id)`. The last three return the profile as a dictionary,
or `None` when it does not exist. `new_users` returns a success message.
Database errors are returned as error objects. These functions require
`DATABASE_URL` and an existing `app_data.users` table with `id`, `full_name`,
and `email` columns.

The [database API](./database/services/README.md) also has an authenticated
profile-sync endpoint that validates the Supabase session and creates a missing
profile. Its older user CRUD endpoints do not authenticate callers and must
be restricted until secured. Deleting a profile does not delete the Supabase
authentication account.
