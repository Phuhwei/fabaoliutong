import * as ReactDOM from 'react-dom';
import * as React from 'react';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import reducer from './redux/reducers/allReducers';
import Main from './components/Main';


const reducers = combineReducers({
  reducer
});

const configureStore = () => {
  const store = createStore(
    reducers,
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  )

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./redux/reducers/allReducers', () => {
      const nextRootReducer = reducers;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}

ReactDOM.render(
  <Main store={configureStore()} />,
  document.getElementById('app'),
);

if (module.hot) {
  module.hot.accept();
}
