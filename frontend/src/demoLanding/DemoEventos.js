import React from 'react';
import Boton from '../componentes/Compartidos/Boton';

// Lista de eventos de muestra
const sampleEvents = [
  {
    id: 1,
    title: 'Cena de Aniversario',
    img: '/assets/images/event-02.jpg',
    desc: 'Menú especial, ambiente reservado y decoración personalizada.'
  },
  {
    id: 2,
    title: 'Brunch Corporativo',
    img: '/assets/images/event-01.jpg',
    desc: 'Espacio privado para reuniones y opciones de catering.'
  },
  {
    id: 3,
    title: 'Cumpleaños Familiar',
    img: '/assets/images/event-03.jpg',
    desc: 'Paquetes familiares con menú para niños y adultos.'
  },
  {
    id: 4,
    title: 'Degustación Privada',
    img: '/assets/images/event-04.jpg',
    desc: 'Menú de degustación para grupos reducidos y experiencias guiadas.'
  }
];

// Componente para mostrar eventos especiales
const DemoEventos = ({ onOpenReserva }) => {
  return (
    <section className="demo-eventos" id="eventos">
      <div className="demo-section-inner">
        <h2 className="demo-section-heading">Eventos Especiales</h2>
        <p className="demo-section-sub">Organiza tu evento: cumpleaños, aniversarios y reuniones privadas.</p>
        <div className="event-grid">
          {/* Muestra cada evento en una tarjeta */}
          {sampleEvents.map(ev => (
            <article className="event-card" key={ev.id}>
              <div className="event-media">
                <img src={ev.img} alt={ev.title} className="event-img" />
              </div>
              <div className="event-content">
                <h3 className="event-title">{ev.title}</h3>
                <p className="event-desc">{ev.desc}</p>
                <div className="event-actions">
                  {/* Botón para reservar el evento */}
                  <Boton variante="primario" onClick={() => onOpenReserva && onOpenReserva(ev)} className="demo-reservar-btn">Reservar evento</Boton>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DemoEventos;
