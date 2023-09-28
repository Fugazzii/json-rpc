import { Callback, ITransportServer, JsonRpcRequest, JsonRpcResponse } from "../transport"; // Import any required types

export class JsonRpcServer {
    private readonly handlers: Map<string, Callback>;
    private readonly transport: ITransportServer;
    
    private constructor(transport: ITransportServer) {
        this.handlers = new Map();
        this.transport = transport;

        this._registerPingFunction();

        this.transport.onRequest(this._handleRequest.bind(this));
    }
    
    public static run({ transport }: { transport: ITransportServer }) {
        return new JsonRpcServer(transport);
    }
    
    public addMethod(handlerName: string, cb: Callback) { 
        this.handlers.set(handlerName, cb);
    }
    
    private _handleRequest(requestData: JsonRpcRequest) {
        const { method, id } = requestData;

        const cb = this.handlers.get(method);
        
        if (!cb) return;
        
        try {
            const result = cb();
            this._sendRpcResponse(id, result);
        } catch (error) {
            throw error;
        }
    }
    
    private _sendRpcResponse(id: string, result: any) {
        const jsonResponse: JsonRpcResponse = {
            jsonrpc: "2.0",
            result,
            id
        };
        this.transport.sendResponse(jsonResponse);
    }

    private _registerPingFunction() {
        this.addMethod("ping", () => "pong!");
    }
}
