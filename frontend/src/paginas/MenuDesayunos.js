import React, { useState, useEffect } from 'react';
import ModalMenu from '../componentes/Compartidos/ModalMenu';

const items = [
  { title: 'Tostadas Francesas', desc: 'Pan brioche con miel y frutas', price: '$6.50' },
  { title: 'Omelette', desc: 'Huevos, queso y verduras frescas', price: '$5.50' },
  { title: 'Avena', desc: 'Avena caliente con frutas', price: '$4.00' },
];

const storageKey = (title) => `menuContent:desayunos:${title}`;

const MenuDesayunos = () => {
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
      <h1>Desayunos</h1>
      <p>Comienza tu día con energía</p>
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

export default MenuDesayunos;
