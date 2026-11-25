import os

import requests
from google.adk.tools.tool_context import ToolContext

api_base_url = os.getenv("MEDICAL_BACKEND_URL", "http://127.0.0.1:8001").rstrip("/")
api_url = f"{api_base_url}/doctor-details"

def check_doctor_availablity():

    """Function to check doctor availability by making a GET request to the API endpoint."""

    response = requests.get(api_url)
    if response.status_code == 200:
        result = response.json()

        return {
            "doctor details": result
        }
    else:
        return {"error": "Failed to fetch doctor details"}



def book_appointment(patient_name: str, doc_name: str, designation: str, slot_booking_time: str, hospital: str, contact: str, tool_context: ToolContext):
    """Function to book an appointment by making a POST request to the API endpoint. take the input from the and ask the user for any missing details."""

    uid = tool_context.session.user_id
    if not uid or not uid.strip():
        raise ValueError("A user ID is required to book an appointment.")
    payload = {
        "uid": uid,
        "patient_name": patient_name,
        "doc_name": doc_name,
        "designation": designation,
        "slot_booking_time": slot_booking_time,
        "hospital": hospital,
        "contact": contact
    }
    
    response = requests.post(f"{api_base_url}/appointment-booking", params=payload)

    if response.status_code == 200:
        return {"message": "Appointment booked successfully"}
    else:
        return {"error": "Failed to book appointment" , "error": response.status_code}





def cancel_appointment(patient_name: str, doc_name: str, designation: str, slot_booking_time: str, hospital: str, contact: str, tool_context: ToolContext):
    """Cancel an appointment using its known details. Leave unknown details empty."""

    uid = tool_context.session.user_id
    if not uid or not uid.strip():
        raise ValueError("A user ID is required to cancel an appointment.")
    payload = {
        "uid": uid,
        "patient_name": patient_name,
        "doc_name": doc_name,
        "designation": designation,
        "slot_booking_time": slot_booking_time,
        "hospital": hospital,
        "contact": contact,
    }
    response = requests.post(f"{api_base_url}/appointment-cancellation", params=payload)
   
    if response.status_code == 200:
        return response.json()
    else:
        return {"error": "Failed to cancel appointment" , "error": response.status_code}