
const env = process.env.NODE_ENV;

// const initReduxState = (type) => {
//   switch (type) {
//     case 'setting':
//       return {
//         token: env !== 'test' && {
//           login: sessionStorage && (sessionStorage.getItem('loginToken') || null),
//         },
//         isLoggedin: false,
//         devTools: true,
//         dropDownLists: {},
//       };
//     case 'tempZone':
//       return {
//         1: {},
//         2: {},
//         3: {},
//         4: {},
//         5: {},
//         BankModal: {},
//       };
//     default: return {};
//   }
// };

export default (state = {}, action: any) => {
  switch (action.type) {
    case 'CLEAR_TEMPZONE': {
      return {};
    }
    default: return state;
  }
}