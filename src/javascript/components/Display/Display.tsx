import * as React from 'react';
import { dbStruct } from '../../../config';
const style = require('./style.css');

const findColumnNames = (db: Obj, table: string) =>
  Object.keys(db[table]).map((column: string) => {
    if (typeof db[table][column] === 'string') return db[table][column];
    // console.log(db[table][column].table);
    // return 'test';
    return db[db[table][column].table][db[table][column].link];
  });

interface ModuleProps {
  table: string;
}

export default ({ table }: ModuleProps) => {
  const columns = findColumnNames(dbStruct, table);
  return (
    <section className={style.table}>
      <div className={style.row}>
        {columns.map(name => (
          <span
            key={name}
            style={{ width: `${100 / columns.length}%` }}
            className={style.field}
          >{name}</span>
        ))}
      </div>
    </section>
  )
};
