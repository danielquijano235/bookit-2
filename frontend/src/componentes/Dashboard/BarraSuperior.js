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
    reserva: 'https://img.icons8.com/ios-filled/20/4A90E2/restaurant-table.png',
    cliente: 'https://img.icons8.com/ios-filled/20/8B5CF6/user.png',
    sistema: 'https://img.icons8.com/ios-filled/20/F97316/settings.png',
    info: 'https://img.icons8.com/ios-filled/20/10B981/info--v1.png',
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

const BarraSuperior = ({ onNuevaReserva }) => {
  const [panelAbierto, setPanelAbierto] = useState(false);
  const panelRef = useRef(null);
  const botonRef = useRef(null);

  const {
    notificaciones,
    noLeidas,
    marcarComoLeida,
    marcarTodasLeidas,
    eliminarNotificacion,
    limpiarTodas,
  } = useNotificaciones();

  // Cerrar el panel al hacer clic fuera
  useEffect(() => {
    const manejarClickFuera = (e) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target) &&
        botonRef.current && !botonRef.current.contains(e.target)
      ) {
        setPanelAbierto(false);
      }
    };

    if (panelAbierto) {
      document.addEventListener('mousedown', manejarClickFuera);
    }
    return () => document.removeEventListener('mousedown', manejarClickFuera);
  }, [panelAbierto]);

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
        <input type="text" placeholder="Buscar clientes, reservas..." />
      </div>

      {/* Acciones de la barra */}
      <div className="barra-acciones">
        {/* Botón de notificaciones */}
        <div className="notificaciones-contenedor">
          <button
            className={`btn-notificaciones ${panelAbierto ? 'activo' : ''}`}
            onClick={() => setPanelAbierto(!panelAbierto)}
            ref={botonRef}
          >
            <img
              src="https://img.icons8.com/ios-filled/22/1e3a5f/bell--v1.png"
              alt="notificaciones"
              width="22"
              height="22"
            />
            {noLeidas > 0 && (
              <span className="notificacion-badge">
                {noLeidas > 9 ? '9+' : noLeidas}
              </span>
            )}
          </button>

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
                    <button
                      className="notificaciones-btn-texto"
                      onClick={marcarTodasLeidas}
                    >
                      Marcar todas leídas
                    </button>
                  )}
                </div>
              </div>

              {/* Lista de notificaciones */}
              <div className="notificaciones-lista">
                {notificaciones.length === 0 ? (
                  <div className="notificaciones-vacio">
                    <img
                      src="https://img.icons8.com/ios-filled/48/cccccc/bell--v1.png"
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
                        <button
                          className="notificacion-btn-eliminar"
                          onClick={(e) => {
                            e.stopPropagation();
                            eliminarNotificacion(notif.id);
                          }}
                          title="Eliminar"
                        >
                          <img
                            src="https://img.icons8.com/ios-filled/14/999999/delete-sign.png"
                            alt="eliminar"
                            width="14"
                            height="14"
                          />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer del panel */}
              {notificaciones.length > 0 && (
                <div className="notificaciones-footer">
                  <button className="notificaciones-btn-limpiar" onClick={limpiarTodas}>
                    Limpiar todas
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Botón para crear nueva reserva */}
        <button className="btn-nueva-reserva" onClick={onNuevaReserva}>
          + Nueva Reserva
        </button>
      </div>
    </header>
  );
};

export default BarraSuperior;
