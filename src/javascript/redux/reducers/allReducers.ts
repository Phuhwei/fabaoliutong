import { merge } from '../../lib';

// const env = process.env.NODE_ENV;

export const initialState = {
  sortOrder: {
    sortBy: '日期',
    direction: '', // true: Down; false: Up;
  },
  showModal: {},
  tableTemp: {},
  tableData: {},
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
