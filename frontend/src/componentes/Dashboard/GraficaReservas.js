/**
 * ============================================
 * BOOKIT - Componente GraficaReservas
 * Archivo: componentes/Dashboard/GraficaReservas.js
 * ============================================
 * 
 * Propósito: Gráfica de barras que muestra las reservas
 * de la última semana usando Chart.js.
 * 
 * Props:
 *   - datos: Objeto con días y cantidades { "Lun": 45, "Mar": 52, ... }
 * 
 * Usa la librería Chart.js a través del wrapper react-chartjs-2
 */

import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registrar los componentes que necesita Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GraficaReservas = ({ datos }) => {
  // Extraer los nombres de los días y sus valores
  const etiquetas = Object.keys(datos);    // ["Lun", "Mar", ...]
  const valores = Object.values(datos);     // [45, 52, ...]

  // Configuración de los datos para la gráfica
  const datosGrafica = {
    labels: etiquetas,
    datasets: [
      {
        label: 'Reservas',
        data: valores,
        // Degradado de color: amarillo claro arriba, amarillo oscuro abajo
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return '#FDB022';
          
          // Crear degradado vertical
          const degradado = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          degradado.addColorStop(0, '#FDB022');    // Base: amarillo oscuro
          degradado.addColorStop(1, '#FFD580');    // Tope: amarillo claro
          return degradado;
        },
        borderRadius: {
          topLeft: 8,       // Bordes redondeados arriba
          topRight: 8,
          bottomLeft: 0,
          bottomRight: 0,
        },
        borderSkipped: false,
        barThickness: 40,
        hoverBackgroundColor: '#E9A020',  // Color al pasar el mouse
      },
    ],
  };

  // Opciones de configuración de la gráfica
  const opciones = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,  // No mostrar leyenda
      },
      tooltip: {
        backgroundColor: '#1e3a5f',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          // Personalizar el texto del tooltip
          label: (contexto) => `${contexto.parsed.y} reservas`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,   // No mostrar líneas verticales
        },
        ticks: {
          color: '#718096',
          font: {
            family: 'Inter',
            size: 13,
            weight: '500',
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',  // Líneas horizontales suaves
        },
        ticks: {
          color: '#718096',
          font: {
            family: 'Inter',
            size: 12,
          },
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="grafica-tarjeta">
      {/* Header de la gráfica */}
      <div className="grafica-header">
        <h3 className="grafica-titulo">Reservas de la Semana</h3>
        <span className="grafica-periodo">Últimos 7 días</span>
      </div>

      {/* Contenedor de la gráfica */}
      <div className="grafica-contenedor">
        <Bar data={datosGrafica} options={opciones} />
      </div>
    </div>
  );
};

export default GraficaReservas;
