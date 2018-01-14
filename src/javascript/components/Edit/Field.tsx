import * as React from 'react';
import { connect } from 'react-redux';
import { dbSchema } from '../../../../api/config';
import { getTableData } from '../../lib';
import * as actions from '../../redux/actions';
import Edit from './Edit';

interface LinkColumn {
  table: string;
  link: string;
}
interface ModuleProps {
  state: rootState;
  table: string;
  column: string; // the display column name
  columnId: string; // the original column name
  columnValue: string | LinkColumn;
  saveToRedux: typeof actions.saveToRedux;
}
interface State {
  optionList: Option[];
  disbleOption: boolean;
}
interface Option {
  id: number;
  name: string;
}
class Field extends React.Component<ModuleProps, State> {
  public linkTable = '';
  public state: State = {
    disbleOption: false,
    optionList: [],
  };
  public componentDidMount() {
    if (this.props.columnValue && this.props.columnValue.constructor.name === 'Object') {
      const linkTable = (this.props.columnValue as LinkColumn).table;
      this.linkTable = linkTable;
      getTableData(linkTable)
        .then((res: Obj) => this.setState({ optionList: res.data }));
    }
  }
  public render() {
    const { state, table, saveToRedux, columnId } = this.props;
    return (
      typeof this.props.columnValue === 'string'
        ? (
          <input
            id={this.props.column}
            value={state.tableTemp[table] && state.tableTemp[table][columnId] || ''}
            onChange={evt => saveToRedux({
              tableTemp: { [table]: { [columnId]: evt.target.value } },
            })}
          />)
        : (
          <div id={this.props.column}>
            <select
              value={state.tableTemp[table] && state.tableTemp[table][columnId] || ''}
              onChange={evt => {
                this.setState({ disbleOption: true });
                saveToRedux({
                  tableTemp: { [table]: { [columnId]: evt.target.value } },
                });
              }}
            >
              <option selected disabled={this.state.disbleOption}>请选择</option>
              {this.state.optionList.map((opt: Option) =>
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>)}
            </select>
            <button
              onClick={evt => {
                evt.preventDefault();
                this.props.saveToRedux({ showModal: { [this.linkTable]: true } });
              }}
            >新建
            </button>
          </div >
        ));
  }
}

export default connect(
  (state: rootState) => ({ state }),
  { saveToRedux: actions.saveToRedux },
)(Field);
