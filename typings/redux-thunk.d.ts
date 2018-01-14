declare type Dispatch = (Obj: Obj) => any;

declare interface Actions { [key: string]: Func }

declare interface rootState {
  orderList: Obj[],
  showModal: Obj,
  tableTemp: Obj,
}


