<?php
/**
 * ============================================
 * BOOKIT - Registro de Usuario
 * Archivo: autenticacion/registro.php
 * ============================================
 */

require_once '../configuracion/conexion.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Metodo no permitido"]);
    exit();
}

$datos = json_decode(file_get_contents("php://input"), true);

$nombre = $datos['nombre'] ?? '';
$email = $datos['email'] ?? '';
$contrasena = $datos['contrasena'] ?? '';
$restaurante = $datos['restaurante'] ?? '';
$telefono = $datos['telefono'] ?? '';

if (empty($nombre) || empty($email) || empty($contrasena)) {
    http_response_code(400);
    echo json_encode(["error" => "Nombre, email y contrasena son requeridos"]);
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["error" => "El formato del email no es valido"]);
    exit();
}

if (strlen($contrasena) < 6) {
    http_response_code(400);
    echo json_encode(["error" => "La contrasena debe tener al menos 6 caracteres"]);
    exit();
}

try {
    $consulta_verificar = "SELECT id FROM usuarios WHERE email = ?";
    $stmt = $conexion->prepare($consulta_verificar);
    $stmt->execute([$email]);

    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(["error" => "Ya existe un usuario con ese email"]);
        exit();
    }

    $contrasena_hash = password_hash($contrasena, PASSWORD_DEFAULT);

    $consulta_insertar = "
        INSERT INTO usuarios (nombre, email, contrasena, restaurante, telefono)
        VALUES (?, ?, ?, ?, ?)
        RETURNING id
    ";
    $stmt = $conexion->prepare($consulta_insertar);
    $stmt->execute([$nombre, $email, $contrasena_hash, $restaurante, $telefono]);
    $id_nuevo = (int)$stmt->fetchColumn();

    http_response_code(201);
    echo json_encode([
        "mensaje" => "Usuario registrado exitosamente",
        "usuario" => [
            "id" => $id_nuevo,
            "nombre" => $nombre,
            "email" => $email
        ]
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error al registrar el usuario"]);
}
?>
