/**
 * ============================================
 * BOOKIT - Componente Boton Reutilizable
 * Archivo: componentes/Compartidos/Boton.js
 * ============================================
 * 
 * Props:
 *   - children: Contenido del botón (texto, iconos)
 *   - variante: 'primario' (amarillo), 'secundario' (outline), 'peligro' (rojo)
 *   - onClick: Función al hacer clic
 *   - disabled: Deshabilitar el botón
 *   - tipo: Tipo HTML del botón ('button', 'submit')
 */

import React from 'react';

const estilosVariante = {
  primario: {
    backgroundColor: '#FDB022',
    color: '#1e3a5f',
    border: 'none',
    fontWeight: '700',
  },
  secundario: {
    backgroundColor: 'transparent',
    color: '#718096',
    border: '1.5px solid #e2e8f0',
    fontWeight: '500',
  },
  peligro: {
    backgroundColor: '#EF4444',
    color: 'white',
    border: 'none',
    fontWeight: '600',
  },
};

const Boton = ({ children, variante = 'primario', onClick, disabled = false, tipo = 'button' }) => {
  const estilos = {
    ...estilosVariante[variante],
    padding: '10px 22px',
    borderRadius: '10px',
    fontSize: '0.9rem',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    transition: '0.2s ease',
    fontFamily: 'inherit',
  };

  return (
    <button style={estilos} onClick={onClick} disabled={disabled} type={tipo}>
      {children}
    </button>
  );
};

export default Boton;
