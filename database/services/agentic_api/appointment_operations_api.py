import os

import psycopg
from psycopg.rows import dict_row

def appointment_booking(uid ,patient_name, doc_name, designation, slot_booking_time, hospital , contact):
    if not uid or not uid.strip():
        raise ValueError("A non-empty uid is required.")

    with psycopg.connect(
        os.getenv("DATABASE_URL", "postgresql://postgres:mysecretpassword@postgres-db:5432/my_app"),
        row_factory=dict_row
    ) as connection:
        with connection.cursor() as cursor:
            cursor.execute('INSERT INTO hospitals.appointments (uid, patient_name, doc_name, designation, slot_booking_time, hospital , contact) VALUES (%s, %s, %s, %s, %s, %s, %s)', (uid, patient_name, doc_name, designation, slot_booking_time, hospital , contact))
    return {"message": "Appointment booked successfully"}




def appointment_cancellation(uid , patient_name, doc_name, designation, slot_booking_time, hospital , contact):
    if not uid or not uid.strip():
        raise ValueError("A non-empty uid is required.")

    details = (
        ("patient_name", patient_name),
        ("doc_name", doc_name),
        ("designation", designation),
        ("slot_booking_time", slot_booking_time),
        ("hospital", hospital),
        ("contact", contact),
    )
    provided = [(column, value) for column, value in details if value and value.strip()]
    if not provided:
        raise ValueError("At least one appointment detail is required.")

    conditions = " AND ".join(f"{column} = %s" for column, _ in provided)
    with psycopg.connect(
        os.getenv("DATABASE_URL", "postgresql://postgres:mysecretpassword@postgres-db:5432/my_app"),
        row_factory=dict_row
    ) as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                f"DELETE FROM hospitals.appointments WHERE uid = %s AND {conditions}",
                (uid, *(value for _, value in provided)),
            )
            deleted = cursor.rowcount
    if not deleted:
        return {"error": "No matching appointment found."}
    return {"message": "Appointment cancelled successfully"}


# if __name__=="__main__":
#     print(appointment_booking("sAIF Doe", "Dr. Smith", "Cardiologist", "2023-10-15 10:00:00", "General Hospital", "+91 8867715967"))