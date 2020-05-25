import Waku, { IWakuInfoResponse } from "../src";

describe("Waku", () => {
  let waku: Waku;
  let info: IWakuInfoResponse;
  let keyPairId: string;

  beforeEach(async () => {
    waku = new Waku("https://waku.walletconnect.org");
    info = await waku.init();
  });

  it("should instantiate", async () => {
    expect(waku).toBeTruthy();
  });

  it("should init controllers", async () => {
    expect(info).toBeTruthy();
  });

  it("should create new key pair", async () => {
    keyPairId = await waku.request({
      id: 1,
      jsonrpc: "2.0",
      method: "waku_newKeyPair",
      params: [],
    });
    expect(keyPairId).toBeTruthy();
  });

  it("should check key pair", async () => {
    const check = await waku.request({
      id: 1,
      jsonrpc: "2.0",
      method: "waku_hasKeyPair",
      params: [keyPairId],
    });
    expect(check).toBeTruthy();
  });

  it("should get public key", async () => {
    const pubKey = await waku.request({
      id: 1,
      jsonrpc: "2.0",
      method: "waku_getPublicKey",
      params: [keyPairId],
    });
    expect(pubKey).toBeTruthy();
  });

  it("should get private key", async () => {
    const prvKey = await waku.request({
      id: 1,
      jsonrpc: "2.0",
      method: "waku_getPrivateKey",
      params: [keyPairId],
    });
    expect(prvKey).toBeTruthy();
  });

  it("should create symmetric key", async () => {
    const symKey = await waku.request({
      id: 1,
      jsonrpc: "2.0",
      method: "waku_newSymKey",
      params: [],
    });
    expect(symKey).toBeTruthy();
  });

  it("should generate symmetric key from password", async () => {
    const symKey = await waku.request({
      id: 1,
      jsonrpc: "2.0",
      method: "waku_generateSymKeyFromPassword",
      params: ["password"],
    });
    expect(symKey).toBeTruthy();
  });
});
