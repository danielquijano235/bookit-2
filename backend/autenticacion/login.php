<?php
/**
 * ============================================
 * BOOKIT - Login de Usuario
 * Archivo: autenticacion/login.php
 * ============================================
 * 
 * Recibe: POST con JSON { "email": "...", "contrasena": "..." }
 * Devuelve: JSON con datos del usuario si el login es exitoso
 *           o un mensaje de error si las credenciales son incorrectas.
 * 
 * Proceso:
 * 1. Verificar que sea método POST
 * 2. Obtener email y contraseña del body
 * 3. Buscar el usuario por email en la base de datos
 * 4. Verificar la contraseña con password_verify
 * 5. Guardar datos en sesión si es correcto
 * 6. Devolver respuesta JSON
 */

// Incluir el archivo de conexión (que también configura CORS y sesiones)
require_once '../configuracion/conexion.php';

// Solo aceptar peticiones POST (no GET, PUT, etc.)
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // 405 = Método no permitido
    echo json_encode(["error" => "Método no permitido"]);
    exit();
}

// ============================================
// OBTENER DATOS DEL BODY DE LA PETICIÓN
// React envía los datos como JSON en el body,
// por eso usamos php://input para leerlos.
// ============================================
$datos = json_decode(file_get_contents("php://input"), true);

// Extraer email y contraseña (si no vienen, quedan vacíos)
$email = $datos['email'] ?? '';
$contrasena = $datos['contrasena'] ?? '';

// Validar que no estén vacíos
if (empty($email) || empty($contrasena)) {
    http_response_code(400); // 400 = Petición incorrecta
    echo json_encode(["error" => "Email y contraseña son requeridos"]);
    exit();
}

// ============================================
// BUSCAR USUARIO EN LA BASE DE DATOS
// Usamos prepared statements (consultas preparadas)
// para prevenir ataques de SQL Injection.
// El signo ? es un placeholder que se reemplaza
// de forma segura con el valor real.
// ============================================
$consulta = "SELECT * FROM usuarios WHERE email = ?";
$stmt = mysqli_prepare($conexion, $consulta);           // Preparar la consulta
mysqli_stmt_bind_param($stmt, "s", $email);             // "s" = el parámetro es string
mysqli_stmt_execute($stmt);                              // Ejecutar la consulta
$resultado = mysqli_stmt_get_result($stmt);              // Obtener el resultado

// Verificar si se encontró algún usuario con ese email
if (mysqli_num_rows($resultado) === 0) {
    http_response_code(401); // 401 = No autorizado
    echo json_encode(["error" => "Credenciales incorrectas"]);
    exit();
}

// Obtener los datos del usuario como array asociativo
$usuario = mysqli_fetch_assoc($resultado);

// ============================================
// VERIFICAR LA CONTRASEÑA
// password_verify() compara la contraseña enviada
// con el hash guardado en la base de datos.
// Esto es seguro porque las contraseñas se guardan
// hasheadas con password_hash(), nunca en texto plano.
// ============================================
if (!password_verify($contrasena, $usuario['contrasena'])) {
    http_response_code(401); // 401 = No autorizado
    echo json_encode(["error" => "Credenciales incorrectas"]);
    exit();
}

// ============================================
// GUARDAR DATOS EN LA SESIÓN
// Esto permite que en peticiones futuras podamos
// saber quién está logueado sin pedir credenciales otra vez.
// ============================================
$_SESSION['usuario_id'] = $usuario['id'];
$_SESSION['usuario_nombre'] = $usuario['nombre'];
$_SESSION['usuario_email'] = $usuario['email'];
$_SESSION['usuario_restaurante'] = $usuario['restaurante'];

// ============================================
// RESPONDER CON ÉXITO
// Devolvemos los datos del usuario (sin la contraseña)
// para que React pueda mostrarlos en el dashboard.
// ============================================
echo json_encode([
    "mensaje" => "Login exitoso",
    "usuario" => [
        "id" => $usuario['id'],
        "nombre" => $usuario['nombre'],
        "email" => $usuario['email'],
        "restaurante" => $usuario['restaurante']
    ]
]);
?>
