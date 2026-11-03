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
