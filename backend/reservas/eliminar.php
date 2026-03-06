<?php
/**
 * ============================================
 * BOOKIT - Eliminar Reserva
 * Archivo: reservas/eliminar.php
 * ============================================
 */

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
$id = $_GET['id'] ?? null;

if (!$id) {
    http_response_code(400);
    echo json_encode(["error" => "Se requiere el ID de la reserva"]);
    exit();
}

try {
    $consulta = "DELETE FROM reservas WHERE id = ? AND usuario_id = ?";
    $stmt = $conexion->prepare($consulta);
    $stmt->execute([(int)$id, $usuario_id]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(["mensaje" => "Reserva eliminada exitosamente"]);
    } else {
        http_response_code(404);
        echo json_encode(["error" => "Reserva no encontrada"]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error al eliminar la reserva"]);
}
?>
