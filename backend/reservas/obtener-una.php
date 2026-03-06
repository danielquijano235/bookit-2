<?php
/**
 * ============================================
 * BOOKIT - Obtener Una Reserva
 * Archivo: reservas/obtener-una.php
 * ============================================
 */

require_once '../configuracion/conexion.php';

if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "No autenticado"]);
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
    $consulta = "
        SELECT
            r.id,
            r.cliente_id,
            r.mesa_id,
            r.numero_personas,
            r.fecha,
            r.hora,
            r.estado,
            r.notas_especiales,
            c.nombre AS cliente_nombre,
            c.telefono AS cliente_telefono,
            c.email AS cliente_email,
            m.numero AS mesa_numero,
            m.capacidad AS mesa_capacidad
        FROM reservas r
        INNER JOIN clientes c ON r.cliente_id = c.id
        LEFT JOIN mesas m ON r.mesa_id = m.id
        WHERE r.id = ? AND r.usuario_id = ?
    ";

    $stmt = $conexion->prepare($consulta);
    $stmt->execute([(int)$id, $usuario_id]);
    $reserva = $stmt->fetch();

    if (!$reserva) {
        http_response_code(404);
        echo json_encode(["error" => "Reserva no encontrada"]);
        exit();
    }

    echo json_encode($reserva);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error al obtener la reserva"]);
}
?>
