<?php
/**
 * ============================================
 * BOOKIT - Obtener Un Cliente
 * Archivo: clientes/obtener-uno.php
 * ============================================
 */

require_once '../configuracion/conexion.php';

if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "No autenticado"]);
    exit();
}

$usuario_id = (int)$_SESSION['usuario_id'];
$id = $_GET['id'] ?? null;

if (!$id) {
    http_response_code(400);
    echo json_encode(["error" => "Se requiere el ID del cliente"]);
    exit();
}

try {
    $consulta = "SELECT * FROM clientes WHERE id = ? AND usuario_id = ?";
    $stmt = $conexion->prepare($consulta);
    $stmt->execute([(int)$id, $usuario_id]);
    $cliente = $stmt->fetch();

    if (!$cliente) {
        http_response_code(404);
        echo json_encode(["error" => "Cliente no encontrado"]);
        exit();
    }

    echo json_encode($cliente);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error al obtener el cliente"]);
}
?>
