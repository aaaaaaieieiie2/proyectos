-- ==============================================================================
-- 🗄️ FILITOUR - MASTER SCHEMA (Fase 2)
-- Base de Datos Relacional para MySQL / MariaDB
-- IMPORTANTE: Se usa utf8mb4 en todas las tablas para soportar EMOJIS nativamente.
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS filitour_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE filitour_db;

-- Desactivar llaves foráneas temporalmente para poder borrar tablas si ya existen
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS bookings, reviews, about_blocks, services, transfers, beaches, package_places, tour_includes, tour_tags, tour_images, tours, styles, zones, settings, admins;
SET FOREIGN_KEY_CHECKS = 1;

-- ------------------------------------------------------------------------------
-- 1. CONFIGURACIÓN Y SEGURIDAD
-- ------------------------------------------------------------------------------

CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Para guardar SOCIAL links, SITE_TEXTS, COMPANY_WA, LOGO_URL
CREATE TABLE settings (
    setting_key VARCHAR(100) PRIMARY KEY,
    setting_value TEXT NOT NULL,
    setting_group ENUM('social', 'text', 'config') NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------------------------
-- 2. CATÁLOGO BASE (Zonas y Estilos)
-- ------------------------------------------------------------------------------

CREATE TABLE zones (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    emoji VARCHAR(20) DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE styles (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------------------------
-- 3. TOURS Y PAQUETES (El núcleo del negocio)
-- ------------------------------------------------------------------------------

CREATE TABLE tours (
    id VARCHAR(100) PRIMARY KEY,
    type ENUM('place', 'package') DEFAULT 'place',
    name VARCHAR(255) NOT NULL,
    sub_title VARCHAR(255) NULL,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    old_price DECIMAL(10,2) NULL,
    duration VARCHAR(100) NULL,
    rating DECIMAL(3,1) DEFAULT 5.0,
    is_featured BOOLEAN DEFAULT FALSE,
    emoji VARCHAR(20) NULL,
    description TEXT,
    history TEXT,
    pin_size INT DEFAULT 52,
    latitude DECIMAL(10,6) NULL,
    longitude DECIMAL(10,6) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Galería de imágenes (Soporta múltiples imágenes por Tour/Lugar)
CREATE TABLE tour_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tour_id VARCHAR(100) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    display_order INT DEFAULT 0,
    FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Etiquetas/Tags de los tours
CREATE TABLE tour_tags (
    tour_id VARCHAR(100) NOT NULL,
    style_id VARCHAR(50) NOT NULL,
    PRIMARY KEY (tour_id, style_id),
    FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE,
    FOREIGN KEY (style_id) REFERENCES styles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Lista de "Qué Incluye" (viñetas)
CREATE TABLE tour_includes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tour_id VARCHAR(100) NOT NULL,
    item_text VARCHAR(255) NOT NULL,
    FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Relación: Qué lugares (places) pertenecen a un paquete (package)
CREATE TABLE package_places (
    package_id VARCHAR(100) NOT NULL,
    place_id VARCHAR(100) NOT NULL,
    display_order INT DEFAULT 0,
    PRIMARY KEY (package_id, place_id),
    FOREIGN KEY (package_id) REFERENCES tours(id) ON DELETE CASCADE,
    FOREIGN KEY (place_id) REFERENCES tours(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------------------------
-- 4. PLAYAS Y TRASLADOS
-- ------------------------------------------------------------------------------

CREATE TABLE beaches (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    zone_id VARCHAR(50) NULL,
    emoji VARCHAR(20) NULL,
    price DECIMAL(10,2) DEFAULT 0.00,
    duration VARCHAR(100) NULL,
    image_url VARCHAR(255) NULL,
    description TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE transfers (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    origin VARCHAR(255) NULL,
    destination VARCHAR(255) NULL,
    price_one_way DECIMAL(10,2) DEFAULT 0.00,
    price_round_trip DECIMAL(10,2) DEFAULT 0.00,
    max_passengers INT DEFAULT 8,
    emoji VARCHAR(20) NULL,
    price_basis VARCHAR(50) DEFAULT 'per_vehicle',
    description TEXT,
    latitude DECIMAL(10,6) NULL,
    longitude DECIMAL(10,6) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------------------------
-- 5. CMS - SECCIONES ESTÁTICAS (Quiénes Somos, Servicios)
-- ------------------------------------------------------------------------------

CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    emoji VARCHAR(20) NULL,
    display_order INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE about_blocks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255) NULL,
    description TEXT,
    image_url VARCHAR(255) NULL,
    image_position VARCHAR(50) DEFAULT 'center',
    image_fit VARCHAR(50) DEFAULT 'cover',
    display_order INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------------------------
-- 6. CLIENTES: RESEÑAS Y RESERVAS
-- ------------------------------------------------------------------------------

CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tour_id VARCHAR(100) NULL,
    client_name VARCHAR(150) NOT NULL,
    stars INT NOT NULL CHECK(stars >= 1 AND stars <= 5),
    review_text TEXT NOT NULL,
    review_date VARCHAR(100) NULL, -- Guarda textos como "Hace 1 semana" o una fecha
    is_approved BOOLEAN DEFAULT FALSE, -- El CMS decidirá cuáles se publican
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_type VARCHAR(50) NOT NULL,
    reference_id VARCHAR(100) NULL, -- ID del tour/playa/traslado
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) NULL,
    client_phone VARCHAR(50) NULL,
    travel_date DATE NULL,
    pax_adults INT DEFAULT 1,
    pax_kids INT DEFAULT 0,
    total_price DECIMAL(10,2) DEFAULT 0.00,
    client_notes TEXT NULL,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==============================================================================
-- INSERCIÓN DE DATOS DE PRUEBA (ADMIN DEFAULT)
-- ==============================================================================
-- Contraseña por defecto: admin123 (hasheada con bcrypt)
INSERT INTO admins (username, password_hash) 
VALUES ('admin', '$2y$10$/IJCb8DOvqs.IOGXatQYKebPVka8qMfTHJw/19g9FoBAi5CE/bsku');

