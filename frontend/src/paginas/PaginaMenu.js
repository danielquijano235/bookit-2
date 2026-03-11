import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ModalSimple from '../componentes/Compartidos/ModalSimple';
import { getPlatosByCategoria } from '../servicios/menuStorage';
import samplePlatos from '../servicios/samplePlatos';
import categorias from '../servicios/categorias';

// Página de menú: muestra categorías y platos
const PaginaMenu = () => {
  const [open, setOpen] = useState(false);
  const [categoria, setCategoria] = useState(null);
  const [items, setItems] = useState([]);

  // Abre el modal de una categoría y carga los platos
  const abrirCategoria = (c) => (e) => {
    e.preventDefault();
    // try to load stored platos for this category
    let found = getPlatosByCategoria(c.id) || [];
    // fallback demo items when none stored — use per-category samplePlatos
    if (!found || found.length === 0) {
      found = samplePlatos[c.id] || [];
    }
    setCategoria(c);
    setItems(found);
    setOpen(true);
  };

  // Cierra el modal
  const cerrar = () => { setOpen(false); setCategoria(null); setItems([]); };

  // Formatea el precio
  const formatPrice = (n) => n == null ? '' : ('$' + Number(n).toLocaleString('es-CO'));

  return (
    <main className="vista-menu menu-landing">
      <div className="menu-header" style={{ background: 'transparent', boxShadow: 'none', padding: 0 }}>
        <Link to="/demo-landing" aria-label="Volver a Demo" className="menu-back-btn">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </Link>
        <div className="menu-titulo" style={{ width: '100%', textAlign: 'center' }}>
          <h1>Nuestro Menú</h1>
        </div>
      </div>
      {/* Grid de categorías */}
      <section className="menu-grid-container">
        <div className="menu-grid">
          {categorias.map((c) => (
            <article className="menu-card" key={c.id}>
              <a href={`/menu/${c.id}`} onClick={abrirCategoria(c)} className="menu-card-link">
                <div className="menu-card-img">
                  <img src={c.image} alt={c.title} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span className="menu-card-btn">{c.title}</span>
                </div>
              </a>
            </article>
          ))}
        </div>
      </section>
      {/* Modal para mostrar platos de la categoría */}
      <ModalSimple open={open} onClose={cerrar}>
        <div className="menu-modal-content">
          <h2>{categoria?.title}</h2>
          <ul className="menu-modal-list">
            {items.map((item, idx) => (
              <li key={idx} className="menu-modal-item">
                <span>{item.nombre}</span>
                <span>{formatPrice(item.precio)}</span>
              </li>
            ))}
          </ul>
        </div>
      </ModalSimple>
    </main>
  );
};

export default PaginaMenu;
