<?php

require_once '../configuracion/conexion.php';

if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "No autenticado"]);
    exit();
}

$usuario_id = (int)$_SESSION['usuario_id'];

try {
    $stmt = $conexion->prepare("
        SELECT id, numero, capacidad, ubicacion, estado
        FROM mesas
        WHERE usuario_id = ?
        ORDER BY numero ASC
    ");
    $stmt->execute([$usuario_id]);
    $mesas = $stmt->fetchAll();

    echo json_encode($mesas);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error al obtener las mesas"]);
}
