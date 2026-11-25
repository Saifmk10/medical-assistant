import io
import json
import os
import sys
import unittest
from pathlib import Path
from unittest.mock import patch
from urllib.error import HTTPError, URLError

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "database" / "services"))

from fastapi.testclient import TestClient

from generic_api import authentication_api, supabase_auth
from main import app


class ProfileSyncTests(unittest.TestCase):
    def setUp(self):
        self.environment = patch.dict(os.environ, {
            "DATABASE_URL": "postgresql://test",
            "SUPABASE_URL": "https://example.supabase.co",
            "SUPABASE_PUBLISHABLE_KEY": "public-key",
        })
        self.environment.start()
        self.addCleanup(self.environment.stop)
        self.opener_patch = patch.object(supabase_auth, "build_opener")
        self.opener = self.opener_patch.start().return_value
        self.addCleanup(self.opener_patch.stop)
        self.connect_patch = patch.object(authentication_api.psycopg, "connect")
        self.connect = self.connect_patch.start()
        self.addCleanup(self.connect_patch.stop)
        self.cursor = self.connect.return_value.__enter__.return_value.cursor.return_value.__enter__.return_value
        self.client = TestClient(app, raise_server_exceptions=False)
        self.addCleanup(self.client.close)

    def mock_user(self, user):
        self.opener.open.side_effect = lambda *args, **kwargs: io.BytesIO(
            json.dumps(user).encode("utf-8")
        )

    def test_verified_identity_is_inserted_idempotently_not_from_request(self):
        self.mock_user({
            "id": "supabase-user-id",
            "email": "user@example.com",
            "user_metadata": {"full_name": "O'Brien"},
        })
        for _ in range(2):
            response = self.client.post(
                "/auth/profile-sync",
                headers={"Authorization": "Bearer valid-token"},
                json={"id": "forged-id", "email": "forged@example.com"},
            )
            self.assertEqual(response.status_code, 204)
        request = self.opener.open.call_args.args[0]
        self.assertEqual(request.full_url, "https://example.supabase.co/auth/v1/user")
        self.assertEqual(request.get_header("Authorization"), "Bearer valid-token")
        self.assertEqual(request.get_header("Apikey"), "public-key")
        query, parameters = self.cursor.execute.call_args.args
        self.assertIn("ON CONFLICT (id) DO NOTHING", query)
        self.assertEqual(parameters, ("supabase-user-id", "O'Brien", "user@example.com"))
        self.assertEqual(self.cursor.execute.call_count, 2)

    def test_missing_or_invalid_token_does_not_write(self):
        self.assertEqual(self.client.post("/auth/profile-sync").status_code, 401)
        self.opener.open.side_effect = HTTPError("https://example.supabase.co", 401, "", {}, None)
        response = self.client.post("/auth/profile-sync", headers={"Authorization": "Bearer bad"})
        self.assertEqual(response.status_code, 401)
        self.connect.assert_not_called()

    def test_missing_email_and_upstream_failure_do_not_write(self):
        self.mock_user({"id": "user-id", "user_metadata": {}})
        response = self.client.post("/auth/profile-sync", headers={"Authorization": "Bearer token"})
        self.assertEqual(response.status_code, 422)
        self.opener.open.side_effect = URLError("unavailable")
        response = self.client.post("/auth/profile-sync", headers={"Authorization": "Bearer token"})
        self.assertEqual(response.status_code, 502)
        self.connect.assert_not_called()

    def test_missing_name_uses_default_and_database_errors_fail_request(self):
        self.mock_user({"id": "user-id", "email": "user@example.com", "user_metadata": {}})
        self.cursor.execute.side_effect = authentication_api.psycopg.Error("unavailable")
        response = self.client.post("/auth/profile-sync", headers={"Authorization": "Bearer token"})
        self.assertEqual(response.status_code, 500)
        self.assertEqual(self.cursor.execute.call_args.args[1], ("user-id", "Patient", "user@example.com"))


if __name__ == "__main__":
    unittest.main()
