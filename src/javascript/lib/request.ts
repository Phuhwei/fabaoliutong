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
