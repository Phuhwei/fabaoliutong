interface RequestArgs {
  contentType?: null | undefined | string;
  method: 'get' | 'post';
  url: string;
  headers?: Obj;
  fields?: Obj;
  body?: Obj;
  timeout?: number | undefined;
}