import React from "react";
import "./Alerta.css";

// Iconos de Icons8 por tipo
const ICONOS = {
  exito: "https://img.icons8.com/ios-filled/32/4CAF50/checked--v1.png",
  error: "https://img.icons8.com/ios-filled/32/EF4444/error--v1.png",
  info: "https://img.icons8.com/ios-filled/32/3B82F6/info--v1.png",
  advertencia: "https://img.icons8.com/ios-filled/32/FDB022/error--v1.png",
};

const Alerta = ({ tipo = "info", mensaje, visible = true, onCerrar }) => {
  if (!visible) return null;

  return (
    <div className={`alerta alerta-${tipo}`}>
      <img
        className="alerta-icono"
        src={ICONOS[tipo] || ICONOS.info}
        alt={tipo}
      />
      <div className="alerta-contenido">
        <span className="alerta-mensaje">{mensaje}</span>
      </div>
      {onCerrar && (
        <button className="alerta-cerrar" onClick={onCerrar} title="Cerrar">
          <img
            src="https://img.icons8.com/ios-filled/18/999999/delete-sign.png"
            alt="Cerrar"
          />
        </button>
      )}
    </div>
  );
};

export default Alerta;
