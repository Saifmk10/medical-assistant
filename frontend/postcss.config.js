// =============================================================
// PostCSS configuration
// -------------------------------------------------------------
// Tailwind CSS runs as a PostCSS plugin; Autoprefixer adds
// vendor prefixes for older browsers. Vite picks this file up
// automatically — no extra wiring required.
// =============================================================
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
