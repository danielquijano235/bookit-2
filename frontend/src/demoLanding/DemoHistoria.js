import React from 'react';

const DemoHistoria = () => {
  return (
    <section className="demo-historia" id="historia">
      <div className="demo-historia-inner">
        <h2>Nuestra Historia</h2>
        <p className="demo-historia-intro">Nosotros empezamos en 2016 como un pequeño local familiar en Rionegro. Desde el primer día buscamos rescatar sabores tradicionales con un toque moderno, apoyando productores locales y creando espacios para compartir.</p>

        <div className="historia-grid">
          <div className="historia-item">
            <div className="historia-year">2016</div>
            <div className="historia-text">Apertura del primer local familiar en Rionegro.</div>
          </div>
          <div className="historia-item">
            <div className="historia-year">2019</div>
            <div className="historia-text">Expansión del menú y participación en festivales locales.</div>
          </div>
          <div className="historia-item">
            <div className="historia-year">2023</div>
            <div className="historia-text">Lanzamiento de la reserva online y adaptaciones sostenibles.</div>
          </div>
        </div>

        
      </div>
    </section>
  );
};

export default DemoHistoria;
