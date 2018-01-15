import * as React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import Container from '../Container';

export default ({ store }: Obj) => (
  <Provider store={store}>
    <Router>
      <Container />
    </Router>
  </Provider>
);
