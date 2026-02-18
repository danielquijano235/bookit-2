/**
 * ============================================
 * BOOKIT - Componente BarraNavegacion
 * Archivo: componentes/LandingPage/BarraNavegacion.js
 * ============================================
 * 
 * Propósito: Barra de navegación fija (sticky) superior.
 * Incluye el logo, enlaces de sección y botones de login/registro.
 * 
 * Props: Ninguna
 * Estados:
 *   - scrollActivo: Se activa cuando el usuario hace scroll
 *   - menuAbierto: Controla el menú hamburguesa en móviles
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BarraNavegacion = () => {
  // Estado para saber si el usuario hizo scroll (para cambiar estilo del navbar)
  const [scrollActivo, setScrollActivo] = useState(false);
  // Estado para el menú hamburguesa en móviles
  const [menuAbierto, setMenuAbierto] = useState(false);
  // Hook de React Router para navegar a otras páginas
  const navigate = useNavigate();

  // Efecto que escucha el scroll de la ventana
  useEffect(() => {
    const manejarScroll = () => {
      // Si el scroll es mayor a 50px, activar el estilo compacto
      setScrollActivo(window.scrollY > 50);
    };

    // Agregar el listener
    window.addEventListener('scroll', manejarScroll);

    // Limpiar el listener cuando el componente se desmonte
    return () => window.removeEventListener('scroll', manejarScroll);
  }, []);

  return (
    <nav className={`navbar ${scrollActivo ? 'navbar-scroll' : ''}`}>
      {/* Logo de BookIt */}
      <div className="navbar-logo" onClick={() => navigate('/')}>
        <img src="/assets/images/logo-bookit.png" alt="BookIt" className="navbar-logo-img" />
      </div>

      {/* Links de navegación (solo se ven en escritorio) */}
      <div className={`navbar-links ${menuAbierto ? 'abierto' : ''}`}>
        <a href="#ventajas" onClick={() => setMenuAbierto(false)}>Beneficios</a>
        <a href="#caracteristicas" onClick={() => setMenuAbierto(false)}>Características</a>
        <a href="#testimonios" onClick={() => setMenuAbierto(false)}>Testimonios</a>
        <a href="#contacto" onClick={() => setMenuAbierto(false)}>Contacto</a>
      </div>

      {/* Botones de acción */}
      <div className="navbar-botones">
        <button 
          className="btn-login-nav" 
          onClick={() => navigate('/login')}
        >
          Iniciar Sesión
        </button>
        <button 
          className="btn-empezar-nav"
          onClick={() => navigate('/login')}
        >
          Empezar Ahora
        </button>
        {/* Botón hamburguesa para móviles */}
        <button 
          className="navbar-hamburguesa"
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

export default BarraNavegacion;
