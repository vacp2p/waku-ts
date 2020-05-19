import { KeyPair, SymKey } from "../typings";
import {
  NETWORK_METHODS,
  SIGNER_METHODS,
  MESSAGING_METHODS,
} from "../constants";

export function isKeyPair(value?: any): value is KeyPair {
  return typeof value.prvKey !== "undefined";
}

export function isSymKey(value?: any): value is SymKey {
  return typeof value.symKey !== "undefined";
}

export function isNetworkMethod(value?: string): boolean {
  if (!value) return false;
  return Object.keys(NETWORK_METHODS).includes(value);
}

export function isSignerMethod(value?: string): boolean {
  if (!value) return false;
  return Object.keys(SIGNER_METHODS).includes(value);
}

export function isMessagingMethod(value?: string): boolean {
  if (!value) return false;
  return Object.keys(MESSAGING_METHODS).includes(value);
}
