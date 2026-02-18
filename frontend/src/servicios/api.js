

// ============================================
// CONFIGURACIÓN BASE
// Esta URL debe coincidir con la carpeta del backend en XAMPP
// Por ejemplo: C:/xampp/htdocs/bookit-api/
// ============================================
const API_URL = 'http://localhost/bookit-api';

/**
 * Función auxiliar para hacer peticiones HTTP
 * Es una función "helper" que simplifica el código repetitivo.
 * 
 * @param {string} endpoint - Ruta del archivo PHP (ej: '/autenticacion/login.php')
 * @param {Object} opciones - Configuración de la petición (method, body, etc.)
 * @returns {Object} - Datos JSON de la respuesta
 */
const peticion = async (endpoint, opciones = {}) => {
  try {
    // Hacer la petición HTTP con fetch
    const respuesta = await fetch(`${API_URL}${endpoint}`, {
      ...opciones,
      credentials: 'include', // MUY IMPORTANTE: envía las cookies de sesión PHP
      headers: {
        'Content-Type': 'application/json', // Indicar que enviamos JSON
        ...opciones.headers,
      },
    });

    // Convertir la respuesta a JSON
    const datos = await respuesta.json();

    // Si la respuesta no es exitosa (código 400, 401, 500, etc.)
    if (!respuesta.ok) {
      throw new Error(datos.error || 'Error en la petición');
    }

    return datos; // Devolver los datos exitosos
  } catch (error) {
    console.error('Error en petición API:', error);
    throw error; // Re-lanzar el error para que lo maneje quien llamó
  }
};



/**
 * Iniciar sesión con email y contraseña
 * @param {string} email - Email del usuario
 * @param {string} contrasena - Contraseña del usuario
 * @returns {Object} - { mensaje, usuario: { id, nombre, email, restaurante } }
 */
export const login = async (email, contrasena) => {
  return peticion('/autenticacion/login.php', {
    method: 'POST',
    body: JSON.stringify({ email, contrasena }),
  });
};

/**
 * Verificar si hay una sesión activa
 * Se usa para proteger rutas (verificar si el usuario está logueado)
 * @returns {Object} - { autenticado: true/false, usuario: {...} }
 */
export const verificarSesion = async () => {
  return peticion('/autenticacion/verificar-sesion.php');
};

/**
 * Cerrar la sesión del usuario
 * Destruye la sesión PHP en el servidor
 * @returns {Object} - { mensaje: "Sesión cerrada exitosamente" }
 */
export const cerrarSesion = async () => {
  return peticion('/autenticacion/cerrar-sesion.php', {
    method: 'POST',
  });
};


/**
 * Obtener métricas del día actual
 * @returns {Object} - { reservas_hoy, clientes_nuevos, ocupacion, ingresos_hoy }
 */
export const obtenerMetricasHoy = async () => {
  return peticion('/estadisticas/metricas-hoy.php');
};

/**
 * Obtener reservas agrupadas por día de la semana
 * @returns {Object} - { "Lun": 45, "Mar": 52, ... }
 */
export const obtenerReservasSemana = async () => {
  return peticion('/estadisticas/reservas-semana.php');
};

/**
 * Obtener las próximas reservas (pendientes y confirmadas)
 * @returns {Array} - Array de objetos de reserva
 */
export const obtenerProximasReservas = async () => {
  return peticion('/estadisticas/proximas-reservas.php');
};

// ============================================
// FUNCIONES DE RESERVAS
// CRUD completo (Crear, Leer, Actualizar, Eliminar)
// ============================================

/**
 * Obtener todas las reservas del restaurante
 * @returns {Array} - Array con todas las reservas
 */
export const obtenerTodasReservas = async () => {
  return peticion('/reservas/obtener-todas.php');
};

/**
 * Crear una nueva reserva
 * @param {Object} datosReserva - { cliente_id, fecha, hora, numero_personas, mesa_id, notas_especiales }
 * @returns {Object} - { mensaje, id }
 */
export const crearReserva = async (datosReserva) => {
  return peticion('/reservas/crear.php', {
    method: 'POST',
    body: JSON.stringify(datosReserva),
  });
};

/**
 * Actualizar el estado de una reserva
 * @param {number} id - ID de la reserva
 * @param {string} estado - Nuevo estado ('pendiente', 'confirmada', 'cancelada', 'completada')
 * @returns {Object} - { mensaje }
 */
export const actualizarReserva = async (id, estado) => {
  return peticion('/reservas/actualizar.php', {
    method: 'PUT',
    body: JSON.stringify({ id, estado }),
  });
};

/**
 * Eliminar una reserva
 * @param {number} id - ID de la reserva a eliminar
 * @returns {Object} - { mensaje }
 */
export const eliminarReserva = async (id) => {
  return peticion(`/reservas/eliminar.php?id=${id}`, {
    method: 'DELETE',
  });
};

// ============================================
// FUNCIONES DE CLIENTES
// ============================================

/**
 * Obtener todos los clientes del restaurante
 * @returns {Array} - Array con todos los clientes
 */
export const obtenerTodosClientes = async () => {
  return peticion('/clientes/obtener-todos.php');
};

/**
 * Crear un nuevo cliente
 * @param {Object} datosCliente - { nombre, telefono, email, preferencias }
 * @returns {Object} - { mensaje, cliente }
 */
export const crearCliente = async (datosCliente) => {
  return peticion('/clientes/crear.php', {
    method: 'POST',
    body: JSON.stringify(datosCliente),
  });
};
