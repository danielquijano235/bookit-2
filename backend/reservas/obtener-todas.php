<?php
/**
 * ============================================
 * BOOKIT - Obtener Todas las Reservas
 * Archivo: reservas/obtener-todas.php
 * ============================================
 */

require_once '../configuracion/conexion.php';

if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "No autenticado"]);
    exit();
}

$usuario_id = (int)$_SESSION['usuario_id'];

try {
    $consulta = "
        SELECT
            r.id,
            r.numero_personas,
            r.fecha,
            r.hora,
            r.estado,
            r.notas_especiales,
            c.nombre AS cliente_nombre,
            c.telefono AS cliente_telefono,
            c.email AS cliente_email,
            m.numero AS mesa_numero
        FROM reservas r
        INNER JOIN clientes c ON r.cliente_id = c.id
        LEFT JOIN mesas m ON r.mesa_id = m.id
        WHERE r.usuario_id = ?
        ORDER BY r.fecha DESC, r.hora DESC
    ";

    $stmt = $conexion->prepare($consulta);
    $stmt->execute([$usuario_id]);
    $reservas = $stmt->fetchAll();

    echo json_encode($reservas);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error al obtener las reservas"]);
}
?>
