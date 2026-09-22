# theme/

The app's design system — the single source of truth for colors, typography and spacing.

Every screen and component should read visual values from here instead of hardcoding hex codes or pixel numbers. This keeps the UI consistent and makes global re-theming (e.g. changing the brand color) a one-file change.

## Files

- **colors.ts** — Every color in the app, including the primary brand color (`#2868C9`), semantic colors (success/warning/danger/info) and the appointment-status color map used by `StatusBadge`.
- **typography.ts** — Font sizes, weights and line-heights for headings, body text, captions and buttons. Uses the OS system font by default.
- **spacing.ts** — The spacing scale (4px grid), corner-radius scale, and cross-platform shadow/elevation presets.
- **index.ts** — Re-exports everything as a single `theme` object (`theme.colors`, `theme.typography`, `theme.spacing`, `theme.radii`, `theme.shadow`) so components only need one import.

## Usage

```tsx
import { theme } from '../theme';

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.radii.lg,
    ...theme.shadow.card,
  },
});
```
