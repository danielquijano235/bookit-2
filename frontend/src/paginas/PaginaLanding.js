

import React from 'react';
import BarraNavegacion from '../componentes/LandingPage/BarraNavegacion';
import SeccionHero from '../componentes/LandingPage/SeccionHero';
import SeccionVentajas from '../componentes/LandingPage/SeccionVentajas';
import SeccionCaracteristicas from '../componentes/LandingPage/SeccionCaracteristicas';
import SeccionTestimonios from '../componentes/LandingPage/SeccionTestimonios';
import SeccionContacto from '../componentes/LandingPage/SeccionContacto';
import PiePagina from '../componentes/LandingPage/PiePagina';
import '../estilos/landing.css';

const PaginaLanding = () => {
  return (
    <div>
      {/* Barra de navegación fija */}
      <BarraNavegacion />

      {/* Sección principal con título y CTA */}
      <SeccionHero />

      {/* Sección de ventajas (6 tarjetas) */}
      <SeccionVentajas />

      {/* Sección de características con pestañas */}
      <SeccionCaracteristicas />

      {/* Sección de testimonios (6 tarjetas) */}
      <SeccionTestimonios />

      {/* Sección de contacto con formulario */}
      <SeccionContacto />

      {/* Pie de página */}
      <PiePagina />
    </div>
  );
};

export default PaginaLanding;
