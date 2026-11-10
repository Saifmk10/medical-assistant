import json
import os
import urllib.error
import urllib.request

AGENT_BASE_URL = os.getenv("AGENT_API_BASE_URL", "https://api.saifmk.online/med-agent")
AGENT_APP_NAME = os.getenv("AGENT_APP_NAME", "medical_agent")
AGENT_TIMEOUT = 60

_known_sessions = set()


def _post(url, payload):
    request = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=AGENT_TIMEOUT) as response:
        return json.loads(response.read().decode("utf-8"))


def _ensure_session(user_id, session_id):
    if (user_id, session_id) in _known_sessions:
        return
    url = f"{AGENT_BASE_URL}/apps/{AGENT_APP_NAME}/users/{user_id}/sessions/{session_id}"
    try:
        _post(url, {})
    except urllib.error.HTTPError as e:
        # An already existing session is fine; anything else is a real failure.
        if e.code not in (400, 409):
            raise
    _known_sessions.add((user_id, session_id))


def call_agent_api(user_id, session_id, text):
    """Sends a message to the medical agent and returns the raw list of events."""
    _ensure_session(user_id, session_id)
    return _post(
        f"{AGENT_BASE_URL}/run",
        {
            "app_name": AGENT_APP_NAME,
            "user_id": user_id,
            "session_id": session_id,
            "new_message": {"role": "user", "parts": [{"text": text}]},
        },
    )


def ask_medical_agent(user_id, session_id, text):
    """Sends a message to the medical agent and returns only its final reply text."""
    events = call_agent_api(user_id, session_id, text)
    replies = []
    for event in events:
        content = event.get("content") or {}
        if content.get("role") != "model":
            continue
        for part in content.get("parts") or []:
            if part.get("text") and not part.get("thought"):
                replies.append(part["text"])
    return replies[-1] if replies else "The medical agent returned no response."

