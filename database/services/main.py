from fastapi import FastAPI
from doctor_details_api import get_doctor_details
from appointment_operations_api import appointment_booking , appointment_cancellation
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