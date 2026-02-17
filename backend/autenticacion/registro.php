<?php
/**
 * ============================================
 * BOOKIT - Registro de Usuario
 * Archivo: autenticacion/registro.php
 * ============================================
 * 
 * Recibe: POST con JSON { "nombre", "email", "contrasena", "restaurante", "telefono" }
 * Devuelve: JSON con mensaje de éxito o error.
 * 
 * Proceso:
 * 1. Validar que vengan todos los campos requeridos
 * 2. Verificar que el email no esté ya registrado
 * 3. Hashear la contraseña con password_hash
 * 4. Insertar el nuevo usuario en la base de datos
 */

require_once '../configuracion/conexion.php';

// Solo aceptar POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido"]);
    exit();
}

// Obtener datos del body
$datos = json_decode(file_get_contents("php://input"), true);

$nombre = $datos['nombre'] ?? '';
$email = $datos['email'] ?? '';
$contrasena = $datos['contrasena'] ?? '';
$restaurante = $datos['restaurante'] ?? '';
$telefono = $datos['telefono'] ?? '';

// Validar campos obligatorios
if (empty($nombre) || empty($email) || empty($contrasena)) {
    http_response_code(400);
    echo json_encode(["error" => "Nombre, email y contraseña son requeridos"]);
    exit();
}

// Validar formato de email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["error" => "El formato del email no es válido"]);
    exit();
}

// Validar longitud de contraseña
if (strlen($contrasena) < 6) {
    http_response_code(400);
    echo json_encode(["error" => "La contraseña debe tener al menos 6 caracteres"]);
    exit();
}

// ============================================
// VERIFICAR SI EL EMAIL YA EXISTE
// No puede haber dos usuarios con el mismo email.
// ============================================
$consulta_verificar = "SELECT id FROM usuarios WHERE email = ?";
$stmt = mysqli_prepare($conexion, $consulta_verificar);
mysqli_stmt_bind_param($stmt, "s", $email);
mysqli_stmt_execute($stmt);
$resultado = mysqli_stmt_get_result($stmt);

if (mysqli_num_rows($resultado) > 0) {
    http_response_code(409); // 409 = Conflicto (ya existe)
    echo json_encode(["error" => "Ya existe un usuario con ese email"]);
    exit();
}

// ============================================
// HASHEAR LA CONTRASEÑA
// password_hash crea un hash seguro de la contraseña.
// NUNCA se guarda la contraseña en texto plano.
// ============================================
$contrasena_hash = password_hash($contrasena, PASSWORD_DEFAULT);

// ============================================
// INSERTAR NUEVO USUARIO
// ============================================
$consulta_insertar = "INSERT INTO usuarios (nombre, email, contrasena, restaurante, telefono) VALUES (?, ?, ?, ?, ?)";
$stmt = mysqli_prepare($conexion, $consulta_insertar);
mysqli_stmt_bind_param($stmt, "sssss", $nombre, $email, $contrasena_hash, $restaurante, $telefono);

if (mysqli_stmt_execute($stmt)) {
    $id_nuevo = mysqli_insert_id($conexion); // Obtener el ID del usuario insertado
    
    http_response_code(201); // 201 = Creado exitosamente
    echo json_encode([
        "mensaje" => "Usuario registrado exitosamente",
        "usuario" => [
            "id" => $id_nuevo,
            "nombre" => $nombre,
            "email" => $email
        ]
    ]);
} else {
    http_response_code(500); // 500 = Error interno del servidor
    echo json_encode(["error" => "Error al registrar el usuario"]);
}
?>
