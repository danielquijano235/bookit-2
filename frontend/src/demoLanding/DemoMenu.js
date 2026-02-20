import React from 'react';


const platos = [
  {
    nombre: 'Carpaccio de Res',
    descripcion: 'Finas láminas de res con aderezo de mostaza y alcaparras.',
    precio: '$28.000',
    imagen: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80'
  },
  {
    nombre: 'Salmón a la Parrilla',
    descripcion: 'Salmón fresco con salsa de eneldo y vegetales asados.',
    precio: '$45.000',
    imagen: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80'
  },
  {
    nombre: 'Tarta de Chocolate',
    descripcion: 'Postre cremoso de chocolate con frutos rojos.',
    precio: '$18.000',
    imagen: 'https://images.unsplash.com/photo-1505250469679-203ad9ced0cb?auto=format&fit=crop&w=400&q=80'
  }
];

const DemoMenu = () => (
  <section className="demo-menu" id="menu">
    <h2>Menú Destacado</h2>
    <div className="demo-menu-grid">
      {platos.map((plato, idx) => (
        <div className="demo-menu-card" key={idx}>
          <img src={plato.imagen} alt={plato.nombre} className="demo-menu-img" />
          <div className="demo-menu-info">
            <h3>{plato.nombre}</h3>
            <p className="demo-menu-desc">{plato.descripcion}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default DemoMenu;
