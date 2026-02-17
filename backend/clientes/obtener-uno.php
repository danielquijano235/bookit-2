<?php
/**
 * ============================================
 * BOOKIT - Obtener Un Cliente
 * Archivo: clientes/obtener-uno.php
 * ============================================
 * 
 * Recibe: GET con parámetro ?id=123
 * Devuelve: JSON con los datos de un cliente específico
 */

require_once '../configuracion/conexion.php';

if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "No autenticado"]);
    exit();
}

$usuario_id = $_SESSION['usuario_id'];
$id = $_GET['id'] ?? null;

if (!$id) {
    http_response_code(400);
    echo json_encode(["error" => "Se requiere el ID del cliente"]);
    exit();
}

$consulta = "SELECT * FROM clientes WHERE id = ? AND usuario_id = ?";
$stmt = mysqli_prepare($conexion, $consulta);
mysqli_stmt_bind_param($stmt, "ii", $id, $usuario_id);
mysqli_stmt_execute($stmt);
$resultado = mysqli_stmt_get_result($stmt);

if (mysqli_num_rows($resultado) === 0) {
    http_response_code(404);
    echo json_encode(["error" => "Cliente no encontrado"]);
    exit();
}

echo json_encode(mysqli_fetch_assoc($resultado));
?>
