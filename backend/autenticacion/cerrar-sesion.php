<?php
/**
 * ============================================
 * BOOKIT - Cerrar Sesion
 * Archivo: autenticacion/cerrar-sesion.php
 * ============================================
 */

require_once '../configuracion/conexion.php';

session_destroy();

echo json_encode(["mensaje" => "Sesion cerrada exitosamente"]);
?>
