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

import React from 'react';
import { useNavigate } from 'react-router-dom';

// Items del menú organizados por categorías
const menuPrincipal = [
  { icono: 'https://img.icons8.com/ios-filled/20/FFFFFF/home.png', iconoActivo: 'https://img.icons8.com/ios-filled/20/1e3a5f/home.png', nombre: 'Inicio', clave: 'inicio' },
  { icono: 'https://img.icons8.com/ios-filled/20/FFFFFF/calendar--v1.png', iconoActivo: 'https://img.icons8.com/ios-filled/20/1e3a5f/calendar--v1.png', nombre: 'Reservas', clave: 'reservas' },
  { icono: 'https://img.icons8.com/ios-filled/20/FFFFFF/conference-call.png', iconoActivo: 'https://img.icons8.com/ios-filled/20/1e3a5f/conference-call.png', nombre: 'Clientes', clave: 'clientes' },
  { icono: 'https://img.icons8.com/ios-filled/20/FFFFFF/chair.png', iconoActivo: 'https://img.icons8.com/ios-filled/20/1e3a5f/chair.png', nombre: 'Mesas', clave: 'mesas' },
];

const menuSecundario = [
  { icono: 'https://img.icons8.com/ios-filled/20/FFFFFF/combo-chart.png', iconoActivo: 'https://img.icons8.com/ios-filled/20/1e3a5f/combo-chart.png', nombre: 'Análisis', clave: 'analisis' },
  { icono: 'https://img.icons8.com/ios-filled/20/FFFFFF/restaurant-menu.png', iconoActivo: 'https://img.icons8.com/ios-filled/20/1e3a5f/restaurant-menu.png', nombre: 'Menú', clave: 'menu' },
  { icono: 'https://img.icons8.com/ios-filled/20/FFFFFF/star--v1.png', iconoActivo: 'https://img.icons8.com/ios-filled/20/1e3a5f/star--v1.png', nombre: 'Reseñas', clave: 'resenas' },
];

const BarraLateral = ({ usuario, onCerrarSesion, seccionActiva = 'inicio', onCambiarSeccion }) => {
  const navigate = useNavigate();

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
      <button
        key={indice}
        className={`sidebar-item ${activo ? 'activo' : ''}`}
        onClick={() => onCambiarSeccion && onCambiarSeccion(item.clave)}
      >
        <span className="sidebar-item-icono">
          <img src={activo ? item.iconoActivo : item.icono} alt={item.nombre} width="18" height="18" />
        </span>
        <span className="sidebar-item-nombre">{item.nombre}</span>
      </button>
    );
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
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
      <button className="btn-cerrar-sesion" onClick={onCerrarSesion}>
        <img src="https://img.icons8.com/ios-filled/16/FFFFFF/exit.png" alt="salir" width="16" height="16" style={{verticalAlign: 'middle', marginRight: '8px', opacity: 0.7}} />
        Cerrar Sesión
      </button>
    </aside>
  );
};

export default BarraLateral;
