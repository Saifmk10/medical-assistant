const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { loadEnvFile } = require('node:process');

try {
  loadEnvFile(path.join(__dirname, '..', '.env'));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_PUBLISHABLE_KEY;
if (!url || !key) throw new Error('Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY in the root .env.');
const parsed = new URL(url);
const local = ['127.0.0.1', 'localhost'].includes(parsed.hostname);
if ((parsed.protocol !== 'https:' && !(local && parsed.protocol === 'http:')) ||
    parsed.username || parsed.password || parsed.pathname !== '/' || parsed.search || parsed.hash) {
  throw new Error('Use the Supabase project root URL with HTTPS.');
}
if (!key.startsWith('sb_publishable_')) {
  let role;
  try {
    const parts = key.split('.');
    if (parts.length !== 3) throw new Error('Invalid JWT');
    role = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8')).role;
  } catch {
    throw new Error('Use a publishable or legacy anon key, never a secret key.');
  }
  if (role !== 'anon') throw new Error('Use a publishable or legacy anon key, never a secret key.');
}

const files = {
  '/profile-sync.html': ['profile-sync.html', 'text/html; charset=utf-8'],
  '/node_modules/@supabase/supabase-js/dist/umd/supabase.js': [
    'node_modules/@supabase/supabase-js/dist/umd/supabase.js',
    'text/javascript; charset=utf-8',
  ],
};

http.createServer((req, res) => {
  if (req.method !== 'GET') return res.writeHead(405).end();
  const pathname = new URL(req.url, 'http://127.0.0.1:8765').pathname;
  if (pathname === '/config') {
    return res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    }).end(JSON.stringify({ url: parsed.origin, key }));
  }
  const file = files[pathname];
  if (!file) return res.writeHead(404).end('Not found');
  fs.readFile(path.join(__dirname, file[0]), (error, contents) => {
    if (error) {
      console.error(`Could not load ${file[0]}: ${error.message}`);
      res.writeHead(500).end('Could not load test page or Supabase client.');
      return;
    }
    res.writeHead(200, { 'Content-Type': file[1], 'Cache-Control': 'no-store' }).end(contents);
  });
}).listen(8765, '127.0.0.1', () => {
  console.log('Open http://127.0.0.1:8765/profile-sync.html');
});
