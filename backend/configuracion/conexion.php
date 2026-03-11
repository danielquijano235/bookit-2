<?php


// Indicar al navegador que este endpoint siempre devuelve JSON
header("Content-Type: application/json; charset=UTF-8");

// CONFIGURACION CORS
// CORS controla qué dominios pueden hacer peticiones a este backend.
// Sin esto, el navegador bloquea las peticiones desde el frontend.


// Leer la variable de entorno CORS_ORIGIN; en local será http://localhost:3000
// En producción (Render) se configura con el dominio real del frontend
$origenes_config = getenv('CORS_ORIGIN') ?: 'http://localhost:3000';

// El header HTTP_ORIGIN viene en la petición e indica desde qué dominio viene
$origen_peticion = $_SERVER['HTTP_ORIGIN'] ?? '';

// La variable de entorno puede tener varios dominios separados por coma
// explode los separa, trim elimina espacios, array_filter quita valores vacíos
$origenes_permitidos = array_values(array_filter(array_map('trim', explode(',', $origenes_config))));

// Por seguridad, si la variable de entorno vino vacía, usar localhost por defecto
if (empty($origenes_permitidos)) {
    $origenes_permitidos = ['http://localhost:3000'];
}

// Función para normalizar URLs antes de compararlas:
// pasa a minúsculas, quita espacios y elimina la barra final
// Así "http://localhost:3000/" y "http://localhost:3000" son iguales
$normalizar_origen = static function ($origen) {
    return rtrim(strtolower(trim((string) $origen)), '/');
};

// Normalizar el origen que llegó en la petición y la lista de permitidos
$origen_peticion_norm = $normalizar_origen($origen_peticion);
$origenes_permitidos_norm = array_map($normalizar_origen, $origenes_permitidos);

// Si la lista incluye '*' se permite cualquier origen (útil en desarrollo)
// Si no, solo se permite si el origen de la petición está en la lista
if ($origen_peticion !== '' && in_array('*', $origenes_permitidos_norm, true)) {
    header('Access-Control-Allow-Origin: ' . $origen_peticion);
    header('Access-Control-Allow-Credentials: true'); // permite enviar cookies
    header('Vary: Origin'); // para que el caché no mezcle respuestas de distintos orígenes
} elseif ($origen_peticion !== '' && in_array($origen_peticion_norm, $origenes_permitidos_norm, true)) {
    header('Access-Control-Allow-Origin: ' . $origen_peticion);
    header('Access-Control-Allow-Credentials: true');
    header('Vary: Origin');
}

// Métodos HTTP que se permiten desde el frontend
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
// Headers que el frontend puede enviar en sus peticiones
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
// El navegador puede cachear esta respuesta por 1 día (86400 segundos)
header('Access-Control-Max-Age: 86400');

// Las peticiones OPTIONS son "pre-vuelo": el navegador las manda antes de
// peticiones complejas (PUT, DELETE) para verificar que están permitidas.
// Solo respondemos con 204 (sin contenido) y salimos.
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

// ============================================
// CONEXION POSTGRESQL (PDO)
// Las credenciales se leen desde variables de entorno para no hardcodearlas.
// En local se usan los valores por defecto del servidor de desarrollo.
// ============================================
$servidor = getenv('DB_HOST') ?: '127.0.0.1';
$puerto = getenv('DB_PORT') ?: '5432';
$base_datos = getenv('DB_NAME') ?: 'bookit';
$usuario = getenv('DB_USER') ?: 'postgres';
$contrasena = getenv('DB_PASSWORD') ?: '3014751';

// DSN (Data Source Name): cadena de conexión que le dice a PDO qué motor usar y dónde está
$dsn = "pgsql:host={$servidor};port={$puerto};dbname={$base_datos}";

try {
    // Crear la conexión PDO con dos opciones importantes:
    // ERRMODE_EXCEPTION: si hay un error SQL, lanza una excepción en vez de fallar silencioso
    // FETCH_ASSOC: los resultados de las consultas vienen como arrays asociativos (con nombre de columna)
    $conexion = new PDO($dsn, $usuario, $contrasena, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (PDOException $e) {
    // Si no se puede conectar, no tiene sentido seguir ejecutando el archivo
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
