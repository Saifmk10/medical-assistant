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

Set the agent's Google API credentials in `agents/agent-pipeline/medical_agent/.env`, then start the full stack—including PostgreSQL—from the repository root:

```sh
docker compose up --build
```

Compose starts PostgreSQL, waits for it to be healthy, and then starts the database API and medical agent. All three containers share the `medical-assistant` bridge network; the database API connects to PostgreSQL by its Compose service name, `postgres`. The database uses the default development credentials (`postgres` / `mysecretpassword`, database `my_app`). Set `POSTGRES_USER`, `POSTGRES_PASSWORD`, and `POSTGRES_DB` in the repository-root `.env` to override them; `DATABASE_URL` can also be set there when using an existing external database. Do not use the development password in production.

The medical agent API is available at `http://127.0.0.1:8080`, and the database API at `http://127.0.0.1:8001`. PostgreSQL is published only on localhost at port `5432`; the application containers connect to it through the private Compose network.
