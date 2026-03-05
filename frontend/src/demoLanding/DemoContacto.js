import React, { useState } from 'react';

const DemoContacto = () => {
  const bg = (process.env.PUBLIC_URL || '') + '/assets/images/demo-restaurant.jpg';
  const style = { backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' };
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  return (
    <section className="demo-contacto with-image" id="contacto" aria-label="Contacto" style={style}>
    <div className="demo-contacto-inner">
      <div className="contacto-info">
        <h2>Contacto</h2>
        <p className="contacto-line">Dirección: Calle 123, Ciudad</p>
        <p className="contacto-line">Teléfono: <a href="tel:+571234567890">+57 1 234 567 890</a></p>
        <p className="contacto-line">Email: <a href="mailto:demo@restaurante.com">demo@restaurante.com</a></p>

        <h3>Horarios</h3>
        <ul className="contacto-horarios">
          <li><strong>Lun - Mié:</strong> 12:00 p.m. – 10:00 p.m.</li>
          <li><strong>Jue - Sáb:</strong> 12:00 p.m. – 11:00 p.m.</li>
          <li><strong>Dom:</strong> 12:00 p.m. – 9:00 p.m.</li>
        </ul>
      </div>

      <div className="contacto-form">
        <h3>Contacto</h3>
        <form
          className="contacto-form-inner"
          onSubmit={(e) => {
            e.preventDefault();
            setEnviando(true);

            // Simular envío y mostrar mensaje de éxito (igual que SeccionContacto)
            setTimeout(() => {
              setEnviando(false);
              setEnviado(true);
              e.target.reset();

              // ocultar mensaje de éxito después de 4 segundos
              setTimeout(() => setEnviado(false), 4000);
            }, 2000);
          }}
        >
          {enviado && (
            <div className="contacto-exito">
              <img
                src="https://img.icons8.com/ios-filled/28/10B981/checkmark--v1.png"
                alt="ok"
                width="28"
                height="28"
              />
              <span>¡Mensaje enviado correctamente! Te contactaremos pronto.</span>
            </div>
          )}
          <div className="form-row">
            <label>
              Nombre
              <input type="text" name="nombre" placeholder="Ej. María Pérez" required />
            </label>
            <label>
              Email
              <input type="email" name="email" placeholder="tu@correo.com" required />
            </label>
          </div>

          <label>
            Mensaje
            <textarea name="mensaje" rows="5" placeholder="Escribe tu mensaje aquí..." required></textarea>
          </label>

          <div className="contacto-form-actions">
            <button type="submit" className="contacto-btn-enviar" disabled={enviando}>
              {enviando ? (
                <>
                  <span className="contacto-spinner"></span>
                  Enviando...
                </>
              ) : (
                <>
                  Enviar Mensaje
                  <img src="https://img.icons8.com/ios-filled/18/ffffff/sent.png" alt="" width="18" height="18" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
  );
};

export default DemoContacto;
