import {
  generateKeyPair,
  bufferToHex,
  hexToBuffer,
  randomBytes,
  pbkdf2,
  utf8ToBuffer,
  removeHexPrefix,
  getPublicCompressed,
} from "eccrypto-js";

import {
  IWakuKeyring,
  IWakuStore,
  KeyMap,
  KeyPair,
  Key,
  SymKey,
  JsonRpcRequest,
} from "../typings";
import { STORE_KEYS_ID, WAKU_PREFIX } from "../constants";
import { getFirstMatch, isKeyPair, isSymKey } from "../helpers";

export class WakuKeyring implements IWakuKeyring {
  private keyMap: KeyMap = {};

  constructor(private store: IWakuStore) {}

  // -- public ----------------------------------------------- //

  public async init(): Promise<any> {
    return await this.loadKeys();
  }

  public async request(payload: JsonRpcRequest): Promise<any> {
    const method = payload.method.replace(WAKU_PREFIX + "_", "");
    return this[method](...payload.params);
  }

  public async newKeyPair(): Promise<string> {
    const key = this.genKeyPair();
    await this.addKey(key);
    return key.id;
  }

  public async addPrivateKey(prvKey: string): Promise<string> {
    let key = this.getMatchingKey("prvKey", prvKey);
    if (!key) {
      key = this.genKeyPair(prvKey);
    }
    await this.addKey(key);
    return key.id;
  }

  public async deleteKeyPair(id: string): Promise<boolean> {
    await this.removeKey(id);
    return true;
  }

  public async hasKeyPair(id: string): Promise<boolean> {
    let key = this.getMatchingKey("id", id);
    return isKeyPair(key);
  }

  public async getPublicKey(id: string): Promise<string> {
    let key = this.getMatchingKey("id", id);
    if (!key) {
      throw new Error(`No matching pubKey for id: ${id}`);
    }
    return (key as KeyPair).pubKey;
  }

  public async getPrivateKey(id: string): Promise<string> {
    let key = this.getMatchingKey("id", id);
    if (!key) {
      throw new Error(`No matching privKey for id: ${id}`);
    }
    return (key as KeyPair).prvKey;
  }

  public async newSymKey(): Promise<string> {
    const key = await this.genSymKey();
    await this.addKey(key);
    return key.id;
  }

  public async addSymKey(symKey: string): Promise<string> {
    let key = this.getMatchingKey("symKey", symKey);
    if (!key) {
      key = {
        id: this.getKeyId(symKey),
        symKey,
      };
    }
    await this.addKey(key);
    return key.id;
  }

  public async generateSymKeyFromPassword(password: string): Promise<string> {
    const key = await this.genSymKey(password);
    await this.addKey(key);
    return key.id;
  }

  public async hasSymKey(id: string): Promise<boolean> {
    let key = this.getMatchingKey("id", id);
    return isSymKey(key);
  }

  public async getSymKey(id: string): Promise<string> {
    let key = this.getMatchingKey("id", id);
    if (!key) {
      throw new Error(`No matching symKey for id: ${id}`);
    }
    return (key as SymKey).symKey;
  }

  public async deleteSymKey(id: string): Promise<boolean> {
    await this.removeKey(id);
    return true;
  }

  // -- private ----------------------------------------------- //

  private getMatchingKey(param: string, value: string): Key | undefined {
    return getFirstMatch<Key>(Object.values(this.keyMap), param, value);
  }

  private genKeyPair(prvKey?: string): KeyPair {
    if (prvKey) {
      return {
        id: this.getKeyId(prvKey),
        pubKey: this.getPubKey(prvKey),
        prvKey,
      };
    } else {
      const key = generateKeyPair();
      return {
        id: this.getKeyId(bufferToHex(key.privateKey)),
        pubKey: bufferToHex(key.publicKey, true),
        prvKey: bufferToHex(key.privateKey, true),
      };
    }
  }

  private async genSymKey(password?: string): Promise<SymKey> {
    const symKey =
      typeof password === "string"
        ? await pbkdf2(utf8ToBuffer(password))
        : randomBytes(32);
    return {
      id: this.getKeyId(bufferToHex(symKey)),
      symKey: bufferToHex(symKey, true),
    };
  }

  private getPubKey(prvKey: string): string {
    return bufferToHex(getPublicCompressed(hexToBuffer(prvKey)), true);
  }

  private getKeyId(prvKey: string): string {
    return removeHexPrefix(this.getPubKey(prvKey)).substr(2);
  }

  private async loadKeys(): Promise<void> {
    this.keyMap = (await this.store.get(STORE_KEYS_ID)) || {};
  }

  private async addKey(key: Key): Promise<void> {
    this.keyMap[key.id] = key;
    await this.persistKeys();
  }

  private async removeKey(id: string): Promise<void> {
    delete this.keyMap[id];
    await this.persistKeys();
  }

  private async persistKeys(): Promise<void> {
    await this.store.set(STORE_KEYS_ID, this.keyMap);
  }
}
