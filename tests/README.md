# Supabase Google sign-in check

This standalone check does not change the app. It requires Node.js 22 or
newer and uses a browser to complete Google sign-in.

1. In the root `.env`, add `SUPABASE_URL` (the project root URL, e.g.
   `https://<project-ref>.supabase.co`, not the OAuth callback URL) and
   `SUPABASE_PUBLISHABLE_KEY` (the publishable key or legacy **anon** key).
   Do not use a secret or service-role key.
2. In Supabase Authentication, enable Google and configure its Google OAuth
   client. In Google Cloud, add the Supabase callback URL
   `https://<project-ref>.supabase.co/auth/v1/callback` as an authorized
   redirect URI.
3. In Supabase Authentication URL Configuration, add
   `http://127.0.0.1:8765/auth/callback` to the redirect allow list. If the
   Google OAuth consent screen is in testing mode, add your account as a test user.
4. From the `tests` folder, run `npm install`, then
   `npm run check:google-auth`. Open the URL printed in the terminal and sign in.

The check exchanges the authorization code and verifies the user with Supabase.
It does not print tokens or save a session. A successful login may create a
user in the Supabase project. If port 8765 is already in use, free it and retry.

## Profile sync test page

This is a development-only browser page that uses Google sign-in and the same
`/get-user` and `/new-user` database API endpoints as the mobile app. It creates
a real database row for a signed-in user if one does not already exist. Phone
is not saved. A failed database sync can be retried on the page.

1. Install the existing dependencies with `npm install` in `tests` if needed.
2. Add `http://127.0.0.1:8765/profile-sync.html` to the Supabase Authentication
   redirect allow list and ensure Google sign-in is configured.
3. From `tests`, run `npm run profile-sync` and open
   `http://127.0.0.1:8765/profile-sync.html` in a browser.
4. Click **Sign in with Google**. The local server reads `SUPABASE_URL` and
   `SUPABASE_PUBLISHABLE_KEY` from the repository-root `.env` or environment;
   never use a secret or service-role key. The session is stored in browser
   session storage for the current tab.

The database user endpoints do not authenticate callers, and the create request
puts the name and email in its URL, which may be logged. Use only a test account
and test data; do not expose this page or the test server to untrusted networks.

## Profile sync client tests

With the mobile dependencies installed, run from the repository root in
PowerShell:

```powershell
$out = Join-Path $env:TEMP 'medical-assistant-profile-sync-tests'
Set-Location mobile
npx tsc --ignoreConfig src/services/profileService.ts src/services/apiClient.ts src/services/config.ts --module commonjs --target es2020 --lib 'es2020,dom' --skipLibCheck --outDir $out
$env:PROFILE_SYNC_MODULE = Join-Path $out 'profileService.js'
Set-Location ..
node --test tests\profile-sync-client.test.cjs
```
