export const WAKU_PREFIX = "waku";

export const NETWORK_METHODS = {
  waku_info: "waku_info",
  waku_setMaxMessageSize: "waku_setMaxMessageSize",
  waku_setMinPoW: "waku_setMinPoW",
  waku_setBloomFilter: "waku_setBloomFilter",
  waku_markTrustedPeer: "waku_markTrustedPeer",
  waku_makeLightClient: "waku_makeLightClient",
  waku_cancelLightClient: "waku_cancelLightClient",
};

export const SIGNER_METHODS = {
  waku_newKeyPair: "waku_newKeyPair",
  waku_addPrivateKey: "waku_addPrivateKey",
  waku_deleteKeyPair: "waku_deleteKeyPair",
  waku_hasKeyPair: "waku_hasKeyPair",
  waku_getPublicKey: "waku_getPublicKey",
  waku_getPrivateKey: "waku_getPrivateKey",
  waku_newSymKey: "waku_newSymKey",
  waku_addSymKey: "waku_addSymKey",
  waku_generateSymKeyFromPassword: "waku_generateSymKeyFromPassword",
  waku_hasSymKey: "waku_hasSymKey",
  waku_getSymKey: "waku_getSymKey",
  waku_deleteSymKey: "waku_deleteSymKey",
};

export const MESSAGING_METHODS = {
  waku_post: "waku_post",
  waku_uninstallFilter: "waku_uninstallFilter",
  waku_unsubscribe: "waku_unsubscribe",
  waku_messages: "waku_messages",
  waku_getFilterMessages: "waku_getFilterMessages",
  waku_deleteMessageFilter: "waku_deleteMessageFilter",
  waku_newMessageFilter: "waku_newMessageFilter",
};

export const RPC_METHODS = {
  NETWORK: NETWORK_METHODS,
  SIGNER: SIGNER_METHODS,
  MESSAGING: MESSAGING_METHODS,
};
