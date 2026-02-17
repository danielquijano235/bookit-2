<?php


require_once '../configuracion/conexion.php';

// Verificar sesión
if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "No autenticado"]);
    exit();
}

// Solo aceptar PUT
if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido"]);
    exit();
}

$usuario_id = $_SESSION['usuario_id'];
$datos = json_decode(file_get_contents("php://input"), true);

$id = $datos['id'] ?? null;
$estado = $datos['estado'] ?? null;

// Validar campos obligatorios
if (!$id || !$estado) {
    http_response_code(400);
    echo json_encode(["error" => "Se requiere ID y estado"]);
    exit();
}

// Validar que el estado sea válido
$estados_validos = ['pendiente', 'confirmada', 'cancelada', 'completada'];
if (!in_array($estado, $estados_validos)) {
    http_response_code(400);
    echo json_encode(["error" => "Estado no válido. Opciones: pendiente, confirmada, cancelada, completada"]);
    exit();
}

// Actualizar el estado de la reserva
// Solo se puede actualizar si pertenece al usuario logueado
$consulta = "UPDATE reservas SET estado = ? WHERE id = ? AND usuario_id = ?";
$stmt = mysqli_prepare($conexion, $consulta);
mysqli_stmt_bind_param($stmt, "sii", $estado, $id, $usuario_id);

if (mysqli_stmt_execute($stmt)) {
    // Verificar si realmente se actualizó alguna fila
    if (mysqli_affected_rows($conexion) > 0) {
        echo json_encode(["mensaje" => "Reserva actualizada exitosamente"]);
    } else {
        http_response_code(404);
        echo json_encode(["error" => "Reserva no encontrada"]);
    }
} else {
    http_response_code(500);
    echo json_encode(["error" => "Error al actualizar la reserva"]);
}
?>
