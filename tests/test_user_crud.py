import os
import unittest
from unittest.mock import patch

from database.services.generic_api import authentication_api


class UserCrudTests(unittest.TestCase):
    def setUp(self):
        self.environment = patch.dict(os.environ, {"DATABASE_URL": "postgresql://test"})
        self.environment.start()
        self.addCleanup(self.environment.stop)
        connect_patch = patch.object(authentication_api.psycopg, "connect")
        self.connect = connect_patch.start()
        self.addCleanup(connect_patch.stop)
        self.connection = self.connect.return_value.__enter__.return_value
        self.cursor = self.connection.cursor.return_value.__enter__.return_value

    def test_create_parameterizes_values_and_returns_success(self):
        name = "O'Brien"
        result = authentication_api.new_users("user-id", name, "user@example.com")

        self.assertEqual(result, {"message": "User created successfully"})
        query, parameters = self.cursor.execute.call_args.args
        self.assertIn("INSERT INTO app_data.users", query)
        self.assertNotIn(name, query)
        self.assertEqual(parameters, ("user-id", name, "user@example.com"))

    def test_read_update_and_delete_use_id_and_return_row(self):
        row = {"id": "user-id", "full_name": "Name", "email": "user@example.com"}
        self.cursor.fetchone.return_value = row
        operations = (
            (authentication_api.get_user, ("user-id",), "SELECT", ("user-id",)),
            (authentication_api.update_user_name, ("user-id", "Name"), "UPDATE", ("Name", "user-id")),
            (authentication_api.delete_user, ("user-id",), "DELETE", ("user-id",)),
        )
        for operation, args, statement, parameters in operations:
            with self.subTest(operation=operation.__name__):
                self.assertEqual(operation(*args), row)
                query, actual_parameters = self.cursor.execute.call_args.args
                self.assertIn(statement, query)
                self.assertIn("WHERE id = %s", query)
                self.assertEqual(actual_parameters, parameters)

    def test_missing_user_returns_none(self):
        self.cursor.fetchone.return_value = None
        self.assertIsNone(authentication_api.get_user("missing"))
        self.assertIsNone(authentication_api.update_user_name("missing", "Name"))
        self.assertIsNone(authentication_api.delete_user("missing"))

    def test_database_errors_propagate(self):
        self.cursor.execute.side_effect = authentication_api.psycopg.Error("database error")
        with self.assertRaises(authentication_api.psycopg.Error):
            authentication_api.new_users("user-id", "Name", "user@example.com")


if __name__ == "__main__":
    unittest.main()
