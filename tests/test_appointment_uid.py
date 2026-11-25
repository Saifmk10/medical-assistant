import asyncio
import sys
import unittest
from pathlib import Path
from unittest.mock import patch

from fastapi.testclient import TestClient
from google.adk.agents.invocation_context import InvocationContext
from google.adk.sessions.in_memory_session_service import InMemorySessionService
from google.adk.sessions.session import Session
from google.adk.tools.function_tool import FunctionTool
from google.adk.tools.tool_context import ToolContext

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "agents" / "agent-pipeline"))
sys.path.insert(0, str(ROOT / "database" / "services"))

from agent_tools import check_availablility_tool as tools
from agentic_api import appointment_operations_api as operations

# The authentication module currently performs a database operation on import.
with patch("psycopg.connect"):
    from main import app


DETAILS = {
    "patient_name": "Jane",
    "doc_name": "Dr Smith",
    "designation": "Cardiology",
    "slot_booking_time": "10:00",
    "hospital": "General",
    "contact": "123",
}


class AppointmentToolTests(unittest.TestCase):
    def setUp(self):
        session = Session(app_name="medical_agent", user_id="user-123", id="session-1")
        invocation = InvocationContext(
            invocation_id="invocation-1",
            session=session,
            session_service=InMemorySessionService(),
        )
        self.context = ToolContext(invocation_context=invocation)

    def test_adk_injects_session_uid_into_both_tools(self):
        for operation, endpoint in (
            (tools.book_appointment, "appointment-booking"),
            (tools.cancel_appointment, "appointment-cancellation"),
        ):
            with self.subTest(operation=operation.__name__), patch.object(tools.requests, "post") as post:
                post.return_value.status_code = 200
                post.return_value.json.return_value = {"message": "ok"}
                tool = FunctionTool(operation)
                declaration = tool._get_declaration()
                properties = declaration.parameters_json_schema["properties"]
                self.assertNotIn("tool_context", properties)
                self.assertNotIn("uid", properties)
                self.assertNotIn("url", properties)
                asyncio.run(tool.run_async(args=DETAILS, tool_context=self.context))
                args, kwargs = post.call_args
                self.assertTrue(args[0].endswith("/" + endpoint))
                self.assertEqual(kwargs["params"], {"uid": "user-123", **DETAILS})

    def test_missing_session_uid_never_calls_api(self):
        self.context.session.user_id = " "
        with patch.object(tools.requests, "post") as post:
            with self.assertRaises(ValueError):
                tools.book_appointment(**DETAILS, tool_context=self.context)
            post.assert_not_called()


class AppointmentDatabaseTests(unittest.TestCase):
    def setUp(self):
        self.patcher = patch.object(operations.psycopg, "connect")
        self.connect = self.patcher.start()
        self.addCleanup(self.patcher.stop)
        self.cursor = self.connect.return_value.__enter__.return_value.cursor.return_value.__enter__.return_value

    def test_booking_inserts_session_uid(self):
        operations.appointment_booking("user-123", *DETAILS.values())
        query, params = self.cursor.execute.call_args.args
        self.assertIn("hospitals.appointments", query)
        self.assertEqual(params, ("user-123", *DETAILS.values()))

    def test_cancellation_requires_uid_and_matches_all_provided_details(self):
        self.cursor.rowcount = 1
        operations.appointment_cancellation("user-123", "Jane", "Dr Smith", "", "", "", "")
        query, params = self.cursor.execute.call_args.args
        self.assertIn("WHERE uid = %s AND patient_name = %s AND doc_name = %s", query)
        self.assertNotIn(" OR ", query)
        self.assertEqual(params, ("user-123", "Jane", "Dr Smith"))

    def test_invalid_uid_or_missing_cancellation_details_do_not_query(self):
        for operation, args in (
            (operations.appointment_booking, (" ", *DETAILS.values())),
            (operations.appointment_cancellation, ("", *DETAILS.values())),
            (operations.appointment_cancellation, ("user-123", "", "", "", "", "", "")),
        ):
            with self.subTest(operation=operation.__name__, args=args), self.assertRaises(ValueError):
                operation(*args)
        self.connect.assert_not_called()

    def test_no_matching_appointment_reports_error(self):
        self.cursor.rowcount = 0
        result = operations.appointment_cancellation("user-123", "Jane", "", "", "", "", "")
        self.assertEqual(result, {"error": "No matching appointment found."})


class AppointmentEndpointTests(unittest.TestCase):
    def test_endpoints_reject_blank_uid_and_empty_cancellation(self):
        client = TestClient(app)
        with patch("main.appointment_booking") as booking, patch("main.appointment_cancellation") as cancellation:
            self.assertEqual(client.post("/appointment-booking", params={"uid": " ", **DETAILS}).status_code, 422)
            self.assertEqual(client.post("/appointment-cancellation", params={"uid": "", **DETAILS}).status_code, 422)
            empty_details = dict.fromkeys(DETAILS, "")
            self.assertEqual(client.post("/appointment-cancellation", params={"uid": "user-123", **empty_details}).status_code, 422)
            booking.assert_not_called()
            cancellation.assert_not_called()


if __name__ == "__main__":
    unittest.main()
