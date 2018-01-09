import * as React from "react";
import { Provider } from 'react-redux';
import * as PropTypes from 'prop-types';

export default ({ store }: { store: any }) => (
  <Provider store={store}>
    <div>
      <p>hello world</p>
      <p>hello world</p>
    </div>
  </Provider>
);
