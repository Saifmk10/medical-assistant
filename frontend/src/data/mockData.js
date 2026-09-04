// =============================================================
// mockData.js — hardcoded data for the frontend-only build
// -------------------------------------------------------------
// Everything the UI renders comes from here. When a backend is
// added later, replace these exports with API calls and keep the
// same data shapes so components don't need to change.
// =============================================================

// -------------------------------------------------------------
// 1. Hardcoded login credentials (frontend-only auth)
// -------------------------------------------------------------
export const CREDENTIALS = {
  admin: {
    id: 'admin',
    password: 'admin123',
    name: 'Sarah Jenkins',
    title: 'Hospital Administrator',
  },
  doctor: {
    id: 'doctor',
    password: 'doctor123',
    name: 'Dr. Robert Chen',
    title: 'Senior Physician — Cardiology',
  },
  maintenance: {
    id: 'maintenance',
    password: 'maint123',
    name: 'Mike Torres',
    title: 'Facilities & Biomedical Engineer',
  },
};

// -------------------------------------------------------------
// 2. Role metadata — drives the role-selection cards, login
//    screen headings and dashboard accent colours.
// -------------------------------------------------------------
export const ROLES = {
  admin: {
    key: 'admin',
    label: 'Admin',
    tagline: 'Hospital operations, staff & resources',
    dashboardPath: '/admin/dashboard',
  },
  doctor: {
    key: 'doctor',
    label: 'Doctor',
    tagline: 'Appointments, patients & clinical tasks',
    dashboardPath: '/doctor/dashboard',
  },
  maintenance: {
    key: 'maintenance',
    label: 'Maintenance',
    tagline: 'Equipment, tickets & facility status',
    dashboardPath: '/maintenance/dashboard',
  },
};

// -------------------------------------------------------------
// 3. ADMIN dashboard data
// -------------------------------------------------------------

// Top-row KPI stat tiles
export const ADMIN_STATS = [
  { label: 'Patients Today', value: '248', delta: '+12% vs yesterday', trend: 'up' },
  { label: 'Staff On Duty', value: '86', delta: '92 scheduled', trend: 'flat' },
  { label: 'Beds Occupied', value: '164 / 220', delta: '74% occupancy', trend: 'up' },
  { label: 'Avg. Wait Time', value: '18 min', delta: '-4 min vs last week', trend: 'down' },
];

// Bed occupancy per department (percent feeds the progress bars)
export const DEPARTMENT_OCCUPANCY = [
  { name: 'Cardiology', occupied: 42, total: 50 },
  { name: 'Neurology', occupied: 28, total: 40 },
  { name: 'Orthopedics', occupied: 31, total: 45 },
  { name: 'Pediatrics', occupied: 22, total: 35 },
  { name: 'Emergency', occupied: 41, total: 50 },
];

// Staff currently on shift
export const STAFF_ON_DUTY = [
  { name: 'Dr. Amelia Stone', role: 'Cardiologist', shift: '08:00 – 16:00', status: 'On Duty' },
  { name: 'Dr. Rajiv Menon', role: 'Neurologist', shift: '09:00 – 17:00', status: 'On Duty' },
  { name: 'Nurse Carla Diaz', role: 'ICU Nurse', shift: '07:00 – 19:00', status: 'On Duty' },
  { name: 'Dr. Kevin Osei', role: 'Orthopedic Surgeon', shift: '10:00 – 18:00', status: 'In Surgery' },
  { name: 'Nurse Priya Nair', role: 'ER Nurse', shift: '19:00 – 07:00', status: 'On Duty' },
  { name: 'Dr. Lena Fischer', role: 'Pediatrician', shift: '08:00 – 16:00', status: 'On Break' },
];

// Latest admissions / events for the activity feed
export const RECENT_ACTIVITY = [
  { time: '09:42', text: 'Patient admitted to ICU — Bed 12', type: 'admission' },
  { time: '09:15', text: 'Discharge processed — Room 304', type: 'discharge' },
  { time: '08:58', text: 'Emergency case registered — ER Bay 2', type: 'emergency' },
  { time: '08:30', text: 'New staff shift started — Night Team B', type: 'staff' },
  { time: '08:05', text: 'Pharmacy restock request approved', type: 'pharmacy' },
];

// -------------------------------------------------------------
// 4. DOCTOR dashboard data
// -------------------------------------------------------------

export const DOCTOR_STATS = [
  { label: "Today's Appointments", value: '14', delta: '3 remaining', trend: 'flat' },
  { label: 'Admitted Patients', value: '9', delta: '2 critical', trend: 'up' },
  { label: 'Pending Lab Reports', value: '5', delta: '2 urgent', trend: 'up' },
  { label: 'Prescriptions Issued', value: '27', delta: 'this week', trend: 'flat' },
];

