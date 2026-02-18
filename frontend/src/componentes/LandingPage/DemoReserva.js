/**
 * ============================================
 * BOOKIT - Componente DemoReserva
 * Archivo: componentes/LandingPage/DemoReserva.js
 * ============================================
 * 
 * Propósito: Experiencia interactiva de demostración.
 * Simula el proceso de reserva en 3 pasos:
 *   Paso 1: Elegir número de personas
 *   Paso 2: Seleccionar fecha en calendario
 *   Paso 3: Elegir hora disponible
 *   Final: Confirmación animada de la reserva
 */

import React, { useState, useEffect } from 'react';

// ============================================
// DATOS DE CONFIGURACIÓN
// ============================================
const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];
const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const HORARIOS_DISPONIBLES = [
  '12:00 pm', '12:30 pm', '1:00 pm', '1:30 pm', '2:00 pm',
  '7:00 pm', '7:30 pm', '8:00 pm', '8:30 pm', '9:00 pm', '9:30 pm'
];

// Generar días del mes para el calendario
const obtenerDiasMes = (anio, mes) => {
  const primerDia = new Date(anio, mes, 1).getDay();
  const totalDias = new Date(anio, mes + 1, 0).getDate();
  const dias = [];
  for (let i = 0; i < primerDia; i++) dias.push(null);
  for (let d = 1; d <= totalDias; d++) dias.push(d);
  return dias;
};

