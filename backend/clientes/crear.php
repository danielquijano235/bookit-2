<?php
/**
 * ============================================
 * BOOKIT - Crear Nuevo Cliente
 * Archivo: clientes/crear.php
 * ============================================
 * 
 * Recibe: POST con JSON { "nombre", "telefono", "email", "preferencias" }
 * Devuelve: JSON con mensaje de éxito y datos del cliente creado
 */

require_once '../configuracion/conexion.php';

if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "No autenticado"]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido"]);
    exit();
}

$usuario_id = $_SESSION['usuario_id'];
$datos = json_decode(file_get_contents("php://input"), true);

$nombre = $datos['nombre'] ?? '';
$telefono = $datos['telefono'] ?? '';
$email = $datos['email'] ?? '';
$preferencias = $datos['preferencias'] ?? '';

// Validar nombre obligatorio
if (empty($nombre)) {
    http_response_code(400);
    echo json_encode(["error" => "El nombre del cliente es requerido"]);
    exit();
}

// Insertar el nuevo cliente
$consulta = "INSERT INTO clientes (usuario_id, nombre, telefono, email, preferencias) VALUES (?, ?, ?, ?, ?)";
$stmt = mysqli_prepare($conexion, $consulta);
mysqli_stmt_bind_param($stmt, "issss", $usuario_id, $nombre, $telefono, $email, $preferencias);

if (mysqli_stmt_execute($stmt)) {
    $id_nuevo = mysqli_insert_id($conexion);
    
    http_response_code(201);
    echo json_encode([
        "mensaje" => "Cliente creado exitosamente",
        "cliente" => [
            "id" => $id_nuevo,
            "nombre" => $nombre,
            "telefono" => $telefono,
            "email" => $email
        ]
    ]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Error al crear el cliente"]);
}
?>
