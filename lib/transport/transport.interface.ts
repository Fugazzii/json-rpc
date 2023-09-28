export type Address = { hostname: string, port: number };
export type Callback = (...args: any[]) => any;
export type JsonRpcVersion = "1.0" | "2.0";

export type JsonRpcRequest = {
    jsonrpc: JsonRpcVersion,
    method: string,
    params?: any[],
    id: string
}

export type JsonRpcResponse = {
    jsonrpc: JsonRpcVersion,
    result: any,
    id: string
}

export interface ITransportClient {
    send(message: string): void;
}

export interface ITransportServer {
    handleIncomingRequest(buffer: string): void;
}