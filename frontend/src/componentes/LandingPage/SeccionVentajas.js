/**
 * ============================================
 * BOOKIT - Componente SeccionVentajas
 * Archivo: componentes/LandingPage/SeccionVentajas.js
 * ============================================
 * 
 * Propósito: Muestra las 6 ventajas principales de BookIt
 * en un grid de 3 columnas x 2 filas.
 * 
 * Cada ventaja tiene un icono con color de fondo,
 * un título y una descripción.
 */

import React from 'react';

// Array con los datos de las 6 ventajas
// Cada una tiene una clase CSS única para asignar su background-image
const ventajas = [
  {
    clase: 'ventaja-optimizacion',
    imagen: '/assets/images/optimizacion.jpg',
    titulo: 'Optimización del Tiempo',
    texto: 'Automatiza reservas, pedidos e inventario, reduciendo tareas manuales y liberando tiempo para enfocarte en el servicio al cliente.',
  },
  {
    clase: 'ventaja-control',
    imagen: '/assets/images/control.jpg',
    titulo: 'Control y Organización',
    texto: 'Centraliza la información del restaurante en un solo lugar, evitando errores y mejorando la toma de decisiones con datos claros.',
  },
  {
    clase: 'ventaja-experiencia',
    imagen: '/assets/images/experiencia.jpg',
    titulo: 'Experiencia del Cliente',
    texto: 'Facilita la gestión de pedidos y reservas, ofreciendo rapidez y precisión que se traducen en mayor satisfacción y fidelización.',
  },
  {
    clase: 'ventaja-ingresos',
    imagen: '/assets/images/ingresos.jpg',
    titulo: 'Incrementa tus Ingresos',
    texto: 'Reduce las mesas vacías y maximiza tu capacidad con un sistema inteligente de gestión de reservas que optimiza cada turno.',
  },
  {
    clase: 'ventaja-seguridad',
    imagen: '/assets/images/seguridad.jpg',
    titulo: 'Seguridad Garantizada',
    texto: 'Protege los datos de tus clientes con encriptación de nivel empresarial y cumple con todas las normativas de protección de datos.',
  },
  {
    clase: 'ventaja-implementacion',
    imagen: '/assets/images/implementacion.jpg',
    titulo: 'Implementación Rápida',
    texto: 'Comienza a usar BookIt en menos de 24 horas. Sin instalaciones complicadas ni largos periodos de capacitación.',
  },
];

const SeccionVentajas = () => {
  return (
    <section className="ventajas" id="ventajas">
      {/* Header de la sección */}
      <div className="seccion-header">
        <span className="seccion-badge">VENTAJAS</span>
        <h2 className="seccion-titulo">¿Por qué elegir BookIt?</h2>
        <p className="seccion-subtitulo">
          Descubre cómo BookIt transforma la manera en que gestionas tu restaurante
        </p>
      </div>

      {/* Grid de tarjetas de ventajas */}
      <div className="ventajas-grid">
        {ventajas.map((ventaja, indice) => (
          <div
            className={`ventaja-tarjeta ${ventaja.clase}`}
            key={indice}
          >
            <div
              className="ventaja-imagen"
              style={{ backgroundImage: `url(${process.env.PUBLIC_URL}${ventaja.imagen})` }}
            ></div>
            <div className="ventaja-overlay"></div>
            <div className="ventaja-contenido">
              <h3 className="ventaja-titulo">{ventaja.titulo}</h3>
              <p className="ventaja-texto">{ventaja.texto}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SeccionVentajas;
