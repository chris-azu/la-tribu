-- ============================================
-- LA TRIBU — MySQL Database Schema
-- ============================================

CREATE DATABASE IF NOT EXISTS la_tribu CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE la_tribu;

-- Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  rol ENUM('admin','editor') DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Categorias
CREATE TABLE IF NOT EXISTS categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT,
  imagen VARCHAR(255),
  orden INT DEFAULT 0,
  activa BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Productos
CREATE TABLE IF NOT EXISTS productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL,
  slug VARCHAR(200) NOT NULL UNIQUE,
  descripcion TEXT,
  descripcion_corta VARCHAR(300),
  precio DECIMAL(10,2) NOT NULL,
  categoria_id INT,
  imagen VARCHAR(255),
  modelo_glb VARCHAR(255),
  modelo_usdz VARCHAR(255),
  disponible BOOLEAN DEFAULT TRUE,
  destacado BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Modelos 3D
CREATE TABLE IF NOT EXISTS modelos_3d (
  id INT AUTO_INCREMENT PRIMARY KEY,
  producto_id INT,
  estado ENUM('pendiente','procesando','optimizando','completado','error') DEFAULT 'pendiente',
  proveedor VARCHAR(50),
  imagen_original VARCHAR(255),
  modelo_glb VARCHAR(255),
  modelo_usdz VARCHAR(255),
  job_id VARCHAR(255),
  intentos INT DEFAULT 0,
  error_mensaje TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Generaciones 3D (historial)
CREATE TABLE IF NOT EXISTS generaciones_3d (
  id INT AUTO_INCREMENT PRIMARY KEY,
  modelo_id INT,
  estado VARCHAR(50),
  resultado JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (modelo_id) REFERENCES modelos_3d(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Configuracion
CREATE TABLE IF NOT EXISTS configuracion (
  id INT AUTO_INCREMENT PRIMARY KEY,
  clave VARCHAR(100) NOT NULL UNIQUE,
  valor TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Galeria
CREATE TABLE IF NOT EXISTS galeria (
  id INT AUTO_INCREMENT PRIMARY KEY,
  imagen VARCHAR(255) NOT NULL,
  alt VARCHAR(200),
  orden INT DEFAULT 0,
  activa BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Pedidos WhatsApp
CREATE TABLE IF NOT EXISTS pedidos_whatsapp (
  id INT AUTO_INCREMENT PRIMARY KEY,
  producto_id INT,
  mensaje TEXT,
  numero VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE SET NULL
) ENGINE=InnoDB;
