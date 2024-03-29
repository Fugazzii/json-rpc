import { Address, ITransportClient, JsonRpcRequest, JsonRpcResponse } from "../..";
import net from "net";

type ResponseResolver = (value: JsonRpcResponse | PromiseLike<JsonRpcResponse>) => void;

export class TcpClient implements ITransportClient {

    private readonly socket: net.Socket; 
    private readonly pendingRequests: Map<string, ResponseResolver>;

    public constructor({ host, port }: Address) {
        this.socket = net.connect({ port, host });
        this.pendingRequests = new Map();

        this._listenForResponses();
    }

    public close() {
        this.socket.destroy();
    }

    /**
     * This method recieves method name of RPC method
     * Generates unique ID so we can identify its response by matching IDs
     * Sends request object to server and stores its Promise resolve callback in Map
     */
    public send(method: string, args: any): Promise<JsonRpcResponse> {        
        let currentTime = Date.now();
        let uniqueId = String(currentTime) + this._generateRequestId();

        const jsonRpcRequest: JsonRpcRequest = {
            jsonrpc: "2.0",
            method,
            params: args,
            id: uniqueId
        };
        
        return new Promise((resolve: ResponseResolver, _reject) => {
            const requestString = JSON.stringify(jsonRpcRequest) + "\n";
            const requestBuffer = Buffer.from(requestString);

            this.pendingRequests.set(uniqueId, resolve);
            this.socket.write(requestBuffer);
        });
    }

    /** Socket listens for incoming requests, but those requests are responses of already sent requests */
    private _listenForResponses() {
        this.socket.setEncoding("utf8");

        let dataBuffer = ''; 

        this.socket.on("data", (data: Buffer) => {
            dataBuffer += data.toString();

            let startIndex = 0;
            let endIndex = dataBuffer.indexOf("\n");

            while (endIndex !== -1) {
                const response = dataBuffer.substring(startIndex, endIndex).trim();
                this._handleResponse(response);
                startIndex = endIndex + 1;
                endIndex = dataBuffer.indexOf("\n", startIndex);
            }

            dataBuffer = dataBuffer.substring(startIndex);
        });

    }

    /** When response is returned, it is parsed, before deleting from the Map checks if exists and then resolves */
    private _handleResponse(response: string) {
        try {
            const { id, result }: JsonRpcResponse = JSON.parse(response);

            if(!this.pendingRequests.has(id)) return;

            const resolve = this.pendingRequests.get(id) as ResponseResolver;

            this.pendingRequests.delete(id);
            
            resolve(result);
        } catch (error) {
            throw error;            
        }
    }

    /** Generates random id for requests */
    private _generateRequestId() {
        const alphabet = 'bjectSymhasOwnProp-0123456789ABCDEFGHIJKLMNQRTUVWXYZ_dfgiklquvxz';
        let size = 10;
        let id = '';

        while (0 < size--) { id += alphabet[(Math.random() * 64) | 0]; }

        return id;
    }

}