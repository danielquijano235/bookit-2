<?php
/**
 * ============================================
 * BOOKIT - Reservas de la Semana
 * Archivo: estadisticas/reservas-semana.php
 * ============================================
 */

require_once '../configuracion/conexion.php';

if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "No autenticado"]);
    exit();
}

$usuario_id = (int)$_SESSION['usuario_id'];

// Preparar el array de días con conteo en 0.
// Este es el resultado final que se devuelve; se llena con los datos de la BD.
// Si algún día no tuvo reservas, queda en 0 en lugar de desaparecer.
$dias = [
    "Lun" => 0,
    "Mar" => 0,
    "Mié" => 0,
    "Jue" => 0,
    "Vie" => 0,
    "Sáb" => 0,
    "Dom" => 0
];

// PostgreSQL devuelve el día de la semana como número (1=lunes, 7=domingo)
// con la función ISODOW. Este mapa convierte ese número al nombre corto en español.
$mapa_dia = [
    1 => "Lun",
    2 => "Mar",
    3 => "Mié",
    4 => "Jue",
    5 => "Vie",
    6 => "Sáb",
    7 => "Dom"
];

try {
    // Consultar reservas de los últimos 7 días agrupadas por día de la semana.
    // EXTRACT(ISODOW FROM fecha) extrae el número del día (1-7).
    // DATE(fecha) junto a EXTRACT se usa para agrupar por día exacto y no duplicar.
    // INTERVAL '6 days' da los últimos 7 días incluyendo hoy.
    $consulta = "
        SELECT
            EXTRACT(ISODOW FROM fecha) AS dia_numero,
            COUNT(*) as cantidad
        FROM reservas
        WHERE fecha >= (CURRENT_DATE - INTERVAL '6 days')
          AND usuario_id = ?
        GROUP BY DATE(fecha), EXTRACT(ISODOW FROM fecha)
        ORDER BY DATE(fecha)
    ";

    $stmt = $conexion->prepare($consulta);
    $stmt->execute([$usuario_id]);

    // Recorrer los resultados y asignar la cantidad al día correspondiente
    while ($fila = $stmt->fetch()) {
        $numero = (int)$fila['dia_numero'];
        // Si el número existe en el mapa, buscar el nombre del día y sumar la cantidad
        if (isset($mapa_dia[$numero])) {
            $dias[$mapa_dia[$numero]] = (int)$fila['cantidad'];
        }
    }

    // El frontend recibe algo como: { "Lun": 10, "Mar": 8, "Mié": 15, ... }
    echo json_encode($dias);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error al cargar reservas de la semana"]);
}
            EXTRACT(ISODOW FROM fecha) AS dia_numero,
            COUNT(*) as cantidad
        FROM reservas
        WHERE fecha >= (CURRENT_DATE - INTERVAL '6 days')
          AND usuario_id = ?
        GROUP BY DATE(fecha), EXTRACT(ISODOW FROM fecha)
        ORDER BY DATE(fecha)
    ";

    $stmt = $conexion->prepare($consulta);
    $stmt->execute([$usuario_id]);

    while ($fila = $stmt->fetch()) {
        $numero = (int)$fila['dia_numero'];
        if (isset($mapa_dia[$numero])) {
            $dias[$mapa_dia[$numero]] = (int)$fila['cantidad'];
        }
    }

    echo json_encode($dias);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error al cargar reservas de la semana"]);
}
?>
