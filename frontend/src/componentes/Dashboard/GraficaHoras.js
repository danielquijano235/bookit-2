/**
 * ============================================
 * BOOKIT - Componente GraficaHoras
 * Archivo: componentes/Dashboard/GraficaHoras.js
 * ============================================
 *
 * Propósito: Gráfica de barras que muestra las horas pico
 * (reservas por hora) usando Chart.js.
 */
import React, { useEffect, useState } from 'react';
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

// Registramos los componentes de Chart.js necesarios para la gráfica de barras
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GraficaHoras = ({ datos }) => {
  // Estado para guardar los datos internos de la gráfica
  const [datosInternos, setDatosInternos] = useState(datos);

  // Si cambian los datos recibidos por props, actualizamos el estado
  useEffect(() => {
    if (datos && Object.keys(datos).length) setDatosInternos(datos);
  }, [datos]);

  // Si no hay datos, usamos un mock de horas de 10:00 a 22:00
  const fuente = datosInternos || datos || {
    '10:00': 2,
    '11:00': 5,
    '12:00': 12,
    '13:00': 18,
    '14:00': 10,
    '15:00': 6,
    '16:00': 8,
    '17:00': 22,
    '18:00': 35,
    '19:00': 50,
    '20:00': 48,
    '21:00': 30,
    '22:00': 10,
  };

  // Extraemos las etiquetas (horas) y valores (cantidad de reservas)
  const etiquetas = Object.keys(fuente);
  const valores = Object.values(fuente);

  // Configuración de datos para la gráfica de barras
  const datosGrafica = {
    labels: etiquetas,
    datasets: [
      {
        label: 'Reservas por Hora',
        data: valores,
        backgroundColor: '#4A90E2',
        borderRadius: 6,
        barThickness: 'flex',
        maxBarThickness: 22,
      },
    ],
  };

  const opciones = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e3a5f',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 10,
        cornerRadius: 6,
        callbacks: {
          label: (ctx) => `${ctx.parsed.y} reservas`,
        },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#718096' } },
      y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#718096' }, beginAtZero: true },
    },
  };

  return (
    <div className="grafica-tarjeta">
      <div className="grafica-header">
        <h3 className="grafica-titulo">Horas Pico</h3>
        <span className="grafica-periodo">Último mes</span>
      </div>
      <div className="grafica-contenedor" style={{ height: '260px' }}>
        <Bar data={datosGrafica} options={opciones} />
      </div>
    </div>
  );
};

export default GraficaHoras;
