// =============================================================
// spacing.ts — spacing scale, radii and shadow presets
// -------------------------------------------------------------
// Keep all magic numbers for padding/margin/radius here so the
// whole app follows one consistent 4px grid.
// =============================================================
import { Platform } from 'react-native';

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

// Cross-platform elevation preset — spreads onto a View style object.
export const shadow = {
  card: Platform.select({
    ios: {
      shadowColor: '#101828',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
    },
    android: { elevation: 3 },
    default: {},
  }),
  floating: Platform.select({
    ios: {
      shadowColor: '#101828',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.16,
      shadowRadius: 20,
    },
    android: { elevation: 8 },
    default: {},
  }),
} as const;
