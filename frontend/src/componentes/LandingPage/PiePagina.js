/**
 * ============================================
 * BOOKIT - Componente PiePagina (Footer)
 * Archivo: componentes/LandingPage/PiePagina.js
 * ============================================
 * 
 * Propósito: Footer de la landing page con 4 columnas:
 * logo/descripción, links de producto, empresa y legal.
 */

import React from 'react';

const PiePagina = () => {
  // Scroll genérico a cualquier sección por ID
  const scrollA = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
    <footer className="footer">
      <div className="footer-contenido">
        {/* Columna 1: Logo y descripción */}
        <div>
          <div className="footer-logo">
            <img src="/assets/images/logo-bookit.png" alt="BookIt" className="footer-logo-img" />
          </div>
          <p className="footer-descripcion">
            La plataforma líder en gestión de reservas para restaurantes. 
            Simplifica tu operación y mejora la experiencia de tus clientes.
          </p>
        </div>

        {/* Columna 2: Links de Producto */}
        <div>
          <h4 className="footer-titulo">Producto</h4>
          <div className="footer-links">
            <a href="#ventajas" onClick={scrollA('ventajas')}>Beneficios</a>
            <a href="#caracteristicas" onClick={scrollA('caracteristicas')}>Características</a>
            <a href="#testimonios" onClick={scrollA('testimonios')}>Testimonios</a>
          </div>
        </div>

        {/* Columna 3: Links de Empresa */}
        <div>
          <h4 className="footer-titulo">Empresa</h4>
          <div className="footer-links">
            <button className="link-button" onClick={(e) => e.preventDefault()}>Sobre Nosotros</button>
            <button className="link-button" onClick={(e) => e.preventDefault()}>Blog</button>
            <a href="#contacto" onClick={scrollA('contacto')}>Contacto</a>
          </div>
        </div>
        
      </div>

      {/* Copyright */}
      <p className="footer-copyright">
        © 2026 BookIt. Todos los derechos reservados.
      </p>
  

    </footer>

    <div className="demo-credit-bar" role="contentinfo" aria-label="Hecho por">
      <div className="demo-credit-inner">
        <span className="demo-credit-text">Hecho por</span>
        <img className="demo-credit-logo" src="/assets/images/logo-bookit.png" alt="BookIt" />
      </div>
    </div>
    </>
  );
};

export default PiePagina;
