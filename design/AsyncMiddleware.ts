export function composeAsync(...funcs: Function[]) {
  return funcs.reduce((a, b) => {
    return (...args: any) => {
      const r1 = b(...args);
      const r2 = a(r1);

      return r2;
    };
  });
}