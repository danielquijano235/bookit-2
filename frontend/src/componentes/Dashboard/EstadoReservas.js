/**
 * ============================================
 * BOOKIT - Componente EstadoReservas
 * Archivo: componentes/Dashboard/EstadoReservas.js
 * ============================================
 *
 * Muestra el conteo de reservas por estado (confirmada, pendiente, cancelada, completada).
 */
import React from 'react';

const colores = {
  confirmada: '#10B981',
  pendiente: '#FDB022',
  cancelada: '#EF4444',
  completada: '#4A90E2',
  otra: '#9CA3AF',
};

const EstadoReservas = ({ reservas }) => {
  const lista = reservas || [];

  const conteo = lista.reduce((acc, r) => {
    const estado = (r.estado || 'otra').toLowerCase();
    acc[estado] = (acc[estado] || 0) + 1;
    return acc;
  }, {});

  const estadosMostrar = [
    { key: 'confirmada', label: 'Confirmadas' },
    { key: 'pendiente', label: 'Pendientes' },
    { key: 'cancelada', label: 'Canceladas' },
    { key: 'completada', label: 'Completadas' },
  ];

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
            <div style={{ width: 40, height: 40, borderRadius: 8, background: colores[e.key] || colores.otra, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              {String(conteo[e.key] || 0)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EstadoReservas;
