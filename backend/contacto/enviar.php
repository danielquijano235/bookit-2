<?php

require_once '../configuracion/conexion.php';
require_once '../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

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

// Leer configuracion SMTP desde variables de entorno (definirlas en Render)
$smtp_host     = getenv('SMTP_HOST')     ?: '';
$smtp_port     = (int)(getenv('SMTP_PORT') ?: 587);
$smtp_user     = getenv('SMTP_USER')     ?: '';
$smtp_pass     = getenv('SMTP_PASS')     ?: '';
$smtp_from     = getenv('SMTP_FROM')     ?: $smtp_user;
$smtp_fromname = getenv('SMTP_FROM_NAME') ?: 'BookIt';
$correo_destino = getenv('CONTACT_EMAIL') ?: $smtp_user;

if (empty($smtp_host) || empty($smtp_user) || empty($smtp_pass)) {
    http_response_code(500);
    echo json_encode(["error" => "El servidor de correo no esta configurado"]);
    exit();
}

try {
    $mail = new PHPMailer(true);

    // Configuracion SMTP
    $mail->isSMTP();
    $mail->Host       = $smtp_host;
    $mail->SMTPAuth   = true;
    $mail->Username   = $smtp_user;
    $mail->Password   = $smtp_pass;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = $smtp_port;
    $mail->CharSet    = 'UTF-8';

    // Remitente y destinatario
    $mail->setFrom($smtp_from, $smtp_fromname);
    $mail->addReplyTo($email, $nombre);
    $mail->addAddress($correo_destino);

    // Contenido del correo
    $mail->Subject = "Contacto: $asunto";
    $mail->Body    =
        "<p><strong>Nombre:</strong> " . htmlspecialchars($nombre) . "</p>" .
        "<p><strong>Email:</strong> " . htmlspecialchars($email) . "</p>" .
        "<p><strong>Asunto:</strong> " . htmlspecialchars($asunto) . "</p>" .
        "<p><strong>Mensaje:</strong><br>" . nl2br(htmlspecialchars($mensaje)) . "</p>";
    $mail->AltBody =
        "Nombre: $nombre\nEmail: $email\nAsunto: $asunto\n\nMensaje:\n$mensaje";
    $mail->isHTML(true);

    $mail->send();

    echo json_encode(["mensaje" => "Mensaje enviado correctamente"]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "No se pudo enviar el mensaje. Intenta de nuevo mas tarde."]);
}
