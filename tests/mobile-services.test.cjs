const assert = require('node:assert/strict');
const { afterEach, test } = require('node:test');

const doctors = require(process.env.DOCTOR_SERVICE_MODULE);
const appointments = require(process.env.APPOINTMENT_SERVICE_MODULE);
const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
});

test('doctor directory uses the existing API and its actual response fields', async () => {
  let url;
  global.fetch = async (input) => {
    url = new URL(input);
    return new Response(JSON.stringify([
      { doc_name: 'Dr Example', designation: 'Dermatology', working_hours: '09:00 - 17:00' },
      { doc_name: 'Dr Other', designation: 'General', working_hours: null },
    ]));
  };
  assert.deepEqual(await doctors.getDoctors(), [
    { name: 'Dr Example', specialty: 'Dermatology', workingHours: '09:00 - 17:00' },
    { name: 'Dr Other', specialty: 'General', workingHours: null },
  ]);
  assert.equal(url.origin, 'https://api.saifmk.online');
  assert.equal(url.pathname, '/database-api/doctor-details');
});

test('doctor directory reports null, malformed and HTTP error responses', async () => {
  global.fetch = async () => new Response('null');
  await assert.rejects(doctors.getDoctors(), /temporarily unavailable/);
  global.fetch = async () => new Response(JSON.stringify([{ doc_name: 'Dr Example' }]));
  await assert.rejects(doctors.getDoctors(), /invalid response/);
  global.fetch = async () => new Response('', { status: 503 });
  await assert.rejects(doctors.getDoctors(), /503/);
});

test('appointment operations do not claim success or call unsafe endpoints', async () => {
  global.fetch = async () => assert.fail('No appointment request should be sent');
  await assert.rejects(appointments.getUpcomingAppointments(), /not available/);
  await assert.rejects(appointments.getAvailableSlots('doctor'), /not available/);
  await assert.rejects(appointments.bookAppointment({}), /not available/);
  await assert.rejects(appointments.cancelAppointment('appointment'), /not available/);
  await assert.rejects(appointments.rescheduleAppointment('appointment', {}), /not available/);
});
