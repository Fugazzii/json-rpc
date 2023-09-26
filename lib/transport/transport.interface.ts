import { JsonRpcServer } from "../rpc-server";

export type Address = { hostname: string, port: number };
export type Callback = { cb: (...args: any) => any };

export interface ITransport {
    send(cb: Callback): void;
    receive(cb: Callback): void;
}

export interface ITransportClient extends ITransport {
    connect(url: Address, transport: ITransport): ITransportClient;
}

export interface ITransportServer extends ITransport {
    run(url: Address, transport: ITransport): ITransportServer;
}