/**
 * ============================================
 * BOOKIT - Componente SeccionHero
 * Archivo: componentes/LandingPage/SeccionHero.js
 * ============================================
 * 
 * Propósito: Sección principal de la landing page.
 * Muestra el título, subtítulo, botones CTA, estadísticas
 * y una imagen con tarjeta flotante.
 * 
 * Props: Ninguna
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DemoReserva from './DemoReserva';
import Boton from '../Compartidos/Boton';

const SeccionHero = () => {
  const navigate = useNavigate();
  const [mostrarDemo, setMostrarDemo] = useState(false);

  const irContacto = () => {
    const el = document.getElementById('contacto');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // Si no estamos en la landing, navegamos a la raíz con hash
      window.location.href = '/#contacto';
    }
  };

  return (
    <section className="hero">
      <div className="hero-contenido">
        {/* ====== COLUMNA IZQUIERDA: Texto y CTA ====== */}
        <div className="hero-texto">
          {/* Badge superior */}
          {/* Subtexto superior */}
          <p className="hero-subtexto-superior">
            El software de reservas más completo
          </p>

          {/* Título principal */}
          <h1 className="hero-titulo">
            Transforma la gestión de tu{' '}
            <span className="texto-amarillo">restaurante</span>
          </h1>

          {/* Subtítulo descriptivo */}
          <p className="hero-subtitulo">
            BookIt simplifica las reservas, optimiza tu servicio y mejora la
            experiencia de tus clientes. Todo en una sola plataforma.
          </p>

          {/* Botones de acción */}
          <div className="hero-botones">
            <Boton variante="primario" onClick={irContacto}>Empezar Ahora →</Boton>
            <Boton className="hero-demo-btn" variante="secundario" onClick={() => setMostrarDemo(true)}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                style={{ verticalAlign: 'middle', marginRight: '6px', fill: 'var(--color-amarillo)' }}
                aria-hidden="true"
                focusable="false"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
              Ver Demo
            </Boton>
          </div>

          {/* Botón destacado para la demo de restaurante */}
          <div style={{marginTop:'1.5rem', textAlign:'left', marginBottom:'2.5rem'}}>
            <Boton className="hero-preview-btn" variante="secundario" onClick={() => navigate('/demo-landing')}>
              Cómo se vería tu restaurante
            </Boton>
          </div>

          {/* Estadísticas en fila */}
          <div className="hero-estadisticas">
            <div className="hero-estadistica">
              <div className="hero-estadistica-numero">500+</div>
              <div className="hero-estadistica-texto">Restaurantes</div>
            </div>
            <div className="hero-estadistica">
              <div className="hero-estadistica-numero">50K+</div>
              <div className="hero-estadistica-texto">Reservas/mes</div>
            </div>
            <div className="hero-estadistica">
              <div className="hero-estadistica-numero">98%</div>
              <div className="hero-estadistica-texto">Satisfacción</div>
            </div>
          </div>
        </div>

        {/* ====== COLUMNA DERECHA: Imagen ====== */}
        <div className="hero-imagen">
          {/* Imagen del restaurante (placeholder si no existe) */}
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop"
            alt="Restaurante moderno"
          />

          {/* Tarjeta flotante: mensaje promocional */}
          <div className="hero-tarjeta-flotante">
            <p className="hero-tarjeta-mensaje">Mejora tu resturante con <span className="hero-bookit">Bookit</span> y resive mas clientes</p>
          </div>
        </div>
      </div>

      {/* Modal Demo Interactiva */}
      <DemoReserva visible={mostrarDemo} onCerrar={() => setMostrarDemo(false)} demoOnly={true} />
    </section>
  );
};

export default SeccionHero;
