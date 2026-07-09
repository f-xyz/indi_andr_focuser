import { BaseDevice } from "../BaseDevice";
import { SerialPort } from "serialport";
import { RegexParser } from "@serialport/parser-regex";
import { noop } from "../../utils";

export type SerialOverUsbConfig = {};
export type OnUsbPacketCallback = (packet: string) => void;

export class SerialOverUSB extends BaseDevice<SerialOverUsbConfig> {
  private options = { path: "/dev/ttyGS0", baudRate: 115200 };
  private port: SerialPort;
  private parser: RegexParser;
  private onPacketCallback: OnUsbPacketCallback = noop;

  public constructor(config: SerialOverUsbConfig) {
    super(config);

    const parser = new RegexParser({ regex: /[\r\n]+/ });

    this.port = new SerialPort(this.options);
    this.parser = this.port.pipe(parser);
  }

  public open() {
    console.log(`Serial port is listening ${this.options.path}`);
  }

  public listen(onPacket: OnUsbPacketCallback) {
    this.onPacketCallback = onPacket;
    this.parser.on("data", this.onData);
  }

  private onData = (packet: string) => {
    if (this.port.writable) {
      this.port.write("OK\n");
    }

    this.onPacketCallback(packet);
  }

  public close() {
    this.parser.destroy();
    this.port.destroy();
    this.port.close();
  }
}