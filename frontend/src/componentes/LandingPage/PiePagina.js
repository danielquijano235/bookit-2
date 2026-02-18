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
  return (
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
            <a href="#contacto">Sobre Nosotros</a>
            <a href="#contacto">Blog</a>
            <a href="#contacto">Contacto</a>
          </div>
        </div>

        {/* Columna 4: Links Legales */}
        <div>
          <h4 className="footer-titulo">Legal</h4>
          <div className="footer-links">
            <a href="#contacto">Privacidad</a>
            <a href="#contacto">Términos</a>
            <a href="#contacto">Cookies</a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <p className="footer-copyright">
        © 2024 BookIt. Todos los derechos reservados.
      </p>
    </footer>
  );
};

export default PiePagina;
