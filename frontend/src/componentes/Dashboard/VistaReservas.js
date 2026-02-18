/**
 * ============================================
 * BOOKIT - Componente VistaReservas
 * Archivo: componentes/Dashboard/VistaReservas.js
 * ============================================
 * 
 * Propósito: Módulo completo de gestión de reservas.
 * Muestra tabla con todas las reservas, filtros por estado,
 * búsqueda, y acciones (confirmar, cancelar, eliminar).
 */

import React, { useState, useEffect } from 'react';
import {
  obtenerTodasReservas,
  actualizarReserva,
  eliminarReserva,
  obtenerTodosClientes,
  crearReserva,
} from '../../servicios/api';
import ModalNuevaReserva from './ModalNuevaReserva';
import { useNotificaciones } from '../../contextos/NotificacionesContext';

// Datos de ejemplo cuando el backend no responde
const reservasEjemplo = [
  { id: 1, cliente_nombre: 'Carlos Rodríguez', cliente_telefono: '3001234567', cliente_email: 'carlos@email.com', numero_personas: 4, fecha: '2026-02-08', hora: '19:00:00', estado: 'confirmada', mesa_numero: 5, notas_especiales: 'Cumpleaños' },
  { id: 2, cliente_nombre: 'María González', cliente_telefono: '3009876543', cliente_email: 'maria@email.com', numero_personas: 2, fecha: '2026-02-08', hora: '19:30:00', estado: 'pendiente', mesa_numero: 3, notas_especiales: '' },
  { id: 3, cliente_nombre: 'Ana López', cliente_telefono: '3005551234', cliente_email: 'ana@email.com', numero_personas: 6, fecha: '2026-02-08', hora: '20:00:00', estado: 'confirmada', mesa_numero: 8, notas_especiales: 'Alergia al maní' },
  { id: 4, cliente_nombre: 'Juan Pérez', cliente_telefono: '3007778899', cliente_email: 'juan@email.com', numero_personas: 3, fecha: '2026-02-09', hora: '20:30:00', estado: 'pendiente', mesa_numero: null, notas_especiales: '' },
  { id: 5, cliente_nombre: 'Laura Martínez', cliente_telefono: '3002223344', cliente_email: 'laura@email.com', numero_personas: 5, fecha: '2026-02-09', hora: '21:00:00', estado: 'confirmada', mesa_numero: 12, notas_especiales: 'Silla para bebé' },
  { id: 6, cliente_nombre: 'Pedro Sánchez', cliente_telefono: '3006667788', cliente_email: 'pedro@email.com', numero_personas: 2, fecha: '2026-02-10', hora: '13:00:00', estado: 'cancelada', mesa_numero: 2, notas_especiales: '' },
  { id: 7, cliente_nombre: 'Sofía Ramírez', cliente_telefono: '3004445566', cliente_email: 'sofia@email.com', numero_personas: 8, fecha: '2026-02-10', hora: '20:00:00', estado: 'confirmada', mesa_numero: 15, notas_especiales: 'Reunión de negocios' },
  { id: 8, cliente_nombre: 'Diego Torres', cliente_telefono: '3008889900', cliente_email: 'diego@email.com', numero_personas: 4, fecha: '2026-02-11', hora: '19:00:00', estado: 'pendiente', mesa_numero: 6, notas_especiales: '' },
];

const coloresAvatar = ['#4A90E2', '#8B5CF6', '#10B981', '#FDB022', '#EC4899', '#F97316'];

const VistaReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [reservaDetalle, setReservaDetalle] = useState(null);
  const { agregarNotificacion } = useNotificaciones();

  useEffect(() => {
    cargarReservas();
    cargarClientes();
  }, []);

  const cargarReservas = async () => {
    setCargando(true);
    try {
      const datos = await obtenerTodasReservas();
      setReservas(datos);
    } catch (error) {
      console.error('Error al cargar reservas:', error);
      setReservas(reservasEjemplo);
    } finally {
      setCargando(false);
    }
  };

  const cargarClientes = async () => {
    try {
      const datos = await obtenerTodosClientes();
      setClientes(datos);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
    }
  };

  const manejarCambiarEstado = async (id, nuevoEstado) => {
    const reserva = reservas.find(r => r.id === id);
    const nombre = reserva?.cliente_nombre || reserva?.cliente || 'Reserva #' + id;
    const estadoTexto = { confirmada: 'confirmada', cancelada: 'cancelada', pendiente: 'marcada como pendiente', completada: 'completada' };
    try {
      await actualizarReserva(id, nuevoEstado);
      agregarNotificacion('reserva', `Reserva ${estadoTexto[nuevoEstado] || nuevoEstado}`, `La reserva de ${nombre} ha sido ${estadoTexto[nuevoEstado] || nuevoEstado}`);
      cargarReservas();
    } catch (error) {
      setReservas(prev => prev.map(r => r.id === id ? { ...r, estado: nuevoEstado } : r));
      agregarNotificacion('reserva', `Reserva ${estadoTexto[nuevoEstado] || nuevoEstado}`, `La reserva de ${nombre} ha sido ${estadoTexto[nuevoEstado] || nuevoEstado}`);
    }
  };

  const manejarEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta reserva?')) return;
    const reserva = reservas.find(r => r.id === id);
    const nombre = reserva?.cliente_nombre || reserva?.cliente || 'Reserva #' + id;
    try {
      await eliminarReserva(id);
      agregarNotificacion('reserva', 'Reserva eliminada', `La reserva de ${nombre} ha sido eliminada del sistema`);
      cargarReservas();
    } catch (error) {
      setReservas(prev => prev.filter(r => r.id !== id));
      agregarNotificacion('reserva', 'Reserva eliminada', `La reserva de ${nombre} ha sido eliminada del sistema`);
    }
  };

  const manejarCrearReserva = async (datosReserva) => {
    await crearReserva(datosReserva);
    agregarNotificacion('reserva', 'Nueva reserva creada', `Reserva para ${datosReserva.numero_personas} personas el ${datosReserva.fecha} a las ${datosReserva.hora}`);
    cargarReservas();
  };

  // Filtrar reservas
  const reservasFiltradas = reservas.filter(r => {
    const coincideEstado = filtroEstado === 'todas' || r.estado === filtroEstado;
    const coincideBusqueda = !busqueda || 
      (r.cliente_nombre || r.cliente || '').toLowerCase().includes(busqueda.toLowerCase()) ||
      (r.cliente_telefono || '').includes(busqueda) ||
      (r.fecha || '').includes(busqueda);
    return coincideEstado && coincideBusqueda;
  });

  // Contar por estado
  const contarEstado = (estado) => {
    if (estado === 'todas') return reservas.length;
    return reservas.filter(r => r.estado === estado).length;
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    const d = new Date(fecha + 'T00:00:00');
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatearHora = (hora) => {
    if (!hora) return '';
    return hora.substring(0, 5);
  };

  const obtenerInicial = (nombre) => {
    return nombre ? nombre[0].toUpperCase() : '?';
  };

  const estadoTexto = {
    confirmada: 'Confirmada',
    pendiente: 'Pendiente',
    cancelada: 'Cancelada',
    completada: 'Completada',
  };

  return (
    <div className="vista-reservas">
      {/* Header */}
      <div className="vista-reservas-header">
        <div>
          <h1 className="dashboard-titulo">Reservas</h1>
          <p className="dashboard-fecha">{reservas.length} reservas en total</p>
        </div>
        <button className="btn-nueva-reserva" onClick={() => setModalVisible(true)}>
          + Nueva Reserva
        </button>
      </div>

      {/* Filtros por estado */}
      <div className="reservas-filtros">
        {[
          { clave: 'todas', label: 'Todas' },
          { clave: 'pendiente', label: 'Pendientes' },
          { clave: 'confirmada', label: 'Confirmadas' },
          { clave: 'cancelada', label: 'Canceladas' },
        ].map(filtro => (
          <button
            key={filtro.clave}
            className={`filtro-btn ${filtroEstado === filtro.clave ? 'filtro-activo' : ''}`}
            onClick={() => setFiltroEstado(filtro.clave)}
          >
            {filtro.label}
            <span className="filtro-count">{contarEstado(filtro.clave)}</span>
          </button>
        ))}
      </div>

      {/* Barra de búsqueda */}
      <div className="reservas-busqueda">
        <span className="reservas-busqueda-icono">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="9" cy="9" r="7" stroke="#FDB022" strokeWidth="2" />
            <line x1="14.4142" y1="14" x2="18" y2="17.5858" stroke="#FDB022" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Buscar por nombre, teléfono o fecha..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* Tabla de reservas */}
      <div className="reservas-tabla-contenedor">
        {cargando ? (
          <div className="reservas-cargando">
            <p>Cargando reservas...</p>
          </div>
        ) : reservasFiltradas.length === 0 ? (
          <div className="reservas-vacio">
            <p>📅 No se encontraron reservas</p>
          </div>
        ) : (
          <table className="reservas-tabla">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Personas</th>
                <th>Mesa</th>
                <th>Estado</th>
                <th>Notas</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservasFiltradas.map((reserva, indice) => (
                <tr key={reserva.id || indice} className="reservas-tabla-fila">
                  <td>
                    <div className="tabla-cliente">
                      <div
                        className="tabla-avatar"
                        style={{ backgroundColor: coloresAvatar[indice % coloresAvatar.length] }}
                      >
                        {obtenerInicial(reserva.cliente_nombre || reserva.cliente)}
                      </div>
                      <div className="tabla-cliente-info">
                        <span className="tabla-cliente-nombre">{reserva.cliente_nombre || reserva.cliente}</span>
                        <span className="tabla-cliente-tel">{reserva.cliente_telefono || ''}</span>
                      </div>
                    </div>
                  </td>
                  <td className="tabla-fecha">{formatearFecha(reserva.fecha)}</td>
                  <td className="tabla-hora">{formatearHora(reserva.hora)}</td>
                  <td className="tabla-personas">
                    <span className="personas-badge">👥 {reserva.numero_personas}</span>
                  </td>
                  <td className="tabla-mesa">
                    {reserva.mesa_numero ? `Mesa ${reserva.mesa_numero}` : '—'}
                  </td>
                  <td>
                    <span className={`reserva-estado estado-${reserva.estado}`}>
                      {estadoTexto[reserva.estado] || reserva.estado}
                    </span>
                  </td>
                  <td className="tabla-notas">
                    {reserva.notas_especiales ? (
                      <span className="notas-badge" title={reserva.notas_especiales}>
                        📝 {reserva.notas_especiales.substring(0, 20)}{reserva.notas_especiales.length > 20 ? '...' : ''}
                      </span>
                    ) : '—'}
                  </td>
                  <td>
                    <div className="tabla-acciones">
                      {reserva.estado === 'pendiente' && (
                        <button
                          className="accion-btn accion-confirmar"
                          onClick={() => manejarCambiarEstado(reserva.id, 'confirmada')}
                          title="Confirmar"
                        >
                          ✓
                        </button>
                      )}
                      {reserva.estado !== 'cancelada' && (
                        <button
                          className="accion-btn accion-cancelar"
                          onClick={() => manejarCambiarEstado(reserva.id, 'cancelada')}
                          title="Cancelar"
                        >
                          ✕
                        </button>
                      )}
                      <button
                        className="accion-btn accion-eliminar"
                        onClick={() => manejarEliminar(reserva.id)}
                        title="Eliminar"
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Resumen inferior */}
      <div className="reservas-resumen">
        <div className="resumen-item">
          <span className="resumen-dot resumen-pendiente"></span>
          <span>{contarEstado('pendiente')} pendientes</span>
        </div>
        <div className="resumen-item">
          <span className="resumen-dot resumen-confirmada"></span>
          <span>{contarEstado('confirmada')} confirmadas</span>
        </div>
        <div className="resumen-item">
          <span className="resumen-dot resumen-cancelada"></span>
          <span>{contarEstado('cancelada')} canceladas</span>
        </div>
      </div>

      {/* Modal para nueva reserva */}
      <ModalNuevaReserva
        visible={modalVisible}
        onCerrar={() => setModalVisible(false)}
        onCrear={manejarCrearReserva}
        clientes={clientes}
        mesas={[]}
      />
    </div>
  );
};

export default VistaReservas;
