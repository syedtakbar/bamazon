// This application is designed and developed by Syed Akbar (September 16, 2019)
const config = require('./config');
const mgrViewMenu = require('./mgrViewMenu');

const BamazonMgr = {
    inquirer : require("inquirer"), 
    mysql : require("mysql"),     
    fs : require("fs"),                   
    colors : require('colors'),
    pad : require('pad'),
    productionQuestions : [],

    genQuestions : () => {                         
        return [
                            {
                                type: "list",
                                name: "item",
                                message: "Please select an item: ",
                                choices: mgrViewMenu.mgrViewMenuDetail,                    
                            }                            
                        ];
     },
    
    preprompt: () => {            
        let sql = `CALL getProducts()`;
        let connection = BamazonMgr.mysql.createConnection(config);
        
        connection.query(sql, [], (error, results, fields) => {
                    if (error) {
                        return console.error(error.message);
                    }
                    BamazonMgr.productionQuestions = results[0].map(x => x.item_id + " - " + x.product_name + " $" + x.price + " #" + x.stock_quantity);                     
                    BamazonMgr.prompt(BamazonMgr.productionQuestions );                
                    connection.end();                
        });    
    },

    processCustomerOrder: (itemId, quantityOrdered, UpdateCallBack) => {            
        let sql = `CALL getProduct(?)`;
        let connection = BamazonMgr.mysql.createConnection(config);
        
        connection.query(sql, [itemId], (error, results) => {
                    if (error) {
                        return console.error(error.message);
                    }  
                    UpdateCallBack(itemId,quantityOrdered, results[0][0].stock_quantity, results[0][0].price);        
                    connection.end();                
        });    
    },    


    updateOrderQuantity: (itemId,quantityOrdered, stockQuantity, price) => {            
        
        if (parseInt(stockQuantity) < parseInt(quantityOrdered)) 
        {
            console.log(BamazonMgr.colors.red(`
                                                    Insufficient quantity for ItemId: ${itemId}
                                                    Quantity Orderd: ${quantityOrdered}
                                                    Stocked Quantity: ${stockQuantity}                                    
                                                `));
            return;
        }
        
        
        let sql = `CALL updateProduct(?,?)`;
        let connection = BamazonMgr.mysql.createConnection(config);
        
        connection.query(sql, [itemId, quantityOrdered], (error, results) => {
                    if (error) {
                        return console.error(error.message);
                    }
                    
                    const totalAmt = quantityOrdered * price;
                    console.log(BamazonMgr.colors.green (
                                ` 
                                    Order successful for Item ${itemId} and quantity ${quantityOrdered}
                                    Order Total: $${totalAmt}
                                    Rows affected: ${results.affectedRows}
                                `));                             
                    connection.end();                
        });    
    },  

    prompt : () => BamazonMgr.inquirer.prompt(BamazonMgr.genQuestions()).then(BamazonMgr.processAnswer,BamazonMgr.processError),

    processAnswer: (answers) => {      
        const item_id = answers.item;
        console.log(answers.item);
        //if (isNaN ( answers.quantity)) {console.log(BamazonMgr.colors.red(`Please enter a valid quantity and try again!`)); return;}

        //const quantity = answers.quantity || 0;
        //if (quantity === 0) {console.log(BamazonMgr.colors.red(`Please enter a valid quantity and try again!`)); return;}
        //console.log(`item selected: ${item_id} and quantity: ${quantity}`);
        //BamazonMgr.processCustomerOrder(item_id, quantity, BamazonMgr.updateOrderQuantity);
    },
    

    processError: (err) => {                
        if (err) console.log(BamazonMgr.colors.red(err));                                                         
    },

    writeData: (content) => {        
        BamazonMgr.fs.appendFile("tran.txt", content, BamazonMgr.processError );
    },
};


BamazonMgr.prompt();
