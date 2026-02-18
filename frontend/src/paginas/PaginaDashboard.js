

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BarraLateral from '../componentes/Dashboard/BarraLateral';
import BarraSuperior from '../componentes/Dashboard/BarraSuperior';
import TarjetaMetrica from '../componentes/Dashboard/TarjetaMetrica';
import GraficaReservas from '../componentes/Dashboard/GraficaReservas';
import ListaReservas from '../componentes/Dashboard/ListaReservas';
import ModalNuevaReserva from '../componentes/Dashboard/ModalNuevaReserva';
import VistaReservas from '../componentes/Dashboard/VistaReservas';
import VistaClientes from '../componentes/Dashboard/VistaClientes';
import VistaMesas from '../componentes/Dashboard/VistaMesas';
import VistaResenas from '../componentes/Dashboard/VistaResenas';
import VistaMenu from '../componentes/Dashboard/VistaMenu';
import VistaAnalisis from '../componentes/Dashboard/VistaAnalisis';
import { NotificacionesProvider, useNotificaciones } from '../contextos/NotificacionesContext';
import {
  obtenerMetricasHoy,
  obtenerReservasSemana,
  obtenerProximasReservas,
  obtenerTodosClientes,
  crearReserva,
  cerrarSesion,
} from '../servicios/api';
import '../estilos/dashboard.css';

