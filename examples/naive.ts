import { JsonRpcClient } from "../lib/rpc-client";
import { JsonRpcServer } from "../lib/rpc-server";
import { TcpClient, TcpServer } from "../lib/transport";

export async function example1() {
    let addr = { hostname: "localhost", port: 3000 };

    const transportServer = TcpServer.run(addr);
    const transportClient = TcpClient.connect(addr);

    const server = JsonRpcServer.run({ transport: transportServer });
    server.addMethod("fn", (name: string, age: 20, comment: string) => `${name}${age} -> ${comment}`);

    const client1 = JsonRpcClient.connect({ transport: transportClient });
    const client2 = JsonRpcClient.connect({ transport: transportClient });
    const res = await client1.call("fn", ["ilia", 20, "rpc teslia bidzi"]);
    const pong = await client2.ping();

    console.log("Res: ", res);
    console.log("Ping: ", pong);
}