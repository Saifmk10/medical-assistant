// =============================================================
// Application entry point
// -------------------------------------------------------------
// Mounts the React tree into the #root node of index.html.
// - BrowserRouter  → client-side routing (pages without reload)
// - AuthProvider   → global auth state (logged-in role, user)
// =============================================================
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './index.css'; // Tailwind + global styles

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
