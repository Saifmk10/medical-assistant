from fastapi import Depends, FastAPI, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from agentic_api.doctor_details_api import get_doctor_details
from agentic_api.appointment_operations_api import appointment_booking , appointment_cancellation
from generic_api.authentication_api import new_users, get_user, update_user_name, delete_user, ensure_user
from generic_api.supabase_auth import verified_user
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
bearer = HTTPBearer(auto_error=False)

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
def book_appointment(uid:str ,patient_name: str, doc_name: str, designation: str, slot_booking_time: str, hospital: str, contact: str):
    if not uid.strip():
        raise HTTPException(status_code=422, detail="A non-empty uid is required.")
    return appointment_booking(uid, patient_name, doc_name, designation, slot_booking_time, hospital , contact)

@app.post("/appointment-cancellation")
def cancel_appointment(uid: str, patient_name: str, doc_name: str, designation: str, slot_booking_time: str, hospital: str, contact: str):
    if not uid.strip():
        raise HTTPException(status_code=422, detail="A non-empty uid is required.")
    if not any(value.strip() for value in (patient_name, doc_name, designation, slot_booking_time, hospital, contact)):
        raise HTTPException(status_code=422, detail="At least one appointment detail is required.")
    return appointment_cancellation(uid, patient_name, doc_name, designation, slot_booking_time, hospital , contact)

@app.post("/new-user")
def create_user(id: str, username: str, email: str):
    return new_users(id, username, email)

@app.post("/auth/profile-sync", status_code=204)
def sync_profile(credentials: HTTPAuthorizationCredentials = Depends(bearer)):
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise HTTPException(status_code=401, detail="Bearer token required")
    user_id, full_name, email = verified_user(credentials.credentials)
    ensure_user(user_id, full_name, email)

@app.get("/get-user")
def fetch_user(user_id: str):
    return get_user(user_id)

@app.put("/update-user-name")
def modify_user_name(user_id: str, full_name: str):
    return update_user_name(user_id, full_name)

@app.delete("/delete-user")
def remove_user(user_id: str):
    return delete_user(user_id)