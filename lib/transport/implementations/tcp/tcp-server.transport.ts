import { Address, Callback, ITransport, ITransportServer } from "../..";

export class TcpServer implements ITransportServer {

    public constructor(
        { hostname, port }: Address,
        private readonly transportClient: ITransport
    ) {
        Bun.listen({
            hostname,
            port,
            socket: {
                data(socket, data) {
                    console.log("server: ", data);
                }
            }
        });
    }

    public run(addr: Address, transport: ITransport): TcpServer {
        return new TcpServer(addr, transport);
    }

    public send(cb: Callback): void {
        this.transportClient.receive(cb);
    }

    public receive(cb: Callback): void {
        this.transportClient.send(cb);
    }
}