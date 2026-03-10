/**
 * ============================================
 * BOOKIT - Componente BarraLateral (Sidebar)
 * Archivo: componentes/Dashboard/BarraLateral.js
 * ============================================
 * 
 * Propósito: Menú lateral fijo del dashboard con navegación,
 * perfil del usuario y botón de cerrar sesión.
 * 
 * Props:
 *   - usuario: Objeto con datos del usuario logueado
 *   - onCerrarSesion: Función para cerrar la sesión
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Boton from '../Compartidos/Boton';

// Items del menú organizados por categorías
const menuPrincipal = [
  { icono: 'https://img.icons8.com/ios-filled/20/FFFFFF/home.png', iconoActivo: 'https://img.icons8.com/ios-filled/20/1a1a2e/home.png', nombre: 'Inicio', clave: 'inicio' },
  { icono: 'https://img.icons8.com/ios-filled/20/FFFFFF/calendar--v1.png', iconoActivo: 'https://img.icons8.com/ios-filled/20/1a1a2e/calendar--v1.png', nombre: 'Reservas', clave: 'reservas' },
  { icono: 'https://img.icons8.com/ios-filled/20/FFFFFF/conference-call.png', iconoActivo: 'https://img.icons8.com/ios-filled/20/1a1a2e/conference-call.png', nombre: 'Clientes', clave: 'clientes' },
  { icono: 'https://img.icons8.com/ios-filled/20/FFFFFF/chair.png', iconoActivo: 'https://img.icons8.com/ios-filled/20/1a1a2e/chair.png', nombre: 'Mesas', clave: 'mesas' },
];

const menuSecundario = [
  { icono: 'https://img.icons8.com/ios-filled/20/FFFFFF/combo-chart.png', iconoActivo: 'https://img.icons8.com/ios-filled/20/1a1a2e/combo-chart.png', nombre: 'Análisis', clave: 'analisis' },
  { icono: 'https://img.icons8.com/ios-filled/20/FFFFFF/restaurant-menu.png', iconoActivo: 'https://img.icons8.com/ios-filled/20/1a1a2e/restaurant-menu.png', nombre: 'Menú', clave: 'menu' },
  { icono: 'https://img.icons8.com/ios-filled/20/FFFFFF/star--v1.png', iconoActivo: 'https://img.icons8.com/ios-filled/20/1a1a2e/star--v1.png', nombre: 'Reseñas', clave: 'resenas' },
];

const BarraLateral = ({ usuario, onCerrarSesion, seccionActiva = 'inicio', onCambiarSeccion }) => {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  // Cerrar menú al cambiar de sección
  const cambiarSeccion = (clave) => {
    if (onCambiarSeccion) onCambiarSeccion(clave);
    setMenuAbierto(false);
  };

  // Cerrar menú al redimensionar a pantalla grande
  useEffect(() => {
    const manejarResize = () => {
      if (window.innerWidth > 900) setMenuAbierto(false);
    };
    window.addEventListener('resize', manejarResize);
    return () => window.removeEventListener('resize', manejarResize);
  }, []);

  // NOTA: evitamos manipular `document.body.style.overflow` directamente
  // porque puede dejar el body sin scroll si algo falla. El overlay
  // ya impide interacción cuando está visible y el sidebar se renderiza
  // solo mientras `menuAbierto` es true, por lo que no necesitamos bloquear
  // el scroll del body aquí.

  const obtenerIniciales = (nombre) => {
    if (!nombre) return 'U';
    return nombre
      .split(' ')
      .map(palabra => palabra[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const renderItem = (item, indice) => {
    const activo = seccionActiva === item.clave;
    return (
      <Boton
        key={indice}
        variante={activo ? 'primario' : 'ghost'}
        className={`sidebar-item ${activo ? 'activo' : ''}`}
        onClick={() => cambiarSeccion(item.clave)}
      >
        <span className="sidebar-item-icono">
          <img src={activo ? item.iconoActivo : item.icono} alt={item.nombre} width="18" height="18" />
        </span>
        <span className="sidebar-item-nombre">{item.nombre}</span>
      </Boton>
    );
  };

  return (
    <>
      {/* Botón hamburguesa - solo visible en móvil */}
      <button
        className={`hamburguesa-btn ${menuAbierto ? 'activo' : ''}`}
        onClick={() => setMenuAbierto(!menuAbierto)}
        aria-label="Abrir menú"
      >
        <span className="hamburguesa-linea"></span>
        <span className="hamburguesa-linea"></span>
        <span className="hamburguesa-linea"></span>
      </button>

      {/* Overlay oscuro al abrir menú */}
      {menuAbierto && (
        <div className="sidebar-overlay" onClick={() => setMenuAbierto(false)} />
      )}

      <aside className={`sidebar ${menuAbierto ? 'abierto' : ''}`}>
      {/* Logo (no navegar desde el dashboard a la landing) */}
      <div className="sidebar-logo" style={{ cursor: 'default' }} title="BookIt">
        <img src="/assets/images/logo-bookit.png" alt="BookIt" className="sidebar-logo-img" />
      </div>

      {/* Menú principal */}
      <nav className="sidebar-menu">
        <p className="sidebar-seccion-titulo">PRINCIPAL</p>
        {menuPrincipal.map(renderItem)}

        <p className="sidebar-seccion-titulo">HERRAMIENTAS</p>
        {menuSecundario.map(renderItem)}
      </nav>

      {/* Perfil del usuario */}
      <div className="sidebar-perfil">
        <div className="sidebar-avatar">
          {obtenerIniciales(usuario?.nombre)}
        </div>
        <div className="sidebar-perfil-info">
          <div className="sidebar-perfil-nombre">
            {usuario?.nombre || 'Usuario'}
          </div>
          <div className="sidebar-perfil-email">
            {usuario?.email || 'email@ejemplo.com'}
          </div>
        </div>
      </div>

      {/* Botón para cerrar sesión */}
      <Boton variante="ghost" className="btn btn--ghost btn-cerrar-sesion" onClick={() => { setMenuAbierto(false); onCerrarSesion(); }}>
        <img src="https://img.icons8.com/ios-filled/16/FFFFFF/exit.png" alt="salir" width="16" height="16" style={{verticalAlign: 'middle', marginRight: '8px', opacity: 0.7}} />
        Cerrar Sesión
      </Boton>
    </aside>
    </>
  );
};

export default BarraLateral;
