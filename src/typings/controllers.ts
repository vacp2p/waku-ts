import BasicProvider from "basic-provider";

import { JsonRpcRequest } from "./rpc";

export interface IWakuController {
  init(): Promise<any>;
  request(payload: JsonRpcRequest): Promise<any>;
}
export interface IWakuProvider extends BasicProvider, IWakuController {
  isWakuProvider: boolean;
  enable(): Promise<any>;
}

export interface IWakuSigner extends IWakuController {
  newKeyPair(): Promise<string>;
  addPrivateKey(prvKey: string): Promise<string>;
  deleteKeyPair(id: string): Promise<boolean>;
  hasKeyPair(id: string): Promise<boolean>;
  getPublicKey(id: string): Promise<string>;
  getPrivateKey(id: string): Promise<string>;
  newSymKey(): Promise<string>;
  addSymKey(symKey: string): Promise<string>;
  generateSymKeyFromPassword(): Promise<string>;
  hasSymKey(id: string): Promise<boolean>;
  getSymKey(id: string): Promise<string>;
  deleteSymKey(id: string): Promise<boolean>;
}

export interface IWakuStore {
  set(key: string, data: any): Promise<void>;
  get(key: string): Promise<any>;
  remove(key: string): Promise<void>;
}

export interface IWakuClient extends IWakuController {
  provider: IWakuProvider;
  store: IWakuStore;
  signer: IWakuSigner;
}
