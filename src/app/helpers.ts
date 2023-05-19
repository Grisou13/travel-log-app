export type ArgumentTypes<F extends Function> = F extends (
  ...args: infer A
) => any
  ? A
  : never;

export type SecondArgOfFunction<F extends Function> = F extends (
  ...args: infer A
) => any
  ? A[1]
  : never;
