import React from 'react';
import { Link, useNavigate } from 'react-router-dom';



const DemoMenu = () => {
  const navigate = useNavigate();

  // Maneja la navegación al menú y asegura que el scroll esté arriba
  const handleVerMenu = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'auto' });
    navigate('/menu');
  };

  return (
    <>
      <section className="demo-menu demo-menu-single" id="menu">
        <div className="demo-menu-inner">
          <h2>Menú</h2>
          <p>Descubre nuestro menú por categorías</p>
          <div className="demo-menu-cta">
            {/* Botón para ver el menú completo */}
            <a href="/menu" onClick={handleVerMenu} className="demo-menu-btn">Ver menú</a>
          </div>
        </div>
      </section>
      
    </>
  );
};



export default DemoMenu;
