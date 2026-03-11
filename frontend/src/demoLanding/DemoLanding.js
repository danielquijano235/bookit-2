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

// Componente principal de la landing demo
const DemoLanding = () => {
  // Estado para controlar la visibilidad del modal
  const [modalVisible, setModalVisible] = useState(false);
  // Estado para el evento seleccionado (si aplica)
  const [selectedEvent, setSelectedEvent] = useState(null);
  // Estado para identificar la fuente del modal
  const [modalSource, setModalSource] = useState(null);

  // Función para abrir el modal, puede recibir un objeto evento o un string
  const abrirModal = (arg) => {
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
  // Función para cerrar el modal
  const cerrarModal = () => {
    setSelectedEvent(null);
    setModalSource(null);
    setModalVisible(false);
  };

  // Efecto para bloquear el scroll del body cuando el modal está visible
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
  // Maneja la adición de una nueva reseña
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
