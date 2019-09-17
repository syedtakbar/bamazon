// This application is designed and developed by Syed Akbar (September 16, 2019)
const config = require('./config');

const BamazonCust = {
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
        let connection = BamazonCust.mysql.createConnection(config);
        
        connection.query(sql, [], (error, results, fields) => {
                    if (error) {
                        return console.error(error.message);
                    }
                    BamazonCust.productionQuestions = results[0].map(x => x.item_id + " - " + x.product_name + " $" + x.price + " #" + x.stock_quantity);                     
                    BamazonCust.prompt(BamazonCust.productionQuestions );                
                    connection.end();                
        });    
    },

    processCustomerOrder: (itemId, quantityOrdered, UpdateCallBack) => {            
        let sql = `CALL getProduct(?)`;
        let connection = BamazonCust.mysql.createConnection(config);
        
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
            console.log(BamazonCust.colors.red(`
                                                    Insufficient quantity for ItemId: ${itemId}
                                                    Quantity Orderd: ${quantityOrdered}
                                                    Stocked Quantity: ${stockQuantity}                                    
                                                `));
            return;
        }
        
        
        let sql = `CALL updateProduct(?,?)`;
        let connection = BamazonCust.mysql.createConnection(config);
        
        connection.query(sql, [itemId, quantityOrdered], (error, results) => {
                    if (error) {
                        return console.error(error.message);
                    }
                    
                    const totalAmt = quantityOrdered * price;
                    console.log(BamazonCust.colors.green (
                                ` 
                                    Order successful for Item ${itemId} and quantity ${quantityOrdered}
                                    Order Total: $${totalAmt}
                                    Rows affected: ${results.affectedRows}
                                `));                             
                    connection.end();                
        });    
    },  

    prompt : (obj) => BamazonCust.inquirer.prompt(BamazonCust.genQuestions(obj)).then(BamazonCust.processAnswer,BamazonCust.processError),

    processAnswer: (answers) => {      
        const item_id = answers.item.substring(0,10);
        if (isNaN ( answers.quantity)) {console.log(BamazonCust.colors.red(`Please enter a valid quantity and try again!`)); return;}

        const quantity = answers.quantity || 0;
        if (quantity === 0) {console.log(BamazonCust.colors.red(`Please enter a valid quantity and try again!`)); return;}
        //console.log(`item selected: ${item_id} and quantity: ${quantity}`);
        BamazonCust.processCustomerOrder(item_id, quantity, BamazonCust.updateOrderQuantity);
    },
    

    processError: (err) => {                
        if (err) console.log(BamazonCust.colors.red(err));                                                         
    },

    writeData: (content) => {        
        BamazonCust.fs.appendFile("tran.txt", content, BamazonCust.processError );
    },
};


BamazonCust.preprompt();
