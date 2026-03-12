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

$nombre = trim($datos['nombre'] ?? '');
$telefono = trim($datos['telefono'] ?? '');
$email = trim($datos['email'] ?? '');
$preferencias = trim($datos['preferencias'] ?? '');

if ($nombre === '') {
    http_response_code(400);
    echo json_encode(["error" => "El nombre del cliente es requerido"]);
    exit();
}

try {
    $consulta = "
        INSERT INTO clientes (usuario_id, nombre, telefono, email, preferencias)
        VALUES (?, ?, ?, ?, ?)
        RETURNING id
    ";
    $stmt = $conexion->prepare($consulta);
    $stmt->execute([$usuario_id, $nombre, $telefono, $email, $preferencias]);
    $id_nuevo = (int)$stmt->fetchColumn();

    http_response_code(201);
    echo json_encode([
        "mensaje" => "Cliente creado exitosamente",
        "cliente" => [
            "id" => $id_nuevo,
            "nombre" => $nombre,
            "telefono" => $telefono,
            "email" => $email
        ]
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error al crear el cliente"]);
}
?>
