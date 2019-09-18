// This application is designed and developed by Syed Akbar (September 16, 2019)
const config = require('./config');
const svrViewMenu = require('./svrViewMenu');

const BamazonSvr = {
    inquirer : require("inquirer"), 
    mysql : require("mysql"),     
    fs : require("fs"),                   
    colors : require("colors"),
    pad : require("pad"),
    ctable: require("console.table"),

    genQuestions : () => {                         
        return [
                            {
                                type: "list",
                                name: "item",
                                message: "Please select an item: ",
                                choices: svrViewMenu.svrViewMenuDetail,                    
                            }                            
                        ];
    },

    genCreateDepartmentQuestions : () => {                         
        return [ 
                    {
                        type: "input",
                        name: "department_name",
                        message: "Please enter department name: ",     
                        validate:  (val) => val !== ""                                             
                    },
                    {
                        type: "input",
                        name: "over_head_costs",
                        message: "Please enter over head cost: ",         
                        validate:  (val) => {
                            const isValid = !isNaN(parseFloat(val));
                            return isValid || "over head cost should be a number!";
                        }                        
                    }                                                              
                ];
     },

    createDepartment: (department, cost) => {            
                
        let sql = `CALL insertDepartment(?,?)`;
        let connection = BamazonSvr.mysql.createConnection(config);
        
        connection.query(sql, [department,cost], (error, results) => {
                    if (error) {
                        return console.error(error.message);
                    }
                     
                    if (results.affectedRows > 0)
                    {
                        console.log(BamazonSvr.colors.green (
                        ` 
                            Department creation successful for ${department}                          
                            Rows affected: ${results.affectedRows}
                        `));                        
                    }
                                                 
                    connection.end();                
        });    
    },      

    createDepartmentPrompt : () => BamazonSvr.inquirer.prompt(BamazonSvr.genCreateDepartmentQuestions()).then(BamazonSvr.processCreateDepartmentAnswer,BamazonSvr.processError),    
    rootPrompt : () => BamazonSvr.inquirer.prompt(BamazonSvr.genQuestions()).then(BamazonSvr.processAnswer,BamazonSvr.processError),
    
    processLowInventoryAnswer: (answers) => {      
        const item_id = answers.item.substring(0,10);
        if (isNaN ( answers.quantity)) {console.log(BamazonSvr.colors.red(`Please enter a valid quantity and try again!`)); return;}

        const quantity = answers.quantity || 0;
        if (quantity === 0) {console.log(BamazonSvr.colors.red(`Please enter a valid quantity and try again!`)); return;}
        //console.log(`item selected: ${item_id} and quantity: ${quantity}`);
        BamazonSvr.updateInventoryQuantity(item_id, quantity);     
    },

    processCreateDepartmentAnswer: (answers) => {              
        BamazonSvr.createDepartment(answers.department_name, answers.over_head_costs);     
    },

    processAnswer: (answers) => {      
        const item_id = answers.item;
        const filterAnswer = svrViewMenu.svrViewMenu.filter(x => x.value === parseInt(item_id.substring(0,2)));                         
        const api = filterAnswer[0].api;         
        //console.log(api);
        BamazonSvr[api]();        
    },
    
    SvrDepSales: () => {            
        let sql = `CALL getSalesByDepartments()`;        
        let connection = BamazonSvr.mysql.createConnection(config);
        
        connection.query(sql, [], (error, results, fields) => {
                    if (error) {
                        return console.error(error.message);
                    }                                                                                  
                    console.table(results[0]);              
                    connection.end();                
        });    
    },

    SvrDepCreate: () => {            
        BamazonSvr.createDepartmentPrompt();
    },     

    processError: (err) => {                
        if (err) console.log(BamazonSvr.colors.red(err));                                                         
    },

    writeData: (content) => {        
        BamazonSvr.fs.appendFile("tran.txt", content, BamazonSvr.processError );
    },
};


BamazonSvr.rootPrompt();
