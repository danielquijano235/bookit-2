-- ============================================
-- BOOKIT - Datos de Prueba
-- Archivo: datos-prueba.sql
-- Descripción: Inserta datos de ejemplo para
-- poder probar todas las funciones de la aplicación.
-- ============================================

USE bookit;

-- ============================================
-- USUARIO DE PRUEBA
-- Email: admin@bookit.com
-- Contraseña: Admin123
-- (La contraseña está hasheada con password_hash de PHP)
-- ============================================
INSERT INTO usuarios (nombre, email, contrasena, restaurante, telefono) VALUES
('Daniel Quijano', 'admin@bookit.com', '$2y$10$oftQumMUzWGoR8vzCMlkx.bch1q2kka4f.I8U30ym6tIrhfBPzoYu', 'Restaurante El Sabor', '+57 300 1234567');

-- Guardamos el ID del usuario para usarlo en las demás inserciones
SET @usuario_id = LAST_INSERT_ID();

-- ============================================
-- CLIENTES DE PRUEBA
-- Son los clientes que visitan el restaurante
-- ============================================
INSERT INTO clientes (usuario_id, nombre, telefono, email, visitas, ultima_visita) VALUES
(@usuario_id, 'Carlos Rodríguez', '+57 300 1111111', 'carlos@email.com', 5, '2024-02-03'),
(@usuario_id, 'María González', '+57 300 2222222', 'maria@email.com', 12, '2024-02-01'),
(@usuario_id, 'Ana López', '+57 300 3333333', 'ana@email.com', 3, '2024-01-28'),
(@usuario_id, 'Juan Pérez', '+57 300 4444444', 'juan@email.com', 8, '2024-02-02'),
(@usuario_id, 'Laura Martínez', '+57 300 5555555', 'laura@email.com', 1, '2024-01-25'),
(@usuario_id, 'Pedro Sánchez', '+57 300 6666666', 'pedro@email.com', 6, '2024-01-30'),
(@usuario_id, 'Sofia Torres', '+57 300 7777777', 'sofia@email.com', 4, '2024-02-01'),
(@usuario_id, 'Miguel Ángel', '+57 300 8888888', 'miguel@email.com', 9, '2024-02-03'),
(@usuario_id, 'Carmen Díaz', '+57 300 9999999', 'carmen@email.com', 2, '2024-01-27'),
(@usuario_id, 'Roberto Silva', '+57 301 1111111', 'roberto@email.com', 7, '2024-02-02');

-- ============================================
-- MESAS DEL RESTAURANTE
-- 10 mesas con diferentes capacidades y ubicaciones
-- ============================================
INSERT INTO mesas (usuario_id, numero, capacidad, ubicacion, estado) VALUES
(@usuario_id, 1, 2, 'ventana', 'disponible'),
(@usuario_id, 2, 2, 'interior', 'disponible'),
(@usuario_id, 3, 4, 'interior', 'ocupada'),
(@usuario_id, 4, 4, 'terraza', 'disponible'),
(@usuario_id, 5, 6, 'interior', 'ocupada'),
(@usuario_id, 6, 6, 'terraza', 'disponible'),
(@usuario_id, 7, 8, 'privado', 'reservada'),
(@usuario_id, 8, 4, 'interior', 'disponible'),
(@usuario_id, 9, 2, 'ventana', 'ocupada'),
(@usuario_id, 10, 4, 'terraza', 'disponible');

-- ============================================
-- RESERVAS DE EJEMPLO
-- Reservas para hoy y los próximos días
-- ============================================
INSERT INTO reservas (cliente_id, usuario_id, mesa_id, numero_personas, fecha, hora, estado, notas_especiales) VALUES
-- Reservas de hoy (próximas)
(1, @usuario_id, 3, 4, CURDATE(), '19:00:00', 'confirmada', 'Mesa cerca de la ventana'),
(2, @usuario_id, 1, 2, CURDATE(), '19:30:00', 'pendiente', ''),
(3, @usuario_id, 5, 6, CURDATE(), '20:00:00', 'confirmada', 'Cumpleaños, necesitamos postre especial'),
(4, @usuario_id, 8, 3, CURDATE(), '20:30:00', 'confirmada', ''),
(5, @usuario_id, 6, 5, CURDATE(), '21:00:00', 'pendiente', 'Una silla para bebé'),

