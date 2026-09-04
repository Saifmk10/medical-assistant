// =============================================================
// Vite configuration
// -------------------------------------------------------------
// Vite is the dev-server / bundler for this React app.
// The official React plugin enables Fast Refresh (hot reload)
// and JSX transformation during development.
// =============================================================
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // default Vite port — change here if it clashes
    open: true, // automatically open the browser on `npm run dev`
  },
});
