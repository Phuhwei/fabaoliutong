import { merge } from 'lodash';
import * as superagent from 'superagent';
import { dbSchema } from '../../server/config';

const env = process.env.NODE_ENV;

export const devConsole = (...args: string[]) => {
  if (['development', 'test'].includes(env)) {
    // tslint:disable-next-line:no-console
    console.log(...args);
  }
};

// request functions:
export const request = (args: RequestArgs) => new Promise((resolve, reject) => {
  let req = superagent[args.method](args.url);
  const { headers, fields } = args;
  if (args.contentType !== null) {
    req.set('Content-Type', 'application/json');
  }
  if (headers) {
    Object.keys(headers).forEach(key => {
      req = req.set(key, headers[key]);
    });
  }
  if (fields) {
    Object.keys(fields).forEach(key => {
      req = req.field(key, fields[key]);
    });
  }
  if (args.body) {
    req = req.send(args.body);
  }
  let reqSuccess = false;
  setTimeout(() => {
    if (!reqSuccess) reject({ status: 500, message: `Request time out: ${args.url}` });
  }, args.timeout || 8000);
  return req.then(res => {
    reqSuccess = true;
    resolve(merge({}, res.body, { status: res.status }));
  })
    .catch(err => reject(err));
});

export const findColumnNames = (table: string) =>
  Object.keys(dbSchema[table]).map((column: string) => {
    const { alias, link } = dbSchema[table][column];
    if (alias) return alias;
    return dbSchema[link.table][link.column].alias;
  });

export const findRequiredColumns = (table: string) =>
  Object.keys(dbSchema[table]).filter((column: string) => dbSchema[table][column].required);

export const wait = (time: number) => new Promise(r => setTimeout(r, time || 1000));

export const mathRound = (num: number) => Math.round(num * 100) / 100;

// export const findParentLink = ()
