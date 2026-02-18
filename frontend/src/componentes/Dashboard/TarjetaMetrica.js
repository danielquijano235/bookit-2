/**
 * ============================================
 * BOOKIT - Componente TarjetaMetrica
 * Archivo: componentes/Dashboard/TarjetaMetrica.js
 * ============================================
 * 
 * Propósito: Tarjeta individual que muestra una métrica
 * del dashboard (reservas, clientes, ocupación, ingresos).
 * 
 * Props:
 *   - titulo: Texto del encabezado (ej: "Reservas Hoy")
 *   - numero: Valor grande a mostrar (ej: "127")
 *   - subtexto: Texto pequeño debajo del número (opcional)
 *   - badge: Texto del badge (ej: "↑ +23% vs ayer")
 *   - icono: Emoji del icono (ej: "📅")
 *   - colorFondo: Color de fondo del icono (ej: "#4A90E2")
 */

import React from 'react';

const TarjetaMetrica = ({ titulo, numero, subtexto, badge, icono, colorFondo }) => {
  return (
    <div className="metrica-tarjeta">
      {/* Información de la métrica */}
      <div className="metrica-info">
        <p className="metrica-titulo">{titulo}</p>
        <h2 className="metrica-numero">{numero}</h2>
        {/* Subtexto (si existe) */}
        {subtexto && <p className="metrica-subtexto">{subtexto}</p>}
        {/* Badge con porcentaje */}
        {badge && <span className="badge-verde">{badge}</span>}
      </div>

      {/* Icono con fondo de color */}
      <div
        className="metrica-icono"
        style={{ backgroundColor: `${colorFondo}20` }}
      >
        {icono.startsWith('http') ? (
          <img src={icono} alt="" style={{ width: '24px', height: '24px' }} />
        ) : (
          icono
        )}
      </div>
    </div>
  );
};

export default TarjetaMetrica;
