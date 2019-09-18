exports.mgrViewMenu = [

    {item: "View Products for Sale", value: 1, api: "MgrList"},
    {item: "View Low Inventory", value: 2, api: "MgrGetLow"},
    {item: "Add to Inventory", value: 3, api: "MgrUpdate"},
    {item: "Add New Product", value: 4, api: "MgrCreate"},   
];
exports.mgrViewMenuDetail = exports.mgrViewMenu.map((o) => o.value + " - " + o.item );

