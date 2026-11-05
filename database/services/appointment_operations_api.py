import os

import psycopg
from psycopg.rows import dict_row

def appointment_booking(patient_name, doc_name, designation, slot_booking_time, hospital , contact):

    try:
        connection = psycopg.connect(
            os.getenv("DATABASE_URL", "postgresql://postgres:mysecretpassword@postgres-db:5432/my_app"),
            row_factory=dict_row
        )
        cursor = connection.cursor()

    except Exception as e:
        print(f"Error connecting to database : {e}")
        return None
    
    cursor.execute('INSERT INTO hospitals.test_booking (patient_name, doc_name, designation, slot_booking_time, hospital , contact) VALUES (%s, %s, %s, %s, %s, %s)', (patient_name, doc_name, designation, slot_booking_time, hospital , contact))
    connection.commit()
    cursor.close()
    connection.close()
    return {"message": "Appointment booked successfully"}




def appointment_cancellation(patient_name, doc_name, designation, slot_booking_time, hospital , contact):

    try:
        connection = psycopg.connect(
            os.getenv("DATABASE_URL", "postgresql://postgres:mysecretpassword@postgres-db:5432/my_app"),
            row_factory=dict_row
        )
        cursor = connection.cursor()

    except Exception as e:
        print(f"Error connecting to database : {e}")
        return None
    
    cursor.execute('DELETE FROM hospitals.test_booking WHERE patient_name = %s OR doc_name = %s OR designation = %s OR slot_booking_time = %s OR hospital = %s OR contact = %s', (patient_name, doc_name, designation, slot_booking_time, hospital , contact))
    connection.commit()
    cursor.close()
    connection.close()
    return {"message": "Appointment cancelled successfully"}


# if __name__=="__main__":
#     print(appointment_booking("sAIF Doe", "Dr. Smith", "Cardiologist", "2023-10-15 10:00:00", "General Hospital", "+91 8867715967"))