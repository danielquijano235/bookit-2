import React, { useState, useEffect } from 'react';
import ModalItem from '../componentes/Compartidos/ModalItem';

const defaultItems = [
  { nombre: 'Bistec a la criolla', descripcion: 'Bistec con cebolla y salsa criolla', precio: 25000, imagen: '/assets/images/carnes.jpg', categoria: 'carnes' },
  { nombre: 'Costillas BBQ', descripcion: 'Costillas glaseadas con salsa casera', precio: 32000, imagen: '/assets/images/parrilla.jpg', categoria: 'carnes' },
  { nombre: 'Milanesa de res', descripcion: 'Milanesa empanada con papas', precio: 20000, imagen: '/assets/images/carnes.jpg', categoria: 'carnes' },
  { nombre: 'Filete al ajillo', descripcion: 'Filete de res con ajo y mantequilla', precio: 30000, imagen: '/assets/images/carnes.jpg', categoria: 'carnes' },
  { nombre: 'Cazuela de res', descripcion: 'Estofado tradicional con verduras', precio: 27000, imagen: '/assets/images/carnes.jpg', categoria: 'carnes' },
];

const MenuCarnes = () => {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    // Always show default demo items for Carnes (do not include newly created platos automatically)
    setItems(defaultItems);
  }, []);

  const abrir = (it) => { setSelected(it); setOpen(true); };
  const cerrar = () => { setOpen(false); setSelected(null); };

  const formatPrice = (n) => n == null ? '' : ('$' + Number(n).toLocaleString('es-CO'));

  return (
    <main style={{ padding: 24 }}>
      <h1>Carnes</h1>
      <p>Cortes y preparaciones seleccionadas</p>
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

export default MenuCarnes;
