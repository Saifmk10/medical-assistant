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
