import React from 'react';
import DemoGallery from './DemoGallery';

const DemoInfo = () => (
  <section className="demo-info" id="info">
    <div className="demo-info-grid">
      <div className="demo-info-text">
        <h2>Sobre Nosotros</h2>
        <p>
          En Restaurante Demo ofrecemos una experiencia gastronómica centrada en
          ingredientes de temporada y presentación cuidada. Nuestro equipo crea
          platos que combinan raíces tradicionales con toques contemporáneos.
        </p>
        <p>
          Disfruta de un ambiente cálido, servicio atento y una selección de
          platos pensada para compartir y disfrutar en compañía.
        </p>
      </div>

      <div className="demo-info-gallery">
        <DemoGallery />
      </div>
    </div>
  </section>
);

export default DemoInfo;
