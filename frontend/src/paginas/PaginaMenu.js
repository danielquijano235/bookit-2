
import React from 'react';
import { Link } from 'react-router-dom';

const sections = [
  { id: 'bebidas', title: 'Bebidas' },
  { id: 'desayunos', title: 'Desayunos' },
  { id: 'cenas', title: 'Cenas' },
  { id: 'carnes', title: 'Carnes' },
];

const PaginaMenu = () => {
  return (
    <main
      className="pagina-menu"
      style={{
        background: 'var(--color-azul-oscuro)',
        color: '#fff',
        padding: '20px',
        width: '100%',
        minHeight: '100vh',
        position: 'relative',
        left: '50%',
        marginLeft: '-50vw',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h1 className="pagina-menu-title" style={{ margin: '0 0 8px' }}>Menú</h1>
        <p className="pagina-menu-subtitle" style={{ margin: '0 0 58px', opacity: 0.95 }}>Nuestras categorías destacadas</p>

        {/* Top list of links (vertical, centered) */}
        <div
          className="pagina-menu-links"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            marginBottom: 32,
            width: '100%',
            maxWidth: 420,
          }}
        >
          {sections.map((s) => (
            <Link
              key={s.id}
              to={`/menu/${s.id}`}
              className="pagina-menu-link-vertical"
              style={{
                display: 'block',
                padding: '16px 20px',
                borderRadius: 10,
                background: 'rgba(255,255,255,0.06)',
                width: '100%',
                boxSizing: 'border-box',
                textDecoration: 'none',
                color: 'inherit',
                textAlign: 'center',
                fontWeight: 600,
                fontSize: '1.1rem',
              }}
            >
              {s.title}
            </Link>
          ))}
        </div>

        {/* Detailed sections removed — page shows only links per request */}
      </div>
    </main>
  );
};

export default PaginaMenu;
