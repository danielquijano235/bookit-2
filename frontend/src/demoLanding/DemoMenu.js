import React from 'react';
import { Link, useNavigate } from 'react-router-dom';



const DemoMenu = () => {
  const navigate = useNavigate();

  const handleVerMenu = (e) => {
    e.preventDefault();
    // ensure viewport is at the top before navigating so the menu opens from the top
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
            <a href="/menu" onClick={handleVerMenu} className="demo-menu-btn">Ver menú</a>
          </div>
        </div>
      </section>
      
    </>
  );
};



export default DemoMenu;
