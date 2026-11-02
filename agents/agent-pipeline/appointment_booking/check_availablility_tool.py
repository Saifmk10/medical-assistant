import requests

api_url = "http://127.0.0.1:8001/doctor-details"

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


# if __name__ == "__main__":
print(check_doctor_availablity())   