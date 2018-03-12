import { sortBy } from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { dbSchema } from '../../../server/config';
import { findColumnNames, updateRecord } from '../../lib';
import * as actions from '../../redux/actions';
import QuickEdit from '../QuickEdit';
const style = require('./style.css');

interface ModuleProps {
  store: Obj;
  table: string;
  saveToRedux: typeof actions.saveToRedux;
  requestOrders: typeof actions.requestOrders;
}

class Display extends React.Component<ModuleProps> {
  public columnNameList = findColumnNames(this.props.table);
  public columnIdList = Object.keys(dbSchema[this.props.table]);
  public columnWidth = `${100 / this.columnNameList.length}%`;
  public state: Obj = {};
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
    const { store: { sortOrder, tableTemp } } = this.props;
    return (
      <section>
        <table className={style.table}>
          <tbody>
            <tr>
              {this.columnNameList.map(name => (
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
                {this.columnNameList.map((term, index) => {
                  const value = term === '日期' ? order[term].substr(0, 10) : order[term];
                  const columnId = this.columnIdList[index];
                  const id = order.id;
                  const stateId = `${id}:${term}`;
                  return (
                    <td
                      key={stateId}
                      onDoubleClick={() => term !== '日期' && this.setState({ [stateId]: true })}
                      onBlur={() => {
                        updateRecord('order', {
                          ref: { id },
                          target: { [columnId]: tableTemp[`order:${id}`][columnId] },
                        })
                          .then(() => this.props.requestOrders())
                          .then(() => this.setState({ [stateId]: undefined }));
                      }}
                    >
                      {this.state[stateId]
                        ?
                        <QuickEdit
                          {...{ id: order.id, value, column: columnId }}
                        />
                        : value}
                    </td>);
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </section >
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
