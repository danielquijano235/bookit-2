<?php


require_once '../configuracion/conexion.php';

if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "No autenticado"]);
    exit();
}

$usuario_id = (int)$_SESSION['usuario_id'];

try {
    $consulta = "
        SELECT id, nombre, telefono, email, visitas, ultima_visita, preferencias, fecha_creacion
        FROM clientes
        WHERE usuario_id = ?
        ORDER BY nombre ASC
    ";

    $stmt = $conexion->prepare($consulta);
    $stmt->execute([$usuario_id]);
    $clientes = $stmt->fetchAll();

    echo json_encode($clientes);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error al obtener clientes"]);
}
?>
