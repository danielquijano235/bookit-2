<?php
/**
 * ============================================
 * BOOKIT - Crear Nueva Reserva
 * Archivo: reservas/crear.php
 * ============================================
 */

require_once '../configuracion/conexion.php';

if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "No autenticado"]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Metodo no permitido", "metodo_recibido" => $_SERVER['REQUEST_METHOD']]);
    exit();
}

$usuario_id = (int)$_SESSION['usuario_id'];
$datos = json_decode(file_get_contents("php://input"), true);

$cliente_id = isset($datos['cliente_id']) ? (int)$datos['cliente_id'] : null;
$numero_personas = isset($datos['numero_personas']) ? (int)$datos['numero_personas'] : null;
$fecha = $datos['fecha'] ?? null;
$hora = $datos['hora'] ?? null;
$mesa_id = isset($datos['mesa_id']) && $datos['mesa_id'] !== '' ? (int)$datos['mesa_id'] : null;
$notas = $datos['notas_especiales'] ?? '';

if (!$cliente_id || !$numero_personas || !$fecha || !$hora) {
    http_response_code(400);
    echo json_encode(["error" => "Faltan campos obligatorios: cliente, personas, fecha y hora"]);
    exit();
}

if ($numero_personas < 1) {
    http_response_code(400);
    echo json_encode(["error" => "El numero de personas debe ser al menos 1"]);
    exit();
}

try {
    $consulta = "
        INSERT INTO reservas (cliente_id, usuario_id, numero_personas, fecha, hora, mesa_id, estado, notas_especiales)
        VALUES (?, ?, ?, ?, ?, ?, 'pendiente', ?)
        RETURNING id
    ";

    $stmt = $conexion->prepare($consulta);
    $stmt->execute([$cliente_id, $usuario_id, $numero_personas, $fecha, $hora, $mesa_id, $notas]);
    $id_insertado = (int)$stmt->fetchColumn();

    http_response_code(201);
    echo json_encode([
        "mensaje" => "Reserva creada exitosamente",
        "id" => $id_insertado
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error al crear la reserva"]);
}
?>
