/**
 * JsonRpcClient calls some function using its name
 * TransportClient just receives name
 * TransportClient sends it to server with buffer
 * 
 * TransportServer receives buffer until it detects end of the buffer
 * TransportServer parses received buffer to string and gives it to JsonRpcServer
 * JsonRpcServer calls function with that name and returns its response
 * TransportServer receives response as a buffer
 * TransportServer returns response to TransportClient
 * 
 * TransportClient receives returned response
 * JsonRpcServer gets response
*/

import { JsonRpcClient } from "../lib/rpc-client";
import { JsonRpcServer } from "../lib/rpc-server";
import { TcpClient, TcpServer } from "../lib/transport";

async function main() {

    let addr = { hostname: "localhost", port: 3000 };

    const transportServer = TcpServer.run(addr);
    const transportClient = TcpClient.connect(addr);

    const server = JsonRpcServer.run({ transport: transportServer });
    server.addMethod("fn", () => "rpc-utesles");

    const client1 = JsonRpcClient.connect({ transport: transportClient });
    const client2 = JsonRpcClient.connect({ transport: transportClient });
    const res = await client1.call("fn");
    const pong = await client2.ping();

    console.log(res, pong);
}

main();