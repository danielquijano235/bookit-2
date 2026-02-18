<?php
// Mostrar errores de PHP para depuración temporal
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
/**
 * ============================================
 * BOOKIT - Crear Nueva Reserva
 * Archivo: reservas/crear.php
 * ============================================
 * 
 * Recibe: POST con JSON {
 *   "cliente_id": 1,
 *   "numero_personas": 4,
 *   "fecha": "2024-02-04",
 *   "hora": "19:00",
 *   "mesa_id": 3,           (opcional)
 *   "notas_especiales": ""   (opcional)
 * }
 * 
 * Devuelve: JSON con mensaje de éxito y el ID de la nueva reserva
 * 
 * Proceso:
 * 1. Validar que vengan los campos obligatorios
 * 2. Insertar la reserva en la base de datos
 * 3. Devolver el ID de la reserva creada
 */

require_once '../configuracion/conexion.php';

// Log temporal para depuración del método HTTP
file_put_contents(__DIR__ . '/log_metodo.txt', date('c') . ' - Metodo: ' . $_SERVER['REQUEST_METHOD'] . "\n", FILE_APPEND);
// Verificar sesión
if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "No autenticado"]);
    exit();
}

// Solo aceptar POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        "error" => "Método no permitido",
        "metodo_recibido" => $_SERVER['REQUEST_METHOD']
    ]);
    exit();
}

$usuario_id = $_SESSION['usuario_id'];
$datos = json_decode(file_get_contents("php://input"), true);

// Extraer datos del body
$cliente_id = $datos['cliente_id'] ?? null;
$numero_personas = $datos['numero_personas'] ?? null;
$fecha = $datos['fecha'] ?? null;
$hora = $datos['hora'] ?? null;
$mesa_id = isset($datos['mesa_id']) && $datos['mesa_id'] !== '' ? $datos['mesa_id'] : null;
$notas = $datos['notas_especiales'] ?? '';

// Validar campos obligatorios
if (!$cliente_id || !$numero_personas || !$fecha || !$hora) {
    http_response_code(400);
    echo json_encode(["error" => "Faltan campos obligatorios: cliente, personas, fecha y hora"]);
    exit();
}

// Validar que el número de personas sea positivo
if ($numero_personas < 1) {
    http_response_code(400);
    echo json_encode(["error" => "El número de personas debe ser al menos 1"]);
    exit();
}

// ============================================
// INSERTAR LA NUEVA RESERVA
// El estado inicial siempre es 'pendiente'
// ============================================

if ($mesa_id === null) {
    $consulta = "
        INSERT INTO reservas (cliente_id, usuario_id, numero_personas, fecha, hora, mesa_id, estado, notas_especiales)
        VALUES (?, ?, ?, ?, ?, NULL, 'pendiente', ?)
    ";
    $stmt = mysqli_prepare($conexion, $consulta);
    // "iiisss" = int, int, int, string, string, string
    mysqli_stmt_bind_param($stmt, "iiisss", $cliente_id, $usuario_id, $numero_personas, $fecha, $hora, $notas);
} else {
    $consulta = "
        INSERT INTO reservas (cliente_id, usuario_id, numero_personas, fecha, hora, mesa_id, estado, notas_especiales)
        VALUES (?, ?, ?, ?, ?, ?, 'pendiente', ?)
    ";
    $stmt = mysqli_prepare($conexion, $consulta);
    // "iiissis" = int, int, int, string, string, int, string
    mysqli_stmt_bind_param($stmt, "iiissis", $cliente_id, $usuario_id, $numero_personas, $fecha, $hora, $mesa_id, $notas);
}

if (mysqli_stmt_execute($stmt)) {
    // Obtener el ID auto-generado de la reserva
    $id_insertado = mysqli_insert_id($conexion);
    
    http_response_code(201); // 201 = Creado
    echo json_encode([
        "mensaje" => "Reserva creada exitosamente",
        "id" => $id_insertado
    ]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Error al crear la reserva: " . mysqli_error($conexion)]);
}
?>
