export type SymKey = {
  id: string;
  symKey: string;
};

export type KeyPair = {
  id: string;
  pubKey: string;
  prvKey: string;
};

export type Key = SymKey | KeyPair;

export type KeyMap = {
  [id: string]: Key;
};
