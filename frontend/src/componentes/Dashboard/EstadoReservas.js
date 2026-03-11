/**
 * ============================================
 * BOOKIT - Componente EstadoReservas
 * Archivo: componentes/Dashboard/EstadoReservas.js
 * ============================================
 *
 * Muestra el conteo de reservas por estado (confirmada, pendiente, cancelada, completada).
 */
import React from 'react';

// Íconos para cada estado de reserva
// Se usan para mostrar visualmente el tipo de estado
const iconos = {
  confirmada: 'https://img.icons8.com/ios-filled/20/FFFFFF/checkmark--v1.png',
  pendiente:  'https://img.icons8.com/ios-filled/20/FFFFFF/clock--v1.png',
  cancelada:  'https://img.icons8.com/ios-filled/20/FFFFFF/cancel.png',
  completada: 'https://img.icons8.com/ios-filled/20/FFFFFF/double-tick.png',
  otra:       'https://img.icons8.com/ios-filled/20/FFFFFF/info.png',
};

// Colores para cada estado de reserva
// Ayudan a diferenciar visualmente cada tarjeta
const colores = {
  confirmada: '#10B981',
  pendiente: '#FDB022',
  cancelada: '#EF4444',
  completada: '#4A90E2',
  otra: '#9CA3AF',
};

const EstadoReservas = ({ reservas }) => {
  // Si no hay reservas, usamos lista vacía
  const lista = reservas || [];

  // Agrupa las reservas por estado usando reduce
  // Ejemplo: { confirmada: 5, pendiente: 2, ... }
  const conteo = lista.reduce((acc, r) => {
    const estado = (r.estado || 'otra').toLowerCase();
    acc[estado] = (acc[estado] || 0) + 1;
    return acc;
  }, {});

  // Estados que se muestran en la tarjeta
  const estadosMostrar = [
    { key: 'confirmada', label: 'Confirmadas' },
    { key: 'pendiente', label: 'Pendientes' },
    { key: 'cancelada', label: 'Canceladas' },
    { key: 'completada', label: 'Completadas' },
  ];

  // Renderiza una tarjeta para cada estado, mostrando el conteo y el ícono
  return (
    <div className="estado-reservas-card">
      <div className="grafica-header">
        <h3 className="grafica-titulo">Estado Reservas</h3>
        <span className="grafica-periodo">Resumen</span>
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
        {estadosMostrar.map((e) => (
          <div key={e.key} style={{ flex: '1 1 120px', padding: 12, borderRadius: 8, background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.9rem', color: '#374151' }}>{e.label}</div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{conteo[e.key] || 0}</div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: colores[e.key] || colores.otra, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <img src={iconos[e.key] || iconos.otra} alt={e.label} style={{ width: 20, height: 20 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EstadoReservas;
