import * as React from 'react';
import { connect } from 'react-redux';
import { dbSchema } from '../../../../config';
const style = require('./style.css');

const findColumnNames = (db: Obj, table: string) =>
  Object.keys(db[table]).map((column: string) => {
    if (typeof db[table][column] === 'string') return db[table][column];
    return db[db[table][column].table][db[table][column].link];
  });

interface ModuleProps {
  table: string;
}

class Display extends React.Component<ModuleProps> {
  public columns = findColumnNames(dbSchema, this.props.table);
  public columnWidth = `${100 / this.columns.length}%`;
  // public componentWillMount() {
  //   // const sql = ['SELECT',
  //   //   'treasure.name as treasure,',
  //   //   'person.name as person,',
  //   //   'o.unit_price,',
  //   //   'o.quantity,',
  //   //   'st.status,',
  //   //   'o.final_price,',
  //   //   'o.date',
  //   //   'FROM',
  //   //   'fabaoliutong.order as o,',
  //   //   'fabaoliutong.status as st',
  //   //   'fabaoliutong.area as area',
  //   //   'fabaoliutong.person as person',
  //   //   'fabaoliutong.treasure as treasure',
  //   //   'WHERE o.treasure_id = treasure.id',
  //   //   'AND o.person_id = person.id',
  //   //   'AND o.status_id = st.id;',
  //   // ].join(' ');
  //   // freeQuery(sql)
  //   //   .then(res => console.log('hahahah'));
  // }

  public render() {
    return (
      <section className={style.table}>
        <div className={style.row}>
          {this.columns.map(name => (
            <span
              key={name}
              style={{ width: this.columnWidth }}
              className={style.field}
            >{name}</span>
          ))}
        </div>
      </section>
    );
  }
}

export default connect(
  (state: Obj) => state,
)(Display);
