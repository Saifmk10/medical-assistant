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

Set `POSTGRES_PASSWORD` and `GEMINI_API_KEY` in the repository-root `.env` file, and set the agent's Google API credentials in `agents/agent-pipeline/medical_agent/.env`. Keep both files local and never commit them. Use a unique, strong database password; no default password is provided. Then start the full stack—including PostgreSQL and Caddy—from the repository root:

```sh
docker volume create pdk_caddy_data
docker volume create pdk_caddy_config
docker compose up --build
```

Compose starts PostgreSQL, waits for it to be healthy, and then starts the database API, medical agent, and Caddy reverse proxy. Caddy's configuration is in [`rev_proxy/Caddyfile`](./rev_proxy/Caddyfile); certificate and configuration state are persisted in the `pdk_caddy_data` and `pdk_caddy_config` Docker volumes. Set `POSTGRES_USER` and `POSTGRES_DB` in the repository-root `.env` to override their non-secret defaults. `DATABASE_URL` can also be set there when using an existing external database.

Run only one Caddy service on ports 80 and 443. On hosts that already manage Caddy with a separate Compose project, mount `rev_proxy/Caddyfile` in that project and omit the main Compose project's `caddy` service. Recreate the active Caddy service after editing the file to ensure it reads the current bind-mounted file.

The medical agent API is available through Caddy at `https://api.saifmk.online/med-agent/`. The voice API is available at `https://api.saifmk.online/medical-voice-api/` and is proxied to the `voice-api` Compose service on port `8000`; the prefix is stripped before requests reach the service. The medical agent is also available locally at `http://127.0.0.1:8080`, and the database API at `http://127.0.0.1:8001`. PostgreSQL is published only on localhost at port `5432`; the application containers connect to it through the private Compose network.
