import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import Main from './components/Main';
import reducer from './redux/reducers/allReducers';

const configureStore = () => {
  const store = createStore(
    reducer,
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__(),
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./redux/reducers/allReducers', () => {
      const nextRootReducer = reducer;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
};

ReactDOM.render(
  <Main store={configureStore()} />,
  document.getElementById('app'),
);

if (module.hot) {
  module.hot.accept();
}
