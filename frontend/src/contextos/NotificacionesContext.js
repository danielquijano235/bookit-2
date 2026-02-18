/**
 * ============================================
 * BOOKIT - Contexto de Notificaciones
 * Archivo: contextos/NotificacionesContext.js
 * ============================================
 * 
 * Propósito: Sistema centralizado de notificaciones para todo
 * el dashboard. Usa React Context para compartir el estado
 * de las notificaciones entre todos los componentes.
 * 
 * Las notificaciones se guardan en localStorage para que
 * persistan al recargar la página.
 * 
 * Tipos de notificación:
 *   - reserva: Nueva reserva creada o estado cambiado
 *   - cliente: Nuevo cliente registrado
 *   - sistema: Alertas del sistema (ocupación, etc.)
 *   - info: Información general
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Crear el contexto
const NotificacionesContext = createContext();

// Clave para guardar en localStorage
const STORAGE_KEY = 'bookit_notificaciones';

/**
 * Cargar notificaciones guardadas en localStorage
 * Si no hay nada guardado, devuelve notificaciones iniciales de ejemplo
 */
const cargarNotificaciones = () => {
  try {
    const guardadas = localStorage.getItem(STORAGE_KEY);
    if (guardadas) {
      return JSON.parse(guardadas);
    }
  } catch (error) {
    console.error('Error al cargar notificaciones:', error);
  }

  // Notificaciones iniciales de ejemplo
  return [
    {
      id: 1,
      tipo: 'reserva',
      titulo: 'Nueva reserva confirmada',
      mensaje: 'Carlos Rodríguez reservó mesa para 4 personas a las 19:00',
      fecha: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // Hace 15 min
      leida: false,
    },
    {
      id: 2,
      tipo: 'cliente',
      titulo: 'Nuevo cliente registrado',
      mensaje: 'Valentina Herrera se ha registrado como nueva cliente',
      fecha: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // Hace 45 min
      leida: false,
    },
    {
      id: 3,
      tipo: 'sistema',
      titulo: 'Ocupación alta',
      mensaje: 'La ocupación del restaurante ha superado el 80% hoy',
      fecha: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // Hace 2 horas
      leida: false,
    },
    {
      id: 4,
      tipo: 'reserva',
      titulo: 'Reserva cancelada',
      mensaje: 'Pedro Sánchez ha cancelado su reserva de las 13:00',
      fecha: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // Hace 3 horas
      leida: true,
    },
    {
      id: 5,
      tipo: 'info',
      titulo: 'Bienvenido a BookIt',
      mensaje: 'Tu sistema de reservas está listo. ¡Gestiona tu restaurante fácilmente!',
      fecha: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // Hace 1 día
      leida: true,
    },
  ];
};

/**
 * Provider de notificaciones.
 * Envuelve el dashboard para dar acceso a las notificaciones
 * desde cualquier componente hijo.
 */
export const NotificacionesProvider = ({ children }) => {
  const [notificaciones, setNotificaciones] = useState(cargarNotificaciones);

  // Guardar en localStorage cada vez que cambien
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notificaciones));
    } catch (error) {
      console.error('Error al guardar notificaciones:', error);
    }
  }, [notificaciones]);

  /**
   * Agregar una nueva notificación
   * @param {string} tipo - 'reserva' | 'cliente' | 'sistema' | 'info'
   * @param {string} titulo - Título corto de la notificación
   * @param {string} mensaje - Descripción detallada
   */
  const agregarNotificacion = useCallback((tipo, titulo, mensaje) => {
    const nueva = {
      id: Date.now(),
      tipo,
      titulo,
      mensaje,
      fecha: new Date().toISOString(),
      leida: false,
    };
    setNotificaciones(prev => [nueva, ...prev]);
  }, []);

  /**
   * Marcar una notificación como leída
   */
  const marcarComoLeida = useCallback((id) => {
    setNotificaciones(prev =>
      prev.map(n => n.id === id ? { ...n, leida: true } : n)
    );
  }, []);

  /**
   * Marcar todas las notificaciones como leídas
   */
  const marcarTodasLeidas = useCallback(() => {
    setNotificaciones(prev => prev.map(n => ({ ...n, leida: true })));
  }, []);

  /**
   * Eliminar una notificación
   */
  const eliminarNotificacion = useCallback((id) => {
    setNotificaciones(prev => prev.filter(n => n.id !== id));
  }, []);

  /**
   * Limpiar todas las notificaciones
   */
  const limpiarTodas = useCallback(() => {
    setNotificaciones([]);
  }, []);

  // Calcular cantidad de no leídas
  const noLeidas = notificaciones.filter(n => !n.leida).length;

  // Valor que se comparte con todos los componentes hijos
  const valor = {
    notificaciones,
    noLeidas,
    agregarNotificacion,
    marcarComoLeida,
    marcarTodasLeidas,
    eliminarNotificacion,
    limpiarTodas,
  };

  return (
    <NotificacionesContext.Provider value={valor}>
      {children}
    </NotificacionesContext.Provider>
  );
};

/**
 * Hook personalizado para usar las notificaciones desde cualquier componente.
 * Uso: const { notificaciones, agregarNotificacion, noLeidas } = useNotificaciones();
 */
export const useNotificaciones = () => {
  const contexto = useContext(NotificacionesContext);
  if (!contexto) {
    throw new Error('useNotificaciones debe usarse dentro de NotificacionesProvider');
  }
  return contexto;
};

export default NotificacionesContext;
