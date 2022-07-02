import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { DarkModeContextProvider } from './context/darkModeContext';
import { AuthorizationContextProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <DarkModeContextProvider>
      <AuthorizationContextProvider>
        <App />
      </AuthorizationContextProvider>
    </DarkModeContextProvider>
  </React.StrictMode>
);
