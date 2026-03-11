import React from 'react';


  // Componente modal ligero para mostrar detalles de un ítem (plato, producto).
  // - Usa estilos en línea para simplificar el uso desde distintas secciones.
  // - `onClose` cierra el modal cuando el usuario hace clic fuera o en el botón.


const overlay = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 3000,
};

const box = {
  width: 'min(760px, 96%)',
  maxHeight: '90vh',
  background: '#fff',
  borderRadius: 10,
  padding: 16,
  boxSizing: 'border-box',
  overflow: 'auto',
};

const header = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 };

const imgStyle = { width: '100%', maxHeight: 320, objectFit: 'cover', borderRadius: 8, marginBottom: 12 };

const precioStyle = { fontWeight: 800, fontSize: 18 };

const ModalItem = ({ open, item, onClose }) => {
  if (!open || !item) return null;

  const formatearPrecio = (n) => {
    if (n == null) return '';
    const num = Number(n) || 0;
    return '$' + num.toLocaleString('es-CO');
  };

  return (
    <div style={overlay} onMouseDown={onClose}>
      <div style={box} onMouseDown={(e) => e.stopPropagation()}>
        <div style={header}>
          <h2 style={{ margin: 0 }}>{item.nombre || item.title}</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: 22, cursor: 'pointer' }}>×</button>
        </div>

        {item.imagen && <img src={item.imagen} alt={item.nombre || item.title} style={imgStyle} onError={(e) => { e.target.onerror = null; e.target.src = '/assets/images/placeholder-plato.png'; }} />}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ color: '#666' }}>{item.categoria || item.cat || ''}</div>
          <div style={precioStyle}>{formatearPrecio(item.precio)}</div>
        </div>

        <div style={{ color: '#333', lineHeight: 1.4 }}>{item.descripcion || item.desc || ''}</div>
      </div>
    </div>
  );
};

export default ModalItem;
