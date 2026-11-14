import os

import psycopg
from psycopg.rows import dict_row
import dotenv

dotenv.load_dotenv()

def new_users(id, username, email):
    try:
        with psycopg.connect(os.environ["DATABASE_URL"], row_factory=dict_row) as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    "INSERT INTO app_data.users (id, full_name, email) VALUES (%s, %s, %s)",
                    (id, username, email),
                )
        return {"message": "User created successfully"}
    except psycopg.Error as e:
        return {"error in user creation": str(e)}


def get_user(user_id):
    try:
        with psycopg.connect(os.environ["DATABASE_URL"], row_factory=dict_row) as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    "SELECT id, full_name, email FROM app_data.users WHERE id = %s",
                    (user_id,),
                )
                return cursor.fetchone()
    except psycopg.Error as e:
        return {"error in fetching user": str(e)}


def update_user_name(user_id, full_name):
    try:
        with psycopg.connect(os.environ["DATABASE_URL"], row_factory=dict_row) as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    UPDATE app_data.users
                    SET full_name = %s
                    WHERE id = %s
                    RETURNING id, full_name, email
                    """,
                    (full_name, user_id),
                )
                return cursor.fetchone()
    except psycopg.Error as e:
        return {"error in updating user": str(e)}


def delete_user(user_id):
    try:
        with psycopg.connect(os.environ["DATABASE_URL"], row_factory=dict_row) as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    "DELETE FROM app_data.users WHERE id = %s RETURNING id, full_name, email",
                    (user_id,),
                )
                return cursor.fetchone()
    except psycopg.Error as e:
        return {"error in deleting user": str(e)}


# print(get_user("2c7b57e6-5120-49a9-858e-f48a4ee46a1e"))
# print(new_users("769023fg29", "O'Brien", "user@example.com"))
# print(get_user("769023fg29"))
# print(update_user_name("769023fg29", "New Name"))
print(delete_user("769023fg29"))