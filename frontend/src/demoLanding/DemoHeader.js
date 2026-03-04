import React from 'react';
import { useNavigate } from 'react-router-dom';

const DemoHeader = ({ onOpenReserva }) => {
  const navigate = useNavigate();

  const irPaginaPrincipal = (e) => {
    e.preventDefault();
    navigate('/');
  };

  return (
  <header className="demo-header">
    <nav className="demo-nav left">
      <a href="#info">NOSOTROS</a>
      <a href="/menu" onClick={(e) => { e.preventDefault(); navigate('/menu'); }}>MENÚ</a>
      <a href="#historia">HISTORIA</a>
    </nav>

    <div className="logo" role="button" tabIndex={0} onClick={irPaginaPrincipal} onKeyDown={(e) => { if (e.key === 'Enter') irPaginaPrincipal(e); }} style={{cursor: 'pointer'}}>DEMO</div>

    <nav className="demo-nav right">
      <a href="#eventos">EVENTOS</a>
      <a href="#reservas" onClick={(e) => { e.preventDefault(); onOpenReserva && onOpenReserva(); }}>RESERVAS</a>
      <a href="#contacto">INFORMACIÓN</a>
    </nav>
  </header>

  );
};

export default DemoHeader;
