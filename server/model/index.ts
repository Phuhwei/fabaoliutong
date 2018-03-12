import { freeQuery, insertMultipleRows, insertOneRow, updateOneRow } from '../lib/db';

export const getAllOrders = () => {
  const sql = ['SELECT',
    'person.name as 订购人,',
    'treasure.name as 法宝,',
    'o.id,',
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

declare interface DbJSON {
  [key: string]: string | number;
}
declare interface MultiJSON  {
  fields: string[];
  valueSets: string[];
}
export const addEntry = (table: string, data: DbJSON | MultiJSON, isMultiple?: boolean) =>
  isMultiple
    ? insertMultipleRows(table, (data as MultiJSON).fields, (data as MultiJSON).valueSets)
    : insertOneRow(table, data as DbJSON);

export const updateEntry = (table: string, data: Obj) =>
  updateOneRow(table, data.ref, data.target);
