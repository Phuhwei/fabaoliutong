"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var db_1 = require("../lib/db");
exports.getAllOrders = function () {
    var sql = ['SELECT',
        'person.name as 订购人,',
        'treasure.name as 法宝,',
        "o.unit_price_RMB as '单价(¥)',",
        "o.unit_price_CAD as '单价($)',",
        'o.quantity as 数量,',
        'st.name as 状态,',
        "o.final_price as '总价($)',",
        'o.date as 日期',
        'FROM',
        'fabaoliutong.order as o,',
        'fabaoliutong.status as st,',
        'fabaoliutong.area as area,',
        'fabaoliutong.person as person,',
        'fabaoliutong.treasure as treasure',
        'WHERE o.treasure_id = treasure.id',
        'AND o.person_id = person.id',
        'AND o.status_id = st.id',
        'GROUP by o.id;',
    ].join(' ');
    return db_1.freeQuery(sql);
};
exports.getTableData = function (table) { return db_1.freeQuery("SELECT * FROM fabaoliutong." + table); };
exports.addEntry = function (table, data, isMultiple) {
    return isMultiple
        ? db_1.insertMultipleRows(table, data.fields, data.valueSets)
        : db_1.insertOneRow(table, data);
};
//# sourceMappingURL=index.js.map