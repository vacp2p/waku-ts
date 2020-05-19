export function getOrUndefined<T>(name: string, target: any): T | undefined {
  let res: T | undefined = undefined;
  if (typeof target !== "undefined" && typeof target[name] !== "undefined") {
    res = target[name];
  }
  return res;
}

export function getOrError<T>(name: string, target: any): T {
  const res = getOrUndefined<T>(name, target);
  if (!res) {
    throw new Error(`${name} is not defined in target`);
  }
  return res;
}

export function getFirstMatch<T>(
  array: T[],
  key: string,
  value: any
): T | undefined {
  let result: T | undefined = undefined;
  const matches = array.filter(
    x => typeof x[key] !== "undefined" && x[key] === value
  );

  if (!!matches && matches.length) {
    result = matches[0];
  }

  return result;
}
