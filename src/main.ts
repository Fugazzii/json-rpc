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

// function main() {

//     const transportServer = new TransportServer("host");
//     const transportClient = new TransportClient("host");

//     const server = JsonRpcServer.run({ transport: transportServer });
//     server.addMethod("fn_name", () => "hello");

//     const client = JsonRpcClient.connect({ transport: transportClient });
//     client.call("fn");

// }