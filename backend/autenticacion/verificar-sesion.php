<?php
/**
 * ============================================
 * BOOKIT - Verificar Sesion
 * Archivo: autenticacion/verificar-sesion.php
 * ============================================
 */

require_once '../configuracion/conexion.php';

if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(["autenticado" => false]);
    exit();
}

echo json_encode([
    "autenticado" => true,
    "usuario" => [
        "id" => (int)$_SESSION['usuario_id'],
        "nombre" => $_SESSION['usuario_nombre'],
        "email" => $_SESSION['usuario_email'],
        "restaurante" => $_SESSION['usuario_restaurante'] ?? ''
    ]
]);
?>
