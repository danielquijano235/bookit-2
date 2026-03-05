import React from 'react';
import Boton from '../componentes/Compartidos/Boton';

const DemoReservar = ({ onOpenReserva }) => (
  <section className="demo-reservar" id="reservar">
    <div className="demo-reservar-inner">
      <h2 className="reservas-title">RESERVAS</h2>
      <p className="reservas-sub">Tu mesa te espera</p>
      <p className="reservas-desc">¿Un plan especial, una noche inolvidable o simplemente antojo de buena comida? Reserva fácil y vive Restaurant Demo: con sabor, música en vivo y todo el encanto local.</p>

      <div className="reservar-cta-wrap">
        <button className="demo-reservar-btn demo-reservar-cta" onClick={() => onOpenReserva && onOpenReserva('reservar')}>
          RESERVA
        </button>
      </div>

      <div className="reservas-horarios">
        <div className="horarios-box">
          <h3 className="horarios-title">Información</h3>
          <p className="horarios-sub">Horarios</p>
          <ul className="horario-list">
            <li><strong>Lunes a miércoles:</strong> 12:00 p.m. – 12:00 a.m.</li>
            <li><strong>Jueves a sábado:</strong> 12:00 p.m. – 1:00 a.m.</li>
            <li><strong>Domingos y festivos:</strong> 12:00 p.m. – 11:00 p.m.</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
);

export default DemoReservar;
