// import {} from "http"
import { Server, Socket } from "socket.io";
import { imethod, iservice } from "../iservice";
import { iinterface, IO } from "../iinterface";
import { iresult } from "../iresult";

let io:Server;
let services:iservice[] = [];

export const socket:iinterface = {
    identifier: IO.SOC,
    name: "socket",
    init: init,
    bind: bind,
    middleware: middleware,
}

/**
 * @public
 * @param port 
 */
function init(port?:Number) {
    listen();
}

/**
 * @public
 * @param service 
 */
function bind(service:iservice) {
    services.push(service);
}

/**
 * @public
 * @param fnc 
 */
function middleware(fnc:any[]) {
    fnc.forEach(m => {
        io.use(m);
    });
}

/**
 * @private
 */

function listen(){
    if(io !== null && io !== undefined) return io;

    io = new Server();

    io.on('connection', function(soc:Socket) {
        registerListeners(soc);
    });
}

/**
 * @private
 * @param soc 
 */
function registerListeners(soc:Socket) {
    for (let index = 0; index < services.length; index++) {
        services[index].method.forEach(function(method:imethod){
            soc.on(method.alias.toUpperCase(), function(context:any){
                callback(soc, method, context);
            }); 
        });
    }
}

/**
 * @private
 * @param soc 
 * @param method 
 * @param context 
 * @returns 
 */
function callback(soc:Socket, method:imethod, context:any) {
    const result:iresult = method.fnc(context)
    if(result.error){
        return soc.emit('SOCKET_ERROR', result);
    }
    return soc.emit(method.alias.toUpperCase(), result);
}

