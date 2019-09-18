# Bamazon

## Description

This application implements a simple command line based storefront using the npm [inquirer](https://www.npmjs.com/package/inquirer) package and the MySQL database backend together with the npm [mysql](https://www.npmjs.com/package/mysql) package. The application presents three interfaces: **customer** , **manager** and **supervisor**.

### MySQL Database Setup

In order to run this application, you should have the MySQL database already set up on your machine. If you don't, visit the [MySQL installation page](https://dev.mysql.com/downloads/mysql/8.0.html) to install the version you need for your operating system. Once you have MySQL isntalled, you will be able to create the *bamazon* database and the *products* and *departments* tables and related stored procudures with the SQL code found in [./db/DDL.sql](DDL.sql). Run this code inside your MySQL client like [MySQL Workbench](https://www.mysql.com/products/workbench/) to populate the database, then you will be ready to proceed with running the bamazon customer, manager and supervisor interfaces.

### Initial Setp
Please clone the bamazon repo and install necessary node modules, as below.

	git clone git@github.com:syedtakbar/bamazon.git
	cd bamazon
	npm install

### Customer Interface
The customer interface presents a list of options, as below.
    
    ? Please select an item to purchase:  
    0000000033 - LG - 65" Class - LED - UK6090PUA Series - 2160p - Smart - 4K UHD TV with HDR $529.99 #50 
    0000000034 - Sony - 65" Class - LED - X900F Series - 2160p - Smart - 4K Ultra HD TV with HDR $1399.99 #10 
    ❯ 0000000035 - Samsung - 75" Class - LED - NU6900 Series - 2160p - Smart - 4K UHD TV with HDR $999.99 #24 
    0000000036 - VIZIO - 70" Class - LED - V Series - 2160p - Smart - 4K UHD TV with HDR $699.99 #24 
    0000000037 - TCL - 75" Class - LED - 6 Series - 2160p - Smart - 4K UHD TV with HDR $1299.99 #10 
    0000000038 - Samsung - Galaxy Note10+ with 256GB Memory Cell Phone (Unlocked) - Aura Black $899.99 #10 
    0000000039 - Google - Pixel 3 with 64GB Memory Cell Phone (Unlocked) - Just Black $499.99 #10 
    (Move up and down to reveal more choices)


The customer interface allows the user to view the current inventory of store items: item ids, descriptions, department in which the item is located and price. The user is then able to purchase one of the existing items by selecting item from the prompt and entering the desired quantity. If the selected quantity is currently in stock, the user's order is fulfilled, displaying the total purchase price and updating the database. If the desired quantity is not available, the user is displayed to insufficient quantity message.

To run the customer interface please follow the steps below:

	node bamazonCustomer.js

### Manager Interace

The manager interface presents a list of four options, as below. 

    ? Please select an item:  
    1 - View Products for Sale 
    2 - View Low Inventory 
    ❯ 3 - Add to Inventory 
    4 - Add New Product 
 
The **View Products for Sale** option allows the user to view the current inventory of store items: item ids, descriptions, department in which the item is located, price, and the quantity available in stock. 

The **View Low Inventory** option shows the user the items which currently have fewer than 100 units available.

The **Add to Inventory** option allows the user to select a given item ID and add additional inventory to the target item.

The **Add New Product** option allows the user to enter details about a new product which will be entered into the database upon completion of the form.

To run the manager interface please follow the steps below:

	node bamazonManager.js


### Supervisor Interace

The supervisor interface presents a list of four options, as below. 

    ? Please select an item:  
    1 - View Product Sales by Department 
    ❯ 2 - Create New Department 
 
The **View Product Sales by Department** option allows the user to view the sales figures by departments. The app  displays a summarized table. Please see some sample data below.

    department_id  department_name  over_head_costs  product_sales  total_profit
    -------------  ---------------  ---------------  -------------  ------------
    0000000009     TV               6999.99          0              -6999.99    
    0000000010     Phone            4999.99          0              -4999.99    
    0000000011     Laptop           1999.99          7799.88        5799.89     
    0000000012     Headphone        399.99           0              -399.99     

The **Create New Department** option allows the user to enter details about a new department which will be entered into the database upon completion of the form.

To run the supervisor interface please follow the steps below:

	node bamazonSupervisor.js    

### Bamazon Demo

You can download and watch the demo of the bamazon customer, manager and interfaces below.

![Results](./bamazon.gif)
    
- - -

## TECHNOLOGIES USED
* Javascript
* Nodejs
* Node packages:
    * mysql
    * pad
    * inquirer
    * colors
    * fs
    * console.table


