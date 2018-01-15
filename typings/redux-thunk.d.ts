declare type Dispatch = (Obj: Obj) => any;

declare interface Actions { [key: string]: Func }

declare interface RootState {
  currencyRate: number;
  sortOrder: {
    sortBy: string,
    direction: boolean | '',
  },
  showModal: Obj,
  tableTemp: Obj,
  tableData: Obj,
}
