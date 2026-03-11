/**
 * ============================================
 * BOOKIT - Componente PiePagina (Footer)
 * Archivo: componentes/LandingPage/PiePagina.js
 * ============================================
 * 
 * Propósito: Footer de la landing page con 4 columnas:
 * logo/descripción, links de producto, empresa y legal.
 */

import React, { useState } from 'react';
import ModalSimple from '../Compartidos/ModalSimple';

const PiePagina = () => {
  const [blogOpen, setBlogOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  // Maneja el click en el link "Sobre nosotros"
  const handleSobreClick = (e) => {
    e.preventDefault();
    const el = document.getElementById('sobre-nosotros');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      setAboutOpen(true);
    }
  };

  // Maneja el click en el link "Contacto"
  const handleContactClick = (e) => {
    e && e.preventDefault();
    // Cierra el modal primero, luego navega/scroll a contacto
    setAboutOpen(false);
    setTimeout(() => {
      const el = document.getElementById('contacto');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        // fallback: change hash
        window.location.hash = '#contacto';
      }
    }, 220);
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
            <a href="#ventajas">Beneficios</a>
            <a href="#caracteristicas">Características</a>
            <a href="#testimonios">Testimonios</a>
          </div>
        </div>

        {/* Columna 3: Links de Empresa */}
        <div>
          <h4 className="footer-titulo">Empresa</h4>
          <div className="footer-links">
            <button className="link-button" onClick={(e) => handleSobreClick(e)}>Sobre Nosotros</button>
            <button className="link-button" onClick={() => setBlogOpen(true)}>Blog</button>
            <a href="#contacto">Contacto</a>
          </div>
        </div>
        
      </div>

      {/* Copyright */}
      <p className="footer-copyright">
        © 2026 BookIt. Todos los derechos reservados.
      </p>
  
      <ModalSimple open={blogOpen} title="Últimas entradas del blog" onClose={() => setBlogOpen(false)} hideHeader={true}>
        <div className="about-modal">
          <div className="about-modal-header">
            <img src="/assets/images/logo-bookit.png" alt="BookIt" className="about-modal-logo" />
            <button className="about-modal-close" onClick={() => setBlogOpen(false)}>×</button>
          </div>

          <div className="about-modal-body">
            <h4 className="about-modal-title">Últimas entradas</h4>
            <p className="about-modal-text">Lecturas breves y consejos para optimizar reservas, fidelizar clientes y sacar más provecho a BookIt.</p>

            <ul className="about-modal-list">
              <li>
                <strong>5 maneras de aumentar tus reservas</strong>
                <p style={{ margin: '6px 0 0', color: 'var(--color-texto-claro)' }}>Consejos rápidos para optimizar tu disponibilidad y convertir más visitantes en reservas.</p>
              </li>
              <li style={{ marginTop: 10 }}>
                <strong>Cómo mejorar la experiencia en sala</strong>
                <p style={{ margin: '6px 0 0', color: 'var(--color-texto-claro)' }}>Estrategias sencillas para fidelizar clientes y obtener reseñas positivas.</p>
              </li>
            </ul>

            <div className="about-modal-actions">
              <a href="/blog" className="about-demo-link">Ver más en el blog →</a>
            </div>
          </div>
        </div>
      </ModalSimple>

      <ModalSimple open={aboutOpen} title="Sobre BookIt" onClose={() => setAboutOpen(false)} hideHeader={true}>
        <div className="about-modal">
          <div className="about-modal-header">
            <img
              src="/assets/images/logo-bookit.png"
              alt="BookIt"
              className="about-modal-logo"
            />
            <button className="about-modal-close" onClick={() => setAboutOpen(false)}>×</button>
          </div>

          <div className="about-modal-body">
            <h4 className="about-modal-title">Nuestro propósito</h4>
            <p className="about-modal-text">
              En BookIt creemos que gestionar un restaurante debe ser sencillo y eficiente.
              Ofrecemos una plataforma pensada para optimizar reservas, maximizar la ocupación
              y mejorar la experiencia de tus clientes, sin complicaciones.
            </p>

            <ul className="about-modal-list">
              <li>Calendario en tiempo real y gestión de mesas.</li>
              <li>Perfiles de clientes y comunicación automatizada.</li>
              <li>Reportes accionables para tomar mejores decisiones.</li>
            </ul>

            <div className="about-modal-actions">
              <button type="button" onClick={handleContactClick} className="about-cta">Contáctanos</button>
              <a href="/demo-landing" className="about-demo-link">Ver demo →</a>
            </div>
          </div>
        </div>
      </ModalSimple>
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
