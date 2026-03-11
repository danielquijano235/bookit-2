<?php
/**
 * ============================================
 * BOOKIT - Verificar Sesion
 * Archivo: autenticacion/verificar-sesion.php
 * ============================================
 */

require_once '../configuracion/conexion.php';

// Verificar si existe la variable de sesión que se guarda al hacer login.
// Si no existe, significa que no hay sesión activa o que ya expiró.
if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401); // No autorizado
    echo json_encode(["autenticado" => false]);
    exit();
}

// Si la sesión existe, devolver los datos del usuario al frontend.
// El frontend usa esto para saber qué nombre mostrar y qué restaurante es.
echo json_encode([
    "autenticado" => true,
    "usuario" => [
        "id" => (int)$_SESSION['usuario_id'],
        "nombre" => $_SESSION['usuario_nombre'],
        "email" => $_SESSION['usuario_email'],
        "restaurante" => $_SESSION['usuario_restaurante'] ?? '' // puede estar vacío si no se llenó
    ]
]);
?>
