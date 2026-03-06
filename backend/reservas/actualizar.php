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

$id = $datos['id'] ?? null;
$estado = $datos['estado'] ?? null;

if (!$id || !$estado) {
    http_response_code(400);
    echo json_encode(["error" => "Se requiere ID y estado"]);
    exit();
}

$estados_validos = ['pendiente', 'confirmada', 'cancelada', 'completada'];
if (!in_array($estado, $estados_validos, true)) {
    http_response_code(400);
    echo json_encode(["error" => "Estado no valido. Opciones: pendiente, confirmada, cancelada, completada"]);
    exit();
}

try {
    $consulta = "UPDATE reservas SET estado = ? WHERE id = ? AND usuario_id = ?";
    $stmt = $conexion->prepare($consulta);
    $stmt->execute([$estado, (int)$id, $usuario_id]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(["mensaje" => "Reserva actualizada exitosamente"]);
    } else {
        http_response_code(404);
        echo json_encode(["error" => "Reserva no encontrada"]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error al actualizar la reserva"]);
}
?>
