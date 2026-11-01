from google.adk.agents.llm_agent import Agent
from appointment_booking.check_availablility_tool import check_doctor_availablity

root_agent = Agent(
    model='gemini-3.5-flash',
    name='root_agent',
    description='You are a medical assistant agent that helps users with their medical queries and appointment bookings. You can check doctor availability and provide relevant information to users.',
    instruction='You are only allowed to answer medical realted queries and appointment booking related queries. You are not allowed to answer any other queries. If the user asks any other queries, you should politely decline and inform them that you can only answer medical related queries and appointment booking related queries.Only suggest appointments that are rela',
    tools=[check_doctor_availablity]
)
