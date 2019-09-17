// This application is designed and developed by Syed Akbar (September 16, 2019)
const config = require('./config');

const libBamazonCust = {
     inquirer : require("inquirer"), 
     mysql : require("mysql"),     
     fs : require("fs"),                   
     colors : require('colors'),
     pad : require('pad'),
     productionQuestions : [],
     genQuestions : (obj) => {                         
        return [
                            {
                                type: "list",
                                name: "item",
                                message: "Please select an item to purchase: ",
                                choices: obj,                    
                            },
                            {
                                type: "input",
                                name: "quantity",
                                message: "Please enter quantity for your selection: ",                        
                                filter: function(val) {
                                return val.toLowerCase();
                                }                       
                            }
                        ];
     },
    
    
    preprompt: () => {            
        let sql = `CALL getProducts()`;
        let connection = libBamazonCust.mysql.createConnection(config);
        
        connection.query(sql, [], (error, results, fields) => {
                    if (error) {
                        return console.error(error.message);
                    }
                    libBamazonCust.productionQuestions = results[0].map(x => x.item_id + " - " + x.product_name + " $" + x.price + " #" + x.stock_quantity);                     
                    libBamazonCust.prompt(libBamazonCust.productionQuestions );                
                    connection.end();                
        });    
    },

    processCustomerOrder: (itemId, quantityOrdered, UpdateCallBack) => {            
        let sql = `CALL getProduct(?)`;
        let connection = libBamazonCust.mysql.createConnection(config);
        
        connection.query(sql, [itemId], (error, results) => {
                    if (error) {
                        return console.error(error.message);
                    }
                    // console.log(` 
                    //                 item_id: ${results[0][0].item_id}
                    //                 stock_quantity: ${results[0][0].stock_quantity}
                    // `);    
                    UpdateCallBack(itemId,quantityOrdered, results[0][0].stock_quantity, results[0][0].price);        
                    connection.end();                
        });    
    },    


    updateOrderQuantity: (itemId,quantityOrdered, stockQuantity, price) => {            
        
        if (parseInt(stockQuantity) < parseInt(quantityOrdered)) 
        {
            console.log(libBamazonCust.colors.red(`
                                                    Insufficient quantity for ItemId: ${itemId}
                                                    Quantity Orderd: ${quantityOrdered}
                                                    Stocked Quantity: ${stockQuantity}                                    
                                                `));
            return;
        }
        
        
        let sql = `CALL updateProduct(?,?)`;
        let connection = libBamazonCust.mysql.createConnection(config);
        
        connection.query(sql, [itemId, quantityOrdered], (error, results) => {
                    if (error) {
                        return console.error(error.message);
                    }
                    
                    const totalAmt = quantityOrdered * price;
                    console.log(libBamazonCust.colors.green (
                                ` 
                                    Order successful for Item ${itemId} and quantity ${quantityOrdered}
                                    Order Total: $${totalAmt}
                                    Rows affected: ${results.affectedRows}
                                `));                             
                    connection.end();                
        });    
    },  

    prompt : (obj) => libBamazonCust.inquirer.prompt(libBamazonCust.genQuestions(obj)).then(libBamazonCust.processAnswer,libBamazonCust.processError),

    processAnswer: (answers) => {      
        const item_id = answers.item.substring(0,10);
        const quantity = answers.quantity || 0;

        if (quantity === 0) {console.log(libBamazonCust.colors.red(`Please enter a valid quantity and try again!`)); return;}
        //console.log(`item selected: ${item_id} and quantity: ${quantity}`);
        libBamazonCust.processCustomerOrder(item_id, quantity, libBamazonCust.updateOrderQuantity);
    },
    

    processError: (err) => {                
        if (err) console.log(libBamazonCust.colors.red(err));                                                         
    },

    writeData: (content) => {        
        libBamazonCust.fs.appendFile("tran.txt", content, libBamazonCust.processError );
    },
};


libBamazonCust.preprompt();
