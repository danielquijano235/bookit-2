import React, { useState, useEffect } from 'react';
import ModalItem from '../componentes/Compartidos/ModalItem';

const defaultItems = [
  { nombre: 'Tostadas Francesas', descripcion: 'Pan brioche con miel y frutas', precio: 6500, imagen: '/assets/images/para-empezar.jpg', categoria: 'desayunos' },
  { nombre: 'Omelette', descripcion: 'Huevos, queso y verduras frescas', precio: 5500, imagen: '/assets/images/para-empezar.jpg', categoria: 'desayunos' },
  { nombre: 'Avena', descripcion: 'Avena caliente con frutas', precio: 4000, imagen: '/assets/images/para-empezar.jpg', categoria: 'desayunos' },
  { nombre: 'Pancakes con miel', descripcion: 'Tortitas dulces con miel y fruta', precio: 8000, imagen: '/assets/images/para-empezar.jpg', categoria: 'desayunos' },
  { nombre: 'Arepa con huevo', descripcion: 'Arepa rellena con huevo y queso', precio: 7000, imagen: '/assets/images/para-empezar.jpg', categoria: 'desayunos' },
];

const MenuDesayunos = () => {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    // Always show default demo items in this listing (do not auto-include newly created platos)
    setItems(defaultItems);
  }, []);

  const abrir = (it) => { setSelected(it); setOpen(true); };
  const cerrar = () => { setOpen(false); setSelected(null); };

  const formatPrice = (n) => n == null ? '' : ('$' + Number(n).toLocaleString('es-CO'));

  return (
    <main style={{ padding: 24 }}>
      <h1>Desayunos</h1>
      <p>Comienza tu día con energía</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16, marginTop: 18 }}>
        {items.map((it) => (
          <article key={it.id || it.nombre} onClick={() => abrir(it)} style={{ padding: 16, borderRadius: 10, background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.08)', cursor: 'pointer' }}>
            <h3 style={{ margin: '0 0 8px' }}>{it.nombre || it.title}</h3>
            <p style={{ margin: '0 0 12px', color: '#555' }}>{it.descripcion || it.desc}</p>
            <div style={{ fontWeight: 700 }}>{formatPrice(it.precio)}</div>
          </article>
        ))}
      </div>

      <ModalItem open={open} item={selected} onClose={cerrar} />
    </main>
  );
};

export default MenuDesayunos;
