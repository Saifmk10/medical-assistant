// =============================================================
// typography.ts — font sizes, weights and line-heights
// -------------------------------------------------------------
// Uses the OS default system font (San Francisco on iOS, Roboto on
// Android) so the app feels native on both platforms out of the box.
// Swap `fontFamily` values here if a custom font is added later.
// =============================================================
import { Platform } from 'react-native';

export const fontFamily = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'System',
});

export const typography = {
  fontFamily,

  // Headings
  h1: { fontSize: 28, lineHeight: 34, fontWeight: '700' as const },
  h2: { fontSize: 22, lineHeight: 28, fontWeight: '700' as const },
  h3: { fontSize: 18, lineHeight: 24, fontWeight: '600' as const },

  // Body text
  bodyLarge: { fontSize: 16, lineHeight: 22, fontWeight: '400' as const },
  body: { fontSize: 14, lineHeight: 20, fontWeight: '400' as const },
  bodyMedium: { fontSize: 14, lineHeight: 20, fontWeight: '600' as const },

  // Supporting text
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '500' as const },
  label: { fontSize: 12, lineHeight: 16, fontWeight: '600' as const },

  // Buttons
  button: { fontSize: 15, lineHeight: 20, fontWeight: '600' as const },
} as const;
