import requests


def call_agent_api(user_id, session_id, text):
    url = "https://api.saifmk.online/med-agent/run"
    payload = {
        "app_name": "medical_agent",
        "user_id": user_id,
        "session_id": session_id,
        "new_message": {
            "role": "user",
            "parts": [{"text": text}],
        },
    }

    response = requests.post(url, json=payload, timeout=60)
    response.raise_for_status()
    return response.json()

response = call_agent_api("u_123" , "s_123" , "which doctors are available at 4pm?")
print(response)


