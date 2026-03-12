<?php
// crear.php - Endpoint para crear un nuevo cliente asociado al usuario autenticado

require_once '../configuracion/conexion.php'; // Incluye la conexión a la base de datos

// Verifica que el usuario esté autenticado mediante la sesión
if (!isset($_SESSION['usuario_id'])) {
    // Si no hay sesión, responde con error 401 (no autorizado)
    http_response_code(401);
    echo json_encode(["error" => "No autenticado"]);
    exit();
}

// Solo permite solicitudes HTTP POST (no GET, PUT, etc.)
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    // Si el método no es POST, responde con error 405 (método no permitido)
    http_response_code(405);
    echo json_encode(["error" => "Metodo no permitido"]);
    exit();
}

$usuario_id = (int)$_SESSION['usuario_id']; // ID del usuario autenticado
// Lee los datos enviados en el cuerpo de la petición (espera JSON)
$datos = json_decode(file_get_contents("php://input"), true);

// Extrae y limpia los campos esperados del cliente
$nombre = trim($datos['nombre'] ?? ''); // Nombre del cliente (obligatorio)
$telefono = trim($datos['telefono'] ?? ''); // Teléfono del cliente (opcional)
$email = trim($datos['email'] ?? ''); // Email del cliente (opcional)
$preferencias = trim($datos['preferencias'] ?? ''); // Preferencias del cliente (opcional)

// Valida que el nombre no esté vacío (es obligatorio)
if ($nombre === '') {
    // Si falta el nombre, responde con error 400 (petición incorrecta)
    http_response_code(400);
    echo json_encode(["error" => "El nombre del cliente es requerido"]);
    exit();
}

try {
    // Prepara la consulta SQL para insertar el nuevo cliente
    $consulta = "
        INSERT INTO clientes (usuario_id, nombre, telefono, email, preferencias)
        VALUES (?, ?, ?, ?, ?)
        RETURNING id
    ";
    $stmt = $conexion->prepare($consulta); // Prepara la consulta para evitar inyección SQL
    $stmt->execute([$usuario_id, $nombre, $telefono, $email, $preferencias]); // Ejecuta con los datos recibidos
    $id_nuevo = (int)$stmt->fetchColumn(); // Obtiene el ID del nuevo cliente insertado

    // Responde con código 201 (creado) y los datos del cliente creado
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
} catch (PDOException $e) {
    // Si ocurre un error en la base de datos, responde con error 500
    http_response_code(500);
    echo json_encode(["error" => "Error al crear el cliente"]);
}
?>
