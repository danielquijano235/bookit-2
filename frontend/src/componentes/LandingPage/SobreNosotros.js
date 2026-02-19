import React from "react";
import "../../estilos/landing.css";

const SobreNosotros = () => {
  return (
    <section className="sobre-nosotros-section" id="sobre-nosotros">
      <div className="container sobre-nosotros-discreto">
        <div className="historia-box historia-discreta">
          <p style={{fontSize: '1rem', color: 'var(--color-texto-claro)', marginBottom: 8}}>
            <b>Bookit</b> es desarrollado por <b>Daniel</b> y <b>Camilo</b>, dos apasionados por el software y las soluciones ágiles.
          </p>
          <p style={{fontSize: '0.97rem', color: 'var(--color-texto-claro)', marginBottom: 0}}>
            Creemos en la tecnología simple, útil y cercana. Gracias por confiar en nosotros.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SobreNosotros;
