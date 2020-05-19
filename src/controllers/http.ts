import { EventEmitter } from "events";
import { IRpcConnection } from "basic-provider";

export class HttpConnection extends EventEmitter implements IRpcConnection {
  public connected: boolean = false;
  public url: string = "";

  constructor(url: string) {
    super();
    if (url) {
      this.url = url;
      this.connected = true;
    }
  }

  public async send(payload: any): Promise<any> {
    if (!this.url) {
      throw new Error("HttpConnection has no provided url");
    }
    if (!this.connected) {
      throw new Error("HttpConnection is closed");
    }
    const response = await fetch(this.url, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    return result;
  }

  public async open(): Promise<void> {
    this.connected = true;
  }

  public async close(): Promise<void> {
    this.connected = false;
  }
}
