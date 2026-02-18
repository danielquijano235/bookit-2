/**
 * ============================================
 * BOOKIT - Componente SeccionTestimonios
 * Archivo: componentes/LandingPage/SeccionTestimonios.js
 * ============================================
 * 
 * Propósito: Muestra testimonios de clientes satisfechos
 * en un grid de 3 columnas x 2 filas (6 testimonios).
 * 
 * Cada testimonio tiene estrellas, texto, avatar con iniciales,
 * nombre y cargo.
 */

import React from 'react';

// Array con los datos de los 6 testimonios
const testimonios = [
  {
    texto: 'BookIt ha transformado completamente la gestión de nuestro restaurante. Ahora gestionamos el doble de reservas sin errores y nuestros clientes están más satisfechos que nunca.',
    iniciales: 'MG',
    nombre: 'María González',
    cargo: 'Propietaria, La Cocina de María',
  },
  {
    texto: 'La implementación fue increíblemente rápida. En menos de 24 horas ya estábamos operando con el sistema. El soporte técnico es excepcional y siempre están disponibles.',
    iniciales: 'CR',
    nombre: 'Carlos Ramírez',
    cargo: 'Gerente, El Asador Premium',
  },
  {
    texto: 'Gestionamos 5 restaurantes y BookIt nos permite tener control total desde una sola plataforma. Los reportes analíticos nos han ayudado a aumentar nuestros ingresos en un 30%.',
    iniciales: 'AM',
    nombre: 'Ana Martínez',
    cargo: 'Directora, Grupo Sabor Latino',
  },
  {
    texto: 'Lo que más me gusta es la facilidad de uso. Mi equipo aprendió a usarlo en minutos y ahora dedican más tiempo a atender a los clientes en lugar de gestionar reservas manualmente.',
    iniciales: 'RS',
    nombre: 'Roberto Silva',
    cargo: 'Chef Propietario, Fusión Gourmet',
  },
  {
    texto: 'Las notificaciones automáticas han reducido significativamente nuestras cancelaciones. Los clientes reciben recordatorios y confirmaciones que mejoran su experiencia.',
    iniciales: 'LF',
    nombre: 'Laura Fernández',
    cargo: 'Gerente de Operaciones, Vista Mar',
  },
  {
    texto: 'BookIt no solo gestiona reservas, también nos ha ayudado a conocer mejor a nuestros clientes. El programa de fidelización integrado ha sido un game changer para nuestro negocio.',
    iniciales: 'DM',
    nombre: 'Diego Morales',
    cargo: 'Propietario, Tradición Mexicana',
  },
];

const SeccionTestimonios = () => {
  return (
    <section className="testimonios" id="testimonios">
      {/* Header de la sección */}
      <div className="seccion-header">
        <span className="seccion-badge">TESTIMONIOS</span>
        <h2 className="seccion-titulo">Lo que dicen nuestros clientes</h2>
        <p className="seccion-subtitulo">
          Más de 500 restaurantes confían en BookIt para gestionar sus operaciones
        </p>
      </div>

      {/* Grid de testimonios */}
      <div className="testimonios-grid">
        {testimonios.map((testimonio, indice) => (
          <div className="testimonio-tarjeta" key={indice}>
            {/* 5 estrellas amarillas */}
            <div className="testimonio-estrellas">
              <img src="https://img.icons8.com/ios-filled/16/FDB022/star--v1.png" alt="★" width="16" height="16" />
              <img src="https://img.icons8.com/ios-filled/16/FDB022/star--v1.png" alt="★" width="16" height="16" />
              <img src="https://img.icons8.com/ios-filled/16/FDB022/star--v1.png" alt="★" width="16" height="16" />
              <img src="https://img.icons8.com/ios-filled/16/FDB022/star--v1.png" alt="★" width="16" height="16" />
              <img src="https://img.icons8.com/ios-filled/16/FDB022/star--v1.png" alt="★" width="16" height="16" />
            </div>

            {/* Texto del testimonio */}
            <p className="testimonio-texto">"{testimonio.texto}"</p>

            {/* Información del autor */}
            <div className="testimonio-autor">
              <div className="testimonio-avatar">{testimonio.iniciales}</div>
              <div>
                <div className="testimonio-nombre">{testimonio.nombre}</div>
                <div className="testimonio-cargo">{testimonio.cargo}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SeccionTestimonios;
