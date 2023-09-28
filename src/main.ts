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

import { example1 } from "../examples";

example1();