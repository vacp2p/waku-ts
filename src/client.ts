import {
  IWakuProvider,
  IWakuKeyring,
  IWakuStore,
  IWakuClient,
  JsonRpcRequest,
} from "./typings";
import {
  HttpConnection,
  WakuProvider,
  WakuKeyring,
  WakuStore,
} from "./controllers";
import { isKeyringMethod, isNetworkMethod } from "./helpers/validators";
import { WAKU_PREFIX } from "./constants";
class Waku implements IWakuClient {
  public provider: IWakuProvider;
  public store: IWakuStore;
  public keyring: IWakuKeyring;

  constructor(provider: string | IWakuProvider, store?: IWakuStore) {
    this.provider =
      typeof provider === "string"
        ? new WakuProvider(new HttpConnection(provider))
        : provider;
    this.store = store || new WakuStore();
    this.keyring = new WakuKeyring(this.store);
  }

  public async init(): Promise<any> {
    await this.keyring.init();
    return this.provider.init();
  }

  public async request(payload: JsonRpcRequest): Promise<any> {
    if (isKeyringMethod(payload.method)) {
      return this.keyring.request(payload);
    } else if (isNetworkMethod(payload.method)) {
      return this.provider.request(payload);
    }
    const method = payload.method.replace(WAKU_PREFIX + "_", "");
    return this[method](...payload.params);
  }
}

export default Waku;
