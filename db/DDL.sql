DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(255) NULL,
  department_name VARCHAR(255) NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT NULL,  
  PRIMARY KEY (item_id)
);


USE `bamazon`;
DROP procedure IF EXISTS `getProducts`;

DELIMITER $$
USE `bamazon`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `getProducts`()
BEGIN
	SELECT item_id,product_name,department_name,price,stock_quantity 
	FROM bamazon.products;
    
END$$

DELIMITER ;


USE `bamazon`;
DROP procedure IF EXISTS `getProduct`;

DELIMITER $$
USE `bamazon`$$
CREATE PROCEDURE `getProduct` (in item_id_input int(10))
BEGIN
	SELECT item_id,product_name,department_name,price,stock_quantity 
    FROM bamazon.products
    WHERE bamazon.products.item_id = item_id_input;
END$$

DELIMITER ;


USE `bamazon`;
DROP procedure IF EXISTS `updateProduct`;

DELIMITER $$
USE `bamazon`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `updateProduct`(in item_id_input int(10), in stock_quantity_input int)
BEGIN
	UPDATE 
    
		bamazon.products 
		SET bamazon.products.stock_quantity =  bamazon.products.stock_quantity - stock_quantity_input
    WHERE bamazon.products.item_id = item_id_input;
END$$

DELIMITER ;



