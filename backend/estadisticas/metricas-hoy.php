<?php


require_once '../configuracion/conexion.php';

// Solo usuarios logueados pueden ver las métricas
if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "No autenticado"]);
    exit();
}

// Obtener el ID del usuario logueado desde la sesión
$usuario_id = (int)$_SESSION['usuario_id'];

// Obtener la fecha de hoy en formato YYYY-MM-DD para usar en las consultas
$fecha_hoy = date('Y-m-d');

try {
    // ---- Consulta 1: Total de reservas para hoy ----
    // Se filtra por fecha de hoy y por el ID del usuario para no mezclar datos
    // de distintos restaurantes que usen el sistema
    $consulta_reservas = "
        SELECT COUNT(*) as total
        FROM reservas
        WHERE fecha = ? AND usuario_id = ?
    ";
    $stmt = $conexion->prepare($consulta_reservas);
    $stmt->execute([$fecha_hoy, $usuario_id]);
    $resultado_reservas = $stmt->fetch();

    // ---- Consulta 2: Clientes nuevos registrados hoy ----
    // DATE(fecha_creacion) extrae solo la parte de fecha del timestamp
    $consulta_clientes = "
        SELECT COUNT(*) as total
        FROM clientes
        WHERE DATE(fecha_creacion) = ? AND usuario_id = ?
    ";
    $stmt = $conexion->prepare($consulta_clientes);
    $stmt->execute([$fecha_hoy, $usuario_id]);
    $resultado_clientes = $stmt->fetch();

    // ---- Consulta 3: Ocupación de mesas ----
    // Dos subconsultas en una sola: cuántas mesas están ocupadas y cuántas hay en total
    $consulta_ocupacion = "
        SELECT
            (SELECT COUNT(*) FROM mesas WHERE estado = 'ocupada' AND usuario_id = ?) as ocupadas,
            (SELECT COUNT(*) FROM mesas WHERE usuario_id = ?) as total
    ";
    $stmt = $conexion->prepare($consulta_ocupacion);
    $stmt->execute([$usuario_id, $usuario_id]);
    $resultado_ocupacion = $stmt->fetch();

    // Calcular porcentaje de ocupación con cuidado de no dividir entre cero
    $porcentaje_ocupacion = 0;
    if ((int)$resultado_ocupacion['total'] > 0) {
        $porcentaje_ocupacion = (int)round(((int)$resultado_ocupacion['ocupadas'] / (int)$resultado_ocupacion['total']) * 100);
    }

    // ---- Consulta 4: Ingresos estimados de hoy ----
    // No hay precio real por reserva, se usa un promedio fijo por persona.
    // Solo se cuentan reservas confirmadas o completadas (no canceladas ni pendientes).
    $promedio_por_persona = 65000; // pesos colombianos estimados por persona
    $consulta_ingresos = "
        SELECT COALESCE(SUM(numero_personas), 0) as total_personas
        FROM reservas
        WHERE fecha = ? AND usuario_id = ? AND estado IN ('confirmada', 'completada')
    ";
    $stmt = $conexion->prepare($consulta_ingresos);
    $stmt->execute([$fecha_hoy, $usuario_id]);
    $resultado_ingresos = $stmt->fetch();

    // Multiplicar total de personas por el promedio para estimar ingresos
    $ingresos_hoy = ((int)$resultado_ingresos['total_personas']) * $promedio_por_persona;

    // Devolver todas las métricas en un solo objeto JSON
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
