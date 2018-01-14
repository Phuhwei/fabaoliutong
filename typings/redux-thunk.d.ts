declare type Dispatch = (Obj: Obj) => any;

declare interface Actions { [key: string]: Func }

declare interface RootState {
  showModal: Obj,
  tableTemp: Obj,
  tableData: Obj,
}
