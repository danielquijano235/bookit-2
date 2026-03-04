
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
        <Link to="/demo-landing" aria-label="Volver a Demo" className="menu-back-btn">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </Link>
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

      <footer className="demo-footer" role="contentinfo">
        <div className="demo-footer-inner">
          <div className="demo-footer-social social-icons" aria-label="Redes sociales">
            <a href="#" aria-label="Facebook" title="Facebook" className="social-link">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2.2v-2.9h2.2V9.3c0-2.2 1.3-3.5 3.3-3.5.96 0 1.97.17 1.97.17v2.2h-1.12c-1.1 0-1.44.67-1.44 1.36v1.62h2.45l-.39 2.9h-2.06v7A10 10 0 0 0 22 12z"></path></svg>
            </a>
            <a href="#" aria-label="Instagram" title="Instagram" className="social-link">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="3"></circle><circle cx="17.5" cy="6.5" r="0.7" fill="currentColor"></circle></svg>
            </a>
            <a href="#" aria-label="Twitter" title="Twitter" className="social-link">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"><path d="M23 4.56c-.8.36-1.66.6-2.56.71a4.48 4.48 0 0 0-7.64 4.08A12.73 12.73 0 0 1 3.15 3.1a4.48 4.48 0 0 0 1.39 5.98 4.4 4.4 0 0 1-2.03-.56v.06c0 2.2 1.56 4.03 3.64 4.45a4.5 4.5 0 0 1-2.02.08c.57 1.77 2.23 3.06 4.2 3.09A9.01 9.01 0 0 1 2 19.54a12.7 12.7 0 0 0 6.88 2.02c8.26 0 12.78-6.84 12.78-12.78 0-.2 0-.41-.01-.61A9.22 9.22 0 0 0 23 4.56z"></path></svg>
            </a>
            <a href="#" aria-label="LinkedIn" title="LinkedIn" className="social-link">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM10 9h3.7v1.6h.1c.5-.9 1.7-1.8 3.6-1.8C21.5 8.8 22 11 22 14.3V21h-4v-6.2c0-1.5 0-3.5-2.1-3.5-2.1 0-2.4 1.6-2.4 3.4V21H10z"></path></svg>
            </a>
            <a href="#" aria-label="YouTube" title="YouTube" className="social-link">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"><path d="M23.5 7.2a3 3 0 0 0-2.11-2.12C19.64 4.5 12 4.5 12 4.5s-7.64 0-9.39.58A3 3 0 0 0 .5 7.2 31.2 31.2 0 0 0 0 12a31.2 31.2 0 0 0 .5 4.8 3 3 0 0 0 2.11 2.12C4.36 19.5 12 19.5 12 19.5s7.64 0 9.39-.58a3 3 0 0 0 2.11-2.12A31.2 31.2 0 0 0 24 12a31.2 31.2 0 0 0-.5-4.8zM10 15.5v-7l6 3.5-6 3.5z"></path></svg>
            </a>
          </div>
          <div className="divider" aria-hidden="true"></div>
          <div className="demo-footer-location address">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path></svg>
            <span>Rionegro, Antioquia</span>
          </div>
          <div className="demo-footer-bottom">© 2026 — Todos los derechos reservados</div>
        </div>
      </footer>

      <div className="demo-credit-bar" role="contentinfo" aria-label="Hecho por">
        <div className="demo-credit-inner">
          <span className="demo-credit-text">Hecho por</span>
          <img className="demo-credit-logo" src="/assets/images/logo-bookit.png" alt="Bookit" />
        </div>
      </div>
    </main>
  );
};

export default PaginaMenu;
