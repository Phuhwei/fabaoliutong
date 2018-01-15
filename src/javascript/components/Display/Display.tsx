import { sortBy } from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { findColumnNames } from '../../lib';
import * as actions from '../../redux/actions';
const style = require('./style.css');

interface ModuleProps {
  store: Obj;
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
  public sortOrder = (sortedBy: string, direction: boolean) => {
    const { store: { tableData: { order } } } = this.props;
    if (!order) return [];
    const sorted = sortBy(order, [sortedBy]);
    return direction ? sorted : sorted.reverse();
  }
  public handleSort = (name: string) => {
    const { store: { sortOrder }, saveToRedux } = this.props;
    saveToRedux({
      sortOrder: { sortBy: name, direction: !sortOrder.direction },
    });
  }

  public render() {
    const { store: { sortOrder } } = this.props;
    return (
      <section>
        <table className={style.table}>
          <tbody>
            <tr>
              {this.columnList.map(name => (
                <th
                  key={name}
                  onClick={() => this.handleSort(name)}
                >{name}
                  {name === sortOrder.sortBy &&
                    <div className={style[`sort${sortOrder.direction ? 'Up' : 'Down'}`]} />}
                </th>
              ))}
            </tr>
            {this.sortOrder(sortOrder.sortBy, sortOrder.direction).map((order: Obj) => (
              <tr key={order.日期}>
                {this.columnList.map(term => (
                  <td
                    key={term}
                    // style={{ width: this.columnWidth }}
                  >{term === '日期'
                    ? order[term].substr(0, 10)
                    : order[term]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    );
  }
}

export default connect(
  (store: Obj) => ({ store }),
  {
    saveToRedux: actions.saveToRedux,
    requestOrders: actions.requestOrders,
  },
)(Display);
