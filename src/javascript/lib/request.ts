import { frontend } from '../../config';
import { request } from './sys';

const env = process.env.NODE_ENV as 'development' | 'staging';

export const getOrders = () => request({
  method: 'post',
  url: `${frontend[env]}/api/order`,
});

export const getTableData = (table: string) => request({
  method: 'post',
  url: `${frontend[env]}/api/table`,
  headers: { table },
});

export const insertEntry = (table: string, data: ObjStr, isMultiple?: boolean) => request({
  method: 'post',
  url: `${frontend[env]}/api/add`,
  headers: isMultiple ? { table, multiple: true } : { table },
  body: data,
});

export const getCurrencyRate = () => request({
  method: 'get',
  url: 'https://api.fixer.io/latest?base=CAD',
});
