import { merge } from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { getTableData, mathRound, wait } from '../../lib';
import * as actions from '../../redux/actions';

interface LinkColumn {
  required: boolean;
  alias: string;
  link: {
    table: string;
    column: string;
  };
}
interface ModuleProps {
  store: RootState;
  table: string;
  column: string; // the display column name
  columnId: string; // the original column name
  columnValue: LinkColumn;
  saveToRedux: typeof actions.saveToRedux;
  handleDisableButton: Func;
}

class Field extends React.Component<ModuleProps> {
  public linkTable = '';
  public linkColumn = '';
  public componentDidMount() {
    if (this.props.columnValue.link) {
      const { table: linkTable, column } = this.props.columnValue.link;
      this.linkTable = linkTable;
      this.linkColumn = column;
      if (this.props.column === '状态') {
        this.props.saveToRedux({
          tableTemp: { [this.props.table]: { [this.props.columnId]: '1' } },
        });
      }
      getTableData(linkTable)
        .then((res: Obj) => this.props.saveToRedux({ tableData: { [linkTable]: res.data } }));
    }
  }
  public handleChange = (value: string) => {
    const { saveToRedux, table, columnId, store } = this.props;
    saveToRedux({
      tableTemp: { [table]: { [columnId]: value } },
    });
    /* auto fill CAD price */
    if (columnId === 'default_price_RMB') {
      // tslint:disable-next-line:variable-name
      const default_price_CAD = mathRound(parseFloat(value) / store.currencyRate);
      saveToRedux({
        tableTemp: { treasure: { default_price_CAD } },
      });
    }
    /* auto fill total price */
    if (['quantity', 'unit_price_CAD'].includes(columnId)) {
      const { quantity, unit_price_CAD } = merge(store.tableTemp.order, { [columnId]: value });
      if (quantity && unit_price_CAD) {
        saveToRedux({
          tableTemp: { order: { final_price: mathRound(quantity * unit_price_CAD) } },
        });
      }
    }
    /* auto get the default price of that treasure, and fill the unit prices */
    if (columnId === 'treasure_id') {
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
    wait(100).then(this.props.handleDisableButton);
  }

  public render() {
    const { store, table, saveToRedux, columnId, column } = this.props;
    return (
      !!this.props.columnValue.alias
        ? (
          <input
            id={column}
            value={store.tableTemp[table] && store.tableTemp[table][columnId] || ''}
            onChange={evt => this.handleChange(evt.target.value)}
          />)
        : (
          <div id={column}>
            <select
              value={store.tableTemp[table] && store.tableTemp[table][columnId] || '0'}
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
                      fromColumn: columnId,
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
