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

const SeccionHero = () => {
  const navigate = useNavigate();
  const [mostrarDemo, setMostrarDemo] = useState(false);

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
            <button 
              className="btn-empezar"
              onClick={() => navigate('/login')}
            >
              Empezar Ahora →
            </button>
            <button className="btn-demo" onClick={() => setMostrarDemo(true)}>
              <img src="https://img.icons8.com/ios-filled/14/1e3a5f/play--v1.png" alt="play" width="14" height="14" style={{verticalAlign: 'middle', marginRight: '6px'}} />
              Ver Demo
            </button>
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

          {/* Tarjeta flotante con estadística */}
          <div className="hero-tarjeta-flotante">
            <div className="hero-tarjeta-info">
              <h4>Reservas hoy</h4>
              <span className="numero">127</span>
            </div>
            <span className="hero-tarjeta-badge">↑ +23%</span>
          </div>
        </div>
      </div>

      {/* Modal Demo Interactiva */}
      <DemoReserva visible={mostrarDemo} onCerrar={() => setMostrarDemo(false)} />
    </section>
  );
};

export default SeccionHero;
