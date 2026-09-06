from fastapi import FastAPI
from doctor_details_api import get_doctor_details
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