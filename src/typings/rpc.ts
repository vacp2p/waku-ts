export interface IWakuInfoResponse {
  messages: number;
  minPow: number;
  maxMessageSize: number;
}

export type JsonRpcRequest = {
  id: number;
  jsonrpc: "2.0";
  method: string;
  params: any;
};
