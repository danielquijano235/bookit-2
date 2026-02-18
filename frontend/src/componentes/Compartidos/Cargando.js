/**
 * ============================================
 * BOOKIT - Componente de Carga (Loading)
 * Archivo: componentes/Compartidos/Cargando.js
 * ============================================
 * 
 * Propósito: Spinner de carga que se muestra mientras
 * se están obteniendo datos del servidor.
 * 
 * Props:
 *   - mensaje: Texto a mostrar (opcional, por defecto "Cargando...")
 */

import React from 'react';

const Cargando = ({ mensaje = 'Cargando...' }) => {
  return (
    <div className="cargando">
      {mensaje}
    </div>
  );
};

export default Cargando;
