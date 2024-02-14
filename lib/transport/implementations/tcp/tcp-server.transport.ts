import net, { Socket } from "net";
import { Address, ITransportServer, JsonRpcRequest, JsonRpcResponse } from "../..";

export class TcpServer implements ITransportServer {
    private readonly server: net.Server;
    private readonly pendingRequests: Map<string, Socket>;
    private onRequestHandler: ((requestData: JsonRpcRequest) => void) | null;

    public constructor({ host, port }: Address) {
        this.pendingRequests = new Map();
        this.server = net.createServer((socket: Socket) => {
            this._handleClient(socket);
        });
        this.onRequestHandler = null;

        this.server.listen(port, host, () => {
            console.log(`TCP server is listening on ${host}:${port}`);
        });
    }

    public close() {
        this.server.close();
    }

    public onRequest(handler: (requestData: JsonRpcRequest) => void): void {
        this.onRequestHandler = handler;
    }

    /** Sends RPC response back to transport client */
    public sendResponse(response: JsonRpcResponse): void {
        process.nextTick(() => {
            const socket = this.pendingRequests.get(response.id);

            if(!socket) return;
    
            socket.write(JSON.stringify(response) + "\n");    
        })
    }

    /** Listens incoming data (Rpc Requests) from client */
    private _handleClient(socket: Socket) {
        socket.setEncoding("utf-8");
    
        let dataBuffer = "";
    
        /**
         * We are getting data with chunks
         * When \n occurs, it means end of the stream
         */
        socket.on("data", (data: Buffer) => {
            dataBuffer += data.toString();
            
            const newlineIndex = dataBuffer.indexOf("\n");
            if (newlineIndex === -1) return;
            
            const jsonStr = dataBuffer.substring(0, newlineIndex);
            dataBuffer = dataBuffer.substring(newlineIndex + 1);

            const requestData: JsonRpcRequest = this._parseJson(jsonStr);

            if (requestData) {
                this._handleRequest(requestData);
            }
            this.pendingRequests.set(requestData.id, socket);

        });
    
        socket.on("end", () => {
            console.log("Client disconnected");
        });
    }
    
    /** 
     * Parses string into json
     * This method is used for error handling */
    private _parseJson(data: string): JsonRpcRequest {
        try {
            return JSON.parse(data.trim());
        } catch (err) {
            console.error("Error while parsing JSON", err);
            throw err;
        }
    }

    private _handleRequest(requestData: JsonRpcRequest) {
        if (this.onRequestHandler) {
            this.onRequestHandler(requestData);
        }
    }
}
