import axios from "axios";
import { EventEmitter } from "events";
import { IRpcConnection } from "basic-provider";

export class HttpConnection extends EventEmitter implements IRpcConnection {
  public connected: boolean = false;
  public url: string = "";

  constructor(url: string) {
    super();
    this.url = url;
  }

  public async send(payload: any): Promise<any> {
    if (!this.url) {
      throw new Error("HttpConnection has no provided url");
    }
    if (!this.connected) {
      throw new Error("HttpConnection is closed");
    }
    const { data } = await axios.post(this.url, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (data.error) {
      throw new Error(data.error.message);
    }
    return data.result;
  }

  public async open(): Promise<void> {
    this.connected = true;
    this.emit("connect");
    return;
  }

  public async close(): Promise<void> {
    this.connected = false;
    this.emit("close");
    return;
  }
}
