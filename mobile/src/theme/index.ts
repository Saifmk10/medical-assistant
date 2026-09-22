// =============================================================
// theme/index.ts — public entry point for the design system
// -------------------------------------------------------------
// Import everything from here, e.g.:
//   import { theme } from '../theme';
//   theme.colors.primary
// =============================================================
import { colors } from './colors';
import { typography } from './typography';
import { radii, shadow, spacing } from './spacing';

export const theme = {
  colors,
  typography,
  spacing,
  radii,
  shadow,
};

export type Theme = typeof theme;

export { colors, typography, spacing, radii, shadow };
