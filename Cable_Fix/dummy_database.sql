USE cablefix;

-- 1. Insert Categories
INSERT INTO categories (name) VALUES
    ('USB Cables'),
    ('HDMI & Video'),
    ('Audio Cables'),
    ('Networking'),
    ('Adapters & Hubs');

-- 2. Insert Users (password hashes are placeholders)
INSERT INTO users (name, email, password_hash) VALUES
    ('Alice Johnson', 'alice@example.com', '$2y$10$NotARealHashAlice123'),
    ('Bob Smith', 'bob@example.com', '$2y$10$NotARealHashBob456'),
    ('Charlie Davis', 'charlie@example.com', '$2y$10$NotARealHashCharlie789');

-- 3. Insert Products
INSERT INTO products (category_id, title, description, base_price, image) VALUES
    (1, 'Braided USB-C to USB-C Cable',
        'Heavy duty nylon braided cable supporting 100W PD charging.',
        12.99, 'usbc_braided.jpg'),
    (2, 'Ultra High Speed HDMI 2.1',
        'Supports 8K@60Hz and 4K@120Hz for gaming consoles and PC.',
        24.99, 'hdmi_8k.jpg'),
    (4, 'Cat6 Ethernet Patch Cable',
        'Snagless UTP gigabit ethernet cable for home networking.',
        5.99, 'cat6_patch.jpg'),
    (5, '7-in-1 USB-C Hub',
        'Expand your laptop ports with HDMI, SD Card, and USB-A.',
        49.99, 'hub_7in1.jpg');

-- 4. Insert Product Variants
INSERT INTO product_variants (product_id, sku, name, price, stock) VALUES
    (1, 'USB-C-1M-BLK', '1 Meter - Black', 12.99, 50),
    (1, 'USB-C-2M-BLK', '2 Meter - Black', 15.99, 40),
    (1, 'USB-C-1M-RED', '1 Meter - Red', 12.99, 25),
    (2, 'HDMI-21-2M', '2 Meter', 24.99, 30),
    (2, 'HDMI-21-5M', '5 Meter', 34.99, 15),
    (3, 'CAT6-BLU-5PK', '5 Pack - Blue', 19.99, 100),
    (3, 'CAT6-WHT-10M', '10 Meter - White', 12.50, 60),
    (4, 'HUB-GRY', 'Space Grey', 49.99, 20);

-- 5. Insert Carts
INSERT INTO carts (user_id) VALUES (1);

-- 6. Insert Cart Items (Alice's cart)
INSERT INTO cart_items (cart_id, variant_id, qty) VALUES
    (1, 2, 2),   -- 2x 2m Black USB-C
    (1, 8, 1);   -- 1x USB-C Hub

-- 7. Insert Orders (Bob completed one)
INSERT INTO orders (user_id, total, status, shipping_address) VALUES
    (2, 59.98, 'shipped', '123 Tech Lane, Silicon Valley, CA 90210');

-- 8. Insert Order Items (What Bob bought)
INSERT INTO order_items (order_id, variant_id, qty, price) VALUES
    (1, 5, 1, 34.99),  -- 5m HDMI
    (1, 4, 1, 24.99);  -- 2m HDMI
