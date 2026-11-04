from locust import HttpUser, task, between

class MedicalAssistantUser(HttpUser):

    wait_time = between(2, 5)

    @task
    def book_appointment(self):
        self.client.post(
            "/appointment-booking?patient_name=Test%20Patient&doc_name=Dr.%20Smith&designation=Cardiologist&slot_booking_time=2026-11-04%2010:00:00&hospital=Test%20Hospital&contact=9876543210"
        )