/**
 * ============================================
 * BOOKIT - Componente ModalNuevaReserva
 * Archivo: componentes/Dashboard/ModalNuevaReserva.js
 * ============================================
 *
 * Propósito: Modal (ventana emergente) con formulario
 * para crear una nueva reserva.
 *
 * Props:
 *   - visible: Boolean que controla si se muestra el modal
 *   - onCerrar: Función para cerrar el modal
 *   - onCrear: Función que recibe los datos de la nueva reserva
 *   - clientes: Array de clientes disponibles para seleccionar
 *   - mesas: Array de mesas disponibles
 *
 * Estados:
 *   - formulario: Objeto con todos los campos del formulario
 *   - cargando: Indica si se está procesando la creación
 */

import React, { useState, useEffect } from "react";
import Alerta from "../Compartidos/Alerta";
import Boton from "../Compartidos/Boton";

const ModalNuevaReserva = ({
  visible,
  onCerrar,
  onCrear,
  onActualizar,
  reserva = null,
  modo = "crear",
  clientes = [],
  mesas = [],
}) => {
  // Estado del formulario con todos los campos
  const [formulario, setFormulario] = useState({
    cliente_id: "",
    fecha: "",
    hora: "",
    numero_personas: "",
    mesa_id: "",
    notas_especiales: "",
  });
  const [cargando, setCargando] = useState(false);
  const [alerta, setAlerta] = useState({
    visible: false,
    tipo: "info",
    mensaje: "",
  });

  // Si recibimos una reserva en props, rellenar el formulario (modo edición)
  useEffect(() => {
    if (reserva) {
      setFormulario({
        cliente_id: reserva.cliente_id || reserva.cliente || "",
        fecha: reserva.fecha || "",
        hora: reserva.hora || "",
        numero_personas:
          reserva.numero_personas || reserva.numero_personas || "",
        mesa_id: reserva.mesa_id ?? "",
        notas_especiales: reserva.notas_especiales || "",
      });
    } else {
      setFormulario({
        cliente_id: "",
        fecha: "",
        hora: "",
        numero_personas: "",
        mesa_id: "",
        notas_especiales: "",
      });
    }
  }, [reserva, visible]);

  // Si el modal no debe mostrarse, no renderizar nada
  if (!visible) return null;

  /**
   * Manejar cambios en los campos del formulario
   * Actualiza el campo correspondiente en el estado
   */
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Manejar el envío del formulario
   */
  const manejarSubmit = async (e) => {
    e.preventDefault();

    // Validar campos obligatorios
    if (
      !formulario.cliente_id ||
      !formulario.fecha ||
      !formulario.hora ||
      !formulario.numero_personas
    ) {
      setAlerta({
        visible: true,
        tipo: "error",
        mensaje: "Por favor, completa todos los campos obligatorios.",
      });
      setTimeout(() => setAlerta({ ...alerta, visible: false }), 2200);
      return;
    }

    setCargando(true);
    try {
      const datosReserva = { ...formulario };
      if (datosReserva.mesa_id === "" || datosReserva.mesa_id === undefined) {
        datosReserva.mesa_id = null;
      }

      if (modo === "editar" && reserva && onActualizar) {
        await onActualizar(reserva.id, datosReserva);
      } else {
        await onCrear(datosReserva);
        setFormulario({
          cliente_id: "",
          fecha: "",
          hora: "",
          numero_personas: "",
          mesa_id: "",
          notas_especiales: "",
        });
      }
      onCerrar();
    } catch (error) {
      const msg = error?.message || String(error);
      setAlerta({
        visible: true,
        tipo: "error",
        mensaje:
          (reserva ? "Error al actualizar" : "Error al crear") +
          " la reserva: " +
          msg,
      });
      setTimeout(() => setAlerta({ ...alerta, visible: false }), 2200);
    } finally {
      setCargando(false);
    }
  };

  // Generar opciones de hora (de 12:00 a 23:00, cada 30 minutos)
  const opcionesHora = [];
  for (let h = 12; h <= 23; h++) {
    opcionesHora.push(`${h.toString().padStart(2, "0")}:00`);
    opcionesHora.push(`${h.toString().padStart(2, "0")}:30`);
  }

  return (
    // Overlay oscuro detrás del modal
    <div className="modal-overlay" onClick={onCerrar}>
      {/* Modal (stopPropagation evita que se cierre al hacer clic dentro) */}
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {alerta.visible && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 1000,
            }}
          >
            <Alerta
              tipo={alerta.tipo}
              mensaje={alerta.mensaje}
              visible={alerta.visible}
              onCerrar={() => setAlerta({ ...alerta, visible: false })}
            />
          </div>
        )}
        <h2 className="modal-titulo">
          {reserva ? "Editar Reserva" : "Nueva Reserva"}
        </h2>

        <form className="modal-formulario" onSubmit={manejarSubmit}>
          {/* Seleccionar cliente */}
          <div className="campo-grupo">
            <label className="campo-label">Cliente *</label>
            <select
              name="cliente_id"
              value={formulario.cliente_id}
              onChange={manejarCambio}
              required
            >
              <option value="">Seleccionar cliente...</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha y hora alineadas */}
          <div className="form-fecha-hora">
            <div className="campo-grupo">
              <label className="campo-label">Fecha *</label>
              <input
                type="date"
                name="fecha"
                className="campo-input"
                value={formulario.fecha}
                onChange={manejarCambio}
                min={new Date().toISOString().split("T")[0]} // No permitir fechas pasadas
                required
              />
            </div>
            <div className="campo-grupo">
              <label className="campo-label">Hora *</label>
              <select
                name="hora"
                value={formulario.hora}
                onChange={manejarCambio}
                required
              >
                <option value="">Seleccionar hora...</option>
                {opcionesHora.map((hora) => (
                  <option key={hora} value={hora}>
                    {hora}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Número de personas */}
          <div className="campo-grupo">
            <label className="campo-label">Número de Personas *</label>
            <input
              type="number"
              name="numero_personas"
              className="campo-input"
              placeholder="Ej: 4"
              value={formulario.numero_personas}
              onChange={manejarCambio}
              min="1"
              max="20"
              required
            />
          </div>

          {/* Seleccionar mesa (opcional) */}
          <div className="campo-grupo">
            <label className="campo-label">Mesa (opcional)</label>
            <select
              name="mesa_id"
              value={formulario.mesa_id}
              onChange={manejarCambio}
            >
              <option value="">Asignar automáticamente</option>
              {mesas.map((mesa) => (
                <option key={mesa.id} value={mesa.id}>
                  Mesa {mesa.numero} - {mesa.capacidad} personas (
                  {mesa.ubicacion})
                </option>
              ))}
            </select>
          </div>

          {/* Notas especiales */}
          <div className="campo-grupo">
            <label className="campo-label">Notas Especiales</label>
            <textarea
              name="notas_especiales"
              placeholder="Alergias, cumpleaños, silla para bebé..."
              value={formulario.notas_especiales}
              onChange={manejarCambio}
            />
          </div>

          {/* Botones de acción */}
          <div className="modal-botones">
            <Boton
              tipo="button"
              variante="secundario"
              className="btn-cancelar"
              onClick={onCerrar}
            >
              Cancelar
            </Boton>
            <Boton
              tipo="submit"
              variante="primario"
              className="btn-crear-reserva"
              disabled={cargando}
            >
              {cargando
                ? reserva
                  ? "Actualizando..."
                  : "Procesando..."
                : reserva
                  ? "Actualizar Reserva"
                  : "Crear Reserva"}
            </Boton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalNuevaReserva;
