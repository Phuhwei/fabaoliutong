import * as React from 'react';
import { connect } from 'react-redux';
import { findColumnNames } from '../../lib';
import * as actions from '../../redux/actions';
const style = require('./style.css');

interface ModuleProps {
  state: Obj;
  table: string;
  saveToRedux: typeof actions.saveToRedux;
  requestOrders: typeof actions.requestOrders;
}

class Display extends React.Component<ModuleProps> {
  public columnList = findColumnNames(this.props.table);
  public columnWidth = `${100 / this.columnList.length}%`;
  public componentDidMount() {
    this.props.requestOrders();
  }

  public render() {
    const { state } = this.props;
    return (
      <section>
        <div className={style.row}>
          {this.columnList.map(name => (
            <span
              key={name}
              style={{ width: this.columnWidth }}
              className={style.field}
            >{name}
            </span>
          ))}
        </div>
        {(state.tableData.order || []).map((order: Obj) => (
          <div key={JSON.stringify(order)} className={style.row}>
            {this.columnList.map(term => (
              <span
                key={term}
                style={{ width: this.columnWidth }}
                className={style.field}
              >{term === '日期'
                ? order[term].substr(0, 10)
                : order[term]}
              </span>
            ))}
          </div>
        ))}
      </section>
    );
  }
}

export default connect(
  (state: Obj) => ({ state }),
  {
    saveToRedux: actions.saveToRedux,
    requestOrders: actions.requestOrders,
  },
)(Display);
