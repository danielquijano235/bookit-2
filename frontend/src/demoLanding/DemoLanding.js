import React from 'react';
import './demoLanding.css';
import DemoHeader from './DemoHeader';
import DemoHero from './DemoHero';
import DemoInfo from './DemoInfo';
import DemoMenu from './DemoMenu';
import DemoReservar from './DemoReservar';
import DemoEventos from './DemoEventos';
import DemoContacto from './DemoContacto';

const DemoLanding = () => {
  return (
    <div className="demo-landing">
      <DemoHeader />
      <DemoHero />
      <DemoInfo />
      <DemoMenu />
      <DemoReservar />
      <DemoEventos />
      <DemoContacto />
    </div>
  );
};

export default DemoLanding;
