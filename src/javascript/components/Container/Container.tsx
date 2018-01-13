import * as React from 'react';
// import { freeQuery } from '../../lib/db';
import Display from '../Display';
const style = require('./style.css');

export default (props: Obj) => (
  <article className={style.article}>
    <section>
      <button
        className={style.button}
      >新建</button>
      <Display table='order' />
    </section>
  </article >
);
