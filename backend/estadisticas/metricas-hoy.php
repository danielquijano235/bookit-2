<?php
/**
 * ============================================
 * BOOKIT - Metricas de Hoy
 * Archivo: estadisticas/metricas-hoy.php
 * ============================================
 */

require_once '../configuracion/conexion.php';

if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "No autenticado"]);
    exit();
}

$usuario_id = (int)$_SESSION['usuario_id'];
$fecha_hoy = date('Y-m-d');

try {
    $consulta_reservas = "
        SELECT COUNT(*) as total
        FROM reservas
        WHERE fecha = ? AND usuario_id = ?
    ";
    $stmt = $conexion->prepare($consulta_reservas);
    $stmt->execute([$fecha_hoy, $usuario_id]);
    $resultado_reservas = $stmt->fetch();

    $consulta_clientes = "
        SELECT COUNT(*) as total
        FROM clientes
        WHERE DATE(fecha_creacion) = ? AND usuario_id = ?
    ";
    $stmt = $conexion->prepare($consulta_clientes);
    $stmt->execute([$fecha_hoy, $usuario_id]);
    $resultado_clientes = $stmt->fetch();

    $consulta_ocupacion = "
        SELECT
            (SELECT COUNT(*) FROM mesas WHERE estado = 'ocupada' AND usuario_id = ?) as ocupadas,
            (SELECT COUNT(*) FROM mesas WHERE usuario_id = ?) as total
    ";
    $stmt = $conexion->prepare($consulta_ocupacion);
    $stmt->execute([$usuario_id, $usuario_id]);
    $resultado_ocupacion = $stmt->fetch();

    $porcentaje_ocupacion = 0;
    if ((int)$resultado_ocupacion['total'] > 0) {
        $porcentaje_ocupacion = (int)round(((int)$resultado_ocupacion['ocupadas'] / (int)$resultado_ocupacion['total']) * 100);
    }

    $promedio_por_persona = 65000;
    $consulta_ingresos = "
        SELECT COALESCE(SUM(numero_personas), 0) as total_personas
        FROM reservas
        WHERE fecha = ? AND usuario_id = ? AND estado IN ('confirmada', 'completada')
    ";
    $stmt = $conexion->prepare($consulta_ingresos);
    $stmt->execute([$fecha_hoy, $usuario_id]);
    $resultado_ingresos = $stmt->fetch();

    $ingresos_hoy = ((int)$resultado_ingresos['total_personas']) * $promedio_por_persona;

    echo json_encode([
        "reservas_hoy" => (int)$resultado_reservas['total'],
        "clientes_nuevos" => (int)$resultado_clientes['total'],
        "ocupacion" => [
            "porcentaje" => $porcentaje_ocupacion,
            "ocupadas" => (int)$resultado_ocupacion['ocupadas'],
            "total" => (int)$resultado_ocupacion['total']
        ],
        "ingresos_hoy" => $ingresos_hoy
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error al cargar metricas"]);
}
?>
