// =============================================================
// colors.ts — single source of truth for every color used in the app
// -------------------------------------------------------------
// Change a value here and it updates everywhere in the app since
// every component pulls colors from this file (via theme/index.ts).
// =============================================================

export const colors = {
  // Brand / primary — requested brand color
  primary: '#2868C9',
  primaryDark: '#1E4F9C',
  primaryLight: '#5A8FE0',
  primarySurface: '#EAF1FC', // tinted background for primary-themed cards/badges

  // Secondary accent — used for voice/"listening" states and highlights
  accent: '#22C3B6',
  accentSurface: '#E4F9F6',

  // Semantic status colors (appointment states, alerts, badges)
  success: '#2FAE60',
  successSurface: '#E5F7EC',
  warning: '#F0A93B',
  warningSurface: '#FDF1DF',
  danger: '#E5504E',
  dangerSurface: '#FCE9E9',
  info: '#3E8FD6',
  infoSurface: '#E9F2FB',

  // Neutrals — text, borders, backgrounds
  background: '#F5F7FB',
  surface: '#FFFFFF',
  surfaceAlt: '#F0F3F9',
  border: '#E3E8F0',
  divider: '#EDF0F5',

  textPrimary: '#101828',
  textSecondary: '#4B5768',
  textTertiary: '#8996A6',
  textInverse: '#FFFFFF',
  textDisabled: '#B7BFCC',

  // Overlay / shadow helpers
  overlay: 'rgba(16, 24, 40, 0.45)',
  shadow: 'rgba(16, 24, 40, 0.12)',

  // Appointment status → color map (used by StatusBadge)
  status: {
    available: '#2FAE60',
    booked: '#2868C9',
    confirmed: '#22C3B6',
    cancelled: '#E5504E',
    rescheduled: '#F0A93B',
    completed: '#8996A6',
  },
} as const;

export type AppColors = typeof colors;