// Today's appointment schedule
export const DOCTOR_APPOINTMENTS = [
  { time: '09:00', patient: 'John Carter', reason: 'Cardiac follow-up', status: 'Completed' },
  { time: '09:30', patient: 'Maria Gomez', reason: 'Chest pain evaluation', status: 'Completed' },
  { time: '10:15', patient: 'Ahmed Khan', reason: 'Hypertension review', status: 'In Progress' },
  { time: '11:00', patient: 'Emily Zhang', reason: 'Post-op consultation', status: 'Upcoming' },
  { time: '11:45', patient: 'David Okafor', reason: 'ECG & stress test', status: 'Upcoming' },
  { time: '12:30', patient: 'Sofia Rossi', reason: 'Medication adjustment', status: 'Upcoming' },
];

// Patients currently admitted under this doctor
export const DOCTOR_PATIENTS = [
  { name: 'Walter Hughes', ward: 'ICU — Bed 04', condition: 'Post-MI monitoring', severity: 'Critical' },
  { name: 'Nina Petrova', ward: 'Ward B — Bed 11', condition: 'Arrhythmia', severity: 'Stable' },
  { name: 'George Mathew', ward: 'Ward A — Bed 02', condition: 'Heart failure', severity: 'Serious' },
  { name: 'Aisha Bello', ward: 'Ward C — Bed 07', condition: 'Post-angioplasty', severity: 'Stable' },
];

// Lab results waiting for review
export const PENDING_REPORTS = [
  { patient: 'Ahmed Khan', test: 'Lipid panel', ordered: 'Today, 08:10', urgent: true },
  { patient: 'Emily Zhang', test: 'Troponin levels', ordered: 'Today, 07:45', urgent: true },
  { patient: 'David Okafor', test: 'Echocardiogram', ordered: 'Yesterday', urgent: false },
  { patient: 'Sofia Rossi', test: 'Complete blood count', ordered: 'Yesterday', urgent: false },
  { patient: 'John Carter', test: 'INR / coagulation', ordered: '2 days ago', urgent: false },
];

// -------------------------------------------------------------
// 5. MAINTENANCE dashboard data
// -------------------------------------------------------------

export const MAINT_STATS = [
  { label: 'Open Tickets', value: '7', delta: '3 high priority', trend: 'up' },
  { label: 'Equipment Online', value: '94%', delta: '128 / 136 units', trend: 'flat' },
  { label: 'Tasks Completed', value: '18', delta: 'this week', trend: 'up' },
  { label: 'Scheduled Today', value: '5', delta: '2 in progress', trend: 'flat' },
];

// Open maintenance tickets, newest first
export const MAINT_TICKETS = [
  { id: 'TK-1042', title: 'MRI-2 coolant leak', location: 'Radiology — Level 1', priority: 'High', status: 'In Progress' },
  { id: 'TK-1041', title: 'Bed lift motor fault', location: 'Ward B — Room 214', priority: 'High', status: 'Open' },
  { id: 'TK-1039', title: 'HVAC temperature drift', location: 'Operating Theatre 3', priority: 'High', status: 'Open' },
  { id: 'TK-1037', title: 'Nurse-call button unresponsive', location: 'Ward C — Room 308', priority: 'Medium', status: 'In Progress' },
  { id: 'TK-1036', title: 'Corridor lighting flicker', location: 'Level 2 — East Wing', priority: 'Low', status: 'Open' },
  { id: 'TK-1034', title: 'Water pressure low', location: 'Dialysis Unit', priority: 'Medium', status: 'Open' },
  { id: 'TK-1033', title: 'Automatic door sensor', location: 'Main Entrance', priority: 'Low', status: 'Open' },
];

// Health of critical equipment categories
export const EQUIPMENT_STATUS = [
  { name: 'Ventilators', online: 24, total: 26 },
  { name: 'Patient Monitors', online: 58, total: 60 },
  { name: 'Infusion Pumps', online: 34, total: 36 },
  { name: 'Imaging (MRI / CT)', online: 7, total: 8 },
  { name: 'Sterilizers', online: 5, total: 6 },
];

// Preventive maintenance scheduled for today
export const MAINT_SCHEDULE = [
  { time: '09:00', task: 'Generator load test', area: 'Basement — Power Room', done: true },
  { time: '10:30', task: 'Oxygen line pressure check', area: 'ICU', done: true },
  { time: '13:00', task: 'Elevator safety inspection', area: 'Central Block', done: false },
  { time: '15:00', task: 'Fire alarm panel test', area: 'Level 3', done: false },
  { time: '16:30', task: 'Water tank chlorination', area: 'Rooftop Plant', done: false },
];
