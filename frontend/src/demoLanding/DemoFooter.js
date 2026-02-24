import React from 'react';

const DemoFooter = () => (
  <footer className="demo-footer">
    <div className="demo-footer-inner">
      <div className="demo-footer-brand">
        <img src="/assets/images/logo-bookit.png" alt="Restaurant Demo" className="demo-footer-logo" />
        <p className="demo-footer-desc">Restaurant Demo — demostración de la plantilla. Reserva, explora eventos y disfruta.</p>
      </div>

      <div className="demo-footer-links">
        <h5>Enlaces</h5>
        <a href="#galeria">Galería</a>
        <a href="#menu">Menú</a>
        <a href="#eventos">Eventos</a>
      </div>

      <div className="demo-footer-contact">
        <h5>Contacto</h5>
        <p>Tel: <a href="tel:+571234567890">+57 1 234 567 890</a></p>
        <p>Email: <a href="mailto:info@restaurantdemo.com">info@restaurantdemo.com</a></p>
        <div className="demo-footer-social">
          <a href="#" aria-label="Instagram">Instagram</a>
          <a href="#" aria-label="Facebook">Facebook</a>
          <a href="#" aria-label="X">X</a>
        </div>
      </div>
    </div>

    <div className="demo-footer-bottom">© {new Date().getFullYear()} Restaurant Demo — Página de demostración</div>
  </footer>
);

export default DemoFooter;
