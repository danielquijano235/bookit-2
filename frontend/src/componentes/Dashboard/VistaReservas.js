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

import React, { useState, useEffect } from "react";
import Boton from "../Compartidos/Boton";
import ConfirmDialog from "../Compartidos/ConfirmDialog";
import {
  obtenerTodasReservas,
  actualizarReserva,
  eliminarReserva,
  obtenerTodosClientes,
  crearReserva,
} from "../../servicios/api";
import ModalNuevaReserva from "./ModalNuevaReserva";
import { useNotificaciones } from "../../contextos/NotificacionesContext";

// Datos de ejemplo cuando el backend no responde
const reservasEjemplo = [
  {
    id: 1,
    cliente_nombre: "Carlos Rodríguez",
    cliente_telefono: "3001234567",
    cliente_email: "carlos@email.com",
    numero_personas: 4,
    fecha: "2026-02-08",
    hora: "19:00:00",
    estado: "confirmada",
    mesa_numero: 5,
    notas_especiales: "Cumpleaños",
  },
  {
    id: 2,
    cliente_nombre: "María González",
    cliente_telefono: "3009876543",
    cliente_email: "maria@email.com",
    numero_personas: 2,
    fecha: "2026-02-08",
    hora: "19:30:00",
    estado: "pendiente",
    mesa_numero: 3,
    notas_especiales: "",
  },
  {
    id: 3,
    cliente_nombre: "Ana López",
    cliente_telefono: "3005551234",
    cliente_email: "ana@email.com",
    numero_personas: 6,
    fecha: "2026-02-08",
    hora: "20:00:00",
    estado: "confirmada",
    mesa_numero: 8,
    notas_especiales: "Alergia al maní",
  },
  {
    id: 4,
    cliente_nombre: "Juan Pérez",
    cliente_telefono: "3007778899",
    cliente_email: "juan@email.com",
    numero_personas: 3,
    fecha: "2026-02-09",
    hora: "20:30:00",
    estado: "pendiente",
    mesa_numero: null,
    notas_especiales: "",
  },
  {
    id: 5,
    cliente_nombre: "Laura Martínez",
    cliente_telefono: "3002223344",
    cliente_email: "laura@email.com",
    numero_personas: 5,
    fecha: "2026-02-09",
    hora: "21:00:00",
    estado: "confirmada",
    mesa_numero: 12,
    notas_especiales: "Silla para bebé",
  },
  {
    id: 6,
    cliente_nombre: "Pedro Sánchez",
    cliente_telefono: "3006667788",
    cliente_email: "pedro@email.com",
    numero_personas: 2,
    fecha: "2026-02-10",
    hora: "13:00:00",
    estado: "cancelada",
    mesa_numero: 2,
    notas_especiales: "",
  },
  {
    id: 7,
    cliente_nombre: "Sofía Ramírez",
    cliente_telefono: "3004445566",
    cliente_email: "sofia@email.com",
    numero_personas: 8,
    fecha: "2026-02-10",
    hora: "20:00:00",
    estado: "confirmada",
    mesa_numero: 15,
    notas_especiales: "Reunión de negocios",
  },
  {
    id: 8,
    cliente_nombre: "Diego Torres",
    cliente_telefono: "3008889900",
    cliente_email: "diego@email.com",
    numero_personas: 4,
    fecha: "2026-02-11",
    hora: "19:00:00",
    estado: "pendiente",
    mesa_numero: 6,
    notas_especiales: "",
  },
];

const coloresAvatar = [
  "#4A90E2",
  "#8B5CF6",
  "#10B981",
  "#FDB022",
  "#EC4899",
  "#F97316",
];

const VistaReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState("todas");
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [reservaDetalle, setReservaDetalle] = useState(null);
  const [modalModo, setModalModo] = useState("crear"); // 'crear' | 'editar'
  const { agregarNotificacion } = useNotificaciones();

  useEffect(() => {
    cargarReservas();
    // Nota: no cargamos todos los clientes por defecto aquí para evitar
    // descargar/mostrar la lista completa cuando sólo se editan reservas.
    // Los clientes se cargarán cuando el usuario abra el modal en modo creación.
  }, []);

  const cargarReservas = async () => {
    setCargando(true);
    try {
      const datos = await obtenerTodasReservas();
<<<<<<< HEAD
      // Mezcla de reservas: combinamos las reservas recibidas desde el backend
      // con las reservas demo que se guardaron localmente (flujo sin sesión).
      // Esto permite que las reservas hechas en modo demo se vean en el dashboard
      // en la misma máquina/navegador aunque no lleguen al backend.
      const demo = JSON.parse(localStorage.getItem("demo_reservas") || "[]");
      // `datos` normalmente es un array desde el backend; colocamos primero las demo
      // locales para que se vean inmediatamente en la tabla.
      const todos = demo.concat(Array.isArray(datos) ? datos : []);
      setReservas(todos);
    } catch (error) {
      console.error("Error al cargar reservas:", error);
      // On error, still include demo reservations if any
      const demo = JSON.parse(localStorage.getItem("demo_reservas") || "[]");
      setReservas(demo.length ? demo : reservasEjemplo);
=======
      // Usar únicamente los datos recibidos desde el backend.
      const todos = Array.isArray(datos) ? datos : [];
      setReservas(todos);
    } catch (error) {
      console.error("Error al cargar reservas:", error);
      // On error, mostrar datos de ejemplo
      setReservas(reservasEjemplo);
>>>>>>> 10e3833a0541c0c9ce822a93bcabfc03f2e9caa2
    } finally {
      setCargando(false);
    }
  };

  const cargarClientes = async () => {
    try {
      const datos = await obtenerTodosClientes();
      setClientes(datos);
    } catch (error) {
      console.error("Error al cargar clientes:", error);
    }
  };

  // Abrir modal de creación asegurando que los clientes estén cargados
  const abrirModalCrear = async () => {
    try {
      if (!clientes || clientes.length === 0) {
        await cargarClientes();
      }
    } catch (error) {
      console.error(
        "No se pudieron cargar los clientes antes de crear:",
        error,
      );
    }
    setReservaDetalle(null);
    setModalModo("crear");
    setModalVisible(true);
  };

  const manejarCambiarEstado = async (id, nuevoEstado) => {
    const reserva = reservas.find((r) => r.id === id);
    const nombre =
      reserva?.cliente_nombre || reserva?.cliente || "Reserva #" + id;
    const estadoTexto = {
      confirmada: "confirmada",
      cancelada: "cancelada",
      pendiente: "marcada como pendiente",
      completada: "completada",
    };
    try {
      await actualizarReserva(id, nuevoEstado);
      agregarNotificacion(
        "reserva",
        `Reserva ${estadoTexto[nuevoEstado] || nuevoEstado}`,
        `La reserva de ${nombre} ha sido ${estadoTexto[nuevoEstado] || nuevoEstado}`,
      );
      cargarReservas();
    } catch (error) {
      setReservas((prev) =>
        prev.map((r) => (r.id === id ? { ...r, estado: nuevoEstado } : r)),
      );
      agregarNotificacion(
        "reserva",
        `Reserva ${estadoTexto[nuevoEstado] || nuevoEstado}`,
        `La reserva de ${nombre} ha sido ${estadoTexto[nuevoEstado] || nuevoEstado}`,
      );
    }
  };

  // ConfirmDialog para eliminar reserva
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmPayload, setConfirmPayload] = useState(null);

  const manejarEliminar = (id) => {
    const reserva = reservas.find((r) => r.id === id);
    const nombre =
      reserva?.cliente_nombre || reserva?.cliente || "Reserva #" + id;
    setConfirmPayload({ id, nombre });
    setConfirmOpen(true);
  };

  const ejecutarEliminar = async () => {
    if (!confirmPayload) return;
    const { id, nombre } = confirmPayload;
    try {
      await eliminarReserva(id);
      agregarNotificacion(
        "reserva",
        "Reserva eliminada",
        `La reserva de ${nombre} ha sido eliminada del sistema`,
      );
      cargarReservas();
    } catch (error) {
      setReservas((prev) => prev.filter((r) => r.id !== id));
      agregarNotificacion(
        "reserva",
        "Reserva eliminada",
        `La reserva de ${nombre} ha sido eliminada del sistema`,
      );
    }
    setConfirmOpen(false);
    setConfirmPayload(null);
  };

  const manejarCrearReserva = async (datosReserva) => {
    await crearReserva(datosReserva);
    agregarNotificacion(
      "reserva",
      "Nueva reserva creada",
      `Reserva para ${datosReserva.numero_personas} personas el ${datosReserva.fecha} a las ${datosReserva.hora}`,
    );
    cargarReservas();
  };

  const manejarActualizar = async (id, datosReserva) => {
    try {
      await actualizarReserva(id, datosReserva);
      agregarNotificacion(
        "reserva",
        "Reserva actualizada",
        `Reserva actualizada correctamente`,
      );
      cargarReservas();
    } catch (error) {
      // Intentar fallback local
      setReservas((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...datosReserva } : r)),
      );
      agregarNotificacion(
        "reserva",
        "Reserva actualizada",
        `Reserva actualizada correctamente`,
      );
    }
  };

  // Filtrar reservas
  const reservasFiltradas = reservas.filter((r) => {
    const coincideEstado =
      filtroEstado === "todas" || r.estado === filtroEstado;
    const coincideBusqueda =
      !busqueda ||
      (r.cliente_nombre || r.cliente || "")
        .toLowerCase()
        .includes(busqueda.toLowerCase()) ||
      (r.cliente_telefono || "").includes(busqueda) ||
      (r.fecha || "").includes(busqueda);
    return coincideEstado && coincideBusqueda;
  });

  // Contar por estado
  const contarEstado = (estado) => {
    if (estado === "todas") return reservas.length;
    return reservas.filter((r) => r.estado === estado).length;
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "";
    const d = new Date(fecha + "T00:00:00");
    return d.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatearHora = (hora) => {
    if (!hora) return "";
    return hora.substring(0, 5);
  };

  const formatearTelefono = (tel) => {
    if (!tel) return "";
    const raw = String(tel).trim();
    if (raw.startsWith("+")) return raw; // ya tiene prefijo
    // Extraer solo dígitos
    const digits = raw.replace(/\D/g, "");
    if (!digits) return raw;
    // Si ya incluye código de país '57' al inicio, anteponer '+'
    if (digits.startsWith("57")) return `+${digits}`;
    // Si parece número móvil local (10 dígitos que empiezan por 3) o al menos 7 dígitos, añadir +57
    if (digits.length >= 7) return `+57 ${digits}`;
    return raw;
  };

  const obtenerInicial = (nombre) => {
    return nombre ? nombre[0].toUpperCase() : "?";
  };

  const estadoTexto = {
    confirmada: "Confirmada",
    pendiente: "Pendiente",
    cancelada: "Cancelada",
    completada: "Completada",
  };

  return (
    <div className="vista-reservas">
      {/* Header */}
      <div className="vista-reservas-header">
        <div>
          <h1 className="dashboard-titulo">Reservas</h1>
          <p className="dashboard-fecha">{reservas.length} reservas en total</p>
        </div>
        <Boton
          variante="primario"
          className="btn-nueva-reserva"
          onClick={abrirModalCrear}
        >
          + Nueva Reserva
        </Boton>
      </div>

      {/* Filtros por estado */}
      <div className="reservas-filtros">
        {[
          { clave: "todas", label: "Todas" },
          { clave: "pendiente", label: "Pendientes" },
          { clave: "confirmada", label: "Confirmadas" },
          { clave: "cancelada", label: "Canceladas" },
        ].map((filtro) => (
          <Boton
            key={filtro.clave}
            variante={filtroEstado === filtro.clave ? "primario" : "secundario"}
            className={`filtro-btn ${filtroEstado === filtro.clave ? "filtro-activo" : ""}`}
            onClick={() => setFiltroEstado(filtro.clave)}
          >
            {filtro.label}
            <span className="filtro-count">{contarEstado(filtro.clave)}</span>
          </Boton>
        ))}
      </div>

      {/* Barra de búsqueda */}
      <div className="reservas-busqueda">
        <span className="reservas-busqueda-icono">
          <svg
            width="18"
            height="18"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="9" cy="9" r="7" stroke="#FDB022" strokeWidth="2" />
            <line
              x1="14.4142"
              y1="14"
              x2="18"
              y2="17.5858"
              stroke="#FDB022"
              strokeWidth="2"
              strokeLinecap="round"
            />
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
          <div
            className="reservas-vacio"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 140,
            }}
          >
            <img
              src="https://img.icons8.com/ios-filled/48/1a1a2e/calendar--v1.png"
              alt="sin reservas"
              width="48"
              height="48"
              style={{ display: "block", margin: "0 auto 12px" }}
            />
            <p style={{ textAlign: "center", marginTop: 12 }}>
              No se encontraron reservas
            </p>
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
                        style={{
                          backgroundColor:
                            coloresAvatar[indice % coloresAvatar.length],
                        }}
                      >
                        {obtenerInicial(
                          reserva.cliente_nombre || reserva.cliente,
                        )}
                      </div>
                      <div className="tabla-cliente-info">
                        <span className="tabla-cliente-nombre">
                          {reserva.cliente_nombre || reserva.cliente}
                        </span>
                        <span className="tabla-cliente-tel">
                          {formatearTelefono(reserva.cliente_telefono) || ""}
                        </span>
                        {reserva.cliente_email ? (
                          <span className="tabla-cliente-email">
                            {reserva.cliente_email}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td className="tabla-fecha">
                    {formatearFecha(reserva.fecha)}
                  </td>
                  <td className="tabla-hora">{formatearHora(reserva.hora)}</td>
                  <td className="tabla-personas">
                    <span className="personas-badge">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="14"
                        height="14"
                        aria-hidden="true"
                        focusable="false"
                        className="icon-personas"
                        role="img"
                        aria-label="Personas"
                      >
                        <path
                          fill="currentColor"
                          d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-4 0-8 2-8 4v2h16v-2c0-2-4-4-8-4z"
                        />
                      </svg>
                      {reserva.numero_personas}
                    </span>
                  </td>
                  <td className="tabla-mesa">
                    {reserva.mesa_numero ? `Mesa ${reserva.mesa_numero}` : "—"}
                  </td>
                  <td>
                    <span className={`reserva-estado estado-${reserva.estado}`}>
                      {estadoTexto[reserva.estado] || reserva.estado}
                    </span>
                  </td>
                  <td className="tabla-notas">
                    {reserva.notas_especiales ? (
                      <span
                        className="notas-badge"
                        title={reserva.notas_especiales}
                      >
                        <img
                          src="https://img.icons8.com/ios-filled/14/1a1a2e/note.png"
                          alt="nota"
                          width="14"
                          height="14"
                          style={{ verticalAlign: "middle", marginRight: 6 }}
                        />
                        {reserva.notas_especiales.substring(0, 20)}
                        {reserva.notas_especiales.length > 20 ? "..." : ""}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>
                    <div className="tabla-acciones">
                      {/* Mostrar siempre el botón Confirmar pero deshabilitado cuando ya está confirmada o cancelada */}
                      <Boton
                        variante="ghost"
                        className={`accion-btn accion-confirmar ${
                          reserva.estado === "confirmada" ||
                          reserva.estado === "cancelada"
                            ? "accion-confirmar--disabled"
                            : "accion-confirmar--activo"
                        }`}
                        onClick={() => {
                          if (
                            reserva.estado !== "confirmada" &&
                            reserva.estado !== "cancelada"
                          )
                            manejarCambiarEstado(reserva.id, "confirmada");
                        }}
                        title="Confirmar reserva"
                        aria-label="Confirmar reserva"
                        disabled={
                          reserva.estado === "confirmada" ||
                          reserva.estado === "cancelada"
                        }
                        style={{
                          padding: "0",
                          width: "36px",
                          height: "36px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background:
                            reserva.estado !== "confirmada" &&
                            reserva.estado !== "cancelada"
                              ? "#10B981"
                              : "transparent",
                          borderRadius: "8px",
                          boxShadow:
                            reserva.estado !== "confirmada" &&
                            reserva.estado !== "cancelada"
                              ? "0 6px 12px rgba(16,185,129,0.18)"
                              : "none",
                        }}
                      >
                        <img
                          src={
                            reserva.estado !== "confirmada" &&
                            reserva.estado !== "cancelada"
                              ? "https://img.icons8.com/?size=100&id=11658&format=png&color=10B981"
                              : "https://img.icons8.com/ios-filled/20/10B981/checkmark.png"
                          }
                          alt="confirmar"
                          width={
                            reserva.estado !== "confirmada" &&
                            reserva.estado !== "cancelada"
                              ? 28
                              : 20
                          }
                          height={
                            reserva.estado !== "confirmada" &&
                            reserva.estado !== "cancelada"
                              ? 28
                              : 20
                          }
                          style={{ display: "block" }}
                        />
                      </Boton>
                      <Boton
                        variante="ghost"
                        className="accion-btn accion-editar"
                        onClick={() => {
                          setReservaDetalle(reserva);
                          setModalModo("editar");
                          setModalVisible(true);
                        }}
                        title="Editar"
                        aria-label="Editar reserva"
                        style={{
                          padding: "0",
                          width: "36px",
                          height: "36px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <img
                          src="https://img.icons8.com/ios-filled/20/4A90E2/edit.png"
                          alt="editar"
                          width="20"
                          height="20"
                          style={{ display: "block" }}
                        />
                      </Boton>
                      <Boton
                        variante="peligro"
                        className="accion-btn accion-eliminar"
                        onClick={() => manejarEliminar(reserva.id)}
                        title="Eliminar"
                        aria-label="Eliminar reserva"
                        style={{
                          padding: "0",
                          width: "36px",
                          height: "36px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <img
                          src="https://img.icons8.com/ios-filled/20/EF4444/trash.png"
                          alt="eliminar"
                          width="20"
                          height="20"
                          style={{ display: "block" }}
                        />
                      </Boton>
                      <Boton
                        variante="ghost"
                        className={`accion-btn accion-cancelar ${
                          reserva.estado === "cancelada"
                            ? "accion-cancelar--disabled"
                            : "accion-cancelar--activo"
                        }`}
                        onClick={() => {
                          if (reserva.estado !== "cancelada")
                            manejarCambiarEstado(reserva.id, "cancelada");
                        }}
                        title="Cancelar reserva"
                        aria-label="Cancelar reserva"
                        disabled={reserva.estado === "cancelada"}
                        style={{
                          padding: "0",
                          width: "36px",
                          height: "36px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background:
                            reserva.estado !== "cancelada"
                              ? "#fa314a"
                              : "transparent",
                          borderRadius: "8px",
                          boxShadow:
                            reserva.estado !== "cancelada"
                              ? "0 6px 12px rgba(250,49,74,0.18)"
                              : "none",
                        }}
                      >
                        <img
                          src={
                            reserva.estado !== "cancelada"
                              ? "https://img.icons8.com/ios-filled/24/fa314a/delete-sign.png"
                              : "https://img.icons8.com/ios-filled/20/fa314a/delete-sign.png"
                          }
                          alt="cancelar"
                          width={reserva.estado !== "cancelada" ? 24 : 20}
                          height={reserva.estado !== "cancelada" ? 24 : 20}
                          style={{ display: "block" }}
                        />
                      </Boton>
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
          <span>{contarEstado("pendiente")} pendientes</span>
        </div>
        <div className="resumen-item">
          <span className="resumen-dot resumen-confirmada"></span>
          <span>{contarEstado("confirmada")} confirmadas</span>
        </div>
        <div className="resumen-item">
          <span className="resumen-dot resumen-cancelada"></span>
          <span>{contarEstado("cancelada")} canceladas</span>
        </div>
      </div>

      {/* Modal para nueva reserva */}
      <ModalNuevaReserva
        visible={modalVisible}
        onCerrar={() => setModalVisible(false)}
        onCrear={manejarCrearReserva}
        onActualizar={manejarActualizar}
        reserva={reservaDetalle}
        modo={modalModo}
        clientes={modalModo === "crear" ? clientes : []} // evitar pasar lista completa cuando editando
        mesas={[]}
      />

      {/* ConfirmDialog para eliminar reserva */}
      <ConfirmDialog
        abierto={confirmOpen}
        titulo={confirmPayload ? `Eliminar reserva` : "Eliminar"}
        mensaje={
          confirmPayload
            ? `¿Estás seguro de eliminar la reserva de "${confirmPayload.nombre}"? Esta acción no se puede deshacer.`
            : "¿Estás seguro?"
        }
        onConfirm={ejecutarEliminar}
        onCancel={() => {
          setConfirmOpen(false);
          setConfirmPayload(null);
        }}
      />
    </div>
  );
};

export default VistaReservas;
