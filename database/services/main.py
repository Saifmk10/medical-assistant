from fastapi import FastAPI
from agentic_api.doctor_details_api import get_doctor_details
from agentic_api.appointment_operations_api import appointment_booking , appointment_cancellation
from generic_api.authentication_api import new_users, get_user, update_user_name, delete_user
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def testing():
    return {"API RUNNING"}

@app.get("/doctor-details")
def doc():
    return get_doctor_details()

@app.post("/appointment-booking")
def book_appointment(patient_name: str, doc_name: str, designation: str, slot_booking_time: str, hospital: str, contact: str):
    return appointment_booking(patient_name, doc_name, designation, slot_booking_time, hospital , contact)

@app.post("/appointment-cancellation")
def cancel_appointment(patient_name: str, doc_name: str, designation: str, slot_booking_time: str, hospital: str, contact: str):
    return appointment_cancellation(patient_name, doc_name, designation, slot_booking_time, hospital , contact)

@app.post("/new-user")
def create_user(id: str, username: str, email: str):
    return new_users(id, username, email)

@app.get("/get-user")
def fetch_user(user_id: str):
    return get_user(user_id)

@app.put("/update-user-name")
def modify_user_name(user_id: str, full_name: str):
    return update_user_name(user_id, full_name)

@app.delete("/delete-user")
def remove_user(user_id: str):
    return delete_user(user_id)