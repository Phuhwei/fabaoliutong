import { merge } from 'lodash';
import * as React from 'react';
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { dbSchema } from '../../../server/config';
import {
  findColumnNames, findRequiredColumns, insertEntry,
} from '../../lib';
import * as actions from '../../redux/actions';
import Field from './Field';
// const style = require('./style.css');

const EditForm = styled.div`
  display: flex;
  >label {
    width: 100px
  }
  input, select {
    width: 150px;
  }
`;

const Button = styled.button`
  :disabled {
    opacity: 0.3;
  }
`;

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
  public columnAlias = findColumnNames(this.props.table);
  public requiredColumnList = findRequiredColumns(this.props.table);
  public columnIdList = Object.keys(dbSchema[this.props.table]);

  /* Toggle disable button under different cases: */
  public handleDisableButton = () => {
    const { store, table } = this.props;
    const isValid = () => {
      for (const item of this.requiredColumnList) {
        if (!store.tableTemp[table][item]) return false;
      }
      return true;
    };
    this.setState({ disableButton: !isValid() });
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
          <h2>Add {table.toUpperCase()}</h2>
        </Modal.Header>
        <Modal.Body>
          <form>
            {this.columnIdList.map((column, index) => (column !== 'date' &&
              <EditForm key={column}>
                <label htmlFor={column}>{`${this.columnAlias[index]}:`}</label>
                <Field
                  table={table}
                  column={column}
                  handleDisableButton={this.handleDisableButton}
                />
              </EditForm>
            ))}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button
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
                      const unitPriceRMB = store.tableTemp[table].default_price_RMB;
                      const unitPriceCAD = store.tableTemp[table].default_price_CAD;
                      saveToRedux({
                        tableTemp: {
                          [show.fromTable]: {
                            unit_price_RMB: unitPriceRMB,
                            unit_price_CAD: unitPriceCAD,
                          },
                        },
                      });
                    }
                  }
                  this.handleClose();
                })
                // tslint:disable-next-line:no-console
                .catch(e => console.error(e));
            }}
          >
            保存
          </Button>
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
