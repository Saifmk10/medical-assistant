// =============================================================
// Tailwind CSS configuration
// -------------------------------------------------------------
// Theme tokens for the app live here. The palette follows the
// reference design: a vibrant medical blue (#007BFF) paired with
// high-contrast black / white pill elements and soft gray cards.
// Custom keyframes & animation utilities for the app's subtle
// motion language are also registered here so they can be used
// as normal utility classes (e.g. `animate-fade-in-up`).
// =============================================================

/** @type {import('tailwindcss').Config} */
export default {
  // Tell Tailwind which files to scan for class names
  content: ['./index.html', './src/**/*.{js,jsx}'],

  theme: {
    extend: {
      // -------------------------------------------------------
      // Brand palette
      // -------------------------------------------------------
      colors: {
        brand: {
          DEFAULT: '#007BFF', // primary medical blue (from reference theme)
          dark: '#005FCC', // hover / pressed state
          light: '#4DA3FF', // soft accent
          faint: '#EAF3FF', // very light blue tint for surfaces
        },
      },

      // -------------------------------------------------------
      // Typography
      // -------------------------------------------------------
      fontFamily: {
        // `font-display` is used for headings; Tailwind's default
        // sans stack remains the body font.
        display: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },

      // -------------------------------------------------------
      // Shadows — soft, diffused elevation for the card system
      // -------------------------------------------------------
      boxShadow: {
        card: '0 4px 14px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 10px 28px rgba(0, 0, 0, 0.16)',
      },

      // -------------------------------------------------------
      // Keyframes — subtle, calm motion suited to a medical app
      // -------------------------------------------------------
      keyframes: {
        // Gentle entrance: fade + small rise
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // Plain fade for overlays / pages
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        // Slow floating motion for decorative background blobs
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        // Soft pulsing dot for "live" status indicators
        'pulse-soft': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.55', transform: 'scale(0.85)' },
        },
        // Small horizontal shake for form validation errors
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-6px)' },
          '40%, 80%': { transform: 'translateX(6px)' },
        },
        // Smooth width grow used by progress bars on mount
        'grow-bar': {
          '0%': { width: '0%' },
        },
      },

      // -------------------------------------------------------
      // Animation utilities (usage: `animate-fade-in-up` etc.)
      // `both` fill-mode keeps elements hidden before a delayed
      // animation starts — enables staggered card entrances.
      // -------------------------------------------------------
      animation: {
        'fade-in-up': 'fade-in-up 0.55s ease-out both',
        'fade-in': 'fade-in 0.4s ease-out both',
        float: 'float 7s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2.2s ease-in-out infinite',
        shake: 'shake 0.4s ease-in-out',
        'grow-bar': 'grow-bar 0.9s ease-out both',
      },
    },
  },

  plugins: [],
};
