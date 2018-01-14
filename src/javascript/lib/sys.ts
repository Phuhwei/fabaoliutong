import * as superagent from 'superagent';
import { dbSchema } from '../../../api/config';

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
    resolve(merge(res.body, { status: res.status }));
  })
    .catch(err => reject(err));
});

function hasObject(obj: Obj) {
  if (obj == null) { return null; }
  const objects = [] as string[];
  Object.keys(obj).forEach(item => {
    if (obj[item] == null) { return; }
    if (obj[item].constructor.name === 'Object') { objects.push(item); }
  });
  return objects[0] ? objects : null;
}

function arrangeSource(source: Obj, sourceKeys: string[]) {
  const obj = source;
  sourceKeys.forEach(item => {
    if (source[item] === undefined) { delete obj[item]; }
  });
  return obj;
}

export function merge(destin: Obj, source: Obj) {
  if (source === null) {
    return null;
  } else if (source === undefined) {
    return destin;
  } else if (source.constructor.name !== 'Object') {
    return source;
  }
  const sourceKeys = Object.keys(source);
  if (sourceKeys.length === 0) { return destin; }
  const sourceObj = arrangeSource(source, sourceKeys);
  const objectItems = hasObject(destin);
  if (!objectItems) { return Object.assign({}, destin, sourceObj); }
  objectItems.forEach(item => {
    sourceObj[item] = merge(destin[item], sourceObj[item]);
  });
  return Object.assign({}, destin, sourceObj);
}

export const findColumnNames = (table: string) =>
  Object.keys(dbSchema[table]).map((column: string) => {
    const { alias, link } = dbSchema[table][column];
    if (alias) return alias;
    return dbSchema[link.table][link.column].alias;
  });
export const findRequiredColumns = (table: string) =>
  Object.keys(dbSchema[table]).filter((column: string) => dbSchema[table][column].required);

export const wait = (time: number) => new Promise(r => setTimeout(r, time || 1000));
