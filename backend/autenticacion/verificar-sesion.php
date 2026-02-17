<?php
/**
 * ============================================
 * BOOKIT - Verificar Sesión
 * Archivo: autenticacion/verificar-sesion.php
 * ============================================
 * 
 * Recibe: GET (no requiere parámetros)
 * Devuelve: JSON indicando si el usuario está autenticado
 *           y sus datos si lo está.
 * 
 * Este archivo se usa para verificar si hay una sesión
 * activa cuando el usuario entra al dashboard o recarga la página.
 */

require_once '../configuracion/conexion.php';

// Verificar si hay una sesión activa
// (si existe el usuario_id en $_SESSION significa que se logueó)
if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401); // 401 = No autorizado
    echo json_encode(["autenticado" => false]);
    exit();
}

// Si hay sesión, devolver los datos del usuario
echo json_encode([
    "autenticado" => true,
    "usuario" => [
        "id" => $_SESSION['usuario_id'],
        "nombre" => $_SESSION['usuario_nombre'],
        "email" => $_SESSION['usuario_email'],
        "restaurante" => $_SESSION['usuario_restaurante'] ?? ''
    ]
]);
?>
