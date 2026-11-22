import json
import os
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import HTTPRedirectHandler, Request, build_opener

from fastapi import HTTPException


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def verified_user(access_token: str) -> tuple[str, str, str]:
    url = os.environ.get("SUPABASE_URL", "").rstrip("/")
    key = os.environ.get("SUPABASE_PUBLISHABLE_KEY", "")
    parsed = urlparse(url)
    if parsed.scheme != "https" or not parsed.netloc or not key:
        raise HTTPException(status_code=503, detail="Supabase authentication is not configured")

    request = Request(
        f"{url}/auth/v1/user",
        headers={"Authorization": f"Bearer {access_token}", "apikey": key},
    )
    try:
        with build_opener(NoRedirect).open(request, timeout=10) as response:
            user = json.load(response)
    except HTTPError as exc:
        if exc.code in (401, 403):
            raise HTTPException(status_code=401, detail="Invalid or expired session") from exc
        raise HTTPException(status_code=502, detail="Supabase authentication is unavailable") from exc
    except (URLError, TimeoutError, OSError, ValueError) as exc:
        raise HTTPException(status_code=502, detail="Supabase authentication is unavailable") from exc

    if not isinstance(user, dict):
        raise HTTPException(status_code=502, detail="Invalid response from Supabase")
    user_id = user.get("id")
    email = user.get("email")
    metadata = user.get("user_metadata")
    if not isinstance(user_id, str) or not user_id or not isinstance(email, str) or not email:
        raise HTTPException(status_code=422, detail="Supabase account must have an ID and email")
    name = metadata.get("full_name") if isinstance(metadata, dict) else None
    if not isinstance(name, str) or not name.strip():
        name = "Patient"
    return user_id, name, email
