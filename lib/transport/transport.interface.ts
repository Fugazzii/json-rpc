export type Address = { host: string, port: number };
export type Callback = (...args: any[]) => any;
export type JsonRpcVersion = "1.0" | "2.0";

export type JsonRpcRequest = {
    jsonrpc: JsonRpcVersion,
    method: string,
    id: string,
    params?: any[],
}

export type JsonRpcResponse = {
    jsonrpc: JsonRpcVersion,
    result: any,
    id: string
}

export interface ITransportClient {
    send(message: string, ...args: any): Promise<JsonRpcResponse>;
    close(): void;
}

export interface ITransportServer {
    onRequest(handler: (req: JsonRpcRequest) => void): void;  
    sendResponse(resp: JsonRpcResponse): void;
    close(): void;
}
  