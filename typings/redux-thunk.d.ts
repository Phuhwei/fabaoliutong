declare interface Obj { [key: string]: any; }

declare interface ObjStr { [key: string]: string; }

declare type Func = (...args: any[]) => any;

declare type RootState = {
  setting: Obj;
  userData: Obj;
  tempZone: Obj;
}

declare type Dispatch = (Obj: Obj) => any;

declare interface Actions { [key: string]: Func }


