/**
 * ============================================
 * BOOKIT - Componente VistaMesas
 * Archivo: componentes/Dashboard/VistaMesas.js
 * ============================================
 * 
 * Propósito: Módulo de gestión de mesas del restaurante.
 * Muestra las mesas como tarjetas visuales en grid,
 * permite agregar nuevas mesas, cambiar su estado
 * y filtrar/buscar.
 * 
 * Estados:
 *   - mesas: Array de mesas del restaurante
 *   - filtroEstado: Filtro por estado (todas, disponible, ocupada, reservada)
 *   - busqueda: Texto de búsqueda
 *   - modalAgregar: Controla visibilidad del modal para agregar mesa
 *   - modalEstado: Controla visibilidad del modal para cambiar estado
 *   - mesaSeleccionada: Mesa seleccionada para cambiar estado
 *   - formulario: Datos del formulario de nueva mesa
 */

import React, { useState } from 'react';
import { useNotificaciones } from '../../contextos/NotificacionesContext';

// Datos de ejemplo
const mesasIniciales = [
  { id: 1, numero: 1, capacidad: 2, ubicacion: 'Interior', estado: 'disponible' },
  { id: 2, numero: 2, capacidad: 2, ubicacion: 'Interior', estado: 'ocupada' },
  { id: 3, numero: 3, capacidad: 4, ubicacion: 'Interior', estado: 'disponible' },
  { id: 4, numero: 4, capacidad: 4, ubicacion: 'Ventana', estado: 'reservada' },
  { id: 5, numero: 5, capacidad: 4, ubicacion: 'Ventana', estado: 'ocupada' },
  { id: 6, numero: 6, capacidad: 6, ubicacion: 'Interior', estado: 'disponible' },
  { id: 7, numero: 7, capacidad: 6, ubicacion: 'Terraza', estado: 'disponible' },
  { id: 8, numero: 8, capacidad: 8, ubicacion: 'Terraza', estado: 'reservada' },
  { id: 9, numero: 9, capacidad: 2, ubicacion: 'Barra', estado: 'ocupada' },
  { id: 10, numero: 10, capacidad: 4, ubicacion: 'Terraza', estado: 'disponible' },
  { id: 11, numero: 11, capacidad: 10, ubicacion: 'Privado', estado: 'reservada' },
  { id: 12, numero: 12, capacidad: 8, ubicacion: 'Privado', estado: 'disponible' },
];

// Configuración de colores e iconos por estado
const configEstado = {
  disponible: {
    color: '#10B981',
    fondo: 'rgba(16, 185, 129, 0.10)',
    icono: 'https://img.icons8.com/ios-filled/20/10B981/checkmark--v1.png',
    texto: 'Disponible',
  },
  ocupada: {
    color: '#EF4444',
    fondo: 'rgba(239, 68, 68, 0.10)',
    icono: 'https://img.icons8.com/ios-filled/20/EF4444/close-window.png',
    texto: 'Ocupada',
  },
  reservada: {
    color: '#F59E0B',
    fondo: 'rgba(245, 158, 11, 0.10)',
    icono: 'https://img.icons8.com/ios-filled/20/F59E0B/clock--v1.png',
    texto: 'Reservada',
  },
};

// Iconos de ubicación
const iconoUbicacion = {
  Interior: 'https://img.icons8.com/ios-filled/16/999999/home.png',
  Ventana: 'https://img.icons8.com/ios-filled/16/999999/sun--v1.png',
  Terraza: 'https://img.icons8.com/ios-filled/16/999999/outdoor-swimming-pool.png',
  Barra: 'https://img.icons8.com/ios-filled/16/999999/bar-table.png',
  Privado: 'https://img.icons8.com/ios-filled/16/999999/lock--v1.png',
};

