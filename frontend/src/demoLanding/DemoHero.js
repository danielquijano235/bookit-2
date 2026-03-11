import React from 'react';

// Componente hero principal de la demo
const DemoHero = ({ onOpenReserva }) => (
  <section className="demo-hero">
    {/* Imagen de fondo */}
    <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80" alt="Restaurante elegante" className="demo-hero-img" />
    <div className="demo-hero-content">
      <h1>Bienvenido a Restaurante ...</h1>
      <p>Una experiencia gastronómica única para tus clientes.</p>
      {/* Botón para abrir el modal de reserva desde el hero */}
      <a href="#reservar" className="demo-hero-btn" onClick={(e) => { e.preventDefault(); onOpenReserva && onOpenReserva('hero'); }}>Reservar ahora</a>
    </div>
  </section>
);

export default DemoHero;
