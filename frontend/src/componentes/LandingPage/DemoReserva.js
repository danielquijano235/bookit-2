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
import Boton from '../Compartidos/Boton';
import { verificarSesion, crearCliente, crearReserva } from '../../servicios/api';

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

const DemoReserva = ({ visible, onCerrar, selectedEvent, demoOnly = false, source = null }) => {
  // ============================================
  // ESTADOS
  // ============================================
  // Nota: aquí se mantienen los estados del flujo de reserva demo.
  // - `paso`: paso actual del wizard (1 personas, 2 fecha, 3 hora)
  // - `personas`, `diaSeleccionado`, `horaSeleccionada`: datos elegidos por el usuario
  // - `nombreDemo`, `telefonoDemo`, `emailDemo`: información de contacto del demo
  const [paso, setPaso] = useState(1);
  const [personas, setPersonas] = useState(2);
  const [mesActual, setMesActual] = useState(new Date().getMonth());
  const [anioActual, setAnioActual] = useState(new Date().getFullYear());
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);
  const [horaSeleccionada, setHoraSeleccionada] = useState(null);
  const [animando, setAnimando] = useState(false);
  const [confirmado, setConfirmado] = useState(false);
  const [nombreDemo, setNombreDemo] = useState('');
  const [telefonoDemo, setTelefonoDemo] = useState('');
  const [emailDemo, setEmailDemo] = useState('');

  const hoy = new Date();
  const diasMes = obtenerDiasMes(anioActual, mesActual);

  // Determinar límite de personas según origen del modal:
  // - Si `selectedEvent` existe -> modal de evento -> límite 200
  // - Si `source` es 'hero' o 'reservar' -> modal abierto desde hero/cta -> límite 15
  // - En resto de casos mantener el comportamiento histórico (12)
  const maxPersonas = selectedEvent ? 200 : (source === 'hero' || source === 'reservar' ? 25 : 12);

  // Asegurar que el estado `personas` no supere el máximo al cambiar la fuente
  useEffect(() => {
    if (personas > maxPersonas) setPersonas(maxPersonas);
  }, [maxPersonas]);

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
      setTelefonoDemo('');
      setAnimando(false);
    }
  }, [visible]);

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    if (visible) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = originalOverflow;
    };
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
  // Función que orquesta el envío o guardado local de la reserva.
  // - Si `demoOnly` es true (hero demo) se guarda en `localStorage` y no se llama al backend.
  // - Si no, intenta verificar sesión y crear la reserva en backend; si no hay sesión, no falla la UX.
  const confirmarReserva = () => {
    // Enviar reserva: si hay sesión, crear en backend; si no, guardar localmente (demo)
    const enviar = async () => {
      setAnimando(true);
      try {
        const notaEvento = selectedEvent ? `Evento: ${selectedEvent.title}` : '';

        // Si este modal es solo demo (hero), simulamos la reserva pero NO la almacenamos
        if (demoOnly) {
          const fechaISO = diaSeleccionado ? `${anioActual}-${String(mesActual+1).padStart(2,'0')}-${String(diaSeleccionado).padStart(2,'0')}` : '';
          const parseHora = (h) => {
            if (!h) return '';
            const m = h.match(/(\d{1,2}):(\d{2})\s*(am|pm)?/i);
            if (!m) return h;
            let hh = parseInt(m[1],10);
            const mm = m[2];
            const ampm = (m[3] || '').toLowerCase();
            if (ampm === 'pm' && hh < 12) hh += 12;
            if (ampm === 'am' && hh === 12) hh = 0;
            return `${String(hh).padStart(2,'0')}:${mm}:00`;
          };
          const hora24 = parseHora(horaSeleccionada);
          const demo = {
            id: `demo-${Date.now()}`,
            cliente_nombre: nombreDemo || 'Cliente Demo',
            cliente_telefono: telefonoDemo || '',
            cliente_email: emailDemo || '',
            numero_personas: personas,
            fecha: fechaISO,
            hora: hora24,
            estado: 'pendiente',
            mesa_numero: null,
            notas_especiales: notaEvento
          };
          // Intencionalmente NO se persiste `demo` en localStorage ni se envía al backend.
        } else {
          // Intentar verificar sesión en backend. Si existe sesión autenticada,
          // creamos el cliente (si se proporcionó nombre) y luego la reserva.
          const sesion = await verificarSesion().catch(() => null);
          if (sesion && sesion.autenticado) {
            // Crear cliente si se dio nombre (incluye teléfono y email opcional)
            let cliente_id = null;
            if (nombreDemo && nombreDemo.trim()) {
              try {
                const respCliente = await crearCliente({ nombre: nombreDemo.trim(), telefono: telefonoDemo.trim(), email: (emailDemo || '').trim() });
                // `crearCliente` puede devolver { cliente: { id } } o { id }
                cliente_id = respCliente?.cliente?.id || respCliente?.id || null;
              } catch (e) {
                console.warn('No se pudo crear cliente demo:', e);
              }
            }

            const fechaISO = diaSeleccionado ? `${anioActual}-${String(mesActual+1).padStart(2,'0')}-${String(diaSeleccionado).padStart(2,'0')}` : '';
            const hora24 = horaSeleccionada && horaSeleccionada.includes(':') ? (horaSeleccionada.length === 8 ? horaSeleccionada : horaSeleccionada + ':00') : '';

            const datosReserva = {
              cliente_id: cliente_id,
              cliente_email: emailDemo || '',
              numero_personas: personas,
              fecha: fechaISO,
              hora: hora24,
              mesa_id: null,
              notas_especiales: notaEvento
            };

            const res = await crearReserva(datosReserva);
          }
        }

        // Mostrar confirmación
        setTimeout(() => {
          setConfirmado(true);
          setAnimando(false);
        }, 300);
      } catch (err) {
        console.error('Error al enviar reserva demo:', err);
        setAnimando(false);
        setConfirmado(true);
      }
    };
    enviar();
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
        <Boton variante="secundario" onClick={onCerrar} className="demo-cerrar btn--ghost" aria-label="Cerrar demo" title="Cerrar">
          <span className="demo-close-x" aria-hidden="true">×</span>
        </Boton>

        {/* ====== HEADER (modal específico) ====== */}
        <div className="demo-modal-header">
          <div className="demo-header-icono">
            <img src="https://img.icons8.com/ios-filled/28/FDB022/restaurant.png" alt="" width="28" height="28" />
          </div>
          <h2 className="demo-header-titulo">
            {confirmado ? '¡Reserva Confirmada!' : 'Experimenta BookIt'}
          </h2>
          <p className="demo-header-subtitulo">
            {confirmado
              ? 'Así de fácil es reservar con BookIt'
              : (selectedEvent ? `Reservando: ${selectedEvent.title}` : 'Así de simple reservan tus clientes')
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
                  aria-label="Restar personas"
                  title="Restar"
                >
                  <span className="demo-personas-sign">−</span>
                </button>
                <div className="demo-personas-numero">
                  <span className="demo-personas-valor">{personas}</span>
                  <span className="demo-personas-texto">
                    {personas === 1 ? 'persona' : 'personas'}
                  </span>
                </div>

                {/* Input numérico para modal de evento: permite escribir la cantidad directamente */}
                {selectedEvent && (
                  <div style={{ marginLeft: 12 }}>
                    <input
                      type="number"
                      min={1}
                      max={maxPersonas}
                      value={personas}
                      onChange={(e) => {
                        const v = parseInt(e.target.value || '0', 10);
                        if (Number.isNaN(v)) return;
                        const clamped = Math.max(1, Math.min(maxPersonas, v));
                        setPersonas(clamped);
                      }}
                      onBlur={(e) => {
                        const v = parseInt(e.target.value || '0', 10);
                        const clamped = Number.isNaN(v) ? 1 : Math.max(1, Math.min(maxPersonas, v));
                        if (clamped !== personas) setPersonas(clamped);
                      }}
                      className="demo-personas-input"
                      aria-label="Número de personas"
                      style={{ width: 86, padding: '6px 8px', borderRadius: 8, border: '1px solid #e6e6e6' }}
                    />
                  </div>
                )}
                <button
                  className="demo-personas-btn"
                  onClick={() => setPersonas(prev => Math.min(maxPersonas, prev + 1))}
                  disabled={personas >= maxPersonas}
                  aria-label="Sumar personas"
                  title="Sumar"
                >
                  <span className="demo-personas-sign">+</span>
                </button>
              </div>

              {/* Opciones rápidas */}
              <div className="demo-personas-rapidas">
                {[1, 2, 4, 6, 8].map(n => (
                  <Boton
                    key={n}
                    variante={personas === n ? 'primario' : 'secundario'}
                    className={`demo-persona-rapida ${personas === n ? 'activa' : ''}`}
                    onClick={() => setPersonas(Math.min(n, maxPersonas))}
                  >
                    {n}
                  </Boton>
                ))}
              </div>

              { (source === 'hero' || source === 'reservar') && (
                <p className="demo-paso-nota">
                  <img src="https://img.icons8.com/ios-filled/14/999999/info.png" alt="" width="14" height="14" />
                  Para grupos mayores a 25, se recomienda reserva especial
                </p>
              ) }

              <Boton variante="primario" className="demo-btn-siguiente" onClick={irSiguiente}>
                Siguiente
                <img src="https://img.icons8.com/ios-filled/16/ffffff/forward--v1.png" alt="→" width="16" height="16" />
              </Boton>
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
                  <Boton variante="secundario" className="demo-cal-nav" onClick={mesAnterior}>
                    <img src="https://img.icons8.com/ios-filled/16/FDB022/back.png" alt="←" width="16" height="16" />
                  </Boton>
                  <span className="demo-cal-mes">{MESES[mesActual]} {anioActual}</span>
                  <Boton variante="secundario" className="demo-cal-nav" onClick={mesSiguiente}>
                    <img src="https://img.icons8.com/ios-filled/16/FDB022/forward--v1.png" alt="→" width="16" height="16" />
                  </Boton>
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
                    <Boton
                      key={i}
                      variante={dia === diaSeleccionado ? 'primario' : 'secundario'}
                      className={`demo-cal-dia ${!dia ? 'vacio' : ''} ${esDiaPasado(dia) ? 'pasado' : ''} ${dia === diaSeleccionado ? 'seleccionado' : ''} ${dia === hoy.getDate() && mesActual === hoy.getMonth() && anioActual === hoy.getFullYear() ? 'hoy' : ''}`}
                      onClick={() => dia && !esDiaPasado(dia) && setDiaSeleccionado(dia)}
                      disabled={!dia || esDiaPasado(dia)}
                    >
                      {dia}
                    </Boton>
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
                <Boton variante="secundario" className="demo-btn-anterior" onClick={irAnterior}>
                  <img src="https://img.icons8.com/ios-filled/16/999999/back.png" alt="←" width="16" height="16" />
                  Atrás
                </Boton>
                <Boton variante="primario" className="demo-btn-siguiente" onClick={irSiguiente} disabled={!diaSeleccionado}>
                  Siguiente
                  <img src="https://img.icons8.com/ios-filled/16/ffffff/forward--v1.png" alt="→" width="16" height="16" />
                </Boton>
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
                      <Boton
                        key={hora}
                        variante={horaSeleccionada === hora ? 'primario' : 'secundario'}
                        className={`demo-hora-btn ${horaSeleccionada === hora ? 'seleccionada' : ''} ${horariosOcupados.includes(hora) ? 'ocupada' : ''}`}
                        onClick={() => !horariosOcupados.includes(hora) && setHoraSeleccionada(hora)}
                        disabled={horariosOcupados.includes(hora)}
                      >
                        {hora}
                        {horariosOcupados.includes(hora) && <span className="demo-hora-ocupada">Ocupado</span>}
                      </Boton>
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
                  Tu nombre *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Carlos García"
                  value={nombreDemo}
                  onChange={(e) => setNombreDemo(e.target.value)}
                  required
                />
              </div>

              <div className="demo-campo-telefono">
                <label>
                  <img src="https://img.icons8.com/ios-filled/14/999999/phone.png" alt="" width="14" height="14" />
                  Teléfono *
                </label>
                <input
                  type="tel"
                  placeholder="Ej: 3001234567"
                  value={telefonoDemo}
                  onChange={(e) => setTelefonoDemo(e.target.value)}
                  required
                />
              </div>

              <div className="demo-campo-email">
                <label>
                  <img src="https://img.icons8.com/ios-filled/14/999999/email.png" alt="" width="14" height="14" />
                  Email (opcional)
                </label>
                <input
                  type="email"
                  placeholder="ejemplo@correo.com"
                  value={emailDemo}
                  onChange={(e) => setEmailDemo(e.target.value)}
                />
              </div>

              <div className="demo-botones-nav">
                <Boton variante="secundario" className="demo-btn-anterior" onClick={irAnterior}>
                  <img src="https://img.icons8.com/ios-filled/16/999999/back.png" alt="←" width="16" height="16" />
                  Atrás
                </Boton>
                <Boton variante="primario" className="demo-btn-confirmar" onClick={confirmarReserva} disabled={!horaSeleccionada || !nombreDemo.trim() || (telefonoDemo || '').trim().length < 7}>
                  <img src="https://img.icons8.com/ios-filled/18/ffffff/checkmark--v1.png" alt="✓" width="18" height="18" />
                  Confirmar Reserva
                </Boton>
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
                <Boton variante="secundario" className="demo-btn-reiniciar" onClick={() => {
                  setPaso(1);
                  setPersonas(2);
                  setDiaSeleccionado(null);
                  setHoraSeleccionada(null);
                  setConfirmado(false);
                  setNombreDemo('');
                  setEmailDemo('');
                }}>
                  <img src="https://img.icons8.com/ios-filled/16/FDB022/refresh--v1.png" alt="" width="16" height="16" />
                  Probar otra vez
                </Boton>
                <Boton variante="primario" className="demo-btn-empezar" onClick={onCerrar}>
                  ¡Lo quiero para mi restaurante!
                </Boton>
              </div>
            </div>
          )}
        </div>

        {/* footer removed from modal to prevent extra scroll */}
      </div>
    </div>
  );
};

export default DemoReserva;
