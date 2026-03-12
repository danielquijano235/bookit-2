<?php
// obtener-todas.php - Devuelve todas las reservas del usuario autenticado

require_once '../configuracion/conexion.php'; // Incluye la conexión a la base de datos

// Verifica que el usuario esté autenticado mediante la sesión
if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401); // No autorizado
    echo json_encode(["error" => "No autenticado"]);
    exit();
}

$usuario_id = (int)$_SESSION['usuario_id']; // ID del usuario autenticado

try {
    // Consulta SQL para obtener todas las reservas del usuario
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

    $stmt = $conexion->prepare($consulta); // Prepara la consulta para evitar inyección SQL
    $stmt->execute([$usuario_id]); // Ejecuta la consulta con el ID del usuario
    $reservas = $stmt->fetchAll(); // Obtiene todas las reservas encontradas

    echo json_encode($reservas); // Devuelve el resultado como JSON
} catch (PDOException $e) {
    http_response_code(500); // Error interno del servidor
    echo json_encode(["error" => "Error al obtener las reservas"]);
}
?>
