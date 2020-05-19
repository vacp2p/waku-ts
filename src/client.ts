import {
  IWakuProvider,
  IWakuSigner,
  IWakuStore,
  IWakuClient,
  JsonRpcRequest,
} from "./typings";
import {
  HttpConnection,
  WakuProvider,
  WakuSigner,
  WakuStore,
} from "./controllers";
import { isSignerMethod, isNetworkMethod } from "./helpers/validators";
import { WAKU_PREFIX } from "./constants";
class Waku implements IWakuClient {
  public provider: IWakuProvider;
  public store: IWakuStore;
  public signer: IWakuSigner;

  constructor(provider: string | IWakuProvider, store?: IWakuStore) {
    this.provider =
      typeof provider === "string"
        ? new WakuProvider(new HttpConnection(provider))
        : provider;
    this.store = store || new WakuStore();
    this.signer = new WakuSigner(this.store);
  }

  public async init(): Promise<any> {
    await this.signer.init();
    return this.provider.init();
  }

  public async request(payload: JsonRpcRequest): Promise<any> {
    if (isSignerMethod(payload.method)) {
      return this.signer.request(payload);
    } else if (isNetworkMethod(payload.method)) {
      return this.provider.request(payload);
    }
    const method = payload.method.replace(WAKU_PREFIX + "_", "");
    return this[method](...payload.params);
  }
}

export default Waku;
