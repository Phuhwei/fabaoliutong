import * as Debug from 'debug';
import * as mysql from 'promise-mysql';
import { database } from '../config';

const debug = Debug('dev:db');

declare type Connect = mysql.PoolConnection;

const env = process.env.NODE_ENV;
const pool = mysql.createPool({
  host: database[env].host,
  user: database[env].user,
  database: database[env].name,
  password: database[env].password,
  port: 3306,
  connectionLimit: 1000,
});

const query = (connect: Connect, sql: string | string[], questionMark?: Array<string | number>) =>
  Promise.resolve().then(() => {
    if (typeof sql === 'object') { // conditioned for array
      return Promise.all(sql.map(item => connect.query(item, questionMark)));
    }
    return connect.query(sql, questionMark);
  })
    .then(res => {
      pool.releaseConnection(connect);
      return res;
    })
    .catch(err => {
      pool.releaseConnection(connect);
      throw err;
    });

function formatSQL(inputJSON: DbJSON, conjunction: string) {
  let sql = '';
  Object.keys(inputJSON).forEach(field => {
    const value = inputJSON[field];
    let inputValue;
    if (value === null) inputValue = 'NULL'; // will override the current field to be NULL
    else if (value === undefined) return; // will leave as it is.
    else {
      inputValue = `'${typeof value === 'string' && value.indexOf("'") > -1
        ? value.replace(new RegExp("'", 'g'), "\\'")
        : value}'`;
    } // will update the field.
    sql = sql.concat(`${field} = ${inputValue} ${conjunction} `);
  });
  sql = sql.slice(0, -(conjunction.length + 2));
  return sql;
}

const genSql = (type: string, tbl: string, tgtJSON: DbJSON, refJSON?: DbJSON) => {
  // tslint:disable-next-line:max-line-length
  let sql = `${type === 'insert' ? 'INSERT INTO' : 'UPDATE'} ${database[env].name}.${tbl} SET ${formatSQL(tgtJSON, ',')}`;
  if (type === 'update') sql += ` WHERE ${formatSQL(refJSON, 'AND')}`;
  return sql;
};

const getConnection = () => pool.getConnection()
  .catch(err => { throw Error(err); });

export const getOneTable = (table: string, referenceJSON: DbJSON, target?: string[]) =>
  Promise.resolve([
    `SELECT ${(target && target.join(',')) || '*'} FROM ${table}`,
    `WHERE ${formatSQL(referenceJSON, 'and')}`,
  ].join(' '))
    .then(sql => getConnection()
      .then(c => query(c, sql)))
    .catch(err => {
      debug("'getOneTable' Error");
      throw err;
    });

export const insertOneRow = (table: string, insertJSON: DbJSON) => Promise.resolve().then(() => {
  const sql = genSql('insert', table, insertJSON);
  debug(sql);
  return getConnection().then(c => query(c, sql));
})
  .catch(err => {
    debug("'insertOneRow' Error");
    throw err;
  });

interface Query {
  method: string;
  table: string;
  target: DbJSON;
  ref: DbJSON | undefined;
}
export const updateOneRow = (table: string, refJSON: DbJSON, tarJSON: DbJSON, multi?: Query[]) =>
  Promise.resolve().then(() => {
    let sql: string | string[] = genSql('update', table, tarJSON, refJSON);
    if (multi) {
      sql = [sql].concat(multi.map(json =>
        genSql(json.method, json.table, json.target, json.ref)));
    }
    return getConnection().then(c => query(c, sql));
  })
    .catch(err => {
      debug("'updateOneRow' Error");
      throw err;
    });

export const freeQuery = (sql: string, values?: Array<string | number>) =>
  getConnection().then(c => query(c, sql, values))
    .catch(err => {
      debug("'freeQuery' Error");
      throw err;
    });
