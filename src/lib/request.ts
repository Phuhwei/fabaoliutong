import { request } from './sys';

export const getOrders = () => request({
  method: 'post',
  url: '/api/order',
});

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