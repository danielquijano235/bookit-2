<?php

require_once '../configuracion/conexion.php';

if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "No autenticado"]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405);
    echo json_encode(["error" => "Metodo no permitido"]);
    exit();
}

$usuario_id = (int)$_SESSION['usuario_id'];
$datos = json_decode(file_get_contents("php://input"), true);

$id        = isset($datos['id']) ? (int)$datos['id'] : null;
$numero    = isset($datos['numero']) ? (int)$datos['numero'] : null;
$capacidad = isset($datos['capacidad']) ? (int)$datos['capacidad'] : null;
$ubicacion = isset($datos['ubicacion']) ? trim($datos['ubicacion']) : null;
$estado    = isset($datos['estado']) ? trim($datos['estado']) : null;

if (!$id) {
    http_response_code(400);
    echo json_encode(["error" => "ID de mesa requerido"]);
    exit();
}

$campos = [];
$valores = [];

if ($numero !== null) {
    $campos[] = "numero = ?";
    $valores[] = $numero;
}
if ($capacidad !== null) {
    if ($capacidad < 1) {
        http_response_code(400);
        echo json_encode(["error" => "La capacidad debe ser al menos 1"]);
        exit();
    }
    $campos[] = "capacidad = ?";
    $valores[] = $capacidad;
}
if ($ubicacion !== null) {
    $ubicaciones_validas = ['interior', 'terraza', 'ventana', 'privado'];
    if (!in_array($ubicacion, $ubicaciones_validas)) {
        http_response_code(400);
        echo json_encode(["error" => "Ubicacion no valida"]);
        exit();
    }
    $campos[] = "ubicacion = ?";
    $valores[] = $ubicacion;
}
if ($estado !== null) {
    $estados_validos = ['disponible', 'ocupada', 'reservada', 'mantenimiento'];
    if (!in_array($estado, $estados_validos)) {
        http_response_code(400);
        echo json_encode(["error" => "Estado no valido"]);
        exit();
    }
    $campos[] = "estado = ?";
    $valores[] = $estado;
}

if (empty($campos)) {
    http_response_code(400);
    echo json_encode(["error" => "No hay campos para actualizar"]);
    exit();
}

$valores[] = $id;
$valores[] = $usuario_id;

try {
    $stmt = $conexion->prepare("
        UPDATE mesas SET " . implode(", ", $campos) . "
        WHERE id = ? AND usuario_id = ?
    ");
    $stmt->execute($valores);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(["error" => "Mesa no encontrada"]);
        exit();
    }

    echo json_encode(["mensaje" => "Mesa actualizada exitosamente"]);
} catch (PDOException $e) {
    if ($e->getCode() == '23505') {
        http_response_code(409);
        echo json_encode(["error" => "Ya existe una mesa con ese numero"]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Error al actualizar la mesa"]);
    }
}
