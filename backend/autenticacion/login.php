<?php
/**
 * ============================================
 * BOOKIT - Login de Usuario
 * Archivo: autenticacion/login.php
 * ============================================
 */

require_once '../configuracion/conexion.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Metodo no permitido"]);
    exit();
}

$datos = json_decode(file_get_contents("php://input"), true);
$email = $datos['email'] ?? '';
$contrasena = $datos['contrasena'] ?? '';

if (empty($email) || empty($contrasena)) {
    http_response_code(400);
    echo json_encode(["error" => "Email y contrasena son requeridos"]);
    exit();
}

try {
    $consulta = "SELECT * FROM usuarios WHERE email = ?";
    $stmt = $conexion->prepare($consulta);
    $stmt->execute([$email]);
    $usuario = $stmt->fetch();

    if (!$usuario || !password_verify($contrasena, $usuario['contrasena'])) {
        http_response_code(401);
        echo json_encode(["error" => "Credenciales incorrectas"]);
        exit();
    }

    $_SESSION['usuario_id'] = (int)$usuario['id'];
    $_SESSION['usuario_nombre'] = $usuario['nombre'];
    $_SESSION['usuario_email'] = $usuario['email'];
    $_SESSION['usuario_restaurante'] = $usuario['restaurante'];

    echo json_encode([
        "mensaje" => "Login exitoso",
        "usuario" => [
            "id" => (int)$usuario['id'],
            "nombre" => $usuario['nombre'],
            "email" => $usuario['email'],
            "restaurante" => $usuario['restaurante']
        ]
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error al iniciar sesion"]);
}
?>
