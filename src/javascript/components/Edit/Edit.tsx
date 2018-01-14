import * as React from 'react';
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { dbSchema } from '../../../../api/config';
import { findColumnNames } from '../../lib';
import * as actions from '../../redux/actions';
import Field from './Field';
const style = require('./style.css');

interface ModuleProps {
  state: Obj;
  table: string;
  show: boolean;
  saveToRedux: typeof actions.saveToRedux;
}
class Edit extends React.Component<ModuleProps> {
  public columnList = findColumnNames(dbSchema, this.props.table);
  public columnIdList = Object.keys((dbSchema as Obj)[this.props.table]);
  public render() {
    const { table } = this.props;
    return (
      <Modal
        show={this.props.show}
        onHide={() => this.props.saveToRedux({ showModal: { [table]: false } })}
        bsSize='lg'
        backdrop='static'
      >
        <Modal.Header closeButton>
          <h2>Edit {table.toUpperCase()}</h2>
        </Modal.Header>
        <Modal.Body>
          <form>
            {this.columnList.map((column, index) => (
              <div key={column} className={style.field}>
                <label htmlFor={column}>{`${column}:`}</label>
                <Field
                  table={table}
                  column={column}
                  columnId={this.columnIdList[index]}
                  columnValue={(dbSchema as Obj)[table][this.columnIdList[index]]}
                />
              </div>
            ))}
          </form>
        </Modal.Body>
      </Modal >
    );
  }
}

export default connect(
  (state: Obj) => ({ state }),
  { saveToRedux: actions.saveToRedux },
)(Edit);
