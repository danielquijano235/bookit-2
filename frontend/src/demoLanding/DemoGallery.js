import React from 'react';

/*
  DemoGallery (grid)
  - Drop images into `public/assets/images/` and list filenames below.
  - Grid is full-width inside the gallery section and images are wider/taller.
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


const DemoGallery = () => {
  return (
    <div className="demo-gallery" aria-label="Galería de platos">
      <div className="demo-gallery-row">
        {images.map((name, i) => {
          const src = name ? `/assets/images/${name}` : null;
          return (
            <div className={`demo-grid-item`} key={i} aria-hidden={src ? 'false' : 'true'}>
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
