import React, { useState } from 'react';
/**
 * ============================================
 * BOOKIT - Componente SeccionCaracteristicas
 * Archivo: componentes/LandingPage/SeccionCaracteristicas.js
 * ============================================
 * 
 * Propósito: Sección con sistema de pestañas (tabs) que muestra
 * las diferentes características de BookIt.
 * 
 * Estados:
 *   - tabActiva: Índice de la pestaña seleccionada (0 por defecto)
 */

const tabs = [
  {
    nombre: 'Gestión de Reservas',
    titulo: 'Gestión de Reservas',
    subtitulo: 'Sistema inteligente que gestiona todas tus reservas en tiempo real',
    items: [
      'Calendario visual intuitivo',
      'Gestión de disponibilidad en tiempo real',
      'Confirmaciones automáticas por email/SMS',
      'Historial completo de reservas',
    ],
  },
  {
    nombre: 'Base de Datos de Clientes',
    titulo: 'Base de Datos de Clientes',
    subtitulo: 'Conoce a tus clientes y personaliza su experiencia',
    items: [
      'Perfiles completos de cada cliente',
      'Historial de visitas y preferencias',
      'Segmentación inteligente de clientes',
      'Programa de fidelización integrado',
    ],
  },
  {
    nombre: 'Notificaciones Inteligentes',
    titulo: 'Notificaciones Inteligentes',
    subtitulo: 'Mantén a tus clientes informados automáticamente',
    items: [
      'Recordatorios automáticos de reserva',
      'Confirmaciones por email y SMS',
      'Alertas de capacidad del restaurante',
      'Notificaciones de cancelación instantáneas',
    ],
  },
  {
    nombre: 'Análisis y Reportes',
    titulo: 'Análisis y Reportes',
    subtitulo: 'Datos claros para tomar mejores decisiones',
    items: [
      'Dashboard con métricas en tiempo real',
      'Reportes de ocupación y tendencias',
      'Análisis de horas pico y demanda',
      'Exportación de datos a Excel/PDF',
    ],
  },
];

const SeccionCaracteristicas = () => {
  // Estado para controlar cuál pestaña está activa
  const [tabActiva, setTabActiva] = useState(0);

  return (
    <section className="caracteristicas" id="caracteristicas">
      {/* Header de la sección */}
      <div className="seccion-header">
        <span className="seccion-badge">CARACTERÍSTICAS</span>
        <h2 className="seccion-titulo">Todo lo que necesitas en un solo lugar</h2>
        <p className="seccion-subtitulo">
          Potentes herramientas diseñadas específicamente para restaurantes
        </p>
      </div>

      {/* Pestañas (tabs) */}
      <div className="caracteristicas-tabs">
        {tabs.map((tab, indice) => (
          <button
            key={indice}
            className={`tab-boton ${tabActiva === indice ? 'activo' : ''}`}
            onClick={() => setTabActiva(indice)}
          >
            {tab.nombre}
          </button>
        ))}
      </div>

      {/* Contenido de la pestaña activa */}
      <div className="caracteristicas-contenido">
        {/* Lado izquierdo: información */}
        <div className="caracteristicas-info">
          <h3>{tabs[tabActiva].titulo}</h3>
          <p>{tabs[tabActiva].subtitulo}</p>

          {/* Lista de items con checkmarks */}
          <div className="caracteristicas-lista">
            {tabs[tabActiva].items.map((item, indice) => (
              <div className="caracteristica-item" key={indice}>
                <span className="check-icono"><img src="https://img.icons8.com/ios-filled/16/10B981/checkmark--v1.png" alt="check" width="16" height="16" /></span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Lado derecho: imagen */}
        <div className="caracteristicas-imagen">
          <img
            src={tabs[tabActiva].imagen}
            alt={tabs[tabActiva].titulo}
          />
        </div>
      </div>
    </section>
  );
};

export default SeccionCaracteristicas;
