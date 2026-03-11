import React from 'react';

/*
  DemoGallery (grid)
  - Drop images into `public/assets/images/` and list filenames below.
  - Grid is full-width and images are wider/taller.
*/

const images = [
  'plato-01.jpg',
  'plato-02.jpg',
  'plato-03.jpg',
  'plato-04.jpg',
  'plato-05.jpg',
  'plato-06.jpg',
  'plato-07.jpg',
  'plato-08.jpg',
  'plato-09.jpg',
  'plato-10.jpg'
];

// Componente para mostrar la galería de platos
const DemoGallery = () => {
  return (
    <div className="demo-gallery" aria-label="Galería de platos">
      <div className="demo-gallery-row">
        {images.map((name, i) => {
          const src = name ? `/assets/images/${name}` : null;
          return (
            <div className={`demo-grid-item`} key={i} aria-hidden={src ? 'false' : 'true'}>
              {/* Si hay imagen, la muestra; si no, muestra un placeholder */}
              {src ? (
                <img src={src} alt={`Plato ${i + 1}`} className="demo-grid-img" />
              ) : (
                <div className="demo-grid-placeholder">+</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DemoGallery;
