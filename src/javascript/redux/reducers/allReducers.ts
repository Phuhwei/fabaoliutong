
const env = process.env.NODE_ENV;

const initialState = {
  test: 'lol',
};

export default (state = initialState, action: any) => {
  switch (action.type) {
    case 'CLEAR_STATE': {
      return initialState;
    }
    default: return state;
  }
};
