DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT NOT NULL,
    product_sales DECIMAL (16,2),
    PRIMARY KEY (item_id)
);
    
INSERT INTO products
	(product_name, department_name, price, stock_quantity, product_sales)
VALUES
	("Wacky Waving Inflatable Arm Flailing Tube Man", "Decor", 149.99, 1000, 0),
    ("Pink Lawn Flamingo", "Decor", 14.99, 50, 0),
    ("Titanium Toothbrush", "Personal Hygiene", 59.99, 10, 0),
    ("Wool Socks (1 Pair)", "Apparel", 7.99, 300, 0),
    ("HAL 9000", "Computers", 5000000.00, 2, 0),
    ("Sticky Notes, 2\"x2\", 500ct.", "Office", 1.99, 50, 0),
    ("Deluxe Chess Simulator", "Computers", 99.99, 15, 0),
    ("Sterile Adhesive Medical Strips, 50 ct.", "Personal Hygiene", 5.99, 30, 0),
    ("Womans Alpaca Wool Pajamas, Violet", "Apparel", 89.99, 20, 0),
    ("Elmers Glue, 20 oz.", "Office", 8.99, 800, 0);

CREATE TABLE departments(
	department_id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(50) NOT NULL,
    overhead_cost DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (department_id)
);

INSERT INTO departments
    (department_name, overhead_cost)
VALUES
    ("Apparel", 1500),
    ("Computers", 1000),
    ("Decor", 500),
    ("Office", 500),
    ("Personal Hygiene", 200);