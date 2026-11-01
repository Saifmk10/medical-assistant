import psycopg
from psycopg.rows import dict_row

def appointment_booking(patient_name, doc_name, designation, slot_booking_time, hospital , contact):

    try:
        connection = psycopg.connect(
            "postgresql://postgres:mysecretpassword@localhost:5432/my_app",
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


if __name__=="__main__":
    print(appointment_booking("sAIF Doe", "Dr. Smith", "Cardiologist", "2023-10-15 10:00:00", "General Hospital", "+91 8867715967"))