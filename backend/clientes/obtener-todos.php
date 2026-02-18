<?php
/**
 * ============================================
 * BOOKIT - Obtener Todos los Clientes
 * Archivo: clientes/obtener-todos.php
 * ============================================
 * 
 * Recibe: GET (no requiere parámetros)
 * Devuelve: JSON con array de todos los clientes del restaurante
 */

require_once '../configuracion/conexion.php';

// Verificar sesión
if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "No autenticado"]);
    exit();
}

$usuario_id = $_SESSION['usuario_id'];

// Obtener todos los clientes ordenados por nombre
$consulta = "
    SELECT id, nombre, telefono, email, visitas, ultima_visita, preferencias, fecha_creacion
    FROM clientes
    WHERE usuario_id = ?
    ORDER BY nombre ASC
";

$stmt = mysqli_prepare($conexion, $consulta);
mysqli_stmt_bind_param($stmt, "i", $usuario_id);
mysqli_stmt_execute($stmt);
$resultado = mysqli_stmt_get_result($stmt);

$clientes = [];
while ($fila = mysqli_fetch_assoc($resultado)) {
    $clientes[] = $fila;
}

echo json_encode($clientes);
?>
