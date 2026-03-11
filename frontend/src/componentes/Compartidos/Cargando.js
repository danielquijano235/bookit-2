

import React from 'react';

const Cargando = ({ mensaje = 'Cargando...' }) => {
  return (
    <div className="cargando">
      {mensaje}
    </div>
  );
};

export default Cargando;
