<?php
/**
 * ============================================
 * BOOKIT - Obtener Todas las Reservas
 * Archivo: reservas/obtener-todas.php
 * ============================================
 * 
 * Recibe: GET (no requiere parámetros)
 * Devuelve: JSON con array de todas las reservas del usuario
 *           incluyendo datos del cliente y mesa asignada.
 * 
 * Las reservas se ordenan por fecha descendente (más recientes primero).
 */

require_once '../configuracion/conexion.php';

// Verificar que el usuario esté logueado
if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "No autenticado"]);
    exit();
}

$usuario_id = $_SESSION['usuario_id'];

// ============================================
// CONSULTA CON JOIN
// Unimos la tabla reservas con clientes y mesas
// para obtener toda la información en una sola consulta.
// LEFT JOIN con mesas porque una reserva puede no tener mesa asignada.
// ============================================
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

$stmt = mysqli_prepare($conexion, $consulta);
mysqli_stmt_bind_param($stmt, "i", $usuario_id); // "i" = parámetro entero
mysqli_stmt_execute($stmt);
$resultado = mysqli_stmt_get_result($stmt);

// Recorrer todos los resultados y guardarlos en un array
$reservas = [];
while ($fila = mysqli_fetch_assoc($resultado)) {
    $reservas[] = $fila;
}

// Devolver las reservas como JSON
echo json_encode($reservas);
?>
