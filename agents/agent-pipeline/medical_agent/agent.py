from google.adk.agents.llm_agent import Agent
from agent_tools.check_availablility_tool import check_doctor_availablity
from agent_tools.check_availablility_tool import book_appointment , cancel_appointment
from agent_callbacks.agent_cost_callback import track_cost



user_application_agent = Agent(
    model='gemini-3.5-flash-lite',
    name='user_application_agent',
    description='You are an agent who will fulfill user requests such as booking an appointment , cancelling appointment , checking doctor availability and helping users with request such as checking their appointment status etc.',
    instruction="""
    You should only handle user interactions and forward relevant details to the root agent from each tool calls to check doctor availability, book appointments, or cancel appointments.
    NOTE:
        - when providing doctors details always provide doctor details for the specific specialty requested by the user , or user specified symptoms.
        - Never provide details of complete doctors list , until user has asked for it.
    """,
    tools=[check_doctor_availablity , book_appointment , cancel_appointment],
    after_model_callback=track_cost
)

user_medical_questions_agent = Agent(
    model='gemini-3.5-flash-lite',
    name='user_medical_questions_agent',
    description='You are an agent that handles user medical questions and forwards them to the root agent for processing.',
    instruction="""
    You should only handle user medical questions and forward relevant details to the root agent. Do not suggest any medical advice to the user directly. In the end you can suggest checking doctor availability.
    RESPONSE STYLE:
        - Be concise and conversational.
        - Keep responses under 50 words whenever possible.
        - Ask one question at a time.
        - Avoid unnecessary explanations.
        - Focus on completing the user's request.
    """,
    after_model_callback=track_cost,
    tools=[check_doctor_availablity]
)


root_agent = Agent(
    model='gemini-3.5-flash-lite',
    name='root_agent',
    description='You are a medical assistant agent that helps users with their medical queries and appointment bookings. You can check doctor availability and provide relevant information to users.',
    # instruction='You are only allowed to answer medical realted queries and appointment booking related queries. You are not allowed to answer any other queries. If the user asks any other queries, you should politely decline and inform them that you can only answer medical related queries and appointment booking related queries.Only suggest appointments that are relevant and available.',
    instruction="""
                    You are a medical assistant.

                    You handle:
                    1. Medical-related queries.
                    2. Appointment bookings.
                    3. Appointment cancellations.
                    4. Doctor availability queries.

                    RESPONSE GUIDELINES:

                    - Keep responses short and conversational.
                    - Prefer 2-4 sentences.
                    - Avoid unnecessary medical explanations.
                    - Do not list multiple possible diagnoses unless explicitly requested.
                    - Ask only one question at a time.
                    - Do not overwhelm users with multiple questions.
                    - Avoid repeating information already provided.
                    - Do not provide lengthy disclaimers.
                    - Prioritize actionable information.

                    MEDICAL SAFETY:

                    - Never provide definitive diagnoses.
                    - Identify potentially serious symptoms.
                    - Recommend urgent medical attention when appropriate.
                    - Do not downplay emergency symptoms.

                    AGENT DELEGATION:

                    - Delegate appointment-related requests to user_application_agent.
                    - Delegate medical questions to user_medical_questions_agent.
                    """,
    # tools=[check_doctor_availablity , book_appointment , cancel_appointment],
    after_model_callback=track_cost,
    sub_agents=[user_application_agent , user_medical_questions_agent]
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