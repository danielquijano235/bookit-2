import React from 'react';

// Preferimos clases CSS, pero mantenemos estilos en línea como respaldo
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

const Boton = React.forwardRef(({ children, variante = 'primario', onClick, disabled = false, tipo = 'button', className = '' }, ref) => {
  // Para el variante 'secundario' preferimos clases CSS para controlar
  // colores/bordes y permitir efectos hover definidos en landing.css.
  const isAccion = String(className).includes('accion-btn');
  const estilos = {
    ...(variante === 'secundario' ? {} : estilosVariante[variante] || {}),
    padding: isAccion ? '0' : '10px 22px',
    width: isAccion ? '36px' : undefined,
    height: isAccion ? '36px' : undefined,
    borderRadius: isAccion ? '8px' : '10px',
    fontSize: '0.9rem',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    transition: '0.2s ease',
    fontFamily: 'inherit',
    display: isAccion ? 'inline-flex' : undefined,
    alignItems: isAccion ? 'center' : undefined,
    justifyContent: isAccion ? 'center' : undefined,
    boxSizing: isAccion ? 'border-box' : undefined,
  };

  // Preferimos la clase CSS .btn cuando está disponible para tener control total del diseño
  const clase = `btn btn--${variante} ${className}`.trim();

  // Determina si hay elementos hijos para renderizar
  const hasChildren = React.Children.count(children) > 0;

  // Ícono por defecto para 'peligro' si no hay hijos: usa imagen de Icons8 (blanco)
  const defaultPeligroIcon = (
    <img
      src="https://img.icons8.com/ios-filled/16/ffffff/trash--v1.png"
      alt="Eliminar"
      width="16"
      height="16"
      aria-hidden="true"
      focusable="false"
    />
  );

  return (
    <button ref={ref} className={clase} style={estilos} onClick={onClick} disabled={disabled} type={tipo}>
      {hasChildren ? children : (variante === 'peligro' ? defaultPeligroIcon : null)}
    </button>
  );
});

export default Boton;
