<?php
/**
 * ============================================
 * BOOKIT - Reservas de la Semana
 * Archivo: estadisticas/reservas-semana.php
 * ============================================
 * 
 * Recibe: GET (no requiere parámetros)
 * Devuelve: JSON con la cantidad de reservas por cada día
 *           de la última semana: { "Lun": 45, "Mar": 52, ... }
 * 
 * Estos datos se usan para la gráfica de barras del dashboard.
 */

require_once '../configuracion/conexion.php';

// Verificar sesión
if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "No autenticado"]);
    exit();
}

$usuario_id = $_SESSION['usuario_id'];

// ============================================
// CONSULTA: Agrupar reservas por día de la semana
// DATE_SUB(CURDATE(), INTERVAL 7 DAY) = hace 7 días
// DAYNAME(fecha) = nombre del día en inglés
// ============================================
$consulta = "
    SELECT 
        DAYNAME(fecha) as dia_nombre,
        DAYOFWEEK(fecha) as dia_numero,
        COUNT(*) as cantidad
    FROM reservas
    WHERE fecha >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        AND usuario_id = ?
    GROUP BY DATE(fecha), DAYNAME(fecha), DAYOFWEEK(fecha)
    ORDER BY DATE(fecha)
";

$stmt = mysqli_prepare($conexion, $consulta);
mysqli_stmt_bind_param($stmt, "i", $usuario_id);
mysqli_stmt_execute($stmt);
$resultado = mysqli_stmt_get_result($stmt);

// Inicializar todos los días en 0
$dias = [
    "Lun" => 0,
    "Mar" => 0,
    "Mié" => 0,
    "Jue" => 0,
    "Vie" => 0,
    "Sáb" => 0,
    "Dom" => 0
];

// Traducir nombres de días del inglés al español abreviado
$traduccion_dias = [
    "Monday"    => "Lun",
    "Tuesday"   => "Mar",
    "Wednesday" => "Mié",
    "Thursday"  => "Jue",
    "Friday"    => "Vie",
    "Saturday"  => "Sáb",
    "Sunday"    => "Dom"
];

// Recorrer resultados y asignar las cantidades
while ($fila = mysqli_fetch_assoc($resultado)) {
    $dia_traducido = $traduccion_dias[$fila['dia_nombre']] ?? $fila['dia_nombre'];
    $dias[$dia_traducido] = (int)$fila['cantidad'];
}

echo json_encode($dias);
?>
