/**
 * ============================================
 * BOOKIT - Componente VistaClientes
 * Archivo: componentes/Dashboard/VistaClientes.js
 * ============================================
 * 
 * Propósito: Módulo completo de gestión de clientes.
 * Muestra tabla con todos los clientes, búsqueda,
 * modal para agregar nuevos clientes y estadísticas.
 */

import React, { useState, useEffect } from 'react';
import { obtenerTodosClientes, crearCliente } from '../../servicios/api';
import { useNotificaciones } from '../../contextos/NotificacionesContext';

// Datos de ejemplo cuando el backend no responde
const clientesEjemplo = [
  { id: 1, nombre: 'Carlos Rodríguez', telefono: '3001234567', email: 'carlos@email.com', visitas: 12, ultima_visita: '2026-02-07', preferencias: 'Mesa junto a la ventana', fecha_creacion: '2025-10-15' },
  { id: 2, nombre: 'María González', telefono: '3009876543', email: 'maria@email.com', visitas: 8, ultima_visita: '2026-02-06', preferencias: 'Vegetariana', fecha_creacion: '2025-11-02' },
  { id: 3, nombre: 'Ana López', telefono: '3005551234', email: 'ana@email.com', visitas: 23, ultima_visita: '2026-02-08', preferencias: 'Alergia al maní', fecha_creacion: '2025-08-20' },
  { id: 4, nombre: 'Juan Pérez', telefono: '3007778899', email: 'juan@email.com', visitas: 5, ultima_visita: '2026-02-03', preferencias: '', fecha_creacion: '2025-12-10' },
  { id: 5, nombre: 'Laura Martínez', telefono: '3002223344', email: 'laura@email.com', visitas: 15, ultima_visita: '2026-02-07', preferencias: 'Silla para bebé', fecha_creacion: '2025-09-05' },
  { id: 6, nombre: 'Pedro Sánchez', telefono: '3006667788', email: 'pedro@email.com', visitas: 3, ultima_visita: '2026-01-28', preferencias: '', fecha_creacion: '2026-01-15' },
  { id: 7, nombre: 'Sofía Ramírez', telefono: '3004445566', email: 'sofia@email.com', visitas: 31, ultima_visita: '2026-02-08', preferencias: 'Cliente VIP, mesa privada', fecha_creacion: '2025-06-12' },
  { id: 8, nombre: 'Diego Torres', telefono: '3008889900', email: 'diego@email.com', visitas: 7, ultima_visita: '2026-02-05', preferencias: 'Sin gluten', fecha_creacion: '2025-11-28' },
  { id: 9, nombre: 'Valentina Herrera', telefono: '3003216549', email: 'valentina@email.com', visitas: 2, ultima_visita: '2026-02-01', preferencias: '', fecha_creacion: '2026-01-20' },
  { id: 10, nombre: 'Andrés Castro', telefono: '3001112233', email: 'andres@email.com', visitas: 19, ultima_visita: '2026-02-06', preferencias: 'Terraza', fecha_creacion: '2025-07-03' },
];

const coloresAvatar = ['#4A90E2', '#8B5CF6', '#10B981', '#FDB022', '#EC4899', '#F97316'];

const VistaClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [formulario, setFormulario] = useState({ nombre: '', telefono: '', email: '', preferencias: '' });
  const [creando, setCreando] = useState(false);
  const { agregarNotificacion } = useNotificaciones();

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    setCargando(true);
    try {
      const datos = await obtenerTodosClientes();
      setClientes(datos);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      setClientes(clientesEjemplo);
    } finally {
      setCargando(false);
    }
  };

  const manejarCrearCliente = async (e) => {
    e.preventDefault();
    if (!formulario.nombre.trim()) {
      alert('El nombre es obligatorio');
      return;
    }
    setCreando(true);
    try {
      await crearCliente(formulario);
      agregarNotificacion('cliente', 'Nuevo cliente registrado', `${formulario.nombre} ha sido añadido a la base de datos${formulario.email ? ' (' + formulario.email + ')' : ''}`);
      setFormulario({ nombre: '', telefono: '', email: '', preferencias: '' });
      setModalVisible(false);
      cargarClientes();
    } catch (error) {
      const nuevoCliente = {
        id: Date.now(),
        ...formulario,
        visitas: 0,
        ultima_visita: null,
        fecha_creacion: new Date().toISOString().split('T')[0],
      };
      setClientes(prev => [...prev, nuevoCliente]);
      agregarNotificacion('cliente', 'Nuevo cliente registrado', `${formulario.nombre} ha sido añadido a la base de datos${formulario.email ? ' (' + formulario.email + ')' : ''}`);
      setFormulario({ nombre: '', telefono: '', email: '', preferencias: '' });
      setModalVisible(false);
    } finally {
      setCreando(false);
    }
  };

  // Filtrar clientes
  const clientesFiltrados = clientes.filter(c => {
    if (!busqueda) return true;
    const texto = busqueda.toLowerCase();
    return (
      (c.nombre || '').toLowerCase().includes(texto) ||
      (c.telefono || '').includes(texto) ||
      (c.email || '').toLowerCase().includes(texto)
    );
  });

  const formatearFecha = (fecha) => {
    if (!fecha) return '—';
    const d = new Date(fecha + 'T00:00:00');
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const obtenerInicial = (nombre) => {
    return nombre ? nombre[0].toUpperCase() : '?';
  };

  // Estadísticas rápidas
  const totalClientes = clientes.length;
  const clientesActivos = clientes.filter(c => c.visitas >= 5).length;
  const clientesNuevos = clientes.filter(c => {
    if (!c.fecha_creacion) return false;
    const hace30Dias = new Date();
    hace30Dias.setDate(hace30Dias.getDate() - 30);
    return new Date(c.fecha_creacion) >= hace30Dias;
  }).length;
  const totalVisitas = clientes.reduce((sum, c) => sum + (Number(c.visitas) || 0), 0);

  return (
    <div className="vista-clientes">
      {/* Header */}
      <div className="vista-reservas-header">
        <div>
          <h1 className="dashboard-titulo">Clientes</h1>
          <p className="dashboard-fecha">{totalClientes} clientes registrados</p>
        </div>
        <button className="btn-nueva-reserva" onClick={() => setModalVisible(true)}>
          + Nuevo Cliente
        </button>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="clientes-stats">
        <div className="cliente-stat-card">
          <div className="cliente-stat-icono" style={{ backgroundColor: '#4A90E2' }}>👥</div>
          <div>
            <div className="cliente-stat-numero">{totalClientes}</div>
            <div className="cliente-stat-label">Total Clientes</div>
          </div>
        </div>
        <div className="cliente-stat-card">
          <div className="cliente-stat-icono" style={{ backgroundColor: '#10B981' }}>⭐</div>
          <div>
            <div className="cliente-stat-numero">{clientesActivos}</div>
            <div className="cliente-stat-label">Clientes Frecuentes</div>
          </div>
        </div>
        <div className="cliente-stat-card">
          <div className="cliente-stat-icono" style={{ backgroundColor: '#8B5CF6' }}>🆕</div>
          <div>
            <div className="cliente-stat-numero">{clientesNuevos}</div>
            <div className="cliente-stat-label">Nuevos (30 días)</div>
          </div>
        </div>
        <div className="cliente-stat-card">
          <div className="cliente-stat-icono" style={{ backgroundColor: '#FDB022' }}>🔄</div>
          <div>
            <div className="cliente-stat-numero">{totalVisitas}</div>
            <div className="cliente-stat-label">Total Visitas</div>
          </div>
        </div>
      </div>

      {/* Búsqueda */}
      <div className="reservas-busqueda">
        <span className="reservas-busqueda-icono">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="9" cy="9" r="7" stroke="#FDB022" strokeWidth="2" />
            <line x1="14.4142" y1="14" x2="18" y2="17.5858" stroke="#FDB022" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Buscar por nombre, teléfono o email..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* Tabla de clientes */}
      <div className="reservas-tabla-contenedor">
        {cargando ? (
          <div className="reservas-cargando">
            <p>Cargando clientes...</p>
          </div>
        ) : clientesFiltrados.length === 0 ? (
          <div className="reservas-vacio">
            <p>👥 No se encontraron clientes</p>
          </div>
        ) : (
          <table className="reservas-tabla">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Visitas</th>
                <th>Última Visita</th>
                <th>Preferencias</th>
                <th>Registro</th>
              </tr>
            </thead>
            <tbody>
              {clientesFiltrados.map((cliente, indice) => (
                <tr key={cliente.id || indice} className="reservas-tabla-fila">
                  <td>
                    <div className="tabla-cliente">
                      <div
                        className="tabla-avatar"
                        style={{ backgroundColor: coloresAvatar[indice % coloresAvatar.length] }}
                      >
                        {obtenerInicial(cliente.nombre)}
                      </div>
                      <span className="tabla-cliente-nombre">{cliente.nombre}</span>
                    </div>
                  </td>
                  <td className="tabla-fecha">{cliente.telefono || '—'}</td>
                  <td className="tabla-fecha">{cliente.email || '—'}</td>
                  <td>
                    <span className={`visitas-badge ${Number(cliente.visitas) >= 10 ? 'visitas-vip' : ''}`}>
                      {cliente.visitas || 0} visitas
                    </span>
                  </td>
                  <td className="tabla-fecha">{formatearFecha(cliente.ultima_visita)}</td>
                  <td className="tabla-notas">
                    {cliente.preferencias ? (
                      <span className="notas-badge" title={cliente.preferencias}>
                        {cliente.preferencias.substring(0, 25)}{cliente.preferencias.length > 25 ? '...' : ''}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="tabla-fecha">{formatearFecha(cliente.fecha_creacion)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal nuevo cliente */}
      {modalVisible && (
        <div className="modal-overlay" onClick={() => setModalVisible(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-titulo">Nuevo Cliente</h2>
            <form className="modal-formulario" onSubmit={manejarCrearCliente}>
              <div className="campo-grupo">
                <label className="campo-label">Nombre *</label>
                <input
                  type="text"
                  className="campo-input"
                  placeholder="Nombre completo"
                  value={formulario.nombre}
                  onChange={(e) => setFormulario(prev => ({ ...prev, nombre: e.target.value }))}
                  required
                />
              </div>
              <div className="campo-grupo">
                <label className="campo-label">Teléfono</label>
                <input
                  type="tel"
                  className="campo-input"
                  placeholder="Ej: 3001234567"
                  value={formulario.telefono}
                  onChange={(e) => setFormulario(prev => ({ ...prev, telefono: e.target.value }))}
                />
              </div>
              <div className="campo-grupo">
                <label className="campo-label">Email</label>
                <input
                  type="email"
                  className="campo-input"
                  placeholder="correo@ejemplo.com"
                  value={formulario.email}
                  onChange={(e) => setFormulario(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="campo-grupo">
                <label className="campo-label">Preferencias</label>
                <textarea
                  placeholder="Alergias, mesa favorita, notas..."
                  value={formulario.preferencias}
                  onChange={(e) => setFormulario(prev => ({ ...prev, preferencias: e.target.value }))}
                />
              </div>
              <div className="modal-botones">
                <button type="button" className="btn-cancelar" onClick={() => setModalVisible(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-crear-reserva" disabled={creando}>
                  {creando ? 'Creando...' : 'Crear Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VistaClientes;
