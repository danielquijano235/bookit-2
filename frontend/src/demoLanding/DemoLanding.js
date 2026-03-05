import React, { useState, useEffect } from "react";
import "./demoLanding.css";
import DemoHeader from "./DemoHeader";
import DemoHero from "./DemoHero";
import DemoInfo from "./DemoInfo";
import DemoMenu from "./DemoMenu";
import DemoHistoria from "./DemoHistoria";
import DemoReservar from "./DemoReservar";
import DemoEventos from "./DemoEventos";
import DemoContacto from "./DemoContacto";
import DemoReserva from "../componentes/LandingPage/DemoReserva";
import DemoGallery from "./DemoGallery";
import DemoFooter from "./DemoFooter";
import DemoResenas from "./DemoResenas";

const DemoLanding = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalSource, setModalSource] = useState(null);

  const abrirModal = (arg) => {
    // arg can be: event object (from Reservar evento), or a string identifier ('hero','reservar')
    if (arg && typeof arg === "object") {
      setSelectedEvent(arg);
      setModalSource("evento");
    } else if (typeof arg === "string") {
      setSelectedEvent(null);
      setModalSource(arg);
    } else {
      setSelectedEvent(null);
      setModalSource("default");
    }
    setModalVisible(true);
  };
  const cerrarModal = () => {
    setSelectedEvent(null);
    setModalSource(null);
    setModalVisible(false);
  };

  // Cuando el modal está visible, además de bloquear el body,
  // aseguramos que el contenedor `.demo-landing` también no haga scroll.
  useEffect(() => {
    const demoRoot = document.querySelector(".demo-landing");
    const originalOverflow = demoRoot ? demoRoot.style.overflow : null;
    if (modalVisible && demoRoot) {
      demoRoot.style.overflow = "hidden";
    }
    return () => {
      if (demoRoot) demoRoot.style.overflow = originalOverflow || "";
    };
  }, [modalVisible]);

  // Estado para reseñas demo
  const [demoResenas, setDemoResenas] = useState([]);
  const handleNuevaResena = (resena) => {
    setDemoResenas([resena, ...demoResenas]);
    // Aquí podrías enviar la reseña al backend o al dashboard
  };

  return (
    <div className="demo-landing">
      <DemoHeader onOpenReserva={abrirModal} />
      <DemoHero onOpenReserva={abrirModal} />
      <DemoInfo />
      <DemoHistoria />

      {/* Galería a pantalla completa: muestra varios platos grandes juntos */}
      <section className="demo-gallery-section" id="galeria">
        <h2 className="demo-section-title">Sabores que cuentan historias</h2>
        <DemoGallery />
      </section>

      <DemoMenu />
      <DemoReservar onOpenReserva={abrirModal} />
      <DemoEventos onOpenReserva={abrirModal} />

      {/* Sección de reseñas demo */}
      <DemoResenas onNuevaResena={handleNuevaResena} />

      {/* Divisor visual entre reseñas y contacto */}
      <div className="demo-divisor"></div>

      <DemoContacto />

      <DemoReserva
        visible={modalVisible}
        onCerrar={cerrarModal}
        selectedEvent={selectedEvent}
        source={modalSource}
      />
      <DemoFooter />
    </div>
  );
};

export default DemoLanding;
