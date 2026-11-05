from google.adk.agents.llm_agent import Agent
from agent_tools.check_availablility_tool import check_doctor_availablity
from agent_tools.check_availablility_tool import book_appointment , cancel_appointment
from agent_callbacks.agent_cost_callback import track_cost

root_agent = Agent(
    model='gemini-3.5-flash-lite',
    name='root_agent',
    description='You are a medical assistant agent that helps users with their medical queries and appointment bookings. You can check doctor availability and provide relevant information to users.',
    instruction='You are only allowed to answer medical realted queries and appointment booking related queries. You are not allowed to answer any other queries. If the user asks any other queries, you should politely decline and inform them that you can only answer medical related queries and appointment booking related queries.Only suggest appointments that are rela',
    tools=[check_doctor_availablity , book_appointment , cancel_appointment],
    after_model_callback=track_cost
)


# used to create a new session 
#  curl.exe -X POST "http://127.0.0.1:8000/apps/medical_agent/users/u_123/sessions/s_123" `
# >>   -H "Content-Type: application/json" `
# >>   -d '{\"key1\":\"value1\",\"key2\":42}'


# used to send request to the medical agent

# $body = @{
#     app_name = "medical_agent"
#     user_id = "u_123"
#     session_id = "s_123"
#     new_message = @{
#         role = "user"
#         parts = @(
#             @{ text = "i need to book an appointment" }
#         )
#     }
# } | ConvertTo-Json -Depth 10 -Compress

# $response = Invoke-RestMethod `
#     -Uri "http://127.0.0.1:8000/run" `
#     -Method Post `
#     -ContentType "application/json" `
#     -Body $body

# $response | ConvertTo-Json -Depth 20


# bash
# curl -sS -X POST 'http://127.0.0.1:8080/run' \
#   -H 'Content-Type: application/json' \
#   --data-binary @- <<'JSON' | jq .
# {
#   "app_name": "medical_agent",
#   "user_id": "u_123",
#   "session_id": "s_123",
#   "new_message": {
#     "role": "user",
#     "parts": [
#       { "text": "is there any doctor available at 5pm?" }
#     ]
#   }
# }
# JSON