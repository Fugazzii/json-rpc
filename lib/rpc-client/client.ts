import { ITransportClient, JsonRpcResponse } from "../transport";

export class JsonRpcClient {

    private constructor(private readonly transport: ITransportClient) {}

    /** Connects Rpc client to Rpc server */
    public static connect({ transport }: { transport: ITransportClient }) {
        return new JsonRpcClient(transport);
    }

    /** Calls function from RPC server */
    public async call(handlerName: string, args?: any[]): Promise<JsonRpcResponse> {
        return this.transport.send(handlerName, args);
    }

    /** Calls function from RPC server without waiting response */
    public async notify(handlerName: string, args?: any[]): Promise<void> {
        this.transport.send(handlerName, args);
    }

    public async ping(): Promise<JsonRpcResponse> {
        return this.transport.send("ping");
    }
    
}