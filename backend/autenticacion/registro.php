<?php


require_once '../configuracion/conexion.php';

// El registro solo acepta peticiones POST (el formulario envía los datos por POST)
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Metodo no permitido"]);
    exit();
}

// Leer el cuerpo de la petición que viene como JSON desde el formulario de registro
$datos = json_decode(file_get_contents("php://input"), true);

// Extraer los campos del JSON recibido
$nombre = $datos['nombre'] ?? '';
$email = $datos['email'] ?? '';
$contrasena = $datos['contrasena'] ?? '';
$restaurante = $datos['restaurante'] ?? '';
$telefono = $datos['telefono'] ?? '';

// Validar campos obligatorios
if (empty($nombre) || empty($email) || empty($contrasena)) {
    http_response_code(400);
    echo json_encode(["error" => "Nombre, email y contrasena son requeridos"]);
    exit();
}

// Validar que el email tenga formato correcto (ej: usuario@dominio.com)
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["error" => "El formato del email no es valido"]);
    exit();
}

// Contraseña mínima de 6 caracteres
if (strlen($contrasena) < 6) {
    http_response_code(400);
    echo json_encode(["error" => "La contrasena debe tener al menos 6 caracteres"]);
    exit();
}

try {
    // Verificar que no exista ya un usuario con ese email antes de registrar
    $consulta_verificar = "SELECT id FROM usuarios WHERE email = ?";
    $stmt = $conexion->prepare($consulta_verificar);
    $stmt->execute([$email]);

    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(["error" => "Ya existe un usuario con ese email"]);
        exit();
    }

    // Hashear la contraseña antes de guardarla.
    // NUNCA se guarda la contraseña en texto plano en la base de datos.
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
