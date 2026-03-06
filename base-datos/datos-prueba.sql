-- ============================================
-- BOOKIT - Datos de Prueba (PostgreSQL)
-- Archivo: datos-prueba.sql
-- ============================================

DO $$
DECLARE
    usuario_id BIGINT;
BEGIN
    INSERT INTO usuarios (nombre, email, contrasena, restaurante, telefono)
    VALUES (
        'Daniel Quijano',
        'admin@bookit.com',
        '$2y$10$oftQumMUzWGoR8vzCMlkx.bch1q2kka4f.I8U30ym6tIrhfBPzoYu',
        'Restaurante El Sabor',
        '+57 300 1234567'
    )
    RETURNING id INTO usuario_id;

    INSERT INTO clientes (usuario_id, nombre, telefono, email, visitas, ultima_visita) VALUES
    (usuario_id, 'Carlos Rodriguez', '+57 300 1111111', 'carlos@email.com', 5, CURRENT_DATE - INTERVAL '3 days'),
    (usuario_id, 'Maria Gonzalez', '+57 300 2222222', 'maria@email.com', 12, CURRENT_DATE - INTERVAL '5 days'),
    (usuario_id, 'Ana Lopez', '+57 300 3333333', 'ana@email.com', 3, CURRENT_DATE - INTERVAL '8 days'),
    (usuario_id, 'Juan Perez', '+57 300 4444444', 'juan@email.com', 8, CURRENT_DATE - INTERVAL '4 days'),
    (usuario_id, 'Laura Martinez', '+57 300 5555555', 'laura@email.com', 1, CURRENT_DATE - INTERVAL '10 days');

    INSERT INTO mesas (usuario_id, numero, capacidad, ubicacion, estado) VALUES
    (usuario_id, 1, 2, 'ventana', 'disponible'),
    (usuario_id, 2, 2, 'interior', 'disponible'),
    (usuario_id, 3, 4, 'interior', 'ocupada'),
    (usuario_id, 4, 4, 'terraza', 'disponible'),
    (usuario_id, 5, 6, 'privado', 'reservada');

    INSERT INTO reservas (cliente_id, usuario_id, mesa_id, numero_personas, fecha, hora, estado, notas_especiales) VALUES
    (1, usuario_id, 3, 4, CURRENT_DATE, '19:00:00', 'confirmada', 'Mesa cerca de la ventana'),
    (2, usuario_id, 1, 2, CURRENT_DATE, '19:30:00', 'pendiente', ''),
    (3, usuario_id, 5, 6, CURRENT_DATE + INTERVAL '1 day', '20:00:00', 'confirmada', 'Cumpleanos'),
    (4, usuario_id, 4, 3, CURRENT_DATE + INTERVAL '1 day', '20:30:00', 'pendiente', ''),
    (5, usuario_id, 2, 2, CURRENT_DATE - INTERVAL '1 day', '21:00:00', 'completada', ''),
    (1, usuario_id, 1, 2, CURRENT_DATE - INTERVAL '2 days', '12:00:00', 'completada', ''),
    (2, usuario_id, 2, 4, CURRENT_DATE - INTERVAL '3 days', '12:30:00', 'completada', ''),
    (3, usuario_id, 3, 2, CURRENT_DATE - INTERVAL '4 days', '13:00:00', 'completada', ''),
    (4, usuario_id, 4, 3, CURRENT_DATE - INTERVAL '5 days', '19:00:00', 'completada', ''),
    (5, usuario_id, 5, 4, CURRENT_DATE - INTERVAL '6 days', '19:30:00', 'completada', '');

    INSERT INTO resenas (usuario_id, cliente, comentario, calificacion, fecha) VALUES
    (usuario_id, 'Carlos Rodriguez', 'Excelente atencion y comida espectacular.', 5, CURRENT_DATE - INTERVAL '5 days'),
    (usuario_id, 'Maria Gonzalez', 'Muy buena experiencia en general.', 4, CURRENT_DATE - INTERVAL '4 days'),
    (usuario_id, 'Ana Lopez', 'Celebramos un cumpleanos y todo salio perfecto.', 5, CURRENT_DATE - INTERVAL '3 days'),
    (usuario_id, 'Juan Perez', 'La comida estaba bien pero esperabamos mas variedad.', 3, CURRENT_DATE - INTERVAL '2 days');
END $$;
