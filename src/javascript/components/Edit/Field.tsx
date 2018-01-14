import * as React from 'react';
import { connect } from 'react-redux';
import { getTableData, wait } from '../../lib';
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
    if (columnId === 'treasure_id') {
      const unitPrice = store.tableData.treasure.filter((item: Obj) =>
        item.id.toString() === value)[0].default_price;
      saveToRedux({
        tableTemp: { [table]: { unit_price: unitPrice } },
      });
    }
    wait(100).then(this.props.handleDisableButton);
  }
  public handleBlur = () => {
    const { store, columnId, saveToRedux } = this.props;
    if (['quantity', 'unit_price'].includes(columnId)) {
      const { quantity, unit_price } = store.tableTemp.order;
      if (quantity && unit_price) {
        const finalPrice = Math.round((quantity * unit_price) / store.currencyRate * 100) / 100;
        saveToRedux({
          tableTemp: { order: { final_price: finalPrice } },
        });
      }
    }
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
            onBlur={this.handleBlur}
          />)
        : (
          <div id={column}>
            <select
              value={store.tableTemp[table] && store.tableTemp[table][columnId] || '0'}
              onChange={evt => this.handleChange(evt.target.value)}
              onBlur={this.handleBlur}
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
