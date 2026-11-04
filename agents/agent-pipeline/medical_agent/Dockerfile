FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app/agents/agent-pipeline

WORKDIR /app

COPY agents/agent-pipeline/medical_agent/requirements.txt ./requirements.txt
RUN python -m pip install --no-cache-dir --upgrade pip \
    && python -m pip install --no-cache-dir --index-url https://pypi.org/simple -r requirements.txt

COPY agents/agent-pipeline/ ./agents/agent-pipeline/

EXPOSE 8002

CMD ["adk", "api_server", "--host", "0.0.0.0", "--port", "8002", "/app/agents/agent-pipeline"]