const DemoReserva = ({ visible, onCerrar }) => {
  // ============================================
  // ESTADOS
  // ============================================
  const [paso, setPaso] = useState(1);
  const [personas, setPersonas] = useState(2);
  const [mesActual, setMesActual] = useState(new Date().getMonth());
  const [anioActual, setAnioActual] = useState(new Date().getFullYear());
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);
  const [horaSeleccionada, setHoraSeleccionada] = useState(null);
  const [animando, setAnimando] = useState(false);
  const [confirmado, setConfirmado] = useState(false);
  const [nombreDemo, setNombreDemo] = useState('');

  const hoy = new Date();
  const diasMes = obtenerDiasMes(anioActual, mesActual);

  // Reset al abrir
  useEffect(() => {
    if (visible) {
      setPaso(1);
      setPersonas(2);
      setMesActual(new Date().getMonth());
      setAnioActual(new Date().getFullYear());
      setDiaSeleccionado(null);
      setHoraSeleccionada(null);
      setConfirmado(false);
      setNombreDemo('');
      setAnimando(false);
    }
  }, [visible]);

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [visible]);

  if (!visible) return null;

  // ============================================
  // NAVEGACIÓN ENTRE PASOS
  // ============================================
  const irSiguiente = () => {
    setAnimando(true);
    setTimeout(() => {
      setPaso(prev => prev + 1);
      setAnimando(false);
    }, 300);
  };

  const irAnterior = () => {
    setAnimando(true);
    setTimeout(() => {
      setPaso(prev => prev - 1);
      setAnimando(false);
    }, 300);
  };

  // Navegación del calendario
  const mesAnterior = () => {
    if (mesActual === 0) {
      setMesActual(11);
      setAnioActual(prev => prev - 1);
    } else {
      setMesActual(prev => prev - 1);
    }
  };

  const mesSiguiente = () => {
    if (mesActual === 11) {
      setMesActual(0);
      setAnioActual(prev => prev + 1);
    } else {
      setMesActual(prev => prev + 1);
    }
  };

  // ¿Es día pasado?
  const esDiaPasado = (dia) => {
    if (!dia) return true;
    const fecha = new Date(anioActual, mesActual, dia);
    const hoyLimpio = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    return fecha < hoyLimpio;
  };

  // Confirmar reserva demo
  const confirmarReserva = () => {
    setAnimando(true);
    setTimeout(() => {
      setConfirmado(true);
      setAnimando(false);
    }, 400);
  };

  // Simular horarios "ocupados" aleatoriamente (para realismo)
  const horariosOcupados = ['1:30 pm', '8:00 pm'];

  // Fecha formateada para mostrar
  const fechaFormateada = diaSeleccionado
    ? `${DIAS_SEMANA[new Date(anioActual, mesActual, diaSeleccionado).getDay()]}, ${diaSeleccionado} de ${MESES[mesActual]}`
    : '';

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="demo-overlay" onClick={onCerrar}>
      <div className="demo-contenedor" onClick={e => e.stopPropagation()}>

        {/* ====== BOTÓN CERRAR ====== */}
        <button className="demo-cerrar" onClick={onCerrar}>
          <img src="https://img.icons8.com/ios-filled/22/ffffff/delete-sign.png" alt="cerrar" width="22" height="22" />
        </button>

        {/* ====== HEADER ====== */}
        <div className="demo-header">
          <div className="demo-header-icono">
            <img src="https://img.icons8.com/ios-filled/28/FDB022/restaurant.png" alt="" width="28" height="28" />
          </div>
          <h2 className="demo-header-titulo">
            {confirmado ? '¡Reserva Confirmada!' : 'Experimenta BookIt'}
          </h2>
          <p className="demo-header-subtitulo">
            {confirmado
              ? 'Así de fácil es reservar con BookIt'
              : 'Así de simple reservan tus clientes'
            }
          </p>
        </div>

        {/* ====== INDICADOR DE PASOS ====== */}
        {!confirmado && (
          <div className="demo-pasos-indicador">
            {[1, 2, 3].map(num => (
              <div key={num} className={`demo-paso-punto ${paso >= num ? 'activo' : ''} ${paso === num ? 'actual' : ''}`}>
                <div className="demo-paso-circulo">
                  {paso > num ? (
                    <img src="https://img.icons8.com/ios-filled/14/ffffff/checkmark--v1.png" alt="✓" width="14" height="14" />
                  ) : (
                    num
                  )}
                </div>
                <span className="demo-paso-label">
                  {num === 1 ? 'Personas' : num === 2 ? 'Fecha' : 'Hora'}
                </span>
                {num < 3 && <div className={`demo-paso-linea ${paso > num ? 'completada' : ''}`} />}
              </div>
            ))}
          </div>
        )}

        {/* ====== CONTENIDO POR PASO ====== */}
        <div className={`demo-contenido ${animando ? 'demo-animando' : ''}`}>

          {/* ========== PASO 1: PERSONAS ========== */}
          {paso === 1 && !confirmado && (
            <div className="demo-paso demo-paso-personas">
              <div className="demo-paso-icono-grande">
                <img src="https://img.icons8.com/ios-filled/48/FDB022/conference-call.png" alt="" width="48" height="48" />
              </div>
              <h3>¿Cuántas personas?</h3>
              <p className="demo-paso-descripcion">Selecciona el número de persnas</p>

              <div className="demo-personas-selector">
                <button
                  className="demo-personas-btn"
                  onClick={() => setPersonas(prev => Math.max(1, prev - 1))}
                  disabled={personas <= 1}
                >
                  <img src="https://img.icons8.com/ios-filled/20/ffffff/minus-math.png" alt="-" width="20" height="20" />
                </button>
                <div className="demo-personas-numero">
                  <span className="demo-personas-valor">{personas}</span>
                  <span className="demo-personas-texto">
                    {personas === 1 ? 'persona' : 'personas'}
                  </span>
                </div>
                <button
                  className="demo-personas-btn"
                  onClick={() => setPersonas(prev => Math.min(12, prev + 1))}
                  disabled={personas >= 12}
                >
                  <img src="https://img.icons8.com/ios-filled/20/ffffff/plus-math.png" alt="+" width="20" height="20" />
                </button>
              </div>

              {/* Opciones rápidas */}
              <div className="demo-personas-rapidas">
                {[1, 2, 4, 6, 8].map(n => (
                  <button
                    key={n}
                    className={`demo-persona-rapida ${personas === n ? 'activa' : ''}`}
                    onClick={() => setPersonas(n)}
                  >
                    {n}
                  </button>
                ))}
              </div>

              <p className="demo-paso-nota">
                <img src="https://img.icons8.com/ios-filled/14/999999/info.png" alt="" width="14" height="14" />
                Para grupos mayores a 12, se recomienda reserva especial
              </p>

              <button className="demo-btn-siguiente" onClick={irSiguiente}>
                Siguiente
                <img src="https://img.icons8.com/ios-filled/16/ffffff/forward--v1.png" alt="→" width="16" height="16" />
              </button>
            </div>
          )}

          {/* ========== PASO 2: FECHA ========== */}
          {paso === 2 && !confirmado && (
            <div className="demo-paso demo-paso-fecha">
              <h3>Elige una fecha</h3>
              <p className="demo-paso-descripcion">Selecciona el día de l reserva</p>

              <div className="demo-calendario">
                {/* Header del calendario */}
                <div className="demo-cal-header">
                  <button className="demo-cal-nav" onClick={mesAnterior}>
                    <img src="https://img.icons8.com/ios-filled/16/FDB022/back.png" alt="←" width="16" height="16" />
                  </button>
                  <span className="demo-cal-mes">{MESES[mesActual]} {anioActual}</span>
                  <button className="demo-cal-nav" onClick={mesSiguiente}>
                    <img src="https://img.icons8.com/ios-filled/16/FDB022/forward--v1.png" alt="→" width="16" height="16" />
                  </button>
                </div>

                {/* Días de la semana */}
                <div className="demo-cal-dias-semana">
                  {DIAS_SEMANA.map(d => (
                    <span key={d} className="demo-cal-dia-nombre">{d}</span>
                  ))}
                </div>

                {/* Grid de días */}
                <div className="demo-cal-grid">
                  {diasMes.map((dia, i) => (
                    <button
                      key={i}
                      className={`demo-cal-dia ${!dia ? 'vacio' : ''} ${esDiaPasado(dia) ? 'pasado' : ''} ${dia === diaSeleccionado ? 'seleccionado' : ''} ${dia === hoy.getDate() && mesActual === hoy.getMonth() && anioActual === hoy.getFullYear() ? 'hoy' : ''}`}
                      onClick={() => dia && !esDiaPasado(dia) && setDiaSeleccionado(dia)}
                      disabled={!dia || esDiaPasado(dia)}
                    >
                      {dia}
                    </button>
                  ))}
                </div>
              </div>

              {diaSeleccionado && (
                <div className="demo-fecha-seleccion">
                  <img src="https://img.icons8.com/ios-filled/16/10B981/checkmark--v1.png" alt="✓" width="16" height="16" />
                  <span>{fechaFormateada}</span>
                </div>
              )}

              <div className="demo-botones-nav">
                <button className="demo-btn-anterior" onClick={irAnterior}>
                  <img src="https://img.icons8.com/ios-filled/16/999999/back.png" alt="←" width="16" height="16" />
                  Atrás
                </button>
                <button
                  className="demo-btn-siguiente"
                  onClick={irSiguiente}
                  disabled={!diaSeleccionado}
                >
                  Siguiente
                  <img src="https://img.icons8.com/ios-filled/16/ffffff/forward--v1.png" alt="→" width="16" height="16" />
                </button>
              </div>
            </div>
          )}

          {/* ========== PASO 3: HORA ========== */}
          {paso === 3 && !confirmado && (
            <div className="demo-paso demo-paso-hora">
              <h3>Selecciona la hora</h3>
              <p className="demo-paso-descripcion">{fechaFormateada} · {personas} {personas === 1 ? 'persona' : 'personas'}</p>

              <div className="demo-horarios-seccion">
                <div className="demo-horarios-grupo">
                  <span className="demo-horarios-titulo">
                    <img src="https://img.icons8.com/ios-filled/16/FDB022/sun--v1.png" alt="" width="16" height="16" />
                    Mediodía
                  </span>
                  <div className="demo-horarios-grid">
                    {HORARIOS_DISPONIBLES.filter(h => h.includes('12:') || h.includes('1:') || h.includes('2:')).map(hora => (
                      <button
                        key={hora}
                        className={`demo-hora-btn ${horaSeleccionada === hora ? 'seleccionada' : ''} ${horariosOcupados.includes(hora) ? 'ocupada' : ''}`}
                        onClick={() => !horariosOcupados.includes(hora) && setHoraSeleccionada(hora)}
                        disabled={horariosOcupados.includes(hora)}
                      >
                        {hora}
                        {horariosOcupados.includes(hora) && <span className="demo-hora-ocupada">Ocupado</span>}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="demo-horarios-grupo">
                  <span className="demo-horarios-titulo">
                    <img src="https://img.icons8.com/ios-filled/16/FDB022/crescent-moon.png" alt="" width="16" height="16" />
                    Noche
                  </span>
                  <div className="demo-horarios-grid">
                    {HORARIOS_DISPONIBLES.filter(h => parseInt(h) >= 7 && !h.includes('12:')).map(hora => (
                      <button
                        key={hora}
                        className={`demo-hora-btn ${horaSeleccionada === hora ? 'seleccionada' : ''} ${horariosOcupados.includes(hora) ? 'ocupada' : ''}`}
                        onClick={() => !horariosOcupados.includes(hora) && setHoraSeleccionada(hora)}
                        disabled={horariosOcupados.includes(hora)}
                      >
                        {hora}
                        {horariosOcupados.includes(hora) && <span className="demo-hora-ocupada">Ocupado</span>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Campo nombre (para hacerlo más real) */}
              <div className="demo-campo-nombre">
                <label>
                  <img src="https://img.icons8.com/ios-filled/14/999999/user.png" alt="" width="14" height="14" />
                  Tu nombre (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej: Carlos García"
                  value={nombreDemo}
                  onChange={(e) => setNombreDemo(e.target.value)}
                />
              </div>

              <div className="demo-botones-nav">
                <button className="demo-btn-anterior" onClick={irAnterior}>
                  <img src="https://img.icons8.com/ios-filled/16/999999/back.png" alt="←" width="16" height="16" />
                  Atrás
                </button>
                <button
                  className="demo-btn-confirmar"
                  onClick={confirmarReserva}
                  disabled={!horaSeleccionada}
                >
                  <img src="https://img.icons8.com/ios-filled/18/ffffff/checkmark--v1.png" alt="✓" width="18" height="18" />
                  Confirmar Reserva
                </button>
              </div>
            </div>
          )}

          {/* ========== CONFIRMACIÓN ========== */}
          {confirmado && (
            <div className="demo-paso demo-paso-confirmacion">
              <div className="demo-confirmacion-check">
                <div className="demo-check-circulo">
                  <img src="https://img.icons8.com/ios-filled/36/ffffff/checkmark--v1.png" alt="✓" width="36" height="36" />
                </div>
              </div>

              <h3>¡Reserva Exitosa!</h3>

              <div className="demo-confirmacion-tarjeta">
                <div className="demo-conf-fila">
                  <img src="https://img.icons8.com/ios-filled/18/FDB022/user.png" alt="" width="18" height="18" />
                  <span>{nombreDemo || 'Cliente Demo'}</span>
                </div>
                <div className="demo-conf-fila">
                  <img src="https://img.icons8.com/ios-filled/18/FDB022/conference-call.png" alt="" width="18" height="18" />
                  <span>{personas} {personas === 1 ? 'persona' : 'personas'}</span>
                </div>
                <div className="demo-conf-fila">
                  <img src="https://img.icons8.com/ios-filled/18/FDB022/calendar--v1.png" alt="" width="18" height="18" />
                  <span>{fechaFormateada}</span>
                </div>
                <div className="demo-conf-fila">
                  <img src="https://img.icons8.com/ios-filled/18/FDB022/clock--v1.png" alt="" width="18" height="18" />
                  <span>{horaSeleccionada}</span>
                </div>
              </div>

             

              <div className="demo-confirmacion-acciones">
                <button className="demo-btn-reiniciar" onClick={() => {
                  setPaso(1);
                  setPersonas(2);
                  setDiaSeleccionado(null);
                  setHoraSeleccionada(null);
                  setConfirmado(false);
                  setNombreDemo('');
                }}>
                  <img src="https://img.icons8.com/ios-filled/16/FDB022/refresh--v1.png" alt="" width="16" height="16" />
                  Probar otra vez
                </button>
                <button className="demo-btn-empezar" onClick={onCerrar}>
                  ¡Lo quiero para mi restaurante!
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ====== FOOTER ====== */}
        <div className="demo-footer">
          <img src="https://img.icons8.com/ios-filled/14/666666/lock-2.png" alt="" width="14" height="14" />
          <span>Esta demo es interactiva</span>
        </div>
      </div>
    </div>
  );
};

export default DemoReserva;
