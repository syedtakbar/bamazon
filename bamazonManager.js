// This application is designed and developed by Syed Akbar (September 16, 2019)
const config = require('./config');
const mgrViewMenu = require('./mgrViewMenu');



const BamazonMgr = {
    inquirer : require("inquirer"), 
    mysql : require("mysql"),     
    fs : require("fs"),                   
    colors : require("colors"),
    pad : require("pad"),
    ctable: require("console.table"),
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

     lowInventoryQuestions : (obj) => {                         
        return [
                            {
                                type: "list",
                                name: "item",
                                message: "Please select an item to add inventory: ",
                                choices: obj,                    
                            },
                            {
                                type: "number",
                                name: "quantity",
                                message: "Please enter quantity for your selection: ",                                                        
                                filter: function(val) {
                                return val.toLowerCase();
                                }                       
                            }
                        ];
     }, 
    
     genCreateProductQuestions : () => {                         
        return [ 
                    {
                        type: "input",
                        name: "product_name",
                        message: "Please enter product name: ",     
                        validate:  (val) => val !== ""                                       
                    } ,
                    {
                        type: "input",
                        name: "department_name",
                        message: "Please enter department name: ",     
                        validate:  (val) => val !== ""                                             
                    },
                    {
                        type: "input",
                        name: "price",
                        message: "Please enter price: ",         
                        validate:  (val) => {
                            const isValid = !isNaN(parseFloat(val));
                            return isValid || "price should be a number!";
                        }
                        
                    },
                    {
                        type: "input",
                        name: "stock_quantity",
                        message: "Please enter stock quantity: ",   
                        validate:  (val) => {
                            const isValid = !isNaN(parseInt(val));
                            return isValid || "stock quantity should be a number!";
                        }                                     
                    }                                                               
                ];
     },

    addInventoryPrePrompt: () => {            
        let sql = `CALL getProducts()`;
        let connection = BamazonMgr.mysql.createConnection(config);
        
        connection.query(sql, [], (error, results, fields) => {
                    if (error) {
                        return console.error(error.message);
                    }
                    BamazonMgr.productionQuestions = results[0].map(x => x.item_id + " - " + x.product_name + " $" + x.price + " #" + x.stock_quantity);                     
                    BamazonMgr.addInventoryPrompt(BamazonMgr.productionQuestions );                
                    connection.end();                
        });    
    },


    updateInventoryQuantity: (itemId, inventoryQuantity) => {            
                
        let sql = `CALL updateProduct1(?,?)`;
        let connection = BamazonMgr.mysql.createConnection(config);
        
        connection.query(sql, [itemId, inventoryQuantity], (error, results) => {
                    if (error) {
                        return console.error(error.message);
                    }
                     
                    if (results.affectedRows > 0)
                    {
                        console.log(BamazonMgr.colors.green (
                        ` 
                            Inventory update successful for item ${itemId} and quantity ${inventoryQuantity}                            
                            Rows affected: ${results.affectedRows}
                        `));                        
                    }
                                                 
                    connection.end();                
        });    
    },  


    createProduct: (name, department, price, quantity) => {            
                
        let sql = `CALL insertProduct(?,?,?,?)`;
        let connection = BamazonMgr.mysql.createConnection(config);
        
        connection.query(sql, [name, department,price, quantity], (error, results) => {
                    if (error) {
                        return console.error(error.message);
                    }
                     
                    if (results.affectedRows > 0)
                    {
                        console.log(BamazonMgr.colors.green (
                        ` 
                            Product creation successful for ${name}                          
                            Rows affected: ${results.affectedRows}
                        `));                        
                    }
                                                 
                    connection.end();                
        });    
    },      

    createProductPrompt : () => BamazonMgr.inquirer.prompt(BamazonMgr.genCreateProductQuestions()).then(BamazonMgr.processCreateProductAnswer,BamazonMgr.processError),
    addInventoryPrompt : (obj) => BamazonMgr.inquirer.prompt(BamazonMgr.lowInventoryQuestions(obj)).then(BamazonMgr.processLowInventoryAnswer,BamazonMgr.processError),    
    rootPrompt : () => BamazonMgr.inquirer.prompt(BamazonMgr.genQuestions()).then(BamazonMgr.processAnswer,BamazonMgr.processError),
    
    processLowInventoryAnswer: (answers) => {      
        const item_id = answers.item.substring(0,10);
        if (isNaN ( answers.quantity)) {console.log(BamazonMgr.colors.red(`Please enter a valid quantity and try again!`)); return;}

        const quantity = answers.quantity || 0;
        if (quantity === 0) {console.log(BamazonMgr.colors.red(`Please enter a valid quantity and try again!`)); return;}
        //console.log(`item selected: ${item_id} and quantity: ${quantity}`);
        BamazonMgr.updateInventoryQuantity(item_id, quantity);     
    },

    processCreateProductAnswer: (answers) => {              
        BamazonMgr.createProduct(answers.product_name, answers.department_name, answers.price, answers.stock_quantity);     
    },

    processAnswer: (answers) => {      
        const item_id = answers.item;
        const filterAnswer = mgrViewMenu.MgrViewMenu.filter(x => x.value === parseInt(item_id.substring(0,2)));                         
        const api = filterAnswer[0].api;         
        //console.log(api);
        BamazonMgr[api]();        
    },
    
    MgrList: () => {            
        let sql = `CALL getProducts()`;        
        let connection = BamazonMgr.mysql.createConnection(config);
        
        connection.query(sql, [], (error, results, fields) => {
                    if (error) {
                        return console.error(error.message);
                    }                                                                                  
                    console.table(results[0]);              
                    connection.end();                
        });    
    },

    processInventory: (itemId, quantityUpdated, UpdateCallBack) => {            
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
                    UpdateCallBack(itemId,quantityUpdated);        
                    connection.end();                
        });    
    },    

    MgrGetLow: () => {            
        let sql = `CALL getProductsLow(?)`;        
        let connection = BamazonMgr.mysql.createConnection(config);
        
        connection.query(sql, [5], (error, results, fields) => {
                    if (error) {
                        return console.error(error.message);
                    }                                                                                  
                    console.table(results[0]);              
                    connection.end();                
        });    
    },
    
    MgrUpdate: () => {            
        BamazonMgr.addInventoryPrePrompt();
    },    

    MgrCreate: () => {            
        BamazonMgr.createProductPrompt();
    },     

    processError: (err) => {                
        if (err) console.log(BamazonMgr.colors.red(err));                                                         
    },

    writeData: (content) => {        
        BamazonMgr.fs.appendFile("tran.txt", content, BamazonMgr.processError );
    },
};


BamazonMgr.rootPrompt();
