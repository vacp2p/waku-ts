import storage from "localStorage";

import { safeJsonParse, safeJsonStringify } from "./json";
import { getOrUndefined } from "./misc";

export function getLocalStorage(): Storage {
  return getOrUndefined<Storage>("localStorage", window) || storage;
}

export function setLocal(key: string, data: any): void {
  const local = getLocalStorage();
  local.setItem(key, safeJsonStringify(data));
}

export function getLocal(key: string): any {
  const local = getLocalStorage();
  const data = safeJsonParse(local.getItem(key));
  return data;
}

export function removeLocal(key: string): void {
  const local = getLocalStorage();
  local.removeItem(key);
}
