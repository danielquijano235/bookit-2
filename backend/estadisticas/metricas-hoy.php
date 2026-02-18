<?php
/**
 * ============================================
 * BOOKIT - Métricas de Hoy
 * Archivo: estadisticas/metricas-hoy.php
 * ============================================
 * 
 * Recibe: GET (no requiere parámetros)
 * Devuelve: JSON con las métricas del día actual:
 *   - Cantidad de reservas de hoy
 *   - Clientes nuevos registrados hoy
 *   - Porcentaje de ocupación de mesas
 *   - Ingresos estimados del día
 */

require_once '../configuracion/conexion.php';

// Verificar sesión
if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "No autenticado"]);
    exit();
}

$usuario_id = $_SESSION['usuario_id'];
$fecha_hoy = date('Y-m-d'); // Fecha actual en formato YYYY-MM-DD

// ============================================
// 1. CONTAR RESERVAS DE HOY
// Contamos todas las reservas cuya fecha sea hoy
// ============================================
$consulta_reservas = "
    SELECT COUNT(*) as total 
    FROM reservas 
    WHERE DATE(fecha) = ? AND usuario_id = ?
";
$stmt = mysqli_prepare($conexion, $consulta_reservas);
mysqli_stmt_bind_param($stmt, "si", $fecha_hoy, $usuario_id);
mysqli_stmt_execute($stmt);
$resultado_reservas = mysqli_fetch_assoc(mysqli_stmt_get_result($stmt));

// ============================================
// 2. CONTAR CLIENTES NUEVOS DE HOY
// Clientes registrados en las últimas 24 horas
// ============================================
$consulta_clientes = "
    SELECT COUNT(*) as total 
    FROM clientes 
    WHERE DATE(fecha_creacion) = ? AND usuario_id = ?
";
$stmt = mysqli_prepare($conexion, $consulta_clientes);
mysqli_stmt_bind_param($stmt, "si", $fecha_hoy, $usuario_id);
mysqli_stmt_execute($stmt);
$resultado_clientes = mysqli_fetch_assoc(mysqli_stmt_get_result($stmt));

// ============================================
// 3. CALCULAR OCUPACIÓN DE MESAS
// Subqueries para contar mesas ocupadas y totales
// ============================================
$consulta_ocupacion = "
    SELECT 
        (SELECT COUNT(*) FROM mesas WHERE estado = 'ocupada' AND usuario_id = ?) as ocupadas,
        (SELECT COUNT(*) FROM mesas WHERE usuario_id = ?) as total
";
$stmt = mysqli_prepare($conexion, $consulta_ocupacion);
mysqli_stmt_bind_param($stmt, "ii", $usuario_id, $usuario_id);
mysqli_stmt_execute($stmt);
$resultado_ocupacion = mysqli_fetch_assoc(mysqli_stmt_get_result($stmt));

// Calcular porcentaje de ocupación (evitar división por cero)
$porcentaje_ocupacion = 0;
if ($resultado_ocupacion['total'] > 0) {
    $porcentaje_ocupacion = round(($resultado_ocupacion['ocupadas'] / $resultado_ocupacion['total']) * 100);
}

// ============================================
// 4. INGRESOS ESTIMADOS
// Se calcula asumiendo un promedio por persona
// (En un sistema real se conectaría con el sistema de POS)
// ============================================
$promedio_por_persona = 65000; // Pesos colombianos promedio por comensal
$consulta_ingresos = "
    SELECT COALESCE(SUM(numero_personas), 0) as total_personas
    FROM reservas
    WHERE DATE(fecha) = ? AND usuario_id = ? AND estado IN ('confirmada', 'completada')
";
$stmt = mysqli_prepare($conexion, $consulta_ingresos);
mysqli_stmt_bind_param($stmt, "si", $fecha_hoy, $usuario_id);
mysqli_stmt_execute($stmt);
$resultado_ingresos = mysqli_fetch_assoc(mysqli_stmt_get_result($stmt));
$ingresos_hoy = $resultado_ingresos['total_personas'] * $promedio_por_persona;

// ============================================
// DEVOLVER TODAS LAS MÉTRICAS COMO JSON
// ============================================
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
?>
