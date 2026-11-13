const http = require('node:http');
const path = require('node:path');
const { loadEnvFile } = require('node:process');
const { createClient } = require('@supabase/supabase-js');

const envPath = path.join(__dirname, '..', '.env');
const redirectUrl = 'http://127.0.0.1:8765/auth/callback';

try {
  loadEnvFile(envPath);
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;
if (!supabaseUrl || !supabaseKey) {
  console.error('Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY in the root .env file.');
  process.exit(1);
}

let projectUrl;
try {
  projectUrl = new URL(supabaseUrl);
  if (projectUrl.protocol !== 'https:' && !(projectUrl.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(projectUrl.hostname))) {
    throw new Error('Use HTTPS for remote Supabase projects.');
  }
  if (projectUrl.username || projectUrl.password || projectUrl.pathname !== '/' || projectUrl.search || projectUrl.hash) {
    throw new Error('Use the project root URL, without a path, credentials, query, or fragment.');
  }
} catch (error) {
  console.error(`Invalid SUPABASE_URL: ${error.message}`);
  process.exit(1);
}

let jwtRole;
if (supabaseKey.split('.').length === 3) {
  try {
    jwtRole = JSON.parse(Buffer.from(supabaseKey.split('.')[1], 'base64url').toString()).role;
  } catch {
    console.error('The Supabase JWT key is malformed.');
    process.exit(1);
  }
}
if (supabaseKey.startsWith('sb_secret_') || jwtRole === 'service_role') {
  console.error('Use a publishable or legacy anon key, never a secret or service-role key.');
  process.exit(1);
}

const supabase = createClient(projectUrl.toString(), supabaseKey, {
  auth: { flowType: 'pkce', persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
});

let finished = false;
let processing = false;
const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url, redirectUrl);
  if (requestUrl.pathname !== '/auth/callback' || req.method !== 'GET') {
    res.writeHead(404).end('Not found');
    return;
  }
  if (processing) {
    res.writeHead(409).end('Authentication is already being processed.');
    return;
  }
  processing = true;

  const code = requestUrl.searchParams.get('code');
  if (!code) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' }).end(
      'No authorization code was returned. Check the browser URL and Supabase authentication settings.'
    );
    finish('No authorization code returned. Check the browser URL and Supabase authentication settings.');
    return;
  }

  try {
    const { data: sessionData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (exchangeError) throw exchangeError;
    if (!sessionData.session) throw new Error('Supabase did not return a session.');

    const { data: userData, error: userError } = await supabase.auth.getUser(sessionData.session.access_token);
    if (userError) throw userError;
    if (!userData.user) throw new Error('Supabase did not return an authenticated user.');

    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' }).end(
      'Google sign-in succeeded and the Supabase session was verified. You can close this tab.'
    );
    console.log('Google sign-in succeeded. Supabase verified the authenticated user.');
    finish();
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' }).end(
      'Authentication failed. Check the terminal for details.'
    );
    finish(`Authentication failed: ${error.message}`);
  }
});

const timeout = setTimeout(() => finish('Timed out waiting for Google sign-in.'), 5 * 60 * 1000);
function finish(error) {
  if (finished) return;
  finished = true;
  clearTimeout(timeout);
  if (error) {
    console.error(error);
    process.exitCode = 1;
  }
  server.close();
}

server.on('error', (error) => finish(`Local callback server failed: ${error.message}`));
server.listen(8765, '127.0.0.1', async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: redirectUrl, skipBrowserRedirect: true },
    });
    if (error) throw error;
    if (!data.url) throw new Error('Supabase did not return a sign-in URL.');
    console.log('Open this URL in your browser and complete Google sign-in:');
    console.log(data.url);
    console.log('Waiting up to 5 minutes for the callback. Press Ctrl+C to cancel.');
  } catch (error) {
    finish(`Could not start Google sign-in: ${error.message}`);
  }
});
