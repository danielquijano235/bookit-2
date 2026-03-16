<?php

require_once '../configuracion/conexion.php'; // necesario para CORS y sesión

// Solo aceptar peticiones POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Metodo no permitido"]);
    exit();
}

// Leer el JSON que manda el frontend
$datos   = json_decode(file_get_contents("php://input"), true);
$nombre  = trim($datos['nombre']  ?? '');
$email   = trim($datos['email']   ?? '');
$asunto  = trim($datos['asunto']  ?? '');
$mensaje = trim($datos['mensaje'] ?? '');

// Validar que todos los campos lleguen con contenido
if (empty($nombre) || empty($email) || empty($asunto) || empty($mensaje)) {
    http_response_code(400);
    echo json_encode(["error" => "Todos los campos son requeridos"]);
    exit();
}

// Validar el formato del correo
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["error" => "El correo electronico no tiene un formato valido"]);
    exit();
}

// Leer configuracion desde variables de entorno
$resend_api_key  = getenv('RESEND_API_KEY')   ?: '';
$correo_destino  = getenv('CONTACT_EMAIL')     ?: '';
$from_name       = getenv('SMTP_FROM_NAME')    ?: 'BookIt';
// Resend requiere un dominio verificado en el "from".
// Mientras no tengas dominio propio, usa el dominio de prueba de Resend.
$from_address    = getenv('RESEND_FROM')       ?: 'onboarding@resend.dev';

if (empty($resend_api_key) || empty($correo_destino)) {
    http_response_code(500);
    echo json_encode(["error" => "El servidor de correo no esta configurado"]);
    exit();
}

// Cuerpo HTML del correo
$html =
    "<p><strong>Nombre:</strong> " . htmlspecialchars($nombre) . "</p>" .
    "<p><strong>Email:</strong> " . htmlspecialchars($email) . "</p>" .
    "<p><strong>Asunto:</strong> " . htmlspecialchars($asunto) . "</p>" .
    "<p><strong>Mensaje:</strong><br>" . nl2br(htmlspecialchars($mensaje)) . "</p>";

// Payload para la API de Resend
$payload = json_encode([
    "from"     => "$from_name <$from_address>",
    "to"       => [$correo_destino],
    "reply_to" => $email,
    "subject"  => "Contacto: " . $asunto,
    "html"     => $html,
]);

// Llamada HTTP a la API de Resend (no usa SMTP, funciona en Render)
$ch = curl_init('https://api.resend.com/emails');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $resend_api_key,
    'Content-Type: application/json',
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 15);

$respuesta  = curl_exec($ch);
$http_code  = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curl_error = curl_error($ch);
curl_close($ch);

if ($curl_error) {
    http_response_code(500);
    echo json_encode(["error" => "Error de conexion al enviar el mensaje"]);
    exit();
}

if ($http_code === 200 || $http_code === 201) {
    echo json_encode(["mensaje" => "Mensaje enviado correctamente"]);
} else {
    $datos_respuesta = json_decode($respuesta, true);
    http_response_code(500);
    echo json_encode(["error" => "No se pudo enviar el mensaje. Intenta de nuevo mas tarde."]);
}
