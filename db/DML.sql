-- DELETE FROM bamazon.products WHERE item_id <> 0 ;
SELECT item_id,product_name,department_name,price,stock_quantity FROM bamazon.products;

INSERT INTO bamazon.products 
(product_name,department_name,price,stock_quantity)
VALUES 
('LG - 65" Class - LED - UK6090PUA Series - 2160p - Smart - 4K UHD TV with HDR','TV', 529.99,10),
('Sony - 65" Class - LED - X900F Series - 2160p - Smart - 4K Ultra HD TV with HDR','TV', 1399.99,10),
('Samsung - 75" Class - LED - NU6900 Series - 2160p - Smart - 4K UHD TV with HDR', 'TV',999.99,10),
('VIZIO - 70" Class - LED - V Series - 2160p - Smart - 4K UHD TV with HDR', 'TV',699.99,10),
('TCL - 75" Class - LED - 6 Series - 2160p - Smart - 4K UHD TV with HDR', 'TV',1299.99,10),
('Samsung - Galaxy Note10+ with 256GB Memory Cell Phone (Unlocked) - Aura Black', 'Phone',899.99,10),
('Google - Pixel 3 with 64GB Memory Cell Phone (Unlocked) - Just Black', 'Phone', 499.99,10),
('LG - Stylo 4 with 32GB Memory Cell Phone (Unlocked) - Black', 'Phone', 199.99,10),
('Motorola - Moto G7 with 64GB Memory Cell Phone (Unlocked) - Ceramic Black', 'Phone', 149.99,10),
('Razer - Phone 2 with 64GB Memory Cell Phone (Unlocked) - Black', 'Phone', 349.99,10);



