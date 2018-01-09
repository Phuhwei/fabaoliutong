
const env = process.env.NODE_ENV;


export default (state = {}, action: any) => {
  switch (action.type) {
    case 'CLEAR_TEMPZONE': {
      return {};
    }
    default: return state;
  }
}