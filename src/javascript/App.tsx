import * as ReactDOM from 'react-dom';
import * as React from 'react';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
// import { routerMiddleware } from 'react-router-redux';
// import { hashHistory } from 'react-router';
import { setting } from './Redux/reducers';
import Main from './Components/Main';


const reducers = combineReducers({
  setting
});
const store = createStore(
  reducers,
  // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
)

// const configureStore = () => {
//   const store = createStore(
//     reducers,
//     // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
//   )

//   if (module.hot) {
//     // Enable Webpack hot module replacement for reducers
//     module.hot.accept('./Redux/reducers', () => {
//       const nextRootReducer = require('./Redux/reducers');
//       store.replaceReducer(nextRootReducer);
//     });
//   }

//   return store;
// }

ReactDOM.render(
  <Provider store={store}>
    <Main />
  </Provider>,
  document.getElementById('app'),
);

if (module.hot) {
  // Enable Webpack hot module replacement for reducers
  module.hot.accept('./Redux/reducers', () => {
    const nextRootReducer = reducers;
    store.replaceReducer(nextRootReducer);
  });
  module.hot.accept();
}
