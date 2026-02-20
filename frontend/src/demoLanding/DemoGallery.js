import React, { useState } from 'react';

const images = [
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1505250469679-203ad9ced0cb?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1541542684-6e8e8b1b166d?auto=format&fit=crop&w=1200&q=80'
];

const DemoGallery = () => {
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  return (
    <div className="demo-gallery" aria-label="Galería de platos">
      <button className="gallery-arrow left" onClick={prev} aria-label="Anterior">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>

      <div className="demo-gallery-frame">
        <img src={images[index]} alt={`Plato ${index + 1}`} className="demo-gallery-img" />
      </div>

      <button className="gallery-arrow right" onClick={next} aria-label="Siguiente">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
    </div>
  );
};

export default DemoGallery;
