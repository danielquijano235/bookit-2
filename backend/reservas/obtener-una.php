<?php
/**
 * ============================================
 * BOOKIT - Obtener Una Reserva
 * Archivo: reservas/obtener-una.php
 * ============================================
 * 
 * Recibe: GET con parámetro ?id=123
 * Devuelve: JSON con los datos de una reserva específica
 */

require_once '../configuracion/conexion.php';

// Verificar sesión
if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "No autenticado"]);
    exit();
}

$usuario_id = $_SESSION['usuario_id'];

// Obtener el ID de la reserva del parámetro GET
$id = $_GET['id'] ?? null;

if (!$id) {
    http_response_code(400);
    echo json_encode(["error" => "Se requiere el ID de la reserva"]);
    exit();
}

// Buscar la reserva con datos del cliente y mesa
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

$stmt = mysqli_prepare($conexion, $consulta);
mysqli_stmt_bind_param($stmt, "ii", $id, $usuario_id);
mysqli_stmt_execute($stmt);
$resultado = mysqli_stmt_get_result($stmt);

// Verificar si se encontró la reserva
if (mysqli_num_rows($resultado) === 0) {
    http_response_code(404); // 404 = No encontrado
    echo json_encode(["error" => "Reserva no encontrada"]);
    exit();
}

$reserva = mysqli_fetch_assoc($resultado);
echo json_encode($reserva);
?>