const VistaMesas = () => {
  const [mesas, setMesas] = useState(mesasIniciales);
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  const [modalAgregar, setModalAgregar] = useState(false);
  const [modalEstado, setModalEstado] = useState(false);
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
  const [formulario, setFormulario] = useState({
    numero: '',
    capacidad: '2',
    ubicacion: 'Interior',
  });

  const { agregarNotificacion } = useNotificaciones();

  // Filtrar mesas
  const mesasFiltradas = mesas.filter(m => {
    const coincideEstado = filtroEstado === 'todas' || m.estado === filtroEstado;
    const coincideBusqueda = !busqueda ||
      m.ubicacion.toLowerCase().includes(busqueda.toLowerCase()) ||
      m.numero.toString().includes(busqueda);
    return coincideEstado && coincideBusqueda;
  });

  // Contadores
  const totalDisponibles = mesas.filter(m => m.estado === 'disponible').length;
  const totalOcupadas = mesas.filter(m => m.estado === 'ocupada').length;
  const totalReservadas = mesas.filter(m => m.estado === 'reservada').length;

  // Agregar nueva mesa
  const manejarAgregarMesa = (e) => {
    e.preventDefault();
    if (!formulario.numero) {
      alert('El número de mesa es obligatorio');
      return;
    }
    // Verificar que no exista una mesa con ese número
    if (mesas.some(m => m.numero === parseInt(formulario.numero))) {
      alert('Ya existe una mesa con ese número');
      return;
    }
    const nuevaMesa = {
      id: Date.now(),
      numero: parseInt(formulario.numero),
      capacidad: parseInt(formulario.capacidad),
      ubicacion: formulario.ubicacion,
      estado: 'disponible',
    };
    setMesas(prev => [...prev, nuevaMesa].sort((a, b) => a.numero - b.numero));
    agregarNotificacion('sistema', 'Nueva mesa agregada', `Mesa #${nuevaMesa.numero} (${nuevaMesa.capacidad} personas) en ${nuevaMesa.ubicacion}`);
    setFormulario({ numero: '', capacidad: '2', ubicacion: 'Interior' });
    setModalAgregar(false);
  };

  // Cambiar estado de una mesa
  const manejarCambiarEstado = (nuevoEstado) => {
    if (!mesaSeleccionada) return;
    setMesas(prev =>
      prev.map(m => m.id === mesaSeleccionada.id ? { ...m, estado: nuevoEstado } : m)
    );
    agregarNotificacion(
      'sistema',
      `Mesa #${mesaSeleccionada.numero} actualizada`,
      `Estado cambiado a ${configEstado[nuevoEstado].texto.toLowerCase()}`
    );
    setModalEstado(false);
    setMesaSeleccionada(null);
  };

  // Eliminar mesa
  const manejarEliminarMesa = (id) => {
    const mesa = mesas.find(m => m.id === id);
    if (!window.confirm(`¿Estás seguro de eliminar la Mesa #${mesa.numero}?`)) return;
    setMesas(prev => prev.filter(m => m.id !== id));
    agregarNotificacion('sistema', 'Mesa eliminada', `Mesa #${mesa.numero} ha sido eliminada del sistema`);
  };

  return (
    <div className="vista-modulo">
      {/* ====== HEADER ====== */}
      <div className="modulo-header">
        <div>
          <h1 className="modulo-titulo">Gestión de Mesas</h1>
          <p className="modulo-subtitulo">{mesas.length} mesas en total · {totalDisponibles} disponibles ahora</p>
        </div>
        <button className="mesas-btn-agregar" onClick={() => setModalAgregar(true)}>
          <img src="https://img.icons8.com/ios-filled/18/1a1a2e/plus-math.png" alt="+" width="18" height="18" />
          Nueva Mesa
        </button>
      </div>

      {/* ====== TARJETAS RESUMEN ====== */}
      <div className="mesas-resumen">
        <div
          className={`mesa-resumen-tarjeta ${filtroEstado === 'disponible' ? 'mesa-resumen-activa' : ''}`}
          onClick={() => setFiltroEstado(filtroEstado === 'disponible' ? 'todas' : 'disponible')}
          style={{ cursor: 'pointer' }}
        >
          <div className="mesa-resumen-icono" style={{ background: 'rgba(16, 185, 129, 0.12)' }}>
            <img src="https://img.icons8.com/ios-filled/22/10B981/checkmark--v1.png" alt="" width="22" height="22" />
          </div>
          <div className="mesa-resumen-info">
            <span className="mesa-resumen-numero" style={{ color: '#10B981' }}>{totalDisponibles}</span>
            <span className="mesa-resumen-texto">Disponibles</span>
          </div>
        </div>
        <div
          className={`mesa-resumen-tarjeta ${filtroEstado === 'ocupada' ? 'mesa-resumen-activa' : ''}`}
          onClick={() => setFiltroEstado(filtroEstado === 'ocupada' ? 'todas' : 'ocupada')}
          style={{ cursor: 'pointer' }}
        >
          <div className="mesa-resumen-icono" style={{ background: 'rgba(239, 68, 68, 0.12)' }}>
            <img src="https://img.icons8.com/ios-filled/22/EF4444/close-window.png" alt="" width="22" height="22" />
          </div>
          <div className="mesa-resumen-info">
            <span className="mesa-resumen-numero" style={{ color: '#EF4444' }}>{totalOcupadas}</span>
            <span className="mesa-resumen-texto">Ocupadas</span>
          </div>
        </div>
        <div
          className={`mesa-resumen-tarjeta ${filtroEstado === 'reservada' ? 'mesa-resumen-activa' : ''}`}
          onClick={() => setFiltroEstado(filtroEstado === 'reservada' ? 'todas' : 'reservada')}
          style={{ cursor: 'pointer' }}
        >
          <div className="mesa-resumen-icono" style={{ background: 'rgba(245, 158, 11, 0.12)' }}>
            <img src="https://img.icons8.com/ios-filled/22/F59E0B/clock--v1.png" alt="" width="22" height="22" />
          </div>
          <div className="mesa-resumen-info">
            <span className="mesa-resumen-numero" style={{ color: '#F59E0B' }}>{totalReservadas}</span>
            <span className="mesa-resumen-texto">Reservadas</span>
          </div>
        </div>
      </div>

      {/* ====== BÚSQUEDA ====== */}
      <div className="mesas-barra-busqueda">
        <div className="mesas-busqueda-input">
          <span className="mesas-busqueda-icono">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="9" cy="9" r="7" stroke="#FDB022" strokeWidth="2" />
              <line x1="14.4142" y1="14" x2="18" y2="17.5858" stroke="#FDB022" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Buscar por número o ubicación..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="mesas-filtros-rapidos">
          {['todas', 'disponible', 'ocupada', 'reservada'].map(estado => (
            <button
              key={estado}
              className={`mesas-filtro-btn ${filtroEstado === estado ? 'activo' : ''}`}
              onClick={() => setFiltroEstado(estado)}
            >
              {estado === 'todas' ? 'Todas' : configEstado[estado].texto + 's'}
              <span className="mesas-filtro-count">
                {estado === 'todas' ? mesas.length : mesas.filter(m => m.estado === estado).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ====== GRID DE MESAS (TARJETAS) ====== */}
      <div className="mesas-grid">
        {mesasFiltradas.map(mesa => (
          <div className={`mesa-tarjeta mesa-tarjeta-${mesa.estado}`} key={mesa.id}>
            {/* Header de la tarjeta */}
            <div className="mesa-tarjeta-header">
              <div className="mesa-tarjeta-numero" style={{ background: configEstado[mesa.estado].fondo, color: configEstado[mesa.estado].color }}>
                {mesa.numero}
              </div>
              <div className="mesa-tarjeta-badge" style={{ background: configEstado[mesa.estado].fondo, color: configEstado[mesa.estado].color }}>
                <img src={configEstado[mesa.estado].icono} alt="" width="12" height="12" />
                {configEstado[mesa.estado].texto}
              </div>
            </div>

            {/* Info de la mesa */}
            <div className="mesa-tarjeta-info">
              <h3>Mesa {mesa.numero}</h3>
              <div className="mesa-tarjeta-detalles">
                <div className="mesa-tarjeta-detalle">
                  <img src="https://img.icons8.com/ios-filled/14/999999/conference-call.png" alt="" width="14" height="14" />
                  <span>{mesa.capacidad} personas</span>
                </div>
                <div className="mesa-tarjeta-detalle">
                  <img src={iconoUbicacion[mesa.ubicacion] || iconoUbicacion['Interior']} alt="" width="14" height="14" />
                  <span>{mesa.ubicacion}</span>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="mesa-tarjeta-acciones">
              <button
                className="mesa-btn-estado"
                onClick={() => { setMesaSeleccionada(mesa); setModalEstado(true); }}
                title="Cambiar estado"
              >
                <img src="https://img.icons8.com/ios-filled/16/4A90E2/swap.png" alt="" width="16" height="16" />
                Cambiar estado
              </button>
              <button
                className="mesa-btn-eliminar"
                onClick={() => manejarEliminarMesa(mesa.id)}
                title="Eliminar mesa"
              >
                <img src="https://img.icons8.com/ios-filled/16/EF4444/trash--v1.png" alt="" width="16" height="16" />
              </button>
            </div>
          </div>
        ))}

        {/* Tarjeta para agregar nueva mesa */}
        <div className="mesa-tarjeta mesa-tarjeta-agregar" onClick={() => setModalAgregar(true)}>
          <div className="mesa-agregar-contenido">
            <div className="mesa-agregar-icono">
              <img src="https://img.icons8.com/ios-filled/28/cccccc/plus-math.png" alt="+" width="28" height="28" />
            </div>
            <span>Agregar mesa</span>
          </div>
        </div>
      </div>

      {mesasFiltradas.length === 0 && (
        <div className="mesas-vacio">
          <img src="https://img.icons8.com/ios-filled/48/cccccc/restaurant-table.png" alt="" width="48" height="48" />
          <p>No se encontraron mesas con los filtros aplicados</p>
        </div>
      )}

      {/* ====== MODAL: AGREGAR MESA ====== */}
      {modalAgregar && (
        <div className="modal-overlay" onClick={() => setModalAgregar(false)}>
          <div className="modal mesas-modal" onClick={e => e.stopPropagation()}>
            <div className="mesas-modal-header">
              <h2>Agregar Nueva Mesa</h2>
              <button className="mesas-modal-cerrar" onClick={() => setModalAgregar(false)}>
                <img src="https://img.icons8.com/ios-filled/20/999999/delete-sign.png" alt="cerrar" width="20" height="20" />
              </button>
            </div>

            <form className="mesas-modal-form" onSubmit={manejarAgregarMesa}>
              <div className="mesas-modal-campo">
                <label>Número de mesa *</label>
                <input
                  type="number"
                  min="1"
                  placeholder="Ej: 13"
                  value={formulario.numero}
                  onChange={(e) => setFormulario(prev => ({ ...prev, numero: e.target.value }))}
                  required
                  autoFocus
                />
              </div>

              <div className="mesas-modal-fila">
                <div className="mesas-modal-campo">
                  <label>Capacidad (personas) *</label>
                  <select
                    value={formulario.capacidad}
                    onChange={(e) => setFormulario(prev => ({ ...prev, capacidad: e.target.value }))}
                  >
                    {[2, 4, 6, 8, 10, 12].map(n => (
                      <option key={n} value={n}>{n} personas</option>
                    ))}
                  </select>
                </div>
                <div className="mesas-modal-campo">
                  <label>Ubicación *</label>
                  <select
                    value={formulario.ubicacion}
                    onChange={(e) => setFormulario(prev => ({ ...prev, ubicacion: e.target.value }))}
                  >
                    {['Interior', 'Ventana', 'Terraza', 'Barra', 'Privado'].map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mesas-modal-acciones">
                <button type="button" className="mesas-modal-btn-cancelar" onClick={() => setModalAgregar(false)}>
                  Cancelar
                </button>
                <button type="submit" className="mesas-modal-btn-guardar">
                  <img src="https://img.icons8.com/ios-filled/16/1a1a2e/plus-math.png" alt="" width="16" height="16" />
                  Agregar Mesa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====== MODAL: CAMBIAR ESTADO ====== */}
      {modalEstado && mesaSeleccionada && (
        <div className="modal-overlay" onClick={() => { setModalEstado(false); setMesaSeleccionada(null); }}>
          <div className="modal mesas-modal mesas-modal-estado" onClick={e => e.stopPropagation()}>
            <div className="mesas-modal-header">
              <h2>Cambiar Estado — Mesa #{mesaSeleccionada.numero}</h2>
              <button className="mesas-modal-cerrar" onClick={() => { setModalEstado(false); setMesaSeleccionada(null); }}>
                <img src="https://img.icons8.com/ios-filled/20/999999/delete-sign.png" alt="cerrar" width="20" height="20" />
              </button>
            </div>

            <p className="mesas-modal-estado-actual">
              Estado actual:
              <span style={{ color: configEstado[mesaSeleccionada.estado].color, fontWeight: 700, marginLeft: '8px' }}>
                {configEstado[mesaSeleccionada.estado].texto}
              </span>
            </p>

            <div className="mesas-estado-opciones">
              {Object.entries(configEstado).map(([estado, config]) => (
                <button
                  key={estado}
                  className={`mesas-estado-opcion ${mesaSeleccionada.estado === estado ? 'actual' : ''}`}
                  onClick={() => manejarCambiarEstado(estado)}
                  disabled={mesaSeleccionada.estado === estado}
                  style={{
                    '--estado-color': config.color,
                    '--estado-fondo': config.fondo,
                  }}
                >
                  <div className="mesas-estado-opcion-icono" style={{ background: config.fondo }}>
                    <img src={config.icono} alt="" width="24" height="24" />
                  </div>
                  <span className="mesas-estado-opcion-texto">{config.texto}</span>
                  {mesaSeleccionada.estado === estado && (
                    <span className="mesas-estado-opcion-badge">Actual</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VistaMesas;
