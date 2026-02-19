import React from 'react';

const DemoHero = () => (
  <section className="demo-hero">
    <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80" alt="Restaurante elegante" className="demo-hero-img" />
    <div className="demo-hero-content">
      <h1>Bienvenido a Restaurante Demo</h1>
      <p>Una experiencia gastronómica única para tus clientes.</p>
      <a href="#reservar" className="demo-hero-btn">Reservar ahora</a>
    </div>
  </section>
);

export default DemoHero;
