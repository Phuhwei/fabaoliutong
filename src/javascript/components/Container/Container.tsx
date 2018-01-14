import * as React from 'react';
import { connect } from 'react-redux';
import { dbSchema } from '../../../../api/config';
import * as actions from '../../redux/actions';
import Display from '../Display';
import Edit from '../Edit';
const style = require('./style.css');

const table = 'order';
interface ModuleProps {
  state: Obj;
  saveToRedux: typeof actions.saveToRedux;
}
export const Container = (props: ModuleProps) => (
  <article className={style.article}>
    <section>
      <button
        className={style.button}
        onClick={() => {
          props.saveToRedux({ showModal: { [table]: true } });
        }}
      >新建
      </button>
      <Display table={table} />
      {Object.keys(dbSchema).map(tbl => (
        <Edit key={tbl} table={tbl} show={props.state.showModal[tbl]} />
      ))}
    </section>
  </article >
);

export default connect(
  (state: Obj) => ({ state }),
  { saveToRedux: actions.saveToRedux },
)(Container);
