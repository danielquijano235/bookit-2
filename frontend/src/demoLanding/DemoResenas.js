import React, { useState } from "react";
import "./demoLanding.css";
import { useEffect } from "react";

const DemoResenas = ({ onNuevaResena }) => {
  // Estados para los campos del formulario y las reseñas
  const [nombre, setNombre] = useState("");
  const [comentario, setComentario] = useState("");
  const [calificacion, setCalificacion] = useState(5);
  // Almacena las reseñas en localStorage para persistencia
  const [resenas, setResenas] = useState(() => {
    return JSON.parse(localStorage.getItem("resenasDemo") || "[]");
  });
  const [fecha, setFecha] = useState("");
  const [grupo, setGrupo] = useState("");
  const [titulo, setTitulo] = useState("");

  // Efecto para cargar reseñas al montar el componente
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("resenasDemo") || "[]");
    setResenas(stored);
  }, []);

  // Maneja el envío del formulario de reseña
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre || !comentario) return;
    const nueva = {
      id: Date.now(),
      cliente: nombre,
      comentario,
      calificacion,
      fecha: new Date().toISOString().slice(0, 10),
    };
    const prev = JSON.parse(localStorage.getItem("resenasDemo") || "[]");
    const actualizadas = [nueva, ...prev];
    setResenas(actualizadas);
    setNombre("");
    setComentario("");
    setCalificacion(5);
    if (onNuevaResena) onNuevaResena(nueva);
    localStorage.setItem("resenasDemo", JSON.stringify(actualizadas));
  };

  return (
    <section className="demo-resenas-section" id="resenas">
      <div className="demo-resenas-form-grid">
        <form
          className="demo-resena-form demo-resenas-col-izq"
          onSubmit={handleSubmit}
        >
          <h2 className="demo-section-title">
            Cuéntanos:
            <br />
            ¿cómo te fue en tu visita?
          </h2>
          <label>¿Cómo calificarías el nivel de tu experiencia?</label>
          <div className="demo-resena-calificacion">
            {[1, 2, 3, 4, 5].map((n) => (
              <span
                key={n}
                className="star"
                style={{
                  color: n <= calificacion ? "#FDB022" : "#e2e8f0",
                  cursor: "pointer",
                }}
                onClick={() => setCalificacion(n)}
                role="button"
                aria-label={`Calificación ${n}`}
              >
                ★
              </span>
            ))}
          </div>
          <label>Tu nombre</label>
          <input
            type="text"
            placeholder="Escribe tu nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            maxLength={40}
            style={{ marginBottom: "8px" }}
          />
          <label>Escribe tu opinión</label>
          <textarea
            placeholder="Comparte tu experiencia..."
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            minLength={25}
            required
          />
          <button type="submit">Enviar reseña</button>
        </form>
        <div className="demo-resenas-col-der">
          <div className="demo-resenas-lista">
            {resenas.length === 0 && <p>No hay reseñas aún.</p>}
            {resenas.slice(0, 4).map((r) => (
              <div key={r.id} className="demo-resena-item">
                <div className="demo-resena-header">
                  <span className="demo-resena-nombre">{r.cliente}</span>
                  <span className="demo-resena-fecha">{r.fecha}</span>
                  <span className="demo-resena-calificacion">
                    {r.calificacion} ★
                  </span>
                </div>
                <div className="demo-resena-comentario">{r.comentario}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoResenas;
