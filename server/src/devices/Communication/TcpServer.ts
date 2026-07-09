import * as net from "node:net";
import { logAddress, noop } from "../../utils";
import { BaseDevice } from "../BaseDevice";

export type OnTcpPacketCallback = (packet: Buffer) => void;
export type TcpServerConfig = { host: string; port: number; };

export class TcpServer extends BaseDevice<TcpServerConfig> {
  private server: net.Server = new net.Server();
  private sockets: Set<net.Socket> = new Set();
  private onPacketCallback: OnTcpPacketCallback = noop;

  public open() {
    this.server = net.createServer((socket) => {
      this.sockets.add(socket);
      this.onClientConnected(socket);

      socket.on("data", this.onPacketReceived);
      socket.on("end", this.onClientDisconnected);
      socket.on("error", this.onClientDisconnected);
    });

    this.server.on("error", (err) => {
      console.error(`Server error: ${err.message}`);
    });
  }

  public listen(onPacket: OnTcpPacketCallback) {
    this.onPacketCallback = onPacket;
    this.server.listen(this.config.port, this.config.host);
  }

  public close() {
    this.sockets.forEach(socket => socket.destroy());
    this.server.close();
  }

  ////////////////////////////////////////

  private onPacketReceived = (packet: Buffer) => this.onPacketCallback(packet);
  private onClientConnected = (socket: net.Socket) => console.log("TCP client connected", logAddress(socket));
  private onClientDisconnected = () => console.log("TCP client disconnected");
}