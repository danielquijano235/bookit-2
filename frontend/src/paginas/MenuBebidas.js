import React, { useState, useEffect } from 'react';
import ModalMenu from '../componentes/Compartidos/ModalMenu';

const items = [
  { title: 'Café Latte', desc: 'Espresso suave con leche cremosa', price: '$3.50' },
  { title: 'Té Verde', desc: 'Seleccion premium, servido caliente', price: '$2.50' },
  { title: 'Jugo Natural', desc: 'Naranja recién exprimida', price: '$3.00' },
];

const storageKey = (title) => `menuContent:bebidas:${title}`;

const MenuBebidas = () => {
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
      <h1>Bebidas</h1>
      <p>Selecciona tu bebida favorita</p>
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

export default MenuBebidas;
