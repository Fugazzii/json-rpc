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
    
    /** Static constructor */
    public static listen({ transport }: { transport: ITransportServer }) {
        return new JsonRpcServer(transport);
    }

    /** Destroyes socket */
    public close() {
        this.transport.close();
    }
    
    /** Adds method in RPC server */
    public expose(handlerName: string, cb: Callback) { 
        this.handlers.set(handlerName, cb);
    }

    /** Gets name of the handler, executes it and returns response */
    private _handleRequest(requestData: JsonRpcRequest) {
        const { method, id, params } = requestData;

        const cb = this.handlers.get(method);
        
        if (!cb) {
            return;
        }
        
        try {
            const result = params ? cb(...params) : cb();
            this._sendRpcResponse(id, result);
        } catch (error) {
            throw error;
        }
    }
    
    /** Sends response back to client */
    private _sendRpcResponse(id: string, result: any) {
        const jsonResponse: JsonRpcResponse = {
            jsonrpc: "2.0",
            result,
            id
        };
        this.transport.sendResponse(jsonResponse);
    }

    /** Default testing function */
    private _registerPingFunction() {
        this.expose("ping", () => "pong!");
    }
}
