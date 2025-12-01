CREATE DATABASE IF NOT EXISTS cablefix CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cablefix;


-- Users
CREATE TABLE users (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100) NOT NULL,
email VARCHAR(150) NOT NULL UNIQUE,
password_hash VARCHAR(255) NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Categories (optional)
CREATE TABLE categories (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100) NOT NULL UNIQUE
);


-- Products (logical product)
CREATE TABLE products (
id INT AUTO_INCREMENT PRIMARY KEY,
category_id INT,
title VARCHAR(200) NOT NULL,
description TEXT,
base_price DECIMAL(10,2) DEFAULT 0,
image VARCHAR(255),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);


-- Product variants / sub-products (normalized)
CREATE TABLE product_variants (
id INT AUTO_INCREMENT PRIMARY KEY,
product_id INT NOT NULL,
sku VARCHAR(100) UNIQUE,
name VARCHAR(150), -- e.g., "1m", "2m", "Red"
price DECIMAL(10,2) NOT NULL,
stock INT DEFAULT 0,
image VARCHAR(255),
FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);


-- Carts (one active cart per user)
CREATE TABLE carts (
id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


-- Cart items
CREATE TABLE cart_items (
id INT AUTO_INCREMENT PRIMARY KEY,
cart_id INT NOT NULL,
variant_id INT NOT NULL,
qty INT NOT NULL DEFAULT 1,
added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE RESTRICT
);


-- Orders
CREATE TABLE if not exists orders (
id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT,
total DECIMAL(12,2) NOT NULL,
status VARCHAR(50) DEFAULT 'pending',
shipping_address TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);


-- Order items
CREATE TABLE order_items (
id INT AUTO_INCREMENT PRIMARY KEY,
order_id INT NOT NULL,
variant_id INT NOT NULL,
qty INT NOT NULL,
price DECIMAL(10,2) NOT NULL,
FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE RESTRICT
);


-- Sample indexes
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_variants_product ON product_variants(product_id);