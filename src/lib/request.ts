import { devConsole, request } from './sys';

export const getOrders = () => request({
  method: 'post',
  url: '/api/order',
})
  .catch(e => devConsole(e));

/* get different table by header */
export const getTableData = (table: string) => request({
  method: 'post',
  url: '/api/table',
  headers: { table },
});

export const insertEntry = (table: string, data: ObjStr, isMultiple?: boolean) => request({
  method: 'post',
  url: '/api/add',
  headers: isMultiple ? { table, multiple: true } : { table },
  body: data,
});

export const getCurrencyRate = () => request({
  method: 'get',
  url: 'https://api.fixer.io/latest?base=CAD',
});

interface UpdataObj {
  ref: Obj;
  target: Obj;
}
export const updateRecord = (table: string, data: UpdataObj) => request({
  method: 'post',
  url: '/api/update',
  headers: { table },
  body: data,
});
