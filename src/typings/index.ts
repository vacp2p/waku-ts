import BasicProvider from "basic-provider";

export interface IWakuProvider extends BasicProvider {
  isWakuProvider: boolean;
  enable(): Promise<any>;
}

export interface IWakuSigner {
  newKeyPair(): any;
  addPrivateKey(): any;
  deleteKeyPair(): any;
  hasKeyPair(): any;
  getPublicKey(): any;
  getPrivateKey(): any;
  newSymKey(): any;
  addSymKey(): any;
  generateSymKeyFromPassword(): any;
  hasSymKey(): any;
  getSymKey(): any;
  deleteSymKey(): any;
}

export interface IWakuStore {
  set(key: string, data: any): Promise<void>;
  get(key: string): Promise<any>;
  remove(key: string): Promise<void>;
}
