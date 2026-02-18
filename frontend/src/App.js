/**
 * ============================================
 * BOOKIT - Componente Principal (App.js)
 * Archivo: App.js
 * ============================================
 * 
 * Este es el componente raíz de toda la aplicación React.
 * Configura el sistema de rutas (React Router) y define
 * qué componente se muestra según la URL.
 * 
 * Rutas:
 *   /           -> PaginaLanding (pública)
 *   /login      -> PaginaLogin (pública)
 *   /dashboard  -> PaginaDashboard (protegida - requiere login)
 * 
 * RutaProtegida: Componente que verifica si el usuario
 * está autenticado antes de mostrar el dashboard.
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PaginaLanding from './paginas/PaginaLanding';
import PaginaLogin from './paginas/PaginaLogin';
import PaginaDashboard from './paginas/PaginaDashboard';
import './estilos/variables.css';
import './estilos/compartidos.css';

/**
 * Componente RutaProtegida
 * 
 * Verifica si el usuario está logueado antes de mostrar
 * el contenido protegido (dashboard).
 * 
 * Si no está logueado, redirige automáticamente al login.
 * Mientras verifica, muestra un indicador de carga.
 */
const RutaProtegida = ({ children }) => {
  const [autenticado, setAutenticado] = useState(null); // null = aún verificando

  useEffect(() => {
    // Verificar si hay sesión activa en el servidor PHP
    fetch('http://localhost/bookit-api/autenticacion/verificar-sesion.php', {
      credentials: 'include', // Enviar cookies de sesión
    })
      .then(res => res.json())
      .then(datos => {
        setAutenticado(datos.autenticado);
      })
      .catch(() => {
        // Si el backend no responde, revisar localStorage como respaldo
        const usuario = localStorage.getItem('usuario');
        setAutenticado(!!usuario);
      });
  }, []);

  // Mientras verifica, mostrar spinner de carga
  if (autenticado === null) {
    return <div className="cargando">Verificando sesión...</div>;
  }

  // Si está autenticado, mostrar el contenido; si no, redirigir al login
  return autenticado ? children : <Navigate to="/login" />;
};

/**
 * Componente principal App
 * Configura todas las rutas de la aplicación
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública: Landing Page */}
        <Route path="/" element={<PaginaLanding />} />

        {/* Ruta pública: Login */}
        <Route path="/login" element={<PaginaLogin />} />

        {/* Ruta protegida: Dashboard (solo usuarios logueados) */}
        <Route
          path="/dashboard"
          element={
            <RutaProtegida>
              <PaginaDashboard />
            </RutaProtegida>
          }
        />

        {/* Cualquier otra ruta redirige al inicio */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
