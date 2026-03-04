import React, { useState, useEffect } from 'react';
import ModalItem from '../componentes/Compartidos/ModalItem';

const defaultItems = [
  { nombre: 'Gaseosa', descripcion: 'Botella 500ml', precio: 4000, imagen: '/assets/images/bebidas.jpg', categoria: 'bebidas' },
  { nombre: 'Agua mineral', descripcion: 'Botella', precio: 3000, imagen: '/assets/images/bebidas.jpg', categoria: 'bebidas' },
  { nombre: 'Té frío', descripcion: 'Té infusionado y frío', precio: 5000, imagen: '/assets/images/bebidas.jpg', categoria: 'bebidas' },
  { nombre: 'Agua saborizada', descripcion: 'Con gas y sabor ligero', precio: 4500, imagen: '/assets/images/bebidas.jpg', categoria: 'bebidas' },
  { nombre: 'Kombucha', descripcion: 'Bebida fermentada', precio: 12000, imagen: '/assets/images/bebidas.jpg', categoria: 'bebidas' },
];

const MenuBebidas = () => {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    // Always show default demo items for Bebidas (do not include newly created platos automatically)
    setItems(defaultItems);
  }, []);

  const abrir = (it) => { setSelected(it); setOpen(true); };
  const cerrar = () => { setOpen(false); setSelected(null); };

  const formatPrice = (n) => n == null ? '' : ('$' + Number(n).toLocaleString('es-CO'));

  return (
    <main style={{ padding: 24 }}>
      <h1>Bebidas</h1>
      <p>Selecciona tu bebida favorita</p>
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

export default MenuBebidas;
