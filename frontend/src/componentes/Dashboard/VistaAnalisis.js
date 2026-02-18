/**
 * ============================================
 * BOOKIT - Vista de Análisis
 * Archivo: componentes/Dashboard/VistaAnalisis.js
 * ============================================
 *
 * Propósito: Vista detallada de análisis y estadísticas del restaurante,
 * incluyendo métricas avanzadas, gráficos históricos y tendencias.
 *
 * Props:
 *   - metricas: Datos de métricas actuales
 *   - datosGrafica: Datos para gráficos
 */

import React, { useState, useEffect } from 'react';
import TarjetaMetrica from './TarjetaMetrica';
import GraficaReservas from './GraficaReservas';

const VistaAnalisis = ({ metricas, datosGrafica }) => {
  // ============================================
  // DATOS MOCK PARA DEMOSTRACIÓN
  // ============================================
  const metricasAnalisis = {
    reservas_mes: 245,
    ingresos_mes: 18500,
    clientes_recurrentes: 67,
    promedio_reservas_dia: 8.2,
    tasa_cancelacion: 3.2,
    ocupacion_promedio: 78.5,
  };

  const datosGraficaMensual = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [{
      label: 'Reservas Mensuales',
      data: [180, 220, 195, 240, 265, 245],
      backgroundColor: '#4A90E2',
      borderColor: '#4A90E2',
      borderWidth: 1,
    }],
  };

  const datosIngresos = {
    labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
    datasets: [{
      label: 'Ingresos por Semana',
      data: [4200, 4800, 5100, 4400],
      backgroundColor: '#10B981',
      borderColor: '#10B981',
      borderWidth: 1,
    }],
  };

  // ============================================
  // FUNCIONES AUXILIARES
  // ============================================
  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(valor);
  };

  const obtenerFechaFormateada = () => {
    return new Date().toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="vista-analisis">
      {/* Título */}
      <h1 className="dashboard-titulo">Análisis Detallado</h1>
      <p className="dashboard-fecha">{obtenerFechaFormateada()}</p>

      {/* ====== MÉTRICAS AVANZADAS ====== */}
      <div className="metricas-grid">
        <TarjetaMetrica
          titulo="Reservas del Mes"
          numero={metricasAnalisis.reservas_mes}
          badge="↑ +15% vs mes anterior"
          icono="https://img.icons8.com/ios-filled/20/FFFFFF/calendar--v1.png"
          colorFondo="#4A90E2"
        />
        <TarjetaMetrica
          titulo="Ingresos del Mes"
          numero={formatearMoneda(metricasAnalisis.ingresos_mes)}
          badge="↑ +22% vs mes anterior"
          icono="https://img.icons8.com/ios-filled/20/FFFFFF/money.png"
          colorFondo="#FDB022"
        />
        <TarjetaMetrica
          titulo="Clientes Recurrentes"
          numero={`${metricasAnalisis.clientes_recurrentes}%`}
          subtexto="De clientes totales"
          badge="↑ +8%"
          icono="https://img.icons8.com/ios-filled/20/FFFFFF/conference-call.png"
          colorFondo="#8B5CF6"
        />
        <TarjetaMetrica
          titulo="Promedio Diario"
          numero={metricasAnalisis.promedio_reservas_dia}
          subtexto="Reservas por día"
          badge="↑ +5%"
          icono="https://img.icons8.com/ios-filled/20/FFFFFF/statistics.png"
          colorFondo="#10B981"
        />
        <TarjetaMetrica
          titulo="Tasa de Cancelación"
          numero={`${metricasAnalisis.tasa_cancelacion}%`}
          badge="↓ -2%"
          icono="https://img.icons8.com/ios-filled/20/FFFFFF/cancel.png"
          colorFondo="#EF4444"
        />
        <TarjetaMetrica
          titulo="Ocupación Promedio"
          numero={`${metricasAnalisis.ocupacion_promedio}%`}
          badge="↑ +12%"
          icono="https://img.icons8.com/ios-filled/20/FFFFFF/chair.png"
          colorFondo="#06B6D4"
        />
      </div>

      {/* ====== GRÁFICOS DETALLADOS ====== */}
      <div className="analisis-grid">
        {/* Gráfico de reservas mensuales */}
        <div className="grafico-container">
          <h3>Evolución de Reservas (Últimos 6 Meses)</h3>
          <GraficaReservas datos={datosGraficaMensual} />
        </div>

        {/* Gráfico de ingresos semanales */}
        <div className="grafico-container">
          <h3>Ingresos por Semana (Mes Actual)</h3>
          <GraficaReservas datos={datosIngresos} />
        </div>
      </div>

      {/* ====== ANÁLISIS DE TENDENCIAS ====== */}
      <div className="tendencias-section">
        <h3>Análisis de Tendencias</h3>
        <div className="tendencias-grid">
          <div className="tendencia-card">
            <h4><img src="https://img.icons8.com/ios-filled/20/1e3a5f/growth.png" alt="" style={{width:'20px', height:'20px', marginRight:'8px'}} />Crecimiento Mensual</h4>
            <p>Las reservas han aumentado un 15% respecto al mes anterior, mostrando una tendencia positiva constante.</p>
          </div>
          <div className="tendencia-card">
            <h4><img src="https://img.icons8.com/ios-filled/20/1e3a5f/money.png" alt="" style={{width:'20px', height:'20px', marginRight:'8px'}} />Rentabilidad</h4>
            <p>Los ingresos mensuales superan las expectativas con un crecimiento del 22%, impulsado por clientes recurrentes.</p>
          </div>
          <div className="tendencia-card">
            <h4><img src="https://img.icons8.com/ios-filled/20/1e3a5f/conference-call.png" alt="" style={{width:'20px', height:'20px', marginRight:'8px'}} />Fidelización</h4>
            <p>El 67% de los clientes son recurrentes, lo que indica una alta satisfacción y lealtad a la marca.</p>
          </div>
          <div className="tendencia-card">
            <h4><img src="https://img.icons8.com/ios-filled/20/1e3a5f/statistics.png" alt="" style={{width:'20px', height:'20px', marginRight:'8px'}} />Eficiencia Operativa</h4>
            <p>La tasa de cancelación se mantiene baja (3.2%) y la ocupación promedio es del 78.5%, optimizando recursos.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VistaAnalisis;