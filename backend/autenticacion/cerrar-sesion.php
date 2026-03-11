<?php
/**
 * ============================================
 * BOOKIT - Cerrar Sesion
 * Archivo: autenticacion/cerrar-sesion.php
 * ============================================
 */

require_once '../configuracion/conexion.php';

// session_destroy() elimina completamente la sesión del servidor.
// Después de esto, $_SESSION queda vacío y la cookie de sesión deja de ser válida.
// El frontend también borra el localStorage por su cuenta después de llamar esto.
session_destroy();

echo json_encode(["mensaje" => "Sesion cerrada exitosamente"]);
?>
