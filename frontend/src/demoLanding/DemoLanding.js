import React, { useState } from 'react';
import './demoLanding.css';
import DemoHeader from './DemoHeader';
import DemoHero from './DemoHero';
import DemoInfo from './DemoInfo';
import DemoMenu from './DemoMenu';
import DemoReservar from './DemoReservar';
import DemoEventos from './DemoEventos';
import DemoContacto from './DemoContacto';
import DemoReserva from '../componentes/LandingPage/DemoReserva';

const DemoLanding = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const abrirModal = () => setModalVisible(true);
  const cerrarModal = () => setModalVisible(false);

  return (
    <div className="demo-landing">
      <DemoHeader onOpenReserva={abrirModal} />
      <DemoHero onOpenReserva={abrirModal} />
      <DemoInfo />
      <DemoMenu />
      <DemoReservar onOpenReserva={abrirModal} />
      <DemoEventos />
      <DemoContacto />

      <DemoReserva visible={modalVisible} onCerrar={cerrarModal} />
    </div>
  );
};

export default DemoLanding;