-- Reservas de mañana
(6, @usuario_id, 4, 4, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '19:00:00', 'confirmada', ''),
(7, @usuario_id, 7, 8, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '19:30:00', 'confirmada', 'Evento corporativo'),
(8, @usuario_id, 2, 2, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '20:00:00', 'pendiente', '');

-- ============================================
-- RESERVAS HISTÓRICAS (para la gráfica semanal)
-- Simulamos reservas de la última semana
-- ============================================
INSERT INTO reservas (cliente_id, usuario_id, mesa_id, numero_personas, fecha, hora, estado) VALUES
-- Hace 6 días (Lunes) - varias reservas
(1, @usuario_id, 1, 2, DATE_SUB(CURDATE(), INTERVAL 6 DAY), '12:00:00', 'completada'),
(2, @usuario_id, 2, 4, DATE_SUB(CURDATE(), INTERVAL 6 DAY), '12:30:00', 'completada'),
(3, @usuario_id, 3, 2, DATE_SUB(CURDATE(), INTERVAL 6 DAY), '13:00:00', 'completada'),
(4, @usuario_id, 4, 3, DATE_SUB(CURDATE(), INTERVAL 6 DAY), '19:00:00', 'completada'),
(5, @usuario_id, 5, 4, DATE_SUB(CURDATE(), INTERVAL 6 DAY), '19:30:00', 'completada'),
(6, @usuario_id, 6, 2, DATE_SUB(CURDATE(), INTERVAL 6 DAY), '20:00:00', 'completada'),

-- Hace 5 días (Martes) - varias reservas
(7, @usuario_id, 7, 4, DATE_SUB(CURDATE(), INTERVAL 5 DAY), '12:00:00', 'completada'),
(8, @usuario_id, 8, 6, DATE_SUB(CURDATE(), INTERVAL 5 DAY), '12:30:00', 'completada'),
(9, @usuario_id, 9, 2, DATE_SUB(CURDATE(), INTERVAL 5 DAY), '13:00:00', 'completada'),
(10, @usuario_id, 10, 4, DATE_SUB(CURDATE(), INTERVAL 5 DAY), '19:00:00', 'completada'),
(1, @usuario_id, 1, 3, DATE_SUB(CURDATE(), INTERVAL 5 DAY), '19:30:00', 'completada'),
(2, @usuario_id, 2, 2, DATE_SUB(CURDATE(), INTERVAL 5 DAY), '20:00:00', 'completada'),
(3, @usuario_id, 3, 5, DATE_SUB(CURDATE(), INTERVAL 5 DAY), '20:30:00', 'completada'),

-- Hace 4 días (Miércoles) - varias reservas
(4, @usuario_id, 4, 4, DATE_SUB(CURDATE(), INTERVAL 4 DAY), '12:00:00', 'completada'),
(5, @usuario_id, 5, 8, DATE_SUB(CURDATE(), INTERVAL 4 DAY), '13:00:00', 'completada'),
(6, @usuario_id, 6, 2, DATE_SUB(CURDATE(), INTERVAL 4 DAY), '19:00:00', 'completada'),
(7, @usuario_id, 7, 4, DATE_SUB(CURDATE(), INTERVAL 4 DAY), '19:30:00', 'completada'),
(8, @usuario_id, 8, 6, DATE_SUB(CURDATE(), INTERVAL 4 DAY), '20:00:00', 'completada'),
(9, @usuario_id, 9, 3, DATE_SUB(CURDATE(), INTERVAL 4 DAY), '20:30:00', 'completada'),
(10, @usuario_id, 10, 2, DATE_SUB(CURDATE(), INTERVAL 4 DAY), '21:00:00', 'completada'),
(1, @usuario_id, 1, 4, DATE_SUB(CURDATE(), INTERVAL 4 DAY), '21:30:00', 'completada'),

