import React from 'react';

const DemoReservar = ({ onOpenReserva }) => (
  <section className="demo-reservar" id="reservar">
    <h2>Reservar</h2>
    <p>Reserva tu mesa fácilmente y vive una experiencia inolvidable.</p>
    <button className="demo-reservar-btn" onClick={() => onOpenReserva && onOpenReserva()}>Reservar</button>
  </section>
);

export default DemoReservar;
