import { merge } from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { dbSchema } from '../../../server/config';
import { getTableData, mathRound, wait } from '../../lib';
import * as actions from '../../redux/actions';

interface ModuleProps {
  tableName?: string;
  table: string;
  column: string; // the db column name
  handleDisableButton?: Func;
  defaultValue?: string;
  store: RootState;
  saveToRedux: typeof actions.saveToRedux;
}

class Field extends React.Component<ModuleProps> {
  public linkTable = '';
  public linkColumn = '';
  public columnDetail = dbSchema[this.props.tableName || this.props.table][this.props.column];
  public componentDidMount() {
    const { saveToRedux, defaultValue } = this.props;
    let value = defaultValue;
    Promise.resolve().then(() => {
      if (this.columnDetail.link) {
        const { table: linkTable, column } = this.columnDetail.link;
        this.linkTable = linkTable;
        this.linkColumn = column;
        return getTableData(linkTable)
          .then((res: Obj) => saveToRedux({ tableData: { [linkTable]: res.data } }))
          .then(() => {
            if (defaultValue) {
              for (const record of this.props.store.tableData[linkTable]) {
                if (record.name === defaultValue) {
                  value = record.id;
                  break;
                }
              }
            }
          });
      }
    })
      .then(() => {
        this.props.saveToRedux({
          tableTemp: { [this.props.table]: { [this.props.column]: value } },
        });
      });
  }
  public handleChange = (value: string) => {
    const { saveToRedux, table, column, store } = this.props;
    saveToRedux({
      tableTemp: { [table]: { [column]: value } },
    });
    /* auto fill CAD price */
    if (column === 'default_price_RMB') {
      // tslint:disable-next-line:variable-name
      const default_price_CAD = mathRound(parseFloat(value) / store.currencyRate);
      saveToRedux({
        tableTemp: { treasure: { default_price_CAD } },
      });
    }
    /* auto fill total price */
    if (['quantity', 'unit_price_CAD'].includes(column)) {
      const { quantity, unit_price_CAD } = merge(store.tableTemp.order, { [column]: value });
      if (quantity && unit_price_CAD) {
        saveToRedux({
          tableTemp: { order: { final_price: mathRound(quantity * unit_price_CAD) } },
        });
      }
    }
    /* auto get the default price of that treasure, and fill the unit prices */
    if (column === 'treasure_id') {
      const matchTreasure: Obj = store.tableData.treasure.filter((item: Obj) =>
        item.id.toString() === value)[0];
      const unitPriceRMB = matchTreasure.default_price_RMB;
      const unitPriceCAD = matchTreasure.default_price_CAD;
      saveToRedux({
        tableTemp: {
          [table]: {
            unit_price_RMB: unitPriceRMB,
            unit_price_CAD: unitPriceCAD,
          },
        },
      });
    }
    if (this.props.handleDisableButton) wait(100).then(this.props.handleDisableButton);
  }

  public render() {
    const { store, table, saveToRedux, column } = this.props;
    return (!!this.columnDetail.alias
      ? (
        <input
          id={column}
          value={store.tableTemp[table] && store.tableTemp[table][column] || ''}
          onChange={evt => this.handleChange(evt.target.value)}
        />)
      : (
        <div id={column}>
          <select
            value={store.tableTemp[table] && store.tableTemp[table][column] || '0'}
            onChange={evt => this.handleChange(evt.target.value)}
          >
            <option value='0' disabled>请选择</option>
            {(store.tableData[this.linkTable] || []).map((opt: Obj) =>
              <option key={opt.id} value={opt.id}>
                {opt[this.linkColumn]}
              </option>)}
          </select>
          <button
            onClick={evt => {
              evt.preventDefault();
              saveToRedux({
                showModal: {
                  [this.linkTable]: {
                    fromTable: table,
                    fromColumn: column,
                  },
                },
              });
            }}
          >新建
            </button>
        </div >
      ));
  }
}

export default connect(
  (store: RootState) => ({ store }),
  { saveToRedux: actions.saveToRedux },
)(Field);
