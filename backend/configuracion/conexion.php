<?php
/**
 * ============================================
 * BOOKIT - Configuracion de Conexion a Base de Datos
 * Archivo: configuracion/conexion.php
 * ============================================
 *
 * Conexion central del backend usando PDO para PostgreSQL.
 * Lee credenciales desde variables de entorno para despliegues en Render.
 */

header("Content-Type: application/json; charset=UTF-8");

// ============================================
// CONFIGURACION CORS
// ============================================
$origen_permitido = getenv('CORS_ORIGIN') ?: 'http://localhost:3000';
$origen_peticion = $_SERVER['HTTP_ORIGIN'] ?? '';

if ($origen_permitido === '*') {
    header("Access-Control-Allow-Origin: *");
} elseif ($origen_peticion === $origen_permitido) {
    header("Access-Control-Allow-Origin: " . $origen_permitido);
    header("Access-Control-Allow-Credentials: true");
}

header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ============================================
// CONEXION POSTGRESQL (PDO)
// ============================================
$servidor = getenv('DB_HOST') ?: '127.0.0.1';
$puerto = getenv('DB_PORT') ?: '5432';
$base_datos = getenv('DB_NAME') ?: 'bookit';
$usuario = getenv('DB_USER') ?: 'postgres';
$contrasena = getenv('DB_PASSWORD') ?: '';

$dsn = "pgsql:host={$servidor};port={$puerto};dbname={$base_datos}";

try {
    $conexion = new PDO($dsn, $usuario, $contrasena, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error de conexion a base de datos"]);
    exit();
}

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
?>
