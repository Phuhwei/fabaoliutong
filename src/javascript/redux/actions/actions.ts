
export const saveToRedux = (newState: Obj, returnState?: string) =>
  (dispatch: Dispatch, getState: () => Obj) => {
    dispatch({ type: `SAVE_STORE`, payload: newState });
    return Promise.resolve(returnState
      ? getState()[returnState]
      : null);
  };
