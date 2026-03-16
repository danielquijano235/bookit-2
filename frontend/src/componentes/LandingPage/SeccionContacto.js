/**

 * Estados:
 *   - formulario: Objeto con los campos del formulario
 *   - enviando: Indica si se está procesando el envío
 *   - enviado: Controla el mensaje de éxito después de enviar
 */

import React, { useState } from "react";
import { enviarContacto } from "../../servicios/api";

// Datos de las tarjetas de información de contacto
// Cada tarjeta tiene icono, título y dos líneas de texto
const infoContacto = [
  {
    icono: "https://img.icons8.com/ios-filled/24/FDB022/marker.png",
    titulo: "Ubicación",
    linea1: "SENA-comercio",
    linea2: "RIONEGRO, ANTIOQUIA",
  },
  {
    icono: "https://img.icons8.com/ios-filled/24/FDB022/phone.png",
    titulo: "Teléfono",
    linea1: "+57 305 435 2689",
    linea2: "+57 322 219 5864",
  },
  {
    icono: "https://img.icons8.com/ios-filled/24/FDB022/email.png",
    titulo: "Email",
    linea1: "contacto@bookit.com",
    linea2: "soporte@bookit.com",
  },
];

const SeccionContacto = () => {
  // Estado del formulario con todos los campos
  const [formulario, setFormulario] = useState({
    nombre: "",
    email: "",
    asunto: "",
    mensaje: "",
  });
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");

  // Actualiza un campo del formulario según el input
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  };

  // Enviar el formulario al backend real
  const manejarEnvio = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setError("");

    try {
      await enviarContacto(formulario);
      setEnviado(true);
      setFormulario({ nombre: "", email: "", asunto: "", mensaje: "" });
      setTimeout(() => setEnviado(false), 4000);
    } catch (err) {
      setError(err.message || "No se pudo enviar el mensaje. Intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="contacto" id="contacto">
      {/* Header de la sección */}
      <div className="seccion-header">
        <span className="seccion-badge">CONTACTO</span>
        <h2 className="seccion-titulo">¿Tienes alguna pregunta?</h2>
        <p className="seccion-subtitulo">
          Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos lo
          antes posible.
        </p>
      </div>

      {/* Contenido: 2 columnas */}
      <div className="contacto-contenido">
        {/* ====== COLUMNA IZQUIERDA: Info de contacto ====== */}
        <div className="contacto-info contacto-info-principal">
          <div className="contacto-info-header">
            <h3 className="contacto-info-titulo">Información de Contacto</h3>
            <p className="contacto-info-subtitulo">
              Contáctanos por cualquiera de estos medios o completa el
              formulario.
            </p>
          </div>

          {/* Tarjetas de info */}
          <div className="contacto-tarjetas">
            {infoContacto.map((info, indice) => (
              <div className="contacto-tarjeta" key={indice}>
                <div className="contacto-tarjeta-icono">
                  <img
                    src={info.icono}
                    alt={info.titulo}
                    width="24"
                    height="24"
                  />
                </div>
                <div className="contacto-tarjeta-texto">
                  <span className="contacto-tarjeta-titulo">{info.titulo}</span>
                  <span className="contacto-tarjeta-linea">{info.linea1}</span>
                  <span className="contacto-tarjeta-linea">{info.linea2}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Redes sociales */}
          <div className="contacto-redes">
            <span className="contacto-redes-titulo">Síguenos</span>
            <div className="contacto-redes-iconos">
              <a href="#" className="contacto-red" aria-label="Facebook">
                <img
                  src="https://img.icons8.com/ios-filled/20/ffffff/facebook-new.png"
                  alt="Facebook"
                />
              </a>
              <a href="#" className="contacto-red" aria-label="Instagram">
                <img
                  src="https://img.icons8.com/ios-filled/20/ffffff/instagram-new.png"
                  alt="Instagram"
                />
              </a>
              <a href="#" className="contacto-red" aria-label="Twitter">
                <img
                  src="https://img.icons8.com/ios-filled/20/ffffff/twitter.png"
                  alt="Twitter"
                />
              </a>
              <a href="#" className="contacto-red" aria-label="LinkedIn">
                <img
                  src="https://img.icons8.com/ios-filled/20/ffffff/linkedin.png"
                  alt="LinkedIn"
                />
              </a>
            </div>
          </div>
        </div>

        {/* ====== COLUMNA DERECHA: Formulario ====== */}
        <div className="contacto-formulario-contenedor">
          {/* Mensaje de error */}
          {error && (
            <div className="contacto-error">
              <span>{error}</span>
            </div>
          )}

          {/* Mensaje de éxito */}
          {enviado && (
            <div className="contacto-exito">
              <img
                src="https://img.icons8.com/ios-filled/28/10B981/checkmark--v1.png"
                alt="ok"
                width="28"
                height="28"
              />
              <span>
                ¡Mensaje enviado correctamente! Te contactaremos pronto.
              </span>
            </div>
          )}

          <form className="contacto-formulario" onSubmit={manejarEnvio}>
            {/* Fila 1: Nombre y Email */}
            <div className="contacto-fila">
              <div className="contacto-campo">
                <label className="contacto-label">Nombre completo</label>
                <div className="contacto-input-grupo">
                  <img
                    src="https://img.icons8.com/ios-filled/18/999999/user.png"
                    alt=""
                    className="contacto-input-icono"
                  />
                  <input
                    type="text"
                    name="nombre"
                    className="contacto-input"
                    placeholder="Tu nombre"
                    value={formulario.nombre}
                    onChange={manejarCambio}
                    required
                  />
                </div>
              </div>

              <div className="contacto-campo">
                <label className="contacto-label">Correo electrónico</label>
                <div className="contacto-input-grupo">
                  <img
                    src="https://img.icons8.com/ios-filled/18/999999/email.png"
                    alt=""
                    className="contacto-input-icono"
                  />
                  <input
                    type="email"
                    name="email"
                    className="contacto-input"
                    placeholder="tu@email.com"
                    value={formulario.email}
                    onChange={manejarCambio}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Fila 2: Asunto */}
            <div className="contacto-campo">
              <label className="contacto-label">Asunto</label>
              <div className="contacto-input-grupo">
                <img
                  src="https://img.icons8.com/ios-filled/18/999999/topic.png"
                  alt=""
                  className="contacto-input-icono"
                />
                <input
                  type="text"
                  name="asunto"
                  className="contacto-input"
                  placeholder="¿Sobre qué quieres hablar?"
                  value={formulario.asunto}
                  onChange={manejarCambio}
                  required
                />
              </div>
            </div>

            {/* Fila 3: Mensaje (textarea) */}
            <div className="contacto-campo">
              <label className="contacto-label">Mensaje</label>
              <textarea
                name="mensaje"
                className="contacto-textarea"
                placeholder="Escribe tu mensaje aquí..."
                rows="5"
                value={formulario.mensaje}
                onChange={manejarCambio}
                required
              ></textarea>
            </div>

            {/* Botón de enviar */}
            <button
              type="submit"
              className="contacto-btn-enviar"
              disabled={enviando}
            >
              {enviando ? (
                <>
                  <span className="contacto-spinner"></span>
                  Enviando...
                </>
              ) : (
                <>
                  Enviar Mensaje
                  <img
                    src="https://img.icons8.com/ios-filled/18/ffffff/sent.png"
                    alt=""
                    width="18"
                    height="18"
                  />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SeccionContacto;