const PaginaDashboard = () => {
  // ============================================
  // ESTADOS DEL COMPONENTE
  // ============================================
  const [usuario, setUsuario] = useState(null);
  const [metricas, setMetricas] = useState(null);
  const [datosGrafica, setDatosGrafica] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [seccionActiva, setSeccionActiva] = useState('inicio');

  const navigate = useNavigate();
  const { agregarNotificacion } = useNotificaciones();

  // ============================================
  // CARGAR DATOS AL MONTAR EL COMPONENTE
  // useEffect se ejecuta una vez cuando el componente se carga
  // ============================================
  useEffect(() => {
    // Obtener datos del usuario desde localStorage
    const datosUsuario = localStorage.getItem('usuario');
    if (datosUsuario) {
      setUsuario(JSON.parse(datosUsuario));
    }

    // Cargar todos los datos del dashboard
    cargarDatos();
  }, []); // [] = solo se ejecuta una vez

  /**
   * Función que carga todos los datos necesarios del dashboard.
   * Hace múltiples peticiones al backend en paralelo.
   */
  const cargarDatos = async () => {
    setCargando(true);
    try {
      // Hacer todas las peticiones al mismo tiempo con Promise.allSettled
      // Así es más rápido que hacerlas una por una
      const [resMetricas, resGrafica, resReservas, resClientes] = await Promise.allSettled([
        obtenerMetricasHoy(),
        obtenerReservasSemana(),
        obtenerProximasReservas(),
        obtenerTodosClientes(),
      ]);

      // Asignar datos si la petición fue exitosa
      if (resMetricas.status === 'fulfilled') {
        setMetricas(resMetricas.value);
      }
      if (resGrafica.status === 'fulfilled') {
        setDatosGrafica(resGrafica.value);
      }
      if (resReservas.status === 'fulfilled') {
        setReservas(resReservas.value);
      }
      if (resClientes.status === 'fulfilled') {
        setClientes(resClientes.value);
      }
    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
    } finally {
      setCargando(false);
    }
  };

  /**
   * Manejar el cierre de sesión
   */
  const manejarCerrarSesion = async () => {
    try {
      await cerrarSesion();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
    // Limpiar localStorage y redirigir al login
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  /**
   * Manejar la creación de una nueva reserva
   * Se pasa al modal como callback
   */
  const manejarCrearReserva = async (datosReserva) => {
    await crearReserva(datosReserva);
    // Notificar que se creó una reserva
    const clienteNombre = clientes.find(c => c.id == datosReserva.cliente_id)?.nombre || 'Cliente';
    agregarNotificacion(
      'reserva',
      'Nueva reserva creada',
      `${clienteNombre} — ${datosReserva.fecha} a las ${datosReserva.hora} (${datosReserva.numero_personas} personas)`
    );
    // Recargar los datos para reflejar la nueva reserva
    cargarDatos();
  };

  /**
   * Obtener la fecha actual formateada en español
   * Ejemplo: "Viernes, 7 de febrero de 2026"
   */
  const obtenerFechaFormateada = () => {
    const opciones = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const fecha = new Date().toLocaleDateString('es-ES', opciones);
    // Capitalizar primera letra
    return fecha.charAt(0).toUpperCase() + fecha.slice(1);
  };

  /**
   * Formatear número como moneda colombiana
   * Ejemplo: 3380000 -> "$3,380,000"
   */
  const formatearMoneda = (numero) => {
    return '$' + Number(numero).toLocaleString('es-CO');
  };

  // ============================================
  // DATOS POR DEFECTO (se usan si el backend no responde)
  // Así el dashboard siempre muestra algo
  // ============================================
  const metricasPorDefecto = {
    reservas_hoy: 127,
    clientes_nuevos: 34,
    ocupacion: { porcentaje: 64, ocupadas: 32, total: 50 },
    ingresos_hoy: 3380000,
  };

  const graficaPorDefecto = {
    'Lun': 45,
    'Mar': 52,
    'Mié': 61,
    'Jue': 58,
    'Vie': 78,
    'Sáb': 95,
    'Dom': 88,
  };

  const reservasPorDefecto = [
    { id: 1, cliente: 'Carlos Rodríguez', personas: 4, hora: '19:00:00', estado: 'confirmada' },
    { id: 2, cliente: 'María González', personas: 2, hora: '19:30:00', estado: 'pendiente' },
    { id: 3, cliente: 'Ana López', personas: 6, hora: '20:00:00', estado: 'confirmada' },
    { id: 4, cliente: 'Juan Pérez', personas: 3, hora: '20:30:00', estado: 'confirmada' },
    { id: 5, cliente: 'Laura Martínez', personas: 5, hora: '21:00:00', estado: 'pendiente' },
  ];

  // Usar datos reales si existen, si no usar los de ejemplo
  const metricasActuales = metricas || metricasPorDefecto;
  const graficaActual = datosGrafica || graficaPorDefecto;
  const reservasActuales = reservas.length > 0 ? reservas : reservasPorDefecto;

  return (
    <div className="dashboard">
      {/* ====== BARRA LATERAL ====== */}
      <BarraLateral
        usuario={usuario || { nombre: 'Daniel Quijano', email: 'admin@bookit.com' }}
        onCerrarSesion={manejarCerrarSesion}
        seccionActiva={seccionActiva}
        onCambiarSeccion={setSeccionActiva}
      />

      {/* ====== CONTENIDO PRINCIPAL ====== */}
      <div className="dashboard-contenido">
        {/* Barra superior con búsqueda y nueva reserva */}
        <BarraSuperior onNuevaReserva={() => setModalVisible(true)} />

        {/* Cuerpo del dashboard */}
        <main className="dashboard-cuerpo">
          {seccionActiva === 'inicio' && (
            <>
              {/* Título y fecha */}
              <h1 className="dashboard-titulo">Dashboard</h1>
              <p className="dashboard-fecha">{obtenerFechaFormateada()}</p>

              {/* ====== TARJETAS DE MÉTRICAS ====== */}
              <div className="metricas-grid">
                <TarjetaMetrica
                  titulo="Reservas Hoy"
                  numero={metricasActuales.reservas_hoy}
                  badge="↑ +23% vs ayer"
                  icono="https://img.icons8.com/ios-filled/20/FFFFFF/calendar--v1.png"
                  colorFondo="#4A90E2"
                />
                <TarjetaMetrica
                  titulo="Clientes Nuevos"
                  numero={metricasActuales.clientes_nuevos}
                  badge="↑ +12% vs ayer"
                  icono="https://img.icons8.com/ios-filled/20/FFFFFF/conference-call.png"
                  colorFondo="#8B5CF6"
                />
                <TarjetaMetrica
                  titulo="Ocupación"
                  numero={`${metricasActuales.ocupacion.porcentaje}%`}
                  subtexto={`${metricasActuales.ocupacion.ocupadas} de ${metricasActuales.ocupacion.total} mesas`}
                  badge="↑"
                  icono="https://img.icons8.com/ios-filled/20/FFFFFF/statistics.png"
                  colorFondo="#10B981"
                />
                <TarjetaMetrica
                  titulo="Ingresos Hoy"
                  numero={formatearMoneda(metricasActuales.ingresos_hoy)}
                  subtexto={`($${Math.round(metricasActuales.ingresos_hoy / 4000).toLocaleString()} USD)`}
                  badge="↑ +18%"
                  icono="https://img.icons8.com/ios-filled/20/FFFFFF/money.png"
                  colorFondo="#FDB022"
                />
              </div>

              {/* ====== GRÁFICA Y LISTA DE RESERVAS ====== */}
              <div className="dashboard-grid">
                {/* Gráfica de barras semanal */}
                <GraficaReservas datos={graficaActual} />

                {/* Lista de próximas reservas */}
                <ListaReservas reservas={reservasActuales} />
              </div>
            </>
          )}

          {seccionActiva === 'reservas' && (
            <VistaReservas />
          )}

          {seccionActiva === 'clientes' && (
            <VistaClientes />
          )}

          {seccionActiva === 'mesas' && (
            <VistaMesas />
          )}

          {seccionActiva === 'menu' && (
            <VistaMenu />
          )}

          {seccionActiva === 'resenas' && (
            <VistaResenas />
          )}

          {seccionActiva === 'analisis' && (
            <VistaAnalisis metricas={metricas} datosGrafica={datosGrafica} />
          )}

          {!['inicio', 'reservas', 'clientes', 'mesas', 'menu', 'resenas', 'analisis'].includes(seccionActiva) && (
            <div className="seccion-en-construccion">
              <span style={{ fontSize: '3rem' }}>🚧</span>
              <h2>Sección en desarrollo</h2>
              <p>Esta sección estará disponible próximamente.</p>
            </div>
          )}
        </main>
      </div>

      {/* ====== MODAL PARA NUEVA RESERVA ====== */}
      <ModalNuevaReserva
        visible={modalVisible}
        onCerrar={() => setModalVisible(false)}
        onCrear={manejarCrearReserva}
        clientes={clientes}
        mesas={[]}
      />
    </div>
  );
};

// Componente envolvente que provee el contexto de notificaciones
const PaginaDashboardConNotificaciones = () => (
  <NotificacionesProvider>
    <PaginaDashboard />
  </NotificacionesProvider>
);

export default PaginaDashboardConNotificaciones;
