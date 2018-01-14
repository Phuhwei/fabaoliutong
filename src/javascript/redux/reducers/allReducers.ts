import { merge } from '../../lib';

const env = process.env.NODE_ENV;

const initialState = {
  orderList: [] as Obj[],
  showModal: {},
  tableTemp: {},
};

export default (state = initialState, action: any) => {
  switch (action.type) {
    case 'CLEAR_STATE': {
      return initialState;
    }
    case 'SAVE_STORE':
      return merge(state, action.payload);
    default: return state;
  }
};
