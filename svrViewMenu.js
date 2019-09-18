exports.svrViewMenu = [

    {item: "View Product Sales by Department", value: 1, api: "SvrDepSales"},
    {item: "Create New Department", value: 2, api: "SvrDepCreate"},
];
exports.svrViewMenuDetail = exports.svrViewMenu.map((o) => o.value + " - " + o.item );

