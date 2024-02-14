import { ITransportClient, JsonRpcResponse } from "../transport";

export class JsonRpcClient {

    private constructor(private readonly transport: ITransportClient) {}

    /** Connects Rpc client to Rpc server */
    public static connect({ transport }: { transport: ITransportClient }) {
        return new JsonRpcClient(transport);
    }

    /** Destroyes socket */
    public close() {
        this.transport.close();
    }

    /** Calls function from RPC server */
    public call(handlerName: string, ...args: any): Promise<JsonRpcResponse> {
        return this.transport.send(handlerName, args);
    }

    /** Calls function from RPC server without waiting response */
    public notify(handlerName: string, ...args: any): void {
        this.transport.send(handlerName, ...args);
    }

    public ping(): Promise<JsonRpcResponse> {
        return this.transport.send("ping");
    }
    
}