-- Hace 3 días (Jueves) - varias reservas
(2, @usuario_id, 2, 2, DATE_SUB(CURDATE(), INTERVAL 3 DAY), '12:00:00', 'completada'),
(3, @usuario_id, 3, 4, DATE_SUB(CURDATE(), INTERVAL 3 DAY), '13:00:00', 'completada'),
(4, @usuario_id, 4, 6, DATE_SUB(CURDATE(), INTERVAL 3 DAY), '19:00:00', 'completada'),
(5, @usuario_id, 5, 2, DATE_SUB(CURDATE(), INTERVAL 3 DAY), '19:30:00', 'completada'),
(6, @usuario_id, 6, 4, DATE_SUB(CURDATE(), INTERVAL 3 DAY), '20:00:00', 'completada'),
(7, @usuario_id, 7, 8, DATE_SUB(CURDATE(), INTERVAL 3 DAY), '20:30:00', 'completada'),
(8, @usuario_id, 8, 3, DATE_SUB(CURDATE(), INTERVAL 3 DAY), '21:00:00', 'completada'),

-- Hace 2 días (Viernes) - más reservas (fin de semana)
(9, @usuario_id, 9, 2, DATE_SUB(CURDATE(), INTERVAL 2 DAY), '12:00:00', 'completada'),
(10, @usuario_id, 10, 6, DATE_SUB(CURDATE(), INTERVAL 2 DAY), '12:30:00', 'completada'),
(1, @usuario_id, 1, 4, DATE_SUB(CURDATE(), INTERVAL 2 DAY), '13:00:00', 'completada'),
(2, @usuario_id, 2, 2, DATE_SUB(CURDATE(), INTERVAL 2 DAY), '19:00:00', 'completada'),
(3, @usuario_id, 3, 4, DATE_SUB(CURDATE(), INTERVAL 2 DAY), '19:30:00', 'completada'),
(4, @usuario_id, 4, 6, DATE_SUB(CURDATE(), INTERVAL 2 DAY), '20:00:00', 'completada'),
(5, @usuario_id, 5, 8, DATE_SUB(CURDATE(), INTERVAL 2 DAY), '20:30:00', 'completada'),
(6, @usuario_id, 6, 2, DATE_SUB(CURDATE(), INTERVAL 2 DAY), '21:00:00', 'completada'),
(7, @usuario_id, 7, 4, DATE_SUB(CURDATE(), INTERVAL 2 DAY), '21:30:00', 'completada'),

-- Ayer (Sábado) - muchas reservas
(8, @usuario_id, 8, 4, DATE_SUB(CURDATE(), INTERVAL 1 DAY), '12:00:00', 'completada'),
(9, @usuario_id, 9, 2, DATE_SUB(CURDATE(), INTERVAL 1 DAY), '12:30:00', 'completada'),
(10, @usuario_id, 10, 6, DATE_SUB(CURDATE(), INTERVAL 1 DAY), '13:00:00', 'completada'),
(1, @usuario_id, 1, 4, DATE_SUB(CURDATE(), INTERVAL 1 DAY), '13:30:00', 'completada'),
(2, @usuario_id, 2, 2, DATE_SUB(CURDATE(), INTERVAL 1 DAY), '19:00:00', 'completada'),
(3, @usuario_id, 3, 4, DATE_SUB(CURDATE(), INTERVAL 1 DAY), '19:30:00', 'completada'),
(4, @usuario_id, 4, 6, DATE_SUB(CURDATE(), INTERVAL 1 DAY), '20:00:00', 'completada'),
(5, @usuario_id, 5, 8, DATE_SUB(CURDATE(), INTERVAL 1 DAY), '20:30:00', 'completada'),
(6, @usuario_id, 6, 4, DATE_SUB(CURDATE(), INTERVAL 1 DAY), '21:00:00', 'completada'),
(7, @usuario_id, 7, 2, DATE_SUB(CURDATE(), INTERVAL 1 DAY), '21:30:00', 'completada'),
(8, @usuario_id, 8, 4, DATE_SUB(CURDATE(), INTERVAL 1 DAY), '22:00:00', 'completada');
