/**
 * ============================================
 * BOOKIT - Componente BarraSuperior
 * Archivo: componentes/Dashboard/BarraSuperior.js
 * ============================================
 * 
 * Propósito: Header fijo del dashboard con buscador,
 * notificaciones con panel desplegable y botón de nueva reserva.
 * 
 * Props:
 *   - onNuevaReserva: Función que se ejecuta al hacer clic en "+ Nueva Reserva"
 * 
 * Funcionalidad de notificaciones:
 *   - Muestra badge con cantidad de no leídas
 *   - Panel desplegable al hacer clic en la campana
 *   - Marcar como leída individual y todas a la vez
 *   - Eliminar notificaciones individuales
 *   - Iconos por tipo (reserva, cliente, sistema, info)
 *   - Tiempo relativo ("hace 5 min", "hace 2 horas")
 */

import React, { useState, useRef, useEffect } from 'react';
import { useNotificaciones } from '../../contextos/NotificacionesContext';
import Boton from '../Compartidos/Boton';

/**
 * Convertir fecha ISO a texto relativo legible
 * Ej: "hace 5 min", "hace 2 horas", "hace 1 día"
 */
const tiempoRelativo = (fechaISO) => {
  const ahora = new Date();
  const fecha = new Date(fechaISO);
  const diffMs = ahora - fecha;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHoras = Math.floor(diffMin / 60);
  const diffDias = Math.floor(diffHoras / 24);

  if (diffMin < 1) return 'Ahora mismo';
  if (diffMin < 60) return `hace ${diffMin} min`;
  if (diffHoras < 24) return `hace ${diffHoras}h`;
  if (diffDias === 1) return 'Ayer';
  if (diffDias < 7) return `hace ${diffDias} días`;
  return fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
};

/**
 * Obtener icono Icons8 según el tipo de notificación
 */
const obtenerIconoTipo = (tipo) => {
  const iconos = {
    reserva: 'https://img.icons8.com/ios-filled/20/1a1a2e/restaurant-table.png',
    cliente: 'https://img.icons8.com/ios-filled/20/1a1a2e/user.png',
    sistema: 'https://img.icons8.com/ios-filled/20/1a1a2e/settings.png',
    info: 'https://img.icons8.com/ios-filled/20/1a1a2e/info--v1.png',
  };
  return iconos[tipo] || iconos.info;
};

/**
 * Color de fondo del icono según el tipo
 */
const obtenerColorFondo = (tipo) => {
  const colores = {
    reserva: 'rgba(74, 144, 226, 0.12)',
    cliente: 'rgba(139, 92, 246, 0.12)',
    sistema: 'rgba(249, 115, 22, 0.12)',
    info: 'rgba(16, 185, 129, 0.12)',
  };
  return colores[tipo] || colores.info;
};

