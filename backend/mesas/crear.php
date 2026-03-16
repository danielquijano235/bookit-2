<?php

require_once '../configuracion/conexion.php';

if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "No autenticado"]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Metodo no permitido"]);
    exit();
}

$usuario_id = (int)$_SESSION['usuario_id'];
$datos = json_decode(file_get_contents("php://input"), true);

$numero    = isset($datos['numero']) ? (int)$datos['numero'] : null;
$capacidad = isset($datos['capacidad']) ? (int)$datos['capacidad'] : null;
$ubicacion = trim($datos['ubicacion'] ?? 'interior');

if (!$numero || !$capacidad) {
    http_response_code(400);
    echo json_encode(["error" => "Numero y capacidad son requeridos"]);
    exit();
}

if ($capacidad < 1) {
    http_response_code(400);
    echo json_encode(["error" => "La capacidad debe ser al menos 1"]);
    exit();
}

$ubicaciones_validas = ['interior', 'terraza', 'ventana', 'privado'];
if (!in_array($ubicacion, $ubicaciones_validas)) {
    http_response_code(400);
    echo json_encode(["error" => "Ubicacion no valida"]);
    exit();
}

try {
    $stmt = $conexion->prepare("
        INSERT INTO mesas (usuario_id, numero, capacidad, ubicacion, estado)
        VALUES (?, ?, ?, ?, 'disponible')
        RETURNING id
    ");
    $stmt->execute([$usuario_id, $numero, $capacidad, $ubicacion]);
    $id = (int)$stmt->fetchColumn();

    http_response_code(201);
    echo json_encode([
        "mensaje" => "Mesa creada exitosamente",
        "mesa" => [
            "id" => $id,
            "numero" => $numero,
            "capacidad" => $capacidad,
            "ubicacion" => $ubicacion,
            "estado" => "disponible"
        ]
    ]);
} catch (PDOException $e) {
    if ($e->getCode() == '23505') {
        http_response_code(409);
        echo json_encode(["error" => "Ya existe una mesa con ese numero"]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Error al crear la mesa"]);
    }
}
