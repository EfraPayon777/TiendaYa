-- Script de inicialización de la base de datos TiendaYa
-- Crear esquema
CREATE DATABASE IF NOT EXISTS tiendaya;
USE tiendaya;

-- Categorías
CREATE TABLE categorias (
  id              BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  nombre          VARCHAR(120) NOT NULL,
  padre_id        BIGINT UNSIGNED NULL,
  creadoEn        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizadoEn   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_categorias_parent
    FOREIGN KEY (padre_id) REFERENCES categorias(id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

-- Usuarios
CREATE TABLE usuarios (
  id              BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  nombre          VARCHAR(160) NOT NULL,
  email           VARCHAR(190) NOT NULL UNIQUE,
  pwdHash         VARCHAR(255) NOT NULL,
  telefono        VARCHAR(30) NULL,
  estado          ENUM('active','blocked','deleted') NOT NULL DEFAULT 'active',
  creadoEn        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizadoEn   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Productos
CREATE TABLE productos (
  id              BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  nombre          VARCHAR(180) NOT NULL,
  descripcion     TEXT NULL,
  categoria_id    BIGINT UNSIGNED NULL,
  vendedorId      BIGINT UNSIGNED NULL,
  precio          DECIMAL(12,2) NOT NULL CHECK (precio >= 0),
  stock           INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
  creadoEn        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizadoEn   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_productos_category
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_productos_vendedor
    FOREIGN KEY (vendedorId) REFERENCES usuarios(id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

-- Imágenes de productos
CREATE TABLE producto_img (
  id            BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  producto_id   BIGINT UNSIGNED NOT NULL,
  img_url       VARCHAR(500) NOT NULL,
  principal     TINYINT(1) NOT NULL DEFAULT 0,
  orden         INT NOT NULL DEFAULT 0,
  creadoEn      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_producto_img_producto
    FOREIGN KEY (producto_id) REFERENCES productos(id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- Ratings
CREATE TABLE producto_ratings (
  id            BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id       BIGINT UNSIGNED NOT NULL,
  producto_id   BIGINT UNSIGNED NOT NULL,
  rating        TINYINT NOT NULL,
  creadoEn      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizadoEn TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_rating_range CHECK (rating BETWEEN 1 AND 5),
  CONSTRAINT uq_user_product_rating UNIQUE (user_id, producto_id),
  CONSTRAINT fk_ratings_user
    FOREIGN KEY (user_id) REFERENCES usuarios(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_ratings_product
    FOREIGN KEY (producto_id) REFERENCES productos(id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- Favoritos
CREATE TABLE favoritos (
  user_id       BIGINT UNSIGNED NOT NULL,
  producto_id   BIGINT UNSIGNED NOT NULL,
  guardadoEn    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, producto_id),
  CONSTRAINT fk_wishlist_user
    FOREIGN KEY (user_id) REFERENCES usuarios(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_wishlist_product
    FOREIGN KEY (producto_id) REFERENCES productos(id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- Agregar columna foto_perfil a usuarios
ALTER TABLE usuarios ADD COLUMN foto_perfil VARCHAR(255) NULL;

-- Agregar columna comentario a producto_ratings
ALTER TABLE producto_ratings ADD COLUMN comentario TEXT NULL;

-- Insertar categorías
INSERT INTO categorias (nombre) VALUES 
('Electrónicos'),
('Electrodomésticos'),
('Ropa y Accesorios'),
('Hogar y Jardín'),
('Deportes y Fitness'),
('Libros y Educación');
