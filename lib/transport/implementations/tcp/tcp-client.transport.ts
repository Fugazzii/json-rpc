import { Address, Callback, ITransport, ITransportClient, ITransportServer } from "../..";

export class TcpClient implements ITransportClient {

    public constructor(
        { hostname, port }: Address,
        private readonly transportServer: ITransport
    ) {
        Bun.connect({
            hostname,
            port,
            socket: {
                data(socket, data) {
                    console.log("client: ", data);
                }
            }
        })
    }

    public connect(addr: Address, transport: ITransport): TcpClient {
        return new TcpClient(addr, transport);
    }

    public send(cb: Callback): void {
        this.transportServer.receive(cb);
    }

    public receive(cb: Callback): void {
        this.transportServer.send(cb);
    }
}