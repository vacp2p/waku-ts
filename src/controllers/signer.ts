import {
  generateKeyPair,
  bufferToHex,
  getPublic,
  hexToBuffer,
  generatePrivate,
} from "eccrypto-js";

import {
  IWakuSigner,
  IWakuStore,
  KeyMap,
  KeyPair,
  Key,
  SymKey,
  JsonRpcRequest,
} from "../typings";
import { STORE_KEYS_ID, WAKU_PREFIX } from "../constants";
import { uuid, getFirstMatch } from "../helpers";
import { isKeyPair, isSymKey } from "../helpers/validators";

export class WakuSigner implements IWakuSigner {
  private keyMap: KeyMap = {};

  constructor(private store: IWakuStore) {
    this.loadKeys();
  }

  // -- public ----------------------------------------------- //

  public async newKeyPair(): Promise<string> {
    await this.loadKeys();
    const key = this.genKeyPair();
    await this.addKey(key);
    return key.id;
  }

  public async addPrivateKey(prvKey: string): Promise<string> {
    await this.loadKeys();
    let key = this.getMatchingKey("prvKey", prvKey);
    if (!key) {
      key = this.genKeyPair(prvKey);
    }
    await this.addKey(key);
    return key.id;
  }

  public async deleteKeyPair(id: string): Promise<boolean> {
    await this.loadKeys();
    await this.removeKey(id);
    return true;
  }

  public async hasKeyPair(id: string): Promise<boolean> {
    await this.loadKeys();
    let key = this.getMatchingKey("id", id);
    return isKeyPair(key);
  }

  public async getPublicKey(id: string): Promise<string> {
    await this.loadKeys();
    let key = this.getMatchingKey("id", id);
    if (!key) {
      throw new Error(`No matching pubKey for id: ${id}`);
    }
    return (key as KeyPair).pubKey;
  }

  public async getPrivateKey(id: string): Promise<string> {
    await this.loadKeys();
    let key = this.getMatchingKey("id", id);
    if (!key) {
      throw new Error(`No matching privKey for id: ${id}`);
    }
    return (key as KeyPair).prvKey;
  }

  public async newSymKey(): Promise<string> {
    await this.loadKeys();
    const key = this.genSymKey();
    await this.addKey(key);
    return key.id;
  }

  public async addSymKey(symKey: string): Promise<string> {
    await this.loadKeys();
    let key = this.getMatchingKey("symKey", symKey);
    if (!key) {
      key = {
        id: uuid(),
        symKey,
      };
    }
    await this.addKey(key);
    return key.id;
  }

  public async generateSymKeyFromPassword(): Promise<string> {
    await this.loadKeys();
    // TODO: needs to accept optional "password" argument
    const key = this.genSymKey();
    await this.addKey(key);
    return key.id;
  }

  public async hasSymKey(id: string): Promise<boolean> {
    await this.loadKeys();
    let key = this.getMatchingKey("id", id);
    return isSymKey(key);
  }

  public async getSymKey(id: string): Promise<string> {
    await this.loadKeys();
    let key = this.getMatchingKey("id", id);
    if (!key) {
      throw new Error(`No matching symKey for id: ${id}`);
    }
    return (key as SymKey).symKey;
  }

  public async deleteSymKey(id: string): Promise<boolean> {
    await this.loadKeys();
    await this.removeKey(id);
    return true;
  }

  public async request(payload: JsonRpcRequest): Promise<any> {
    const method = payload.method.replace(WAKU_PREFIX + "_", "");
    return this[method](...payload.params);
  }

  // -- private ----------------------------------------------- //

  private getMatchingKey(param: string, value: string): Key | undefined {
    return getFirstMatch<Key>(Object.values(this.keyMap), param, value);
  }

  private genKeyPair(prvKey?: string): KeyPair {
    if (prvKey) {
      return {
        id: uuid(),
        pubKey: bufferToHex(getPublic(hexToBuffer(prvKey)), true),
        prvKey,
      };
    } else {
      const key = generateKeyPair();
      return {
        id: uuid(),
        pubKey: bufferToHex(key.publicKey, true),
        prvKey: bufferToHex(key.privateKey, true),
      };
    }
  }

  private genSymKey(): SymKey {
    const symKey = generatePrivate();
    return {
      id: uuid(),
      symKey: bufferToHex(symKey, true),
    };
  }

  private async loadKeys() {
    this.keyMap = await this.store.get(STORE_KEYS_ID);
  }

  private async addKey(key: Key) {
    this.keyMap[key.id] = key;
    await this.persistKeys();
  }

  private async removeKey(id: string) {
    delete this.keyMap[id];
    await this.persistKeys();
  }

  private async persistKeys() {
    await this.store.set(STORE_KEYS_ID, this.keyMap);
  }
}
