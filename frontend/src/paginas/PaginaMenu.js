
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ModalSimple from '../componentes/Compartidos/ModalSimple';
import { getPlatosByCategoria } from '../servicios/menuStorage';
import samplePlatos from '../servicios/samplePlatos';
import categorias from '../servicios/categorias';

const PaginaMenu = () => {
  const [open, setOpen] = useState(false);
  const [categoria, setCategoria] = useState(null);
  const [items, setItems] = useState([]);

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

  const cerrar = () => { setOpen(false); setCategoria(null); setItems([]); };

  const formatPrice = (n) => n == null ? '' : ('$' + Number(n).toLocaleString('es-CO'));

  return (
    <main className="vista-menu menu-landing">
      <div className="menu-header" style={{ background: 'transparent', boxShadow: 'none', padding: 0 }}>
        <div className="menu-titulo" style={{ width: '100%', textAlign: 'center' }}>
          <h1>Nuestro Menú</h1>
        </div>
      </div>

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

      <ModalSimple open={open} title={categoria ? categoria.title : ''} onClose={cerrar}>
        <div className="categoria-list">
          {items.map((it, idx) => (
            <div className="categoria-item" key={it.id || it.nombre || idx}>
              <div className="categoria-row">
                <div className="categoria-nombre">{it.nombre}</div>
                <div className="categoria-precio">{formatPrice(it.precio)}</div>
              </div>
              {it.descripcion ? <div className="categoria-desc">{it.descripcion}</div> : null}
              <div className="categoria-sep" />
            </div>
          ))}
        </div>
      </ModalSimple>
    </main>
  );
};

export default PaginaMenu;
