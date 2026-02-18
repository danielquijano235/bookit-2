-- ============================================
-- BOOKIT - Sistema de Gestión de Reservas
-- Archivo: bookit.sql
-- Descripción: Script de creación de la base de datos
-- y todas sus tablas con sus relaciones.
-- ============================================

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS bookit CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bookit;

-- ============================================
-- TABLA: usuarios
-- Descripción: Almacena los datos de los dueños
-- o administradores de restaurantes que usan BookIt.
-- ============================================
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL COMMENT 'Nombre completo del usuario',
    email VARCHAR(100) UNIQUE NOT NULL COMMENT 'Email único para login',
    contrasena VARCHAR(255) NOT NULL COMMENT 'Contraseña hasheada con password_hash',
    restaurante VARCHAR(100) COMMENT 'Nombre del restaurante',
    telefono VARCHAR(20) COMMENT 'Teléfono de contacto',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de registro',
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Usuarios administradores del sistema';

-- ============================================
-- TABLA: clientes
-- Descripción: Almacena los datos de los clientes
-- que hacen reservas en los restaurantes.
-- Cada cliente pertenece a un usuario (restaurante).
-- ============================================
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL COMMENT 'ID del restaurante al que pertenece',
    nombre VARCHAR(100) NOT NULL COMMENT 'Nombre completo del cliente',
    telefono VARCHAR(20) COMMENT 'Teléfono del cliente',
    email VARCHAR(100) COMMENT 'Email del cliente',
    visitas INT DEFAULT 0 COMMENT 'Número total de visitas',
    ultima_visita DATE COMMENT 'Fecha de la última visita',
    preferencias TEXT COMMENT 'Preferencias o alergias del cliente',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de registro del cliente',
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario (usuario_id),
    INDEX idx_telefono (telefono),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Clientes de los restaurantes';

-- ============================================
-- TABLA: mesas
-- Descripción: Almacena la información de las mesas
-- de cada restaurante (capacidad, ubicación, estado).
-- ============================================
CREATE TABLE mesas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL COMMENT 'ID del restaurante al que pertenece',
    numero INT NOT NULL COMMENT 'Número de mesa',
    capacidad INT NOT NULL COMMENT 'Cantidad máxima de personas',
    ubicacion ENUM('interior', 'terraza', 'ventana', 'privado') DEFAULT 'interior' COMMENT 'Ubicación de la mesa',
    estado ENUM('disponible', 'ocupada', 'reservada', 'mantenimiento') DEFAULT 'disponible' COMMENT 'Estado actual de la mesa',
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario (usuario_id),
    INDEX idx_estado (estado),
    UNIQUE KEY unique_mesa_usuario (numero, usuario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Mesas de los restaurantes';

-- ============================================
-- TABLA: reservas
-- Descripción: Almacena todas las reservas realizadas.
-- Relaciona clientes con mesas en fechas y horas específicas.
-- ============================================
CREATE TABLE reservas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL COMMENT 'ID del cliente que reserva',
    usuario_id INT NOT NULL COMMENT 'ID del restaurante',
    mesa_id INT COMMENT 'ID de la mesa asignada (puede ser NULL)',
    numero_personas INT NOT NULL COMMENT 'Cantidad de personas en la reserva',
    fecha DATE NOT NULL COMMENT 'Fecha de la reserva',
    hora TIME NOT NULL COMMENT 'Hora de la reserva',
    estado ENUM('pendiente', 'confirmada', 'cancelada', 'completada') DEFAULT 'pendiente' COMMENT 'Estado de la reserva',
    notas_especiales TEXT COMMENT 'Notas o requerimientos especiales',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha en que se creó la reserva',
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (mesa_id) REFERENCES mesas(id) ON DELETE SET NULL,
    INDEX idx_usuario (usuario_id),
    INDEX idx_fecha (fecha),
    INDEX idx_estado (estado),
    INDEX idx_cliente (cliente_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Reservas de los restaurantes';
