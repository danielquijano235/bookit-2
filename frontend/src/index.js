/**
 * ============================================
 * BOOKIT - Punto de Entrada de React
 * Archivo: index.js
 * ============================================
 * Este es el archivo principal que React ejecuta primero.
 * Renderiza el componente App dentro del div con id="root".
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Crear la raíz de React y renderizar la aplicación
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
