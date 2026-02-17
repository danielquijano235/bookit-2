<?php
/**
 * ============================================
 * BOOKIT - Cerrar Sesión
 * Archivo: autenticacion/cerrar-sesion.php
 * ============================================
 * 
 * Recibe: POST (no requiere parámetros)
 * Devuelve: JSON con mensaje de confirmación
 * 
 * Destruye la sesión del usuario para que tenga
 * que volver a iniciar sesión.
 */

require_once '../configuracion/conexion.php';

// Destruir todas las variables de sesión
session_destroy();

// Confirmar que se cerró la sesión
echo json_encode(["mensaje" => "Sesión cerrada exitosamente"]);
?>
