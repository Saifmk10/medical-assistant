import psycopg
from psycopg.rows import dict_row

def get_doctor_details():

    try:
        connection = psycopg.connect(
            "postgresql://postgres:mysecretpassword@localhost:5432/my_app",
            row_factory=dict_row
        )
        cursor = connection.cursor()

    except Exception as e:
        print(f"Error connecting to database : {e}")
        return None
    
    cursor.execute('SELECT name  , qualification  FROM hospitals.cmh')
    doctor_details = cursor.fetchall()
    cursor.close()
    connection.close()
    return doctor_details


if __name__=="__main__":
    print(get_doctor_details())