

import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const GraficaMensual = ({ datos }) => {
  // Si no hay datos, usamos un fallback con meses y valores simulados
  const fallback = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    data: [120, 150, 135, 160, 180, 175, 190, 200, 185, 170, 165, 180],
  };

  // Extraemos etiquetas y valores de los datos recibidos o del fallback
  const { labels, data: valores } = datos && datos.labels && datos.data ? datos : fallback;

  // Configuración de datos para la gráfica de línea
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Reservas (12 meses)',
        data: valores,
        fill: true,
        backgroundColor: 'rgba(59,130,246,0.12)',
        borderColor: '#3b82f6',
        tension: 0.25,
        pointRadius: 4,
        pointBackgroundColor: '#3b82f6',
      },
    ],
  };

  // Opciones de la gráfica: sin leyenda, tooltips personalizados, colores
  const opciones = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#6b7280' } },
      y: { grid: { color: 'rgba(0,0,0,0.05)' }, beginAtZero: true, ticks: { color: '#6b7280' } },
    },
  };

  return (
    <div className="grafica-tarjeta">
      <div className="grafica-header">
        <h3 className="grafica-titulo">Últimos 12 meses</h3>
        <span className="grafica-periodo">Año móvil</span>
      </div>
      <div className="grafica-contenedor" style={{ height: 280 }}>
        <Line data={chartData} options={opciones} />
      </div>
    </div>
  );
};

export default GraficaMensual;
