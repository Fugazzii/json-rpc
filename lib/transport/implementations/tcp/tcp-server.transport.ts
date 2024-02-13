import net, { Socket } from "net";
import { Address, ITransportServer, JsonRpcRequest, JsonRpcResponse } from "../.."; // Adjust import paths as needed

export class TcpServer implements ITransportServer {
    private readonly server: net.Server;
    private readonly pendingRequests: Map<string, Socket>;
    private onRequestHandler: ((requestData: JsonRpcRequest) => void) | null;

    private constructor({ hostname, port }: Address) {
        this.pendingRequests = new Map();
        this.server = net.createServer((socket: Socket) => {
            this._handleClient(socket);
        });
        this.onRequestHandler = null;

        this.server.listen(port, hostname, () => {
            console.log(`TCP server is listening on ${hostname}:${port}`);
        });
    }

    public static run({ hostname, port }: Address): TcpServer {
        return new TcpServer({ hostname, port });
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

            try {
                const requestData: JsonRpcRequest = this._parseJson(jsonStr);

                if (requestData) {
                    this._handleRequest(socket, requestData);
                }
                this.pendingRequests.set(requestData.id, socket);
            } catch (err) {
                console.error("Error while processing JSON request:", err);
            }

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
            let result = JSON.parse(data.trim());
            return result;
        } catch (err) {
            console.error("Error while parsing JSON", err);
            throw err;
        }
    }

    private _handleRequest(socket: Socket, requestData: JsonRpcRequest) {
        if (this.onRequestHandler) {
            this.onRequestHandler(requestData);
        }
    }
}
