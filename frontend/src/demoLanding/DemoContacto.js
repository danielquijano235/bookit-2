import React from 'react';

const DemoContacto = () => {
  const bg = (process.env.PUBLIC_URL || '') + '/assets/images/demo-restaurant.jpg';
  const style = { backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' };
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
        <form className="contacto-form-inner" onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.target);
          const nombre = fd.get('nombre');
          const email = fd.get('email');
          const mensaje = fd.get('mensaje');
          alert(`Gracias ${nombre}!\nMensaje recibido:\n${mensaje}\n\nNos pondremos en contacto al correo: ${email}\n(Esto es una demo, no se envía al servidor)`);
          e.target.reset();
        }}>
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
            <button type="submit" className="contacto-submit">Enviar mensaje</button>
          </div>
        </form>
      </div>
    </div>
  </section>
  );
};

export default DemoContacto;
