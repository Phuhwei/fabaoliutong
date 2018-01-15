import { freeQuery, insertOneRow, insertMultipleRows } from '../lib/db';

export const getAllOrders = () => {
  const sql = ['SELECT',
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
  return freeQuery(sql);
};

export const getTableData = (table: string) => freeQuery(
  `SELECT * FROM fabaoliutong.${table}`,
);

export const addEntry = (table: string, data: DbJSON, isMultiple?: boolean) => isMultiple
  ? insertMultipleRows(table, data.fields, data.valueSets)
  : insertOneRow(table, data);
