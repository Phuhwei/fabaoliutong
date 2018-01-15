import { merge } from 'lodash';
import * as React from 'react';
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { dbSchema } from '../../../../api/config';
import {
  findColumnNames, findRequiredColumns, insertEntry,
} from '../../lib';
import * as actions from '../../redux/actions';
import Field from './Field';
const style = require('./style.css');

const findSize = (table: string) => {
  switch (table) {
    case 'order':
      return 'lg';
    case 'area':
      return 'sm';
    default:
      return undefined;
  }
};

interface ModuleProps {
  store: Obj;
  table: string;
  show: { fromTable: string, fromColumn: string };
  saveToRedux: typeof actions.saveToRedux;
  requestOrders: typeof actions.requestOrders;
}
interface State {
  disableButton: boolean;
}
class Edit extends React.Component<ModuleProps, State> {
  public state: State = {
    disableButton: true,
  };
  public columnList = findColumnNames(this.props.table);
  public requiredColumnList = findRequiredColumns(this.props.table);
  public columnIdList = Object.keys(dbSchema[this.props.table]);
  public handleDisableButton = () => {
    const { store, table } = this.props;
    const validFieldNum = this.requiredColumnList
      .map(column => store.tableTemp[table][column])
      .filter(value => !!value);
    this.setState({ disableButton: this.requiredColumnList.length !== validFieldNum.length });
  }
  public handleClose = () => {
    this.props.saveToRedux({
      showModal: { [this.props.table]: false },
      tableTemp: { [this.props.table]: null },
    });
  }

  public render() {
    const { table, store, show, saveToRedux } = this.props;
    return (
      <Modal
        show={!!this.props.show}
        onHide={this.handleClose}
        bsSize={findSize(table)}
        backdrop='static'
      >
        <Modal.Header closeButton>
          <h2>Edit {table.toUpperCase()}</h2>
        </Modal.Header>
        <Modal.Body>
          <form>
            {this.columnList.map((column, index) => (column !== '日期' &&
              <div key={column} className={style.field}>
                <label htmlFor={column}>{`${column}:`}</label>
                <Field
                  table={table}
                  column={column}
                  columnId={this.columnIdList[index]}
                  columnValue={dbSchema[table][this.columnIdList[index]]}
                  handleDisableButton={this.handleDisableButton}
                />
              </div>
            ))}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button
            disabled={this.state.disableButton}
            onClick={evt => {
              evt.preventDefault();
              insertEntry(table, store.tableTemp[table])
                .then((res: Obj) => {
                  const { insertId } = res.result;
                  const newEntry = [merge({ id: insertId }, store.tableTemp[table])];
                  if (table === 'order') {
                    this.props.requestOrders();
                  } else {
                    saveToRedux({
                      tableData: { [table]: store.tableData[table].concat(newEntry) },
                      tableTemp: { [show.fromTable]: { [show.fromColumn]: `${insertId}` } },
                    });
                    if (show.fromColumn === 'treasure_id') {
                      const unitPrice = store.tableTemp[table].default_price;
                      saveToRedux({
                        tableTemp: { [show.fromTable]: { unit_price: unitPrice } },
                      });
                    }
                  }
                  this.handleClose();
                })
                .catch(e => console.error(e));
            }}
          >
            保存
          </button>
        </Modal.Footer>
      </Modal >
    );
  }
}

export default connect(
  (store: Obj) => ({ store }),
  {
    saveToRedux: actions.saveToRedux,
    requestOrders: actions.requestOrders,
  },
)(Edit);