const BarraSuperior = ({ onNuevaReserva, onBuscar, onSeleccionarResultado, clientes = [], reservas = [] }) => {
  const [panelAbierto, setPanelAbierto] = useState(false);
  const panelRef = useRef(null);
  const botonRef = useRef(null);
  const [query, setQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const {
    notificaciones,
    noLeidas,
    marcarComoLeida,
    marcarTodasLeidas,
    eliminarNotificacion,
    limpiarTodas,
  } = useNotificaciones();

  // Cerrar el panel o dropdown al hacer clic fuera
  useEffect(() => {
    const manejarClickFuera = (e) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target) &&
        botonRef.current && !botonRef.current.contains(e.target)
      ) {
        setPanelAbierto(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) && !e.target.closest('.barra-busqueda')) {
        setDropdownOpen(false);
      }
    };

    if (panelAbierto || dropdownOpen) {
      document.addEventListener('mousedown', manejarClickFuera);
    }
    return () => document.removeEventListener('mousedown', manejarClickFuera);
  }, [panelAbierto, dropdownOpen]);

  // Cerrar panel de notificaciones al hacer scroll
  useEffect(() => {
    if (!panelAbierto) return;
    const manejarScroll = () => setPanelAbierto(false);
    window.addEventListener('scroll', manejarScroll, { passive: true });
    return () => window.removeEventListener('scroll', manejarScroll);
  }, [panelAbierto]);

  // Abrir/cerrar dropdown según query
  useEffect(() => {
    setDropdownOpen(Boolean(query && query.trim().length > 0));
  }, [query]);

  // Helper para resaltar coincidencias
  const escapeRegExp = (s) => String(s).replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
  const highlight = (text = '', q = '') => {
    if (!q) return text;
    const qTrim = q.trim();
    if (!qTrim) return text;
    const parts = String(text).split(new RegExp(`(${escapeRegExp(qTrim)})`, 'i'));
    return parts.map((p, i) =>
      p.toLowerCase() === qTrim.toLowerCase() ? <mark key={i} className="search-highlight">{p}</mark> : <span key={i}>{p}</span>
    );
  };

  return (
    <header className="barra-superior">
      {/* Campo de búsqueda */}
      <div className="barra-busqueda">
        <span className="barra-busqueda-icono">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="9" cy="9" r="7" stroke="#FDB022" strokeWidth="2" />
            <line x1="14.4142" y1="14" x2="18" y2="17.5858" stroke="#FDB022" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Buscar clientes, reservas..."
          value={query}
          onChange={(e) => {
            const v = e.target.value;
            setQuery(v);
            // Nota: no llamamos a onBuscar en cada pulsación para evitar
            // que la vista de Clientes/Reservas se actualice en vivo.
            // onBuscar se llama al presionar Enter o al seleccionar un resultado.
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && typeof onBuscar === 'function') {
              onBuscar(query);
            }
          }}
          aria-haspopup="listbox"
          aria-expanded={dropdownOpen}
        />
        {/* Live dropdown */}
        {dropdownOpen && (
          <div className="search-dropdown" ref={dropdownRef} role="listbox">
            <div className="search-dropdown-section">
              <div className="search-dropdown-title">Clientes</div>
              {clientes && clientes.length > 0 ? (
                <>
                  {clientes
                    .filter(c => {
                      if (!query) return false;
                      const q = query.toLowerCase();
                      return (c.nombre || '').toLowerCase().includes(q) || (c.telefono || '').includes(q) || (c.email || '').toLowerCase().includes(q);
                    })
                    .slice(0,6)
                    .map((c) => (
                      <button key={c.id || c.nombre} className="search-item" onClick={() => {
                        setQuery(c.nombre || '');
                        if (typeof onBuscar === 'function') onBuscar(c.nombre || '');
                        if (typeof onSeleccionarResultado === 'function') onSeleccionarResultado('cliente', c);
                        setDropdownOpen(false);
                      }}>
                        <div className="search-item-main">{highlight(c.nombre || '-', query)}</div>
                        <div className="search-item-sub">{highlight(c.telefono || '', query)}{c.email ? ' • ' : ''}{highlight(c.email || '', query)}</div>
                      </button>
                    ))}
                </>
              ) : (
                <div className="search-empty">No hay clientes</div>
              )}
            </div>

            <div className="search-dropdown-section">
              <div className="search-dropdown-title">Reservas</div>
              {reservas && reservas.length > 0 ? (
                <>
                  {reservas
                    .filter(r => {
                      if (!query) return false;
                      const q = query.toLowerCase();
                      return (r.cliente_nombre || r.cliente || '').toLowerCase().includes(q) || (r.cliente_telefono || '').includes(q) || (r.fecha || '').includes(q);
                    })
                    .slice(0,6)
                    .map((r) => (
                      <button key={r.id || (r.cliente_nombre + r.fecha)} className="search-item" onClick={() => {
                        setQuery(r.cliente_nombre || r.cliente || '');
                        if (typeof onBuscar === 'function') onBuscar(r.cliente_nombre || r.cliente || '');
                        if (typeof onSeleccionarResultado === 'function') onSeleccionarResultado('reserva', r);
                        setDropdownOpen(false);
                      }}>
                        <div className="search-item-main">{highlight(r.cliente_nombre || r.cliente, query)}</div>
                        <div className="search-item-sub">{r.fecha} • {r.hora ? r.hora.substring(0,5) : ''}</div>
                      </button>
                    ))}
                </>
              ) : (
                <div className="search-empty">No hay reservas</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Acciones de la barra */}
      <div className="barra-acciones">
        {/* Botón de notificaciones */}
        <div className="notificaciones-contenedor">
          <Boton
            ref={botonRef}
            variante="ghost"
            className={`btn-notificaciones ${panelAbierto ? 'activo' : ''}`}
            onClick={() => setPanelAbierto(!panelAbierto)}
          >
            <img
              src="https://img.icons8.com/ios-filled/22/1a1a2e/bell--v1.png"
              alt="notificaciones"
              width="22"
              height="22"
            />
            {noLeidas > 0 && (
              <span className="notificacion-badge">
                {noLeidas > 9 ? '9+' : noLeidas}
              </span>
            )}
          </Boton>

          {/* Panel desplegable de notificaciones */}
          {panelAbierto && (
            <div className="notificaciones-panel" ref={panelRef}>
              {/* Header del panel */}
              <div className="notificaciones-header">
                <div className="notificaciones-header-izq">
                  <h3>Notificaciones</h3>
                  {noLeidas > 0 && (
                    <span className="notificaciones-contador">{noLeidas}</span>
                  )}
                </div>
                <div className="notificaciones-header-acciones">
                  {noLeidas > 0 && (
                    <Boton variante="secundario" className="notificaciones-btn-texto" onClick={marcarTodasLeidas}>
                      Marcar todas leídas
                    </Boton>
                  )}
                </div>
              </div>

              {/* Lista de notificaciones */}
              <div className="notificaciones-lista">
                {notificaciones.length === 0 ? (
                  <div className="notificaciones-vacio">
                    <img
                      src="https://img.icons8.com/ios-filled/48/1a1a2e/bell--v1.png"
                      alt="sin notificaciones"
                      width="48"
                      height="48"
                    />
                    <p>No tienes notificaciones</p>
                  </div>
                ) : (
                  notificaciones.map((notif) => (
                    <div
                      className={`notificacion-item ${!notif.leida ? 'no-leida' : ''}`}
                      key={notif.id}
                      onClick={() => marcarComoLeida(notif.id)}
                    >
                      {/* Icono del tipo */}
                      <div
                        className="notificacion-icono"
                        style={{ backgroundColor: obtenerColorFondo(notif.tipo) }}
                      >
                        <img
                          src={obtenerIconoTipo(notif.tipo)}
                          alt={notif.tipo}
                          width="20"
                          height="20"
                        />
                      </div>

                      {/* Contenido */}
                      <div className="notificacion-contenido">
                        <p className="notificacion-titulo">{notif.titulo}</p>
                        <p className="notificacion-mensaje">{notif.mensaje}</p>
                        <span className="notificacion-tiempo">
                          {tiempoRelativo(notif.fecha)}
                        </span>
                      </div>

                      {/* Indicador de no leída + botón eliminar */}
                      <div className="notificacion-acciones">
                        {!notif.leida && <span className="notificacion-punto"></span>}
                        <Boton
                          variante="peligro"
                          className="notificacion-btn-eliminar"
                          onClick={(e) => {
                            e.stopPropagation();
                            eliminarNotificacion(notif.id);
                          }}
                          title="Eliminar"
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer del panel */}
              {notificaciones.length > 0 && (
                <div className="notificaciones-footer">
                  <Boton variante="secundario" className="notificaciones-btn-limpiar" onClick={limpiarTodas}>
                    Limpiar todas
                  </Boton>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Botón para crear nueva reserva */}
        <Boton variante="primario" className="btn-nueva-reserva" onClick={onNuevaReserva}>
          <span className="nueva-reserva-icono">+</span>
          <span className="nueva-reserva-texto">Nueva Reserva</span>
        </Boton>
      </div>
    </header>
  );
};

export default BarraSuperior;
