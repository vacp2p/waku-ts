import BasicProvider from "basic-provider";

import { RPC_METHODS } from "../constants";
import { IWakuProvider } from "../typings";

export class WakuProvider extends BasicProvider implements IWakuProvider {
  get isWakuProvider(): boolean {
    return true;
  }

  public async enable(): Promise<any> {
    try {
      if (!this.connected) {
        await this.open();
      }
      const result = await this.send(RPC_METHODS.NETWORK.waku_info);
      this.emit("enable");
      return result;
    } catch (err) {
      await this.close();
      throw err;
    }
  }
}
