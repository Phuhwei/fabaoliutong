import * as React from 'react';
import { dbSchema } from '../../../../api/config';
import { getTableData } from '../../lib';

interface LinkColumn {
  table: string;
  link: string;
}
interface ModuleProps {
  table: string;
  column: string; // the column name
  columnValue: string | LinkColumn;
}
interface State {
  optionList: Option[];
}
interface Option {
  id: number;
  name: string;
}
export default class extends React.Component<ModuleProps, State> {
  public state: State = {
    optionList: [],
  };
  public componentDidMount() {
    if (this.props.columnValue && this.props.columnValue.constructor.name === 'Object') {
      getTableData((this.props.columnValue as LinkColumn).table)
        .then((res: Obj) => this.setState({ optionList: res.data }));
    }
  }
  public render() {
    return (
      typeof this.props.columnValue === 'string'
        ? <input id={this.props.column} />
        : (
          <div id={this.props.column}>
            <select>
              {this.state.optionList.map((opt: Option) =>
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>)}
            </select>
            <button>新建</button>
          </div>
        ));
  }
}
