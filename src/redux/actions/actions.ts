import { getOrders } from '../../lib';

export const saveToRedux = (newState: Obj, returnState?: string) =>
  (dispatch: Dispatch, getState: () => Obj) => {
    dispatch({ type: `SAVE_STORE`, payload: newState });
    return Promise.resolve(returnState
      ? getState()[returnState]
      : null);
  };

export const requestOrders = () => (dispatch: Dispatch) => getOrders()
  .then((res: { orders: Obj[] }) => {
    dispatch({
      type: `SAVE_STORE`,
      payload: { tableData: { order: res.orders } },
    });
  });
