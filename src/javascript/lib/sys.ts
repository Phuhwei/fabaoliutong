const env = process.env.NODE_ENV;

export function devConsole(...args: string[]) {
  if (['development', 'test'].includes(env)) {
    // tslint:disable-next-line:no-console
    console.log(...args);
  }
}
