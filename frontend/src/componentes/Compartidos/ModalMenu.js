import React from 'react';

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0,0,0,0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 2000,
};

const modalStyle = {
  width: 'min(920px, 94%)',
  maxHeight: '90vh',
  background: '#fff',
  borderRadius: 12,
  padding: 20,
  boxSizing: 'border-box',
  overflow: 'auto',
};

const textareaStyle = {
  width: '100%',
  minHeight: '50vh',
  boxSizing: 'border-box',
  padding: 12,
  fontSize: 16,
  borderRadius: 8,
  border: '1px solid #ddd',
  resize: 'vertical',
};

const footerStyle = {
  marginTop: 12,
  display: 'flex',
  gap: 8,
  justifyContent: 'flex-end',
};

const ModalMenu = ({ open, title, content, onChange, onSave, onClose }) => {
  if (!open) return null;

  return (
    <div style={overlayStyle} onMouseDown={onClose}>
      <div style={modalStyle} onMouseDown={(e) => e.stopPropagation()}>
        <header style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: 20, cursor: 'pointer' }}>×</button>
        </header>

        <div>
          <textarea style={textareaStyle} value={content} onChange={(e) => onChange(e.target.value)} />
        </div>

        <div style={footerStyle}>
          <button onClick={onClose} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #ccc', background: '#f5f5f5', cursor: 'pointer' }}>Cancelar</button>
          <button onClick={onSave} style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: 'var(--color-primario, #2b6cb0)', color: '#fff', cursor: 'pointer' }}>Guardar</button>
        </div>
      </div>
    </div>
  );
};

export default ModalMenu;
