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
$origenes_config = getenv('CORS_ORIGIN') ?: 'http://localhost:3000';
$origen_peticion = $_SERVER['HTTP_ORIGIN'] ?? '';

$origenes_permitidos = array_values(array_filter(array_map('trim', explode(',', $origenes_config))));

if (empty($origenes_permitidos)) {
    $origenes_permitidos = ['http://localhost:3000'];
}

$normalizar_origen = static function ($origen) {
    return rtrim(strtolower(trim((string) $origen)), '/');
};

$origen_peticion_norm = $normalizar_origen($origen_peticion);
$origenes_permitidos_norm = array_map($normalizar_origen, $origenes_permitidos);

if ($origen_peticion !== '' && in_array('*', $origenes_permitidos_norm, true)) {
    header('Access-Control-Allow-Origin: ' . $origen_peticion);
    header('Access-Control-Allow-Credentials: true');
    header('Vary: Origin');
} elseif ($origen_peticion !== '' && in_array($origen_peticion_norm, $origenes_permitidos_norm, true)) {
    header('Access-Control-Allow-Origin: ' . $origen_peticion);
    header('Access-Control-Allow-Credentials: true');
    header('Vary: Origin');
}

header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Max-Age: 86400');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

// ============================================
// CONEXION POSTGRESQL (PDO)
// ============================================
$servidor = getenv('DB_HOST') ?: '127.0.0.1';
$puerto = getenv('DB_PORT') ?: '5432';
$base_datos = getenv('DB_NAME') ?: 'bookit';
$usuario = getenv('DB_USER') ?: 'postgres';
$contrasena = getenv('DB_PASSWORD') ?: '3014751';

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
    $usa_https = (
        (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ||
        (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https')
    );

    $secure_env = getenv('SESSION_COOKIE_SECURE');
    $session_cookie_secure = $secure_env === false || $secure_env === ''
        ? $usa_https
        : filter_var($secure_env, FILTER_VALIDATE_BOOLEAN);

    $session_cookie_samesite = trim((string) (getenv('SESSION_COOKIE_SAMESITE') ?: ''));
    if ($session_cookie_samesite === '') {
        $session_cookie_samesite = $session_cookie_secure ? 'None' : 'Lax';
    }

    if (!$session_cookie_secure && strcasecmp($session_cookie_samesite, 'None') === 0) {
        $session_cookie_samesite = 'Lax';
    }

    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => $session_cookie_secure,
        'httponly' => true,
        'samesite' => $session_cookie_samesite,
    ]);
    session_start();
}
?>
