/**
 * ============================================
 * BOOKIT - Componente VistaResenas
 * Archivo: componentes/Dashboard/VistaResenas.js
 * ============================================
 * 
 * Propósito: Módulo de gestión de reseñas del restaurante.
 * Muestra las reseñas de clientes con calificación,
 * comentarios y fecha.
 */

import React, { useState } from 'react';

const coloresAvatar = ['#4A90E2', '#8B5CF6', '#10B981', '#FDB022', '#EC4899', '#F97316'];

// Datos de ejemplo estáticos
const resenasEjemplo = [
  { id: 1, cliente: 'Carlos Rodríguez', calificacion: 5, comentario: 'Excelente atención y comida espectacular. El sistema de reservas fue muy fácil de usar, llegamos y nuestra mesa estaba lista. Volveremos sin duda.', fecha: '2026-02-08' },
  { id: 2, cliente: 'María González', calificacion: 4, comentario: 'Muy buena experiencia en general. La comida deliciosa y el ambiente agradable. Solo tardaron un poco en traer los platos.', fecha: '2026-02-07' },
  { id: 3, cliente: 'Ana López', calificacion: 5, comentario: 'Celebramos un cumpleaños y todo salió perfecto. El personal fue muy amable y la decoración de la mesa fue un detalle hermoso.', fecha: '2026-02-06' },
  { id: 4, cliente: 'Juan Pérez', calificacion: 3, comentario: 'La comida estaba bien pero esperábamos más variedad en el menú. El servicio fue correcto aunque un poco lento en hora punta.', fecha: '2026-02-05' },
  { id: 5, cliente: 'Laura Martínez', calificacion: 5, comentario: 'Increíble experiencia. Pedimos el menú degustación y cada plato fue una sorpresa. El sommelier nos recomendó un vino perfecto.', fecha: '2026-02-04' },
  { id: 6, cliente: 'Pedro Sánchez', calificacion: 4, comentario: 'Buena relación calidad-precio. El postre de la casa es imperdible. Reservamos por la app y fue muy cómodo.', fecha: '2026-02-03' },
  { id: 7, cliente: 'Sofía Ramírez', calificacion: 5, comentario: 'Como cliente VIP, siempre recibo un trato excepcional. La mesa privada es perfecta para reuniones de negocios.', fecha: '2026-02-02' },
  { id: 8, cliente: 'Diego Torres', calificacion: 4, comentario: 'La terraza tiene una vista espectacular. La comida sin gluten que pedí estaba muy bien preparada y sabrosa.', fecha: '2026-02-01' },
];

const VistaResenas = () => {
  const [resenas] = useState(resenasEjemplo);
  const [filtroCalificacion, setFiltroCalificacion] = useState('todas');

  // Filtrar reseñas
  const resenasFiltradas = resenas.filter(r => {
    if (filtroCalificacion === 'todas') return true;
    return r.calificacion === parseInt(filtroCalificacion);
  });

  // Calcular promedio
  const promedio = (resenas.reduce((sum, r) => sum + r.calificacion, 0) / resenas.length).toFixed(1);
  const total5 = resenas.filter(r => r.calificacion === 5).length;
  const total4 = resenas.filter(r => r.calificacion === 4).length;
  const total3 = resenas.filter(r => r.calificacion === 3).length;

  const renderEstrellas = (cantidad) => {
    return Array.from({ length: 5 }, (_, i) => (
      <img
        key={i}
        src={i < cantidad
          ? "https://img.icons8.com/ios-filled/16/FDB022/star--v1.png"
          : "https://img.icons8.com/ios-filled/16/CCCCCC/star--v1.png"
        }
        alt="★"
        width="16"
        height="16"
      />
    ));
  };

  const formatearFecha = (fecha) => {
    const d = new Date(fecha + 'T00:00:00');
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="vista-modulo">
      {/* Header */}
      <div className="modulo-header">
        <div>
          <h1 className="modulo-titulo">Reseñas de Clientes</h1>
          <p className="modulo-subtitulo">{resenas.length} reseñas en total</p>
        </div>
      </div>

      {/* Resumen */}
      <div className="resenas-resumen">
        <div className="resena-resumen-principal">
          <span className="resena-promedio-numero">{promedio}</span>
          <div className="resena-promedio-estrellas">{renderEstrellas(Math.round(promedio))}</div>
          <span className="resena-promedio-texto">{resenas.length} reseñas</span>
        </div>
        <div className="resena-resumen-barras">
          <div className="resena-barra-fila">
            <span>5 ★</span>
            <div className="resena-barra-fondo"><div className="resena-barra-llena" style={{ width: `${(total5 / resenas.length) * 100}%`, backgroundColor: '#10B981' }}></div></div>
            <span>{total5}</span>
          </div>
          <div className="resena-barra-fila">
            <span>4 ★</span>
            <div className="resena-barra-fondo"><div className="resena-barra-llena" style={{ width: `${(total4 / resenas.length) * 100}%`, backgroundColor: '#FDB022' }}></div></div>
            <span>{total4}</span>
          </div>
          <div className="resena-barra-fila">
            <span>3 ★</span>
            <div className="resena-barra-fondo"><div className="resena-barra-llena" style={{ width: `${(total3 / resenas.length) * 100}%`, backgroundColor: '#F97316' }}></div></div>
            <span>{total3}</span>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="modulo-filtros">
        <div className="filtros-estado">
          {['todas', '5', '4', '3'].map(f => (
            <button
              key={f}
              className={`filtro-btn ${filtroCalificacion === f ? 'activo' : ''}`}
              onClick={() => setFiltroCalificacion(f)}
            >
              {f === 'todas' ? 'Todas' : `${f} ★`}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de reseñas */}
      <div className="resenas-lista">
        {resenasFiltradas.map((resena, indice) => (
          <div className="resena-tarjeta" key={resena.id}>
            <div className="resena-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  className="resena-avatar"
                  style={{ backgroundColor: coloresAvatar[indice % coloresAvatar.length] }}
                >
                  {resena.cliente[0]}
                </div>
                <div>
                  <div className="resena-nombre">{resena.cliente}</div>
                  <div className="resena-fecha">{formatearFecha(resena.fecha)}</div>
                </div>
              </div>
              <div className="resena-estrellas">{renderEstrellas(resena.calificacion)}</div>
            </div>
            <p className="resena-comentario">"{resena.comentario}"</p>
          </div>
        ))}

        {resenasFiltradas.length === 0 && (
          <p style={{ textAlign: 'center', color: '#718096', padding: '40px' }}>
            No hay reseñas con esta calificación
          </p>
        )}
      </div>
    </div>
  );
};

export default VistaResenas;
