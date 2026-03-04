/**
 * ============================================
 * BOOKIT - Componente UltimasReservas
 * Archivo: componentes/Dashboard/UltimasReservas.js
 * ============================================
 *
 * Muestra una lista de las últimas reservas (más recientes).
 */
import React from 'react';

const formatearFechaHora = (fecha, hora) => {
  try {
    const fechaIso = (fecha && fecha.indexOf('T') === -1 && hora) ? `${fecha}T${hora}` : (fecha || '');
    const d = new Date(fechaIso || fecha);
    return d.toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
  } catch (err) {
    return `${fecha || ''} ${hora || ''}`;
  }
};

const UltimasReservas = ({ reservas }) => {
  const lista = reservas && reservas.length ? reservas : [];

  // Ordenar por fecha y hora descendente
  const ordenadas = [...lista].sort((a, b) => {
    const fa = (a.fecha || '') + ' ' + (a.hora || '');
    const fb = (b.fecha || '') + ' ' + (b.hora || '');
    return fb.localeCompare(fa);
  }).slice(0, 5);

  return (
    <div className="ultimas-reservas-card">
      <div className="grafica-header">
        <h3 className="grafica-titulo">Últimas Reservas</h3>
        <span className="grafica-periodo">Recientes</span>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, marginTop: 12 }}>
        {ordenadas.length === 0 && (
          <li style={{ padding: 12, color: '#718096' }}>No hay reservas</li>
        )}
        {ordenadas.map((r) => (
          <li key={r.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
            <div>
              <div style={{ fontWeight: 600 }}>{r.cliente_nombre || r.cliente || 'Cliente'}</div>
              <div style={{ fontSize: '0.85rem', color: '#718096' }}>{formatearFechaHora(r.fecha, r.hora)}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 700 }}>{r.numero_personas || ''} personas</div>
              <div style={{ fontSize: '0.85rem', color: '#718096' }}>{(r.estado || '').charAt(0).toUpperCase() + (r.estado || '').slice(1)}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UltimasReservas;
