import { IWakuProvider, IWakuSigner, IWakuStore } from "./typings";
import {
  HttpConnection,
  WakuProvider,
  WakuSigner,
  WakuStore,
} from "./controllers";
class Waku {
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
}

export default Waku;
