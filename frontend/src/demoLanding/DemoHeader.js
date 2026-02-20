import React from 'react';

const DemoHeader = () => (
  <header className="demo-header">
    <nav className="demo-nav left">
      <a href="#info">NOSOTROS</a>
      <a href="#menu">MENÚ</a>
      <a href="#historia">HISTORIA</a>
    </nav>

    <div className="logo">DEMO</div>

    <nav className="demo-nav right">
      <a href="#eventos">EVENTOS</a>
      <a href="#reservas">RESERVAS</a>
      <a href="#contacto">INFORMACIÓN</a>
    </nav>
  </header>
);

export default DemoHeader;
