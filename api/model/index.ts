import { freeQuery, insertOneRow } from '../lib/db';

export const getAllOrders = () => {
  const sql = ['SELECT',
    'treasure.name as 法宝,',
    'person.name as 订购人,',
    "o.unit_price as '单价(¥)',",
    'o.quantity as 数量,',
    'st.name as 状态,',
    "o.final_price as '确定总价($)',",
    'o.date as 日期',
    'FROM',
    'fabaoliutong.order as o,',
    'fabaoliutong.status as st,',
    'fabaoliutong.area as area,',
    'fabaoliutong.person as person,',
    'fabaoliutong.treasure as treasure',
    'WHERE o.treasure_id = treasure.id',
    'AND o.person_id = person.id',
    'AND o.status_id = st.id;',
  ].join(' ');
  return freeQuery(sql);
};

export const getTableData = (table: string) => freeQuery(
  `SELECT * FROM fabaoliutong.${table}`,
);

export const addEntry = (table: string, insertJSON: DbJSON) => insertOneRow(table, insertJSON);
