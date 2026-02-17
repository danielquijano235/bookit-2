<?php
/**
 * ============================================
 * BOOKIT - Eliminar Reserva
 * Archivo: reservas/eliminar.php
 * ============================================
 * 
 * Recibe: DELETE con parámetro ?id=123
 * Devuelve: JSON con mensaje de confirmación
 */

require_once '../configuracion/conexion.php';

// Verificar sesión
if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "No autenticado"]);
    exit();
}

// Solo aceptar DELETE
if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido"]);
    exit();
}

$usuario_id = $_SESSION['usuario_id'];
$id = $_GET['id'] ?? null;

if (!$id) {
    http_response_code(400);
    echo json_encode(["error" => "Se requiere el ID de la reserva"]);
    exit();
}

// Eliminar la reserva (solo si pertenece al usuario)
$consulta = "DELETE FROM reservas WHERE id = ? AND usuario_id = ?";
$stmt = mysqli_prepare($conexion, $consulta);
mysqli_stmt_bind_param($stmt, "ii", $id, $usuario_id);

if (mysqli_stmt_execute($stmt)) {
    if (mysqli_affected_rows($conexion) > 0) {
        echo json_encode(["mensaje" => "Reserva eliminada exitosamente"]);
    } else {
        http_response_code(404);
        echo json_encode(["error" => "Reserva no encontrada"]);
    }
} else {
    http_response_code(500);
    echo json_encode(["error" => "Error al eliminar la reserva"]);
}
?>
