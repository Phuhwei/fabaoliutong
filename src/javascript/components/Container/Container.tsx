import * as React from 'react';
import { connect } from 'react-redux';
import { dbSchema } from '../../../../api/config';
import { getCurrencyRate } from '../../lib';
import * as actions from '../../redux/actions';
import Display from '../Display';
import Edit from '../Edit';
const style = require('./style.css');

const table = 'order';
interface ModuleProps {
  store: Obj;
  saveToRedux: typeof actions.saveToRedux;
}
export class Container extends React.Component<ModuleProps> {
  public componentDidMount() {
    getCurrencyRate()
      .then((res: Obj) => this.props.saveToRedux({ currencyRate: res.rates.CNY }));
  }
  public render() {
    const { saveToRedux, store } = this.props;
    return (
      <article className={style.article} >
        <section>
          <div className={style.topBar}>
            <span>当前汇率：1 CAD = {store.currencyRate} RMB</span>
            <button
              className={style.button}
              onClick={() => {
                saveToRedux({ showModal: { [table]: true } });
              }}
            >新建
            </button>
          </div>
          <Display table={table} />
          {Object.keys(dbSchema).map(tbl => (
            <Edit key={tbl} table={tbl} show={store.showModal[tbl]} />
          ))}
        </section>
      </article >
    );
  }
}
export default connect(
  (store: Obj) => ({ store }),
  { saveToRedux: actions.saveToRedux },
)(Container);
