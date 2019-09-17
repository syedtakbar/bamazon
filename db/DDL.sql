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

CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(255) NULL,
  over_head_costs DECIMAL(10,2) NULL,
  PRIMARY KEY (department_id)
);

ALTER TABLE products
ADD COLUMN product_sales  DECIMAL(10,2) NULL;

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



USE `bamazon`;
DROP procedure IF EXISTS `getProductsLow`;

DELIMITER $$
USE `bamazon`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `getProductsLow`(in stock_quantity_input INT )
BEGIN
	SELECT item_id,product_name,department_name,price,stock_quantity 
    FROM bamazon.products
    WHERE bamazon.products.stock_quantity < stock_quantity_input;
END$$

DELIMITER ;

USE `bamazon`;
DROP procedure IF EXISTS `updateProduct1`;

DELIMITER $$
USE `bamazon`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `updateProduct1`(in item_id_input int(10), in stock_quantity_input int)
BEGIN
	UPDATE 
    
		bamazon.products 
		SET bamazon.products.stock_quantity =  bamazon.products.stock_quantity + stock_quantity_input
    WHERE bamazon.products.item_id = item_id_input;
END$$

DELIMITER ;


USE `bamazon`;
DROP procedure IF EXISTS `insertProduct`;

DELIMITER $$
USE `bamazon`$$
CREATE PROCEDURE `insertProduct` (in product_name varchar(255),
								  in department_name varchar(255),
                                  in price DECIMAL(10,2),
                                  in stock_quantity INT)
BEGIN
	INSERT INTO bamazon.products
    SET 
		bamazon.products.product_name = product_name,
        bamazon.products.department_name = department_name,
        bamazon.products.price = price,
        bamazon.products.stock_quantity = stock_quantity;
END$$

DELIMITER ;



USE `bamazon`;
DROP procedure IF EXISTS `updateProduct`;

DELIMITER $$
USE `bamazon`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `updateProduct`(
											in item_id_input INT(10), 
                                            in stock_quantity_input INT,
                                            in product_sales_input DECIMAL(10,2))
BEGIN
	UPDATE 
    
		bamazon.products 
		SET 
				bamazon.products.stock_quantity =  bamazon.products.stock_quantity - stock_quantity_input,
				bamazon.products.product_sales = COALESCE(bamazon.products.product_sales, 0) + product_sales_input
        
    WHERE 
		bamazon.products.item_id = item_id_input;
END$$

DELIMITER ;






