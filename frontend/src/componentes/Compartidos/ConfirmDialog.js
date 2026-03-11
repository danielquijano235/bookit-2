import React, { useEffect, useRef } from "react";
import Boton from "./Boton";

/**
 * ConfirmDialog
 * Props:
 *  - abierto: boolean
 *  - titulo: string
 *  - mensaje: string
 *  - onConfirm: function
 *  - onCancel: function
 */
const ConfirmDialog = ({
  abierto,
  titulo = "Confirmar",
  mensaje = "¿Estás seguro?",
  onConfirm,
  onCancel,
}) => {
  const dialogRef = useRef(null);
  const confirmRef = useRef(null);

  // Maneja el enfoque y accesibilidad del diálogo cuando está abierto
  useEffect(() => {
    if (!abierto) return;

    const previouslyFocused = document.activeElement;
    const node = dialogRef.current;
    const focusable = node.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    if (focusable.length) focusable[0].focus();

    // Permite cerrar el diálogo con Escape y mantiene el enfoque dentro del modal
    const handleKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel && onCancel();
      }
      if (e.key === "Tab") {
        // Mantiene el enfoque dentro del diálogo
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      if (previouslyFocused && previouslyFocused.focus)
        previouslyFocused.focus();
    };
  }, [abierto, onCancel]);

  // Si el diálogo no está abierto, no renderiza nada
  if (!abierto) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 420,
          borderRadius: 18,
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-desc"
        ref={dialogRef}
      >
        {/* Ícono de advertencia en el encabezado del diálogo */}
        <div
          className="modal-header"
          style={{
            borderBottom: "none",
            background: "transparent",
            paddingTop: 28,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="https://img.icons8.com/?size=100&id=1474&format=png&color=000000"
            alt="Advertencia"
            width="48"
            height="48"
            style={{ marginBottom: 8 }}
          />
        </div>
        {/* Título y mensaje del diálogo */}
        <div style={{ textAlign: "center", padding: "0 24px 8px" }}>
          <h2
            id="confirm-dialog-title"
            style={{
              fontWeight: 700,
              fontSize: "1.25rem",
              margin: 0,
              color: "#1a1a2e",
            }}
          >
            {titulo}
          </h2>
        </div>
        <div style={{ padding: "0 24px 18px", textAlign: "center" }}>
          <p
            id="confirm-dialog-desc"
            style={{
              margin: 0,
              color: "var(--color-texto-claro)",
              fontSize: "1.05rem",
            }}
          >
            {mensaje}
          </p>
        </div>
        {/* Botones de acción: Cancelar y Confirmar */}
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            padding: "0 24px 24px",
          }}
        >
          <Boton variante="secundario" onClick={onCancel}>
            Cancelar
          </Boton>
          <Boton
            variante="primario"
            onClick={onConfirm}
            ref={confirmRef}
            style={{ background: "#10b981", color: "#fff", border: "none" }}
          >
            Confirmar
          </Boton>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
