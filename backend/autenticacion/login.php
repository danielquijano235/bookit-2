<?php
/**
 * ============================================
 * BOOKIT - Login de Usuario
 * Archivo: autenticacion/login.php
 * ============================================
 */

require_once '../configuracion/conexion.php';

// Solo aceptar peticiones POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Metodo no permitido"]);
    exit();
}

// Leer el JSON que manda el frontend y extraer email y contraseña
$datos = json_decode(file_get_contents("php://input"), true);
$email = $datos['email'] ?? '';
$contrasena = $datos['contrasena'] ?? '';

// Verificar que los dos campos vengan en la petición
if (empty($email) || empty($contrasena)) {
    http_response_code(400);
    echo json_encode(["error" => "Email y contrasena son requeridos"]);
    exit();
}

try {
    // Buscar el usuario en la base de datos por su email
    $consulta = "SELECT * FROM usuarios WHERE email = ?";
    $stmt = $conexion->prepare($consulta);
    $stmt->execute([$email]);
    $usuario = $stmt->fetch();

    // Verificar que el usuario exista y que la contraseña coincida con el hash guardado.
    // password_verify compara la contraseña plana con el hash de la BD de forma segura.
    if (!$usuario || !password_verify($contrasena, $usuario['contrasena'])) {
        http_response_code(401);
        echo json_encode(["error" => "Credenciales incorrectas"]);
        exit();
    }

    // Guardar los datos del usuario en la sesión PHP para que los demás
    // archivos puedan verificar si el usuario está logueado
    $_SESSION['usuario_id'] = (int)$usuario['id'];
    $_SESSION['usuario_nombre'] = $usuario['nombre'];
    $_SESSION['usuario_email'] = $usuario['email'];
    $_SESSION['usuario_restaurante'] = $usuario['restaurante'];

    // Responder con los datos del usuario (sin la contraseña)
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
