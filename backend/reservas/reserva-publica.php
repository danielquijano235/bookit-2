<?php

require_once '../configuracion/conexion.php';

// Solo aceptar peticiones POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Metodo no permitido"]);
    exit();
}

// El usuario_id al que se asocian las reservas públicas.
// Debe ser el ID del admin/restaurante en la tabla usuarios.
// Se lee de variable de entorno o se usa 1 como default.
$usuario_id = (int)(getenv('PUBLIC_RESERVATION_USER_ID') ?: 1);

// Leer el JSON del frontend
$datos = json_decode(file_get_contents("php://input"), true);

$nombre          = trim($datos['nombre'] ?? '');
$telefono        = trim($datos['telefono'] ?? '');
$email           = trim($datos['email'] ?? '');
$numero_personas = isset($datos['numero_personas']) ? (int)$datos['numero_personas'] : null;
$fecha           = $datos['fecha'] ?? null;
$hora            = $datos['hora'] ?? null;
$notas           = trim($datos['notas_especiales'] ?? '');

// Validar campos obligatorios
if (empty($nombre) || !$numero_personas || empty($fecha) || empty($hora)) {
    http_response_code(400);
    echo json_encode(["error" => "Faltan campos obligatorios: nombre, personas, fecha y hora"]);
    exit();
}

if ($numero_personas < 1) {
    http_response_code(400);
    echo json_encode(["error" => "El numero de personas debe ser al menos 1"]);
    exit();
}

// Validar formato de fecha (YYYY-MM-DD)
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $fecha)) {
    http_response_code(400);
    echo json_encode(["error" => "Formato de fecha invalido"]);
    exit();
}

// Validar formato de hora (HH:MM:SS o HH:MM)
if (!preg_match('/^\d{2}:\d{2}(:\d{2})?$/', $hora)) {
    http_response_code(400);
    echo json_encode(["error" => "Formato de hora invalido"]);
    exit();
}

try {
    $conexion->beginTransaction();

    // 1. Crear el cliente (o buscar si ya existe por email)
    $cliente_id = null;

    if (!empty($email)) {
        $buscar = $conexion->prepare("SELECT id FROM clientes WHERE email = ? AND usuario_id = ?");
        $buscar->execute([$email, $usuario_id]);
        $existente = $buscar->fetch();
        if ($existente) {
            $cliente_id = (int)$existente['id'];
        }
    }

    if (!$cliente_id) {
        $insertCliente = $conexion->prepare("
            INSERT INTO clientes (usuario_id, nombre, telefono, email, preferencias)
            VALUES (?, ?, ?, ?, '')
            RETURNING id
        ");
        $insertCliente->execute([$usuario_id, $nombre, $telefono, $email]);
        $cliente_id = (int)$insertCliente->fetchColumn();
    }

    // 2. Buscar mesa disponible automáticamente
    $mesa_id = null;
    $buscarMesa = $conexion->prepare("
        SELECT m.id FROM mesas m
        WHERE m.usuario_id = ?
          AND m.capacidad >= ?
          AND m.estado != 'mantenimiento'
          AND m.id NOT IN (
              SELECT r.mesa_id FROM reservas r
              WHERE r.mesa_id IS NOT NULL
                AND r.fecha = ?
                AND r.estado IN ('pendiente', 'confirmada')
                AND ABS(EXTRACT(EPOCH FROM (r.hora - ?::time))) < 5400
          )
        ORDER BY m.capacidad ASC
        LIMIT 1
    ");
    $buscarMesa->execute([$usuario_id, $numero_personas, $fecha, $hora]);
    $mesaEncontrada = $buscarMesa->fetch();
    if ($mesaEncontrada) {
        $mesa_id = (int)$mesaEncontrada['id'];
    }

    // 3. Crear la reserva
    $insertReserva = $conexion->prepare("
        INSERT INTO reservas (cliente_id, usuario_id, numero_personas, fecha, hora, mesa_id, estado, notas_especiales)
        VALUES (?, ?, ?, ?, ?, ?, 'pendiente', ?)
        RETURNING id
    ");
    $insertReserva->execute([$cliente_id, $usuario_id, $numero_personas, $fecha, $hora, $mesa_id, $notas]);
    $reserva_id = (int)$insertReserva->fetchColumn();

    $conexion->commit();

    http_response_code(201);
    echo json_encode([
        "mensaje" => "Reserva creada exitosamente",
        "id" => $reserva_id
    ]);

} catch (PDOException $e) {
    $conexion->rollBack();
    http_response_code(500);
    echo json_encode(["error" => "Error al crear la reserva"]);
}
