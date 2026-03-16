<?php

require_once '../configuracion/conexion.php';

if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "No autenticado"]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    echo json_encode(["error" => "Metodo no permitido"]);
    exit();
}

$usuario_id = (int)$_SESSION['usuario_id'];
$datos = json_decode(file_get_contents("php://input"), true);
$id = isset($datos['id']) ? (int)$datos['id'] : null;

if (!$id) {
    http_response_code(400);
    echo json_encode(["error" => "ID de mesa requerido"]);
    exit();
}

try {
    $stmt = $conexion->prepare("DELETE FROM mesas WHERE id = ? AND usuario_id = ?");
    $stmt->execute([$id, $usuario_id]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(["error" => "Mesa no encontrada"]);
        exit();
    }

    echo json_encode(["mensaje" => "Mesa eliminada exitosamente"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error al eliminar la mesa"]);
}
