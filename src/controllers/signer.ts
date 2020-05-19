import { IWakuSigner, IWakuStore } from "../typings";

export class WakuSigner implements IWakuSigner {
  constructor(private store: IWakuStore) {}

  public newKeyPair() {}
  public addPrivateKey() {}
  public deleteKeyPair() {}
  public hasKeyPair() {}
  public getPublicKey() {}
  public getPrivateKey() {}
  public newSymKey() {}
  public addSymKey() {}
  public generateSymKeyFromPassword() {}
  public hasSymKey() {}
  public getSymKey() {}
  public deleteSymKey() {}
}
