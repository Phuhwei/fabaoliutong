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
  state: RootState;
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
      getTableData(linkTable)
        .then((res: Obj) => this.props.saveToRedux({ tableData: { [linkTable]: res.data } }));
    }
  }
  public handleChange(value: string) {
    this.props.saveToRedux({
      tableTemp: { [this.props.table]: { [this.props.columnId]: value } },
    });
    wait(100).then(this.props.handleDisableButton);
    // .then((res: Obj) => console.log(res[this.props.table]));
  }
  public render() {
    const { state, table, saveToRedux, columnId } = this.props;
    return (
      !!this.props.columnValue.alias
        ? (
          <input
            id={this.props.column}
            value={state.tableTemp[table] && state.tableTemp[table][columnId] || ''}
            onChange={evt => this.handleChange(evt.target.value)}
          />)
        : (
          <div id={this.props.column}>
            <select
              defaultValue='请选择'
              onChange={evt => this.handleChange(evt.target.value)}
            >
              <option disabled>请选择</option>
              {(state.tableData[this.linkTable] || []).map((opt: Obj) =>
                <option key={opt.id} value={opt.id}>
                  {opt[this.linkColumn]}
                </option>)}
            </select>
            <button
              onClick={evt => {
                evt.preventDefault();
                saveToRedux({ showModal: { [this.linkTable]: true } });
              }}
            >新建
            </button>
          </div >
        ));
  }
}

export default connect(
  (state: RootState) => ({ state }),
  { saveToRedux: actions.saveToRedux },
)(Field);
