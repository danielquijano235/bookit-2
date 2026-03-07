import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DemoHeader = ({ onOpenReserva }) => {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const irPaginaPrincipal = (e) => {
    e.preventDefault();
    navigate('/');
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setMenuAbierto(false);
    } else {
      // If not on demo route, navigate to demo landing with hash
      window.location.href = `/demo-landing#${id}`;
    }
  };

  useEffect(() => {
    const handleOutside = (e) => {
      const nav = document.querySelector('.demo-header');
      if (!nav) return;
      if (menuAbierto && !nav.contains(e.target)) {
        setMenuAbierto(false);
      }
    };
    document.addEventListener('click', handleOutside);
    return () => document.removeEventListener('click', handleOutside);
  }, [menuAbierto]);

  return (
    <header className="demo-header">
      <nav className={`demo-nav left ${menuAbierto ? 'abierto' : ''}`}>
        <a href="#info" onClick={(e) => { e.preventDefault(); scrollToSection('info'); }}>NOSOTROS</a>
        <a href="/menu" onClick={(e) => { e.preventDefault(); navigate('/menu'); }}>MENÚ</a>
        <a href="#historia" onClick={(e) => { e.preventDefault(); scrollToSection('historia'); }}>HISTORIA</a>
      </nav>

      <div className="logo" role="button" tabIndex={0} onClick={irPaginaPrincipal} onKeyDown={(e) => { if (e.key === 'Enter') irPaginaPrincipal(e); }} style={{cursor: 'pointer'}}>DEMO</div>

      <button
        className={`demo-hamburger ${menuAbierto ? 'abierto' : ''}`}
        aria-expanded={menuAbierto}
        aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
        onClick={() => setMenuAbierto(!menuAbierto)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav className={`demo-nav right ${menuAbierto ? 'abierto' : ''}`}>
        <a href="#eventos" onClick={(e) => { e.preventDefault(); scrollToSection('eventos'); }}>EVENTOS</a>
        <a href="#reservas" onClick={(e) => { e.preventDefault(); setMenuAbierto(false); onOpenReserva && onOpenReserva(); }}>RESERVAS</a>
        <a href="#contacto" onClick={(e) => { e.preventDefault(); scrollToSection('contacto'); }}>INFORMACIÓN</a>
      </nav>
    </header>
  );
};

export default DemoHeader;
