import http from 'http';
import net from 'net';
import url from 'url';
import invariant from 'invariant';

const debug = require('debug')('ant-proxy');

type Handler = (...args: any) => void;
interface IAntProxyOption {
  port?: number;
}

export const DEFAULT_PORT = 9393;
export default class AntProxy {
  private port: number;
  private server: http.Server;

  constructor({ port = DEFAULT_PORT }: IAntProxyOption = {}) {
    this.port = port;
  }

  on(event: string, handler: Handler) {
    invariant(this.server, 'Http server is undefined');
    this.server.on(event, handler);
  }

  start(callback: Handler = () => {}) {
    this.server = http.createServer();
    this.server.on('request', this.requestHandler);
    this.server.on('connect', this.connectHandler);
    this.server.listen(this.port, () => {
      callback(this.port);
    });
  }

  private requestHandler(req: Request, res: Response) {}

  private connectHandler(req: Request, clientSocket: net.Socket, head: string) {
    // Connect to an origin server
    const { port, hostname } = new url.URL(`http://${req.url}`);
    const serverSocket = net.connect(this.port, hostname, () => {
      clientSocket.write('HTTP/1.1 200 Connection Established\r\n' + 'Proxy-agent: Node.js-Proxy\r\n' + '\r\n');
      serverSocket.write(head);
      serverSocket.pipe(clientSocket);
      clientSocket.pipe(serverSocket);
    });
  }
}
