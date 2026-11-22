const assert = require('node:assert/strict');
const { afterEach, test } = require('node:test');

const { syncProfile } = require(process.env.PROFILE_SYNC_MODULE);
const originalFetch = global.fetch;
const profile = { id: 'user-id', fullName: "O'Brien & Co", email: 'user+test@example.com' };
const signal = new AbortController().signal;

afterEach(() => {
  global.fetch = originalFetch;
});

function response(data, status = 200) {
  return new Response(JSON.stringify(data), { status });
}

test('creates a missing user with encoded query parameters', async () => {
  const calls = [];
  global.fetch = async (url, options) => {
    calls.push({ url: new URL(url), options });
    return response(calls.length === 1 ? null : { message: 'User created successfully' });
  };
  await syncProfile(profile, signal);
  assert.equal(calls.length, 2);
  assert.equal(calls[0].url.pathname, '/database-api/get-user');
  assert.equal(calls[0].url.searchParams.get('user_id'), profile.id);
  assert.equal(calls[1].url.pathname, '/database-api/new-user');
  assert.equal(calls[1].options.method, 'POST');
  assert.equal(calls[1].options.signal, signal);
  assert.equal(calls[1].url.searchParams.get('id'), profile.id);
  assert.equal(calls[1].url.searchParams.get('username'), profile.fullName);
  assert.equal(calls[1].url.searchParams.get('email'), profile.email);
});

test('does not create an existing user', async () => {
  let count = 0;
  global.fetch = async () => {
    count++;
    return response({ id: profile.id, full_name: 'Existing', email: 'existing@example.com' });
  };
  await syncProfile(profile, signal);
  assert.equal(count, 1);
});

test('surfaces database errors even when the API returns HTTP 200', async () => {
  let count = 0;
  global.fetch = async () => {
    count++;
    return response({ 'error in fetching user': 'database unavailable' });
  };
  await assert.rejects(syncProfile(profile, signal), /look up/);
  assert.equal(count, 1);

  global.fetch = async () => response(++count === 2 ? null : { 'error in user creation': 'database unavailable' });
  await assert.rejects(syncProfile(profile, signal), /create/);
});

test('rejects invalid lookup data, HTTP failures and accounts without email', async () => {
  global.fetch = async () => response({ id: 'other-user' });
  await assert.rejects(syncProfile(profile, signal), /look up/);
  global.fetch = async () => response({ error: 'unavailable' }, 503);
  await assert.rejects(syncProfile(profile, signal), /503/);
  global.fetch = async () => assert.fail('No request expected');
  await assert.rejects(syncProfile({ ...profile, email: undefined }, signal), /email/);
});
