<?php
/**
 * ============================================
 * BOOKIT - Próximas Reservas
 * Archivo: estadisticas/proximas-reservas.php
 * ============================================
 * 
 * Recibe: GET (no requiere parámetros)
 * Devuelve: JSON con las próximas 10 reservas (pendientes y confirmadas)
 *           ordenadas por fecha y hora más cercanas.
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
// CONSULTA: Obtener las próximas 10 reservas
// Solo las que aún no han pasado (fecha >= hoy)
// y que están pendientes o confirmadas (no canceladas)
// ============================================
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
    WHERE r.fecha >= CURDATE()
        AND r.usuario_id = ?
        AND r.estado IN ('confirmada', 'pendiente')
    ORDER BY r.fecha ASC, r.hora ASC
    LIMIT 10
";

$stmt = mysqli_prepare($conexion, $consulta);
mysqli_stmt_bind_param($stmt, "i", $usuario_id);
mysqli_stmt_execute($stmt);
$resultado = mysqli_stmt_get_result($stmt);

// Construir array de reservas
$reservas = [];
while ($fila = mysqli_fetch_assoc($resultado)) {
    $reservas[] = [
        "id" => $fila['id'],
        "cliente" => $fila['cliente_nombre'],
        "personas" => $fila['numero_personas'],
        "fecha" => $fila['fecha'],
        "hora" => $fila['hora'],
        "estado" => $fila['estado'],
        "notas" => $fila['notas_especiales']
    ];
}

echo json_encode($reservas);
?>
