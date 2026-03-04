import React, { useEffect } from 'react';

const overlay = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 3000,
};

const box = {
  width: 'min(760px, 94%)',
  maxHeight: '86vh',
  background: 'var(--color-blanco, #fff)',
  borderRadius: 12,
  padding: '20px',
  boxSizing: 'border-box',
  overflowY: 'auto',
};

const header = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 12,
};

const ModalSimple = ({ open, title, children, onClose, hideHeader = false }) => {
  useEffect(() => {
    if (open) {
      document.body.classList.add('has-modal-open');
    } else {
      document.body.classList.remove('has-modal-open');
    }
    return () => { document.body.classList.remove('has-modal-open'); };
  }, [open]);

  if (!open) return null;
  return (
    <div style={overlay} onMouseDown={onClose}>
      <div style={box} onMouseDown={(e) => e.stopPropagation()}>
        {!hideHeader && (
          <div style={header}>
            <h3 style={{ margin: 0 }}>{title}</h3>
            <button onClick={onClose} style={{ border: 'none', background: 'transparent', fontSize: 20, cursor: 'pointer' }}>×</button>
          </div>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default ModalSimple;
