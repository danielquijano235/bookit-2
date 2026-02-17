<?php
/**
 * ============================================
 * BOOKIT - Configuración de Conexión a Base de Datos
 * Archivo: configuracion/conexion.php
 * ============================================
 * 
 * Este archivo establece la conexión con la base de datos MySQL
 * y configura los headers necesarios para que React pueda
 * comunicarse con el backend (CORS).
 * 
 * Se incluye al inicio de todos los demás archivos PHP.
 */

// ============================================
// DATOS DE CONEXIÓN A LA BASE DE DATOS
// Modificar según tu configuración de XAMPP
// ============================================
$servidor = "localhost";
$usuario = "root";
$contrasena = "";       // Vacía por defecto en XAMPP
$base_datos = "bookit";

// ============================================
// CREAR CONEXIÓN CON LA BASE DE DATOS
// Usamos mysqli_connect para conectar PHP con MySQL
// ============================================
$conexion = mysqli_connect($servidor, $usuario, $contrasena, $base_datos);

// Verificar si la conexión fue exitosa
if (!$conexion) {
    // Si falla, mostrar error y detener el script
    die("Error de conexión: " . mysqli_connect_error());
}

// Configurar la codificación a UTF-8 para soportar caracteres especiales (acentos, ñ, etc.)
mysqli_set_charset($conexion, "utf8");

// ============================================
// CONFIGURACIÓN DE CORS (Cross-Origin Resource Sharing)
// Esto es necesario porque React corre en localhost:3000
// y PHP corre en localhost (puerto 80).
// Sin estos headers, el navegador bloquea las peticiones.
// ============================================
header("Access-Control-Allow-Origin: http://localhost:3000");  // Permitir peticiones desde React
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");  // Métodos HTTP permitidos
header("Access-Control-Allow-Headers: Content-Type, Authorization");  // Headers permitidos
header("Access-Control-Allow-Credentials: true");  // Permitir envío de cookies (para sesiones)
header("Content-Type: application/json; charset=UTF-8");  // Todas las respuestas serán JSON

// ============================================
// MANEJAR PETICIONES PREFLIGHT (OPTIONS)
// El navegador envía una petición OPTIONS antes de
// la petición real para verificar si tiene permisos.
// Respondemos con 200 OK para que continúe.
// ============================================
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ============================================
// INICIAR SESIÓN PHP
// Esto permite guardar datos del usuario logueado
// entre diferentes peticiones.
// ============================================
session_start();
?>
