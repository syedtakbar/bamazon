exports.MgrViewMenu = [

    {item: "View Products for Sale", value: 1, api: "list"},
    {item: "View Low Inventory", value: 2, api: "get"},
    {item: "Add to Inventory", value: 3, api: "add"},
    {item: "Add New Product", value: 4, api: "create"},   
];
exports.mgrViewMenuDetail = exports.MgrViewMenu.map((o) => o.value + " - " + o.item );

