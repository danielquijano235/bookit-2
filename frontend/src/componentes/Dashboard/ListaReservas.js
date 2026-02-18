/**
 * ============================================
 * BOOKIT - Componente ListaReservas
 * Archivo: componentes/Dashboard/ListaReservas.js
 * ============================================
 * 
 * Propósito: Lista de las próximas reservas del día.
 * Muestra avatar con inicial, nombre, personas, hora y estado.
 * 
 * Props:
 *   - reservas: Array de objetos de reserva
 */

import React from 'react';

// Colores para los avatares (se asignan rotativamente)
const coloresAvatar = [
  '#FDB022', // Amarillo
  '#10B981', // Verde
  '#4A90E2', // Azul
  '#8B5CF6', // Morado
  '#EC4899', // Rosa
  '#F97316', // Naranja
];

const ListaReservas = ({ reservas }) => {
  /**
   * Formatear la hora de "19:00:00" a "19:00"
   */
  const formatearHora = (hora) => {
    if (!hora) return '';
    return hora.substring(0, 5); // Tomar solo HH:MM
  };

  /**
   * Obtener la primera letra del nombre del cliente
   */
  const obtenerInicial = (nombre) => {
    return nombre ? nombre[0].toUpperCase() : '?';
  };

  return (
    <div className="reservas-tarjeta">
      {/* Header */}
      <div className="reservas-header">
        <h3 className="reservas-titulo">Próximas Reservas</h3>
      </div>

      {/* Lista de reservas */}
      <div className="reservas-lista">
        {reservas && reservas.length > 0 ? (
          // Mostrar cada reserva
          reservas.map((reserva, indice) => (
            <div className="reserva-item" key={reserva.id || indice}>
              {/* Avatar circular con inicial y color */}
              <div
                className="reserva-avatar"
                style={{ backgroundColor: coloresAvatar[indice % coloresAvatar.length] }}
              >
                {obtenerInicial(reserva.cliente)}
              </div>

              {/* Información de la reserva */}
              <div className="reserva-info">
                <div className="reserva-nombre">{reserva.cliente}</div>
                <div className="reserva-detalle">
                  <span>{reserva.personas} personas</span>
                  <span>🕐 {formatearHora(reserva.hora)}</span>
                </div>
              </div>

              {/* Badge de estado */}
              <span className={`reserva-estado estado-${reserva.estado}`}>
                {reserva.estado === 'confirmada' ? 'Confirmada' : 
                 reserva.estado === 'pendiente' ? 'Pendiente' : 
                 reserva.estado === 'cancelada' ? 'Cancelada' : reserva.estado}
              </span>
            </div>
          ))
        ) : (
          // Si no hay reservas, mostrar mensaje
          <p style={{ textAlign: 'center', color: '#718096', padding: '20px' }}>
            No hay reservas próximas
          </p>
        )}
      </div>

      {/* Botón para ver todas las reservas */}
      <button className="btn-ver-todas">Ver todas las reservas</button>
    </div>
  );
};

export default ListaReservas;
