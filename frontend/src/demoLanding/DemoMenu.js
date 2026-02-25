import React from 'react';
import { Link } from 'react-router-dom';

const DemoMenu = () => (
  <section className="demo-menu demo-menu-single" id="menu">
    <div className="demo-menu-inner">
      <h2>Menú</h2>
      <p>Descubre nuestro menú completo</p>
      <div className="demo-menu-cta">
        <Link className="demo-menu-btn" to="/menu">Ver menú</Link>
      </div>
    </div>
  </section>
);

export default DemoMenu;
