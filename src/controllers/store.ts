import { IWakuStore } from "../typings";
import { setLocal, getLocal, removeLocal } from "../helpers";

export class WakuStore implements IWakuStore {
  public async set(key: string, data: any): Promise<void> {
    return setLocal(key, data);
  }
  public async get(key: string): Promise<any> {
    return getLocal(key);
  }
  public async remove(key: string): Promise<void> {
    return removeLocal(key);
  }
}
