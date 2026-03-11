

import React from 'react';

const Tarjeta = ({ children, className = '' }) => {
  const estilos = {
    background: '#ffffff',
    padding: '24px',
    borderRadius: '16px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0',
  };

  return (
    <div style={estilos} className={className}>
      {children}
    </div>
  );
};

export default Tarjeta;
