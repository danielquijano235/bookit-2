import React, { useState, useEffect } from 'react';
import ModalMenu from '../componentes/Compartidos/ModalMenu';

const items = [
  { title: 'Entrecot', desc: 'Corte premium a la parrilla', price: '$15.00' },
  { title: 'Pollo Asado', desc: 'Marinado y dorado al horno', price: '$11.00' },
  { title: 'Costillas BBQ', desc: 'Salsa casera y cocción lenta', price: '$13.50' },
];

const storageKey = (title) => `menuContent:carnes:${title}`;

const MenuCarnes = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [content, setContent] = useState('');

  useEffect(() => {
    if (selected) {
      const stored = localStorage.getItem(storageKey(selected.title));
      setContent(stored ?? selected.desc ?? '');
      setOpen(true);
    }
  }, [selected]);

  const handleOpen = (it) => setSelected(it);
  const handleClose = () => {
    setOpen(false);
    setSelected(null);
  };
  const handleSave = () => {
    if (selected) {
      localStorage.setItem(storageKey(selected.title), content);
    }
    handleClose();
  };

  return (
    <main style={{ padding: 24 }}>
      <h1>Carnes</h1>
      <p>Cortes y preparaciones seleccionadas</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16, marginTop: 18 }}>
        {items.map((it) => (
          <article key={it.title} onClick={() => handleOpen(it)} style={{ padding: 16, borderRadius: 10, background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.08)', cursor: 'pointer' }}>
            <h3 style={{ margin: '0 0 8px' }}>{it.title}</h3>
            <p style={{ margin: '0 0 12px', color: '#555' }}>{it.desc}</p>
            <div style={{ fontWeight: 700 }}>{it.price}</div>
          </article>
        ))}
      </div>

      <ModalMenu
        open={open}
        title={selected ? selected.title : 'Detalle'}
        content={content}
        onChange={setContent}
        onSave={handleSave}
        onClose={handleClose}
      />
    </main>
  );
};

export default MenuCarnes;
