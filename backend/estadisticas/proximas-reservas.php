<?php
/**
 * ============================================
 * BOOKIT - Proximas Reservas
 * Archivo: estadisticas/proximas-reservas.php
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
            c.nombre as cliente_nombre
        FROM reservas r
        INNER JOIN clientes c ON r.cliente_id = c.id
        WHERE r.fecha >= CURRENT_DATE
          AND r.usuario_id = ?
          AND r.estado IN ('confirmada', 'pendiente')
        ORDER BY r.fecha ASC, r.hora ASC
        LIMIT 10
    ";

    $stmt = $conexion->prepare($consulta);
    $stmt->execute([$usuario_id]);

    $reservas = [];
    while ($fila = $stmt->fetch()) {
        $reservas[] = [
            "id" => (int)$fila['id'],
            "cliente" => $fila['cliente_nombre'],
            "personas" => (int)$fila['numero_personas'],
            "fecha" => $fila['fecha'],
            "hora" => $fila['hora'],
            "estado" => $fila['estado'],
            "notas" => $fila['notas_especiales']
        ];
    }

    echo json_encode($reservas);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error al cargar proximas reservas"]);
}
?>
