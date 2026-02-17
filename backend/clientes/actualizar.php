<?php
/**
 * ============================================
 * BOOKIT - Actualizar Cliente
 * Archivo: clientes/actualizar.php
 * ============================================
 * 
 * Recibe: PUT con JSON { "id", "nombre", "telefono", "email", "preferencias" }
 * Devuelve: JSON con mensaje de éxito o error
 */

require_once '../configuracion/conexion.php';

if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "No autenticado"]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido"]);
    exit();
}

$usuario_id = $_SESSION['usuario_id'];
$datos = json_decode(file_get_contents("php://input"), true);

$id = $datos['id'] ?? null;
$nombre = $datos['nombre'] ?? '';
$telefono = $datos['telefono'] ?? '';
$email = $datos['email'] ?? '';
$preferencias = $datos['preferencias'] ?? '';

if (!$id || empty($nombre)) {
    http_response_code(400);
    echo json_encode(["error" => "Se requiere ID y nombre del cliente"]);
    exit();
}

$consulta = "UPDATE clientes SET nombre = ?, telefono = ?, email = ?, preferencias = ? WHERE id = ? AND usuario_id = ?";
$stmt = mysqli_prepare($conexion, $consulta);
mysqli_stmt_bind_param($stmt, "ssssii", $nombre, $telefono, $email, $preferencias, $id, $usuario_id);

if (mysqli_stmt_execute($stmt)) {
    if (mysqli_affected_rows($conexion) > 0) {
        echo json_encode(["mensaje" => "Cliente actualizado exitosamente"]);
    } else {
        http_response_code(404);
        echo json_encode(["error" => "Cliente no encontrado"]);
    }
} else {
    http_response_code(500);
    echo json_encode(["error" => "Error al actualizar el cliente"]);
}
?>
