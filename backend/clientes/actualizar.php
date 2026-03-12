<?php


require_once '../configuracion/conexion.php';

if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "No autenticado"]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405);
    echo json_encode(["error" => "Metodo no permitido"]);
    exit();
}

$usuario_id = (int)$_SESSION['usuario_id'];
$datos = json_decode(file_get_contents("php://input"), true);

$id = $datos['id'] ?? null;
$nombre = trim($datos['nombre'] ?? '');
$telefono = trim($datos['telefono'] ?? '');
$email = trim($datos['email'] ?? '');
$preferencias = trim($datos['preferencias'] ?? '');

if (!$id || $nombre === '') {
    http_response_code(400);
    echo json_encode(["error" => "Se requiere ID y nombre del cliente"]);
    exit();
}

try {
    $consulta = "
        UPDATE clientes
        SET nombre = ?, telefono = ?, email = ?, preferencias = ?
        WHERE id = ? AND usuario_id = ?
    ";
    $stmt = $conexion->prepare($consulta);
    $stmt->execute([$nombre, $telefono, $email, $preferencias, (int)$id, $usuario_id]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(["mensaje" => "Cliente actualizado exitosamente"]);
    } else {
        http_response_code(404);
        echo json_encode(["error" => "Cliente no encontrado"]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error al actualizar el cliente"]);
}
?>
