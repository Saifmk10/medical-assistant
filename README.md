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

Set the agent's Google API credentials in `agents/agent-pipeline/medical_agent/.env`. Set `DATABASE_URL` in the repository-root `.env` file to the PostgreSQL connection URL, using `host.docker.internal` as the host when PostgreSQL is started separately with `database/docker-compose.yaml`. Then start the services from the repository root:

```sh
docker compose -f database/docker-compose.yaml up -d
docker compose up --build
```

The medical agent API is available at `http://127.0.0.1:8080`, and the database API at `http://127.0.0.1:8001`. Both are bound to the local machine only. The agent connects to `database-api:8001` over the Compose network by default.